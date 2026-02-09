import { User, QuizSession } from '../models/index.js';
import { successResponse, errorResponse, ERROR_CODES } from '../utils/response.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

// 获取积分排行榜
export const getPointsRanking = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const users = await User.findAll({
      attributes: ['id', 'username', 'points', 'createdAt'],
      order: [['points', 'DESC']],
      limit: parseInt(limit)
    });

    res.json(successResponse({
      ranking: users.map((user, index) => ({
        rank: index + 1,
        userId: user.id,
        username: user.username,
        points: user.points,
        joinedAt: user.createdAt
      }))
    }));
  } catch (error) {
    console.error('Get points ranking error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '获取排行榜失败'));
  }
};

// 获取答题排行榜
export const getQuizRanking = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const rankings = await QuizSession.findAll({
      attributes: [
        'userId',
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalQuizzes'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN is_passed = 1 THEN 1 ELSE 0 END')), 'passedQuizzes']
      ],
      group: ['userId'],
      order: [[sequelize.literal('passedQuizzes'), 'DESC']],
      limit: parseInt(limit),
      include: [{
        model: User,
        as: 'user',
        attributes: ['username']
      }]
    });

    res.json(successResponse({
      ranking: rankings.map((item, index) => ({
        rank: index + 1,
        userId: item.userId,
        username: item.user.username,
        totalQuizzes: parseInt(item.get('totalQuizzes')),
        passedQuizzes: parseInt(item.get('passedQuizzes'))
      }))
    }));
  } catch (error) {
    console.error('Get quiz ranking error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '获取排行榜失败'));
  }
};
