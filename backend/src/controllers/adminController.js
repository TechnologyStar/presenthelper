import { Question, CardSet, Card, User, QuizSession, CheckIn, UserCard } from '../models/index.js';
import { successResponse, errorResponse, ERROR_CODES } from '../utils/response.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

// 题目管理
export const createQuestion = async (req, res) => {
  try {
    const { content, type, options, correctAnswer, tags, difficulty } = req.body;

    const question = await Question.create({
      content,
      type,
      options,
      correctAnswer,
      tags,
      difficulty: difficulty || 'medium',
      isActive: true
    });

    res.status(201).json(successResponse(question, '题目创建成功'));
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '创建题目失败'));
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, type, options, correctAnswer, tags, difficulty } = req.body;

    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json(errorResponse(ERROR_CODES.QUESTION_NOT_FOUND, '题目不存在'));
    }

    await question.update({
      content,
      type,
      options,
      correctAnswer,
      tags,
      difficulty
    });

    res.json(successResponse(question, '题目更新成功'));
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '更新题目失败'));
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json(errorResponse(ERROR_CODES.QUESTION_NOT_FOUND, '题目不存在'));
    }

    await question.update({ isActive: false });

    res.json(successResponse(null, '题目删除成功'));
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '删除题目失败'));
  }
};

export const getQuestions = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, difficulty, keyword } = req.query;
    const offset = (page - 1) * limit;

    const where = { isActive: true };
    if (type) where.type = type;
    if (difficulty) where.difficulty = difficulty;
    if (keyword) {
      where.content = { [Op.like]: `%${keyword}%` };
    }

    const { count, rows } = await Question.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json(successResponse({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      data: rows
    }));
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '获取题目列表失败'));
  }
};

// 卡组管理
export const createCardSet = async (req, res) => {
  try {
    const { name, description, theme, cards } = req.body;

    const cardSet = await CardSet.create({
      name,
      description,
      theme,
      totalCards: cards.length,
      isActive: true
    });

    // 创建卡片
    for (const cardData of cards) {
      await Card.create({
        setId: cardSet.id,
        name: cardData.name,
        description: cardData.description,
        imageUrl: cardData.imageUrl,
        rarity: cardData.rarity || 'common'
      });
    }

    res.status(201).json(successResponse(cardSet, '卡组创建成功'));
  } catch (error) {
    console.error('Create card set error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '创建卡组失败'));
  }
};

export const getCardSetsAdmin = async (req, res) => {
  try {
    const cardSets = await CardSet.findAll({
      include: [{
        model: Card,
        as: 'cards'
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(successResponse({ cardSets }));
  } catch (error) {
    console.error('Get card sets error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '获取卡组列表失败'));
  }
};

export const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, rarity } = req.body;

    const card = await Card.findByPk(id);
    if (!card) {
      return res.status(404).json(errorResponse(ERROR_CODES.RESOURCE_NOT_FOUND, '卡片不存在'));
    }

    await card.update({ name, description, imageUrl, rarity });

    res.json(successResponse(card, '卡片更新成功'));
  } catch (error) {
    console.error('Update card error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '更新卡片失败'));
  }
};

// 获取系统统计数据
export const getStatistics = async (req, res) => {
  try {
    // 用户统计
    const totalUsers = await User.count();
    const todayUsers = await User.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    });

    // 答题统计
    const totalQuizSessions = await QuizSession.count();
    const todayQuizSessions = await QuizSession.count({
      where: {
        date: new Date().toISOString().split('T')[0]
      }
    });
    const passedQuizSessions = await QuizSession.count({
      where: { isPassed: true }
    });

    // 签到统计
    const totalCheckIns = await CheckIn.count();
    const todayCheckIns = await CheckIn.count({
      where: {
        date: new Date().toISOString().split('T')[0]
      }
    });

    // 卡片统计
    const totalCards = await Card.count();
    const totalUserCards = await UserCard.count();
    const uniqueCardCollectors = await UserCard.count({
      distinct: true,
      col: 'userId'
    });

    // 题目统计
    const totalQuestions = await Question.count({ where: { isActive: true } });
    const questionsByDifficulty = await Question.findAll({
      where: { isActive: true },
      attributes: [
        'difficulty',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['difficulty']
    });

    // 最近7天的答题趋势
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentQuizTrend = await QuizSession.findAll({
      where: {
        createdAt: {
          [Op.gte]: sevenDaysAgo
        }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    res.json(successResponse({
      users: {
        total: totalUsers,
        today: todayUsers
      },
      quiz: {
        total: totalQuizSessions,
        today: todayQuizSessions,
        passed: passedQuizSessions,
        passRate: totalQuizSessions > 0 ? ((passedQuizSessions / totalQuizSessions) * 100).toFixed(2) : 0
      },
      checkIn: {
        total: totalCheckIns,
        today: todayCheckIns
      },
      cards: {
        total: totalCards,
        collected: totalUserCards,
        collectors: uniqueCardCollectors
      },
      questions: {
        total: totalQuestions,
        byDifficulty: questionsByDifficulty.map(q => ({
          difficulty: q.difficulty,
          count: parseInt(q.get('count'))
        }))
      },
      trends: {
        quiz: recentQuizTrend.map(t => ({
          date: t.get('date'),
          count: parseInt(t.get('count'))
        }))
      }
    }));
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '获取统计数据失败'));
  }
};

