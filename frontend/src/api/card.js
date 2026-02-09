import request from '@/utils/request';

// 获取用户卡册
export const getMyCards = () => {
  return request.get('/card/my');
};

// 获取卡组列表和收集进度
export const getCardSets = () => {
  return request.get('/card/sets');
};
