import express from 'express';
import {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestions,
  createCardSet,
  getCardSetsAdmin,
  updateCard,
  getStatistics
} from '../controllers/adminController.js';
import { authenticate, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

// 所有管理接口都需要管理员权限
router.use(authenticate, requireAdmin);

// 统计数据
router.get('/statistics', getStatistics);

// 题目管理
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);
router.get('/questions', getQuestions);

// 卡组管理
router.post('/cardsets', createCardSet);
router.get('/cardsets', getCardSetsAdmin);
router.put('/cards/:id', updateCard);

export default router;
