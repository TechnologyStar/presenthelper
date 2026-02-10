import request from './request';

export const getStories = () => {
  return request.get('/api/story');
};

export const getStoryDetail = (id) => {
  return request.get(`/api/story/${id}`);
};

export const markStoryRead = (id) => {
  return request.post(`/api/story/${id}/read`);
};
