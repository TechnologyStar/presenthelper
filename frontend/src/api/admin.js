import request from '@/utils/request';

// 获取统计数据
export const getStatistics = () => {
  return request.get('/admin/statistics');
};

// 题目管理
export const createQuestion = (data) => {
  return request.post('/admin/questions', data);
};

export const updateQuestion = (id, data) => {
  return request.put(`/admin/questions/${id}`, data);
};

export const deleteQuestion = (id) => {
  return request.delete(`/admin/questions/${id}`);
};

export const getQuestions = (params) => {
  return request.get('/admin/questions', { params });
};

// 卡组管理
export const createCardSet = (data) => {
  return request.post('/admin/cardsets', data);
};

export const getCardSetsAdmin = () => {
  return request.get('/admin/cardsets');
};

export const updateCard = (id, data) => {
  return request.put(`/admin/cards/${id}`, data);
};
