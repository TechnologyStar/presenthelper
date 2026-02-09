import { Card, CardSet, UserCard, CheckIn, User } from '../models/index.js';
import { successResponse, errorResponse, ERROR_CODES } from '../utils/response.js';
import { getTodayDate, isConsecutiveDate, randomChoice } from '../utils/helpers.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

// 获取用户卡册
export const getMyCards = async (req, res) => {
  try {
    const userId = req.user.id;

    const userCards = await UserCard.findAll({
      where: { userId },
      include: [{
        model: Card,
        as: 'card',
        include: [{
          model: CardSet,
          as: 'cardSet'
        }]
      }],
      order: [['obtainedAt', 'DESC']]
    });

    res.json(successResponse({
      cards: userCards.map(uc => ({
        id: uc.card.id,
        name: uc.card.name,
        description: uc.card.description,
        imageUrl: uc.card.imageUrl,
        rarity: uc.card.rarity,
        count: uc.count,
        obtainedAt: uc.obtainedAt,
        cardSet: {
          id: uc.card.cardSet.id,
          name: uc.card.cardSet.name,
          theme: uc.card.cardSet.theme
        }
      }))
    }));
  } catch (error) {
    console.error('Get my cards error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '获取卡册失败'));
  }
};

// 获取卡组列表和收集进度
export const getCardSets = async (req, res) => {
  try {
    const userId = req.user.id;

    const cardSets = await CardSet.findAll({
      where: { isActive: true },
      include: [{
        model: Card,
        as: 'cards'
      }]
    });

    const result = [];
    for (const set of cardSets) {
      const cards = set.cards;
      const userCards = await UserCard.findAll({
        where: {
          userId,
          cardId: { [Op.in]: cards.map(c => c.id) }
        }
      });

      const collectedCount = userCards.length;
      const isComplete = collectedCount === cards.length;

      result.push({
        id: set.id,
        name: set.name,
        description: set.description,
        theme: set.theme,
        totalCards: set.totalCards,
        collectedCount,
        isComplete,
        progress: Math.round((collectedCount / set.totalCards) * 100)
      });
    }

    res.json(successResponse({ cardSets: result }));
  } catch (error) {
    console.error('Get card sets error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '获取卡组失败'));
  }
};

// 获取签到状态
export const getCheckInStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = getTodayDate();

    const todayCheckIn = await CheckIn.findOne({
      where: { userId, date: today }
    });

    if (todayCheckIn) {
      return res.json(successResponse({
        hasCheckedIn: true,
        consecutiveDays: todayCheckIn.consecutiveDays,
        date: todayCheckIn.date
      }));
    }

    // 查询昨天的签到记录
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split('T')[0];

    const yesterdayCheckIn = await CheckIn.findOne({
      where: { userId, date: yesterdayDate },
      order: [['date', 'DESC']]
    });

    res.json(successResponse({
      hasCheckedIn: false,
      consecutiveDays: yesterdayCheckIn ? yesterdayCheckIn.consecutiveDays : 0,
      date: null
    }));
  } catch (error) {
    console.error('Get check-in status error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '获取签到状态失败'));
  }
};

// 执行签到
export const checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = getTodayDate();

    // 检查今天是否已签到
    const todayCheckIn = await CheckIn.findOne({
      where: { userId, date: today }
    });

    if (todayCheckIn) {
      return res.status(400).json(errorResponse(ERROR_CODES.ALREADY_CHECKED_IN, '今日已签到'));
    }

    // 查询昨天的签到记录
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split('T')[0];

    const yesterdayCheckIn = await CheckIn.findOne({
      where: { userId, date: yesterdayDate }
    });

    let consecutiveDays = 1;
    if (yesterdayCheckIn) {
      consecutiveDays = yesterdayCheckIn.consecutiveDays + 1;
    }

    // 随机发放卡片
    const allCards = await Card.findAll();
    let rewardCard = null;
    let isSpecialReward = false;

    if (allCards.length > 0) {
      // 连续签到7天，发放稀有卡片
      if (consecutiveDays % 7 === 0) {
        const rareCards = allCards.filter(c => c.rarity === 'rare' || c.rarity === 'epic');
        rewardCard = rareCards.length > 0 ? randomChoice(rareCards) : randomChoice(allCards);
        isSpecialReward = true;
      } else {
        rewardCard = randomChoice(allCards);
      }

      // 添加到用户卡册
      const [userCard, created] = await UserCard.findOrCreate({
        where: { userId, cardId: rewardCard.id },
        defaults: {
          count: 1,
          obtainedAt: new Date()
        }
      });

      if (!created) {
        await userCard.increment('count');
      }
    }

    // 创建签到记录
    const checkInRecord = await CheckIn.create({
      userId,
      date: today,
      consecutiveDays,
      rewardCardId: rewardCard ? rewardCard.id : null
    });

    res.json(successResponse({
      consecutiveDays,
      isSpecialReward,
      rewardCard: rewardCard ? {
        id: rewardCard.id,
        name: rewardCard.name,
        rarity: rewardCard.rarity
      } : null
    }, '签到成功'));
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '签到失败'));
  }
};

// 获取签到历史
export const getCheckInHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 30 } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows } = await CheckIn.findAndCountAll({
      where: { userId },
      order: [['date', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json(successResponse({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      data: rows.map(record => ({
        date: record.date,
        consecutiveDays: record.consecutiveDays
      }))
    }));
  } catch (error) {
    console.error('Get check-in history error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '获取签到历史失败'));
  }
};
