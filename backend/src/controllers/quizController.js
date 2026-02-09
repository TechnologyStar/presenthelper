import { Question, QuizSession, User, Card, UserCard } from '../models/index.js';
import { successResponse, errorResponse, ERROR_CODES } from '../utils/response.js';
import { getTodayDate, randomChoices } from '../utils/helpers.js';
import { Op } from 'sequelize';

// 获取今日答题任务
export const getDailyQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = getTodayDate();

    // 检查今天是否已经答题
    let session = await QuizSession.findOne({
      where: { userId, date: today }
    });

    if (session) {
      // 已经有答题记录，返回题目
      const questions = await Question.findAll({
        where: { id: { [Op.in]: session.questions } },
        attributes: ['id', 'content', 'type', 'options', 'difficulty', 'tags']
      });

      return res.json(successResponse({
        session: {
          id: session.id,
          date: session.date,
          score: session.score,
          isPassed: session.isPassed,
          completedAt: session.completedAt
        },
        questions: questions.map(q => q.toJSON()),
        answers: session.answers || []
      }));
    }

    // 创建新的答题任务
    const allQuestions = await Question.findAll({
      where: { isActive: true }
    });

    if (allQuestions.length < 10) {
      return res.status(400).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '题库题目不足'));
    }

    // 随机选择10道题
    const selectedQuestions = randomChoices(allQuestions, 10);
    const questionIds = selectedQuestions.map(q => q.id);

    session = await QuizSession.create({
      userId,
      date: today,
      questions: questionIds,
      answers: [],
      score: 0,
      isPassed: false,
      startedAt: new Date()
    });

    res.json(successResponse({
      session: {
        id: session.id,
        date: session.date,
        score: 0,
        isPassed: false,
        completedAt: null
      },
      questions: selectedQuestions.map(q => ({
        id: q.id,
        content: q.content,
        type: q.type,
        options: q.options,
        difficulty: q.difficulty,
        tags: q.tags
      })),
      answers: []
    }));
  } catch (error) {
    console.error('Get daily quiz error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '获取答题任务失败'));
  }
};

// 提交答案
export const submitAnswer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId, questionId, answer } = req.body;

    const session = await QuizSession.findOne({
      where: { id: sessionId, userId }
    });

    if (!session) {
      return res.status(404).json(errorResponse(ERROR_CODES.QUIZ_SESSION_NOT_FOUND, '答题会话不存在'));
    }

    if (session.completedAt) {
      return res.status(400).json(errorResponse(ERROR_CODES.ALREADY_ANSWERED_TODAY, '已完成答题'));
    }

    const question = await Question.findByPk(questionId);
    if (!question) {
      return res.status(404).json(errorResponse(ERROR_CODES.QUESTION_NOT_FOUND, '题目不存在'));
    }

    // 判断答案是否正确
    const isCorrect = answer === question.correctAnswer;

    // 更新答案记录
    const answers = session.answers || [];
    answers.push({
      questionId,
      answer,
      isCorrect,
      timestamp: new Date()
    });

    await session.update({ answers });

    res.json(successResponse({
      isCorrect,
      correctAnswer: question.correctAnswer
    }));
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '提交答案失败'));
  }
};

// 完成答题
export const completeQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.body;

    const session = await QuizSession.findOne({
      where: { id: sessionId, userId }
    });

    if (!session) {
      return res.status(404).json(errorResponse(ERROR_CODES.QUIZ_SESSION_NOT_FOUND, '答题会话不存在'));
    }

    if (session.completedAt) {
      return res.status(400).json(errorResponse(ERROR_CODES.ALREADY_ANSWERED_TODAY, '已完成答题'));
    }

    // 计算得分
    const answers = session.answers || [];
    const correctCount = answers.filter(a => a.isCorrect).length;
    const score = correctCount * 10;
    const isPassed = score >= 80;

    await session.update({
      score,
      isPassed,
      completedAt: new Date()
    });

    // 如果合格，发放卡片奖励
    let rewardCards = [];
    if (isPassed) {
      const allCards = await Card.findAll();
      if (allCards.length > 0) {
        // 随机发放1-3张卡片
        const cardCount = Math.floor(Math.random() * 3) + 1;
        const selectedCards = randomChoices(allCards, Math.min(cardCount, allCards.length));

        for (const card of selectedCards) {
          const [userCard, created] = await UserCard.findOrCreate({
            where: { userId, cardId: card.id },
            defaults: {
              count: 1,
              obtainedAt: new Date()
            }
          });

          if (!created) {
            await userCard.increment('count');
          }

          rewardCards.push({
            id: card.id,
            name: card.name,
            rarity: card.rarity
          });
        }
      }

      // 增加积分
      await User.increment('points', { by: 10, where: { id: userId } });
    }

    res.json(successResponse({
      score,
      isPassed,
      correctCount,
      totalCount: 10,
      rewardCards,
      pointsEarned: isPassed ? 10 : 0
    }, '答题完成'));
  } catch (error) {
    console.error('Complete quiz error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '完成答题失败'));
  }
};

// 获取答题历史
export const getQuizHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows } = await QuizSession.findAndCountAll({
      where: { userId },
      order: [['date', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json(successResponse({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      data: rows.map(session => ({
        id: session.id,
        date: session.date,
        score: session.score,
        isPassed: session.isPassed,
        completedAt: session.completedAt
      }))
    }));
  } catch (error) {
    console.error('Get quiz history error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '获取答题历史失败'));
  }
};
