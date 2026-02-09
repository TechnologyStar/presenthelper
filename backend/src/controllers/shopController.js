import { RewardType, RewardCode, RedemptionRecord, User, CardSet, Card, UserCard } from '../models/index.js';
import { successResponse, errorResponse, ERROR_CODES } from '../utils/response.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

// 获取商城商品列表
export const getShopItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type = 'all' } = req.query; // all, points, cardset

    const where = { isActive: true };

    if (type === 'points') {
      where.requiredPoints = { [Op.ne]: null };
    } else if (type === 'cardset') {
      where.requiredCardSetId = { [Op.ne]: null };
    }

    const items = await RewardType.findAll({
      where,
      include: [{
        model: RewardCode,
        as: 'codes',
        where: { status: 'available' },
        required: false,
        limit: 1
      }],
      order: [['requiredPoints', 'ASC NULLS LAST']]
    });

    // 获取用户已完成的卡组
    const user = await User.findByPk(userId, {
      include: [{
        model: UserCard,
        as: 'userCards',
        include: [{
          model: Card,
          as: 'card',
          include: [{
            model: CardSet,
            as: 'cardSet'
          }]
        }]
      }]
    });

    // 统计每个卡组的收集情况
    const cardSetProgress = {};
    if (user && user.userCards) {
      for (const userCard of user.userCards) {
        const setId = userCard.card.cardSet.id;
        if (!cardSetProgress[setId]) {
          cardSetProgress[setId] = {
            total: userCard.card.cardSet.totalCards,
            collected: 0
          };
        }
        cardSetProgress[setId].collected++;
      }
    }

    res.json(successResponse({
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        platform: item.platform,
        value: item.value,
        requiredPoints: item.requiredPoints,
        requiredCardSetId: item.requiredCardSetId,
        description: item.description,
        available: item.codes && item.codes.length > 0,
        canRedeem: item.requiredPoints
          ? user.points >= item.requiredPoints
          : (item.requiredCardSetId && cardSetProgress[item.requiredCardSetId]?.collected === cardSetProgress[item.requiredCardSetId]?.total)
      }))
    }));
  } catch (error) {
    console.error('Get shop items error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '获取商品列表失败'));
  }
};

// 兑换商品
export const redeemItem = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { itemId } = req.body;

    // 获取商品信息
    const item = await RewardType.findByPk(itemId, { transaction });
    if (!item || !item.isActive) {
      await transaction.rollback();
      return res.status(404).json(errorResponse(ERROR_CODES.RESOURCE_NOT_FOUND, '商品不存在'));
    }

    // 获取用户信息
    const user = await User.findByPk(userId, { transaction });

    // 检查兑换条件
    if (item.requiredPoints) {
      // 积分兑换
      if (user.points < item.requiredPoints) {
        await transaction.rollback();
        return res.status(400).json(errorResponse(ERROR_CODES.INSUFFICIENT_POINTS, '积分不足'));
      }
    } else if (item.requiredCardSetId) {
      // 卡组兑换
      const cardSet = await CardSet.findByPk(item.requiredCardSetId, { transaction });
      if (!cardSet) {
        await transaction.rollback();
        return res.status(400).json(errorResponse(ERROR_CODES.RESOURCE_NOT_FOUND, '卡组不存在'));
      }

      // 检查是否集齐卡组
      const userCards = await UserCard.findAll({
        where: { userId },
        include: [{
          model: Card,
          as: 'card',
          where: { setId: item.requiredCardSetId }
        }],
        transaction
      });

      if (userCards.length < cardSet.totalCards) {
        await transaction.rollback();
        return res.status(400).json(errorResponse(ERROR_CODES.INCOMPLETE_CARDSET, '卡组未集齐'));
      }
    }

    // 获取可用的兑换码
    const code = await RewardCode.findOne({
      where: {
        typeId: itemId,
        status: 'available'
      },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!code) {
      await transaction.rollback();
      return res.status(400).json(errorResponse(ERROR_CODES.OUT_OF_STOCK, '商品已售罄'));
    }

    // 扣除积分或标记卡组已使用
    if (item.requiredPoints) {
      await user.decrement('points', { by: item.requiredPoints, transaction });
    }

    // 标记兑换码为已使用
    await code.update({
      status: 'used',
      usedBy: userId,
      usedAt: new Date()
    }, { transaction });

    // 创建兑换记录
    await RedemptionRecord.create({
      userId,
      rewardTypeId: itemId,
      rewardCodeId: code.id,
      pointsCost: item.requiredPoints
    }, { transaction });

    await transaction.commit();

    res.json(successResponse({
      code: code.code,
      item: {
        name: item.name,
        platform: item.platform,
        value: item.value
      }
    }, '兑换成功'));
  } catch (error) {
    await transaction.rollback();
    console.error('Redeem item error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '兑换失败'));
  }
};

// 获取我的兑换记录
export const getMyRedemptions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await RedemptionRecord.findAndCountAll({
      where: { userId },
      include: [
        {
          model: RewardType,
          as: 'rewardType',
          attributes: ['name', 'platform', 'value']
        },
        {
          model: RewardCode,
          as: 'rewardCode',
          attributes: ['code']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json(successResponse({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      data: rows.map(record => ({
        id: record.id,
        itemName: record.rewardType.name,
        platform: record.rewardType.platform,
        value: record.rewardType.value,
        code: record.rewardCode.code,
        pointsCost: record.pointsCost,
        redeemedAt: record.createdAt
      }))
    }));
  } catch (error) {
    console.error('Get my redemptions error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '获取兑换记录失败'));
  }
};

// 管理员：添加商品
export const createShopItem = async (req, res) => {
  try {
    const { name, platform, value, requiredPoints, requiredCardSetId, description, codes } = req.body;

    const item = await RewardType.create({
      name,
      platform,
      value,
      requiredPoints,
      requiredCardSetId,
      description,
      isActive: true
    });

    // 批量添加兑换码
    if (codes && codes.length > 0) {
      const codeRecords = codes.map(code => ({
        typeId: item.id,
        code,
        status: 'available'
      }));
      await RewardCode.bulkCreate(codeRecords);
    }

    res.status(201).json(successResponse(item, '商品创建成功'));
  } catch (error) {
    console.error('Create shop item error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '创建商品失败'));
  }
};

// 管理员：获取所有商品
export const getAllShopItems = async (req, res) => {
  try {
    const items = await RewardType.findAll({
      include: [{
        model: RewardCode,
        as: 'codes',
        attributes: ['id', 'status']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(successResponse({
      items: items.map(item => ({
        ...item.toJSON(),
        availableCount: item.codes.filter(c => c.status === 'available').length,
        usedCount: item.codes.filter(c => c.status === 'used').length
      }))
    }));
  } catch (error) {
    console.error('Get all shop items error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '获取商品列表失败'));
  }
};
