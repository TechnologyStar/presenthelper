import request from '@/utils/request';

// 获取签到状态
export const getCheckInStatus = () => {
  return request.get('/checkin/status');
};

// 执行签到
export const checkIn = () => {
  return request.post('/checkin');
};

// 获取签到历史
export const getCheckInHistory = (params) => {
  return request.get('/checkin/history', { params });
};
