import request from '@/utils/request';

export const getLinuxdoAuthUrl = () => {
  return request.get('/linuxdo/auth-url');
};

export const linuxdoCallback = (code) => {
  return request.post('/linuxdo/callback', { code });
};
