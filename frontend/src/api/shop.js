import request from './request';

export const getShopItems = () => {
  return request.get('/api/shop/items');
};

export const redeemItem = (itemId) => {
  return request.post('/api/shop/redeem', { item_id: itemId });
};

export const getMyRedemptions = () => {
  return request.get('/api/shop/my-redemptions');
};
