import request from './request';

export const getMyInvites = () => {
  return request.get('/api/invite/my');
};
