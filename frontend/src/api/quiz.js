import request from '@/utils/request';

// 获取今日答题任务
export const getDailyQuiz = () => {
  return request.get('/quiz/daily');
};

// 提交答案
export const submitAnswer = (data) => {
  return request.post('/quiz/submit', data);
};

// 完成答题
export const completeQuiz = (data) => {
  return request.post('/quiz/complete', data);
};

// 获取答题历史
export const getQuizHistory = (params) => {
  return request.get('/quiz/history', { params });
};
