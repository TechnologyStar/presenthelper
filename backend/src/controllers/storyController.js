import { Story, StoryRead, User, Card, UserCard } from '../models/index.js';
import { successResponse, errorResponse, ERROR_CODES } from '../utils/response.js';
import { randomChoice } from '../utils/helpers.js';

// 获取故事列表
export const getStories = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await StoryRead.findAndCountAll({
      where: { isActive: true },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    // 获取用户已读记录
    const readRecords = await StoryRead.findAll({
      where: { userId },
      attributes: ['storyId', 'isRewarded']
    });

    const readMap = {};
    readRecords.forEach(record => {
      readMap[record.storyId] = {
        isRead: true,
        isRewarded: record.isRewarded
      };
    });

    res.json(successResponse({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      data: rows.map(story => ({
        id: story.id,
        title: story.title,
        coverImage: story.coverImage,
        summary: story.summary,
        xuexiUrl: story.xuexiUrl,
        isRead: readMap[story.id]?.isRead || false,
        isRewarded: readMap[story.id]?.isRewarded || false,
        createdAt: story.createdAt
      }))
    }));
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '获取故事列表失败'));
  }
};

// 获取故事详情
export const getStoryDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const story = await Story.findByPk(id);
    if (!story || !story.isActive) {
      return res.status(404).json(errorResponse(ERROR_CODES.RESOURCE_NOT_FOUND, '故事不存在'));
    }

    // 检查是否已读
    const readRecord = await StoryRead.findOne({
      where: { userId, storyId: id }
    });

    res.json(successResponse({
      id: story.id,
      title: story.title,
      coverImage: story.coverImage,
      summary: story.summary,
      content: story.content,
      xuexiUrl: story.xuexiUrl,
      isRead: !!readRecord,
      isRewarded: readRecord?.isRewarded || false,
      createdAt: story.createdAt
    }));
  } catch (error) {
    console.error('Get story detail error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '获取故事详情失败'));
  }
};

// 标记故事已读并领取奖励
export const markStoryRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const story = await Story.findByPk(id);
    if (!story || !story.isActive) {
      return res.status(404).json(errorResponse(ERROR_CODES.RESOURCE_NOT_FOUND, '故事不存在'));
    }

    // 检查是否已读
    const existingRecord = await StoryRead.findOne({
      where: { userId, storyId: id }
    });

    if (existingRecord) {
      return res.status(400).json(errorResponse(ERROR_CODES.ALREADY_READ, '已经阅读过该故事'));
    }

    // 创建阅读记录
    await StoryRead.create({
      userId,
      storyId: id,
      isRewarded: true
    });

    // 发放奖励：1张随机卡片
    let rewardCard = null;
    const allCards = await Card.findAll();
    if (allCards.length > 0) {
      rewardCard = randomChoice(allCards);

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

    res.json(successResponse({
      rewardCard: rewardCard ? {
        id: rewardCard.id,
        name: rewardCard.name,
        rarity: rewardCard.rarity
      } : null
    }, '阅读完成，奖励已发放'));
  } catch (error) {
    console.error('Mark story read error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '标记阅读失败'));
  }
};

// 管理员：创建故事
export const createStory = async (req, res) => {
  try {
    const { title, coverImage, summary, content, xuexiUrl } = req.body;

    const story = await Story.create({
      title,
      coverImage,
      summary,
      content,
      xuexiUrl,
      isActive: true
    });

    res.status(201).json(successResponse(story, '故事创建成功'));
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '创建故事失败'));
  }
};

// 管理员：更新故事
export const updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, coverImage, summary, content, xuexiUrl } = req.body;

    const story = await Story.findByPk(id);
    if (!story) {
      return res.status(404).json(errorResponse(ERROR_CODES.RESOURCE_NOT_FOUND, '故事不存在'));
    }

    await story.update({
      title,
      coverImage,
      summary,
      content,
      xuexiUrl
    });

    res.json(successResponse(story, '故事更新成功'));
  } catch (error) {
    console.error('Update story error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '更新故事失败'));
  }
};

// 管理员：删除故事
export const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;

    const story = await Story.findByPk(id);
    if (!story) {
      return res.status(404).json(errorResponse(ERROR_CODES.RESOURCE_NOT_FOUND, '故事不存在'));
    }

    await story.update({ isActive: false });

    res.json(successResponse(null, '故事删除成功'));
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '删除故事失败'));
  }
};

// 管理员：获取所有故事
export const getAllStories = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Story.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json(successResponse({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      data: rows
    }));
  } catch (error) {
    console.error('Get all stories error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '获取故事列表失败'));
  }
};
