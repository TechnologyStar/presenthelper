import { defineStore } from 'pinia';
import { ref } from 'vue';
import { login as loginApi, register as registerApi, getProfile } from '@/api/auth';
import { linuxdoCallback } from '@/api/linuxdo';

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '');
  const userInfo = ref(null);

  const setToken = (newToken) => {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  };

  const setUserInfo = (info) => {
    userInfo.value = info;
  };

  const login = async (credentials) => {
    const res = await loginApi(credentials);
    setToken(res.data.token);
    setUserInfo(res.data.user);
    return res;
  };

  const register = async (data) => {
    const res = await registerApi(data);
    setToken(res.data.token);
    setUserInfo(res.data.user);
    return res;
  };

  const linuxdoLogin = async (code) => {
    const res = await linuxdoCallback(code);
    setToken(res.data.token);
    setUserInfo(res.data.user);
    return res;
  };

  const fetchUserInfo = async () => {
    const res = await getProfile();
    setUserInfo(res.data);
    return res;
  };

  const logout = () => {
    token.value = '';
    userInfo.value = null;
    localStorage.removeItem('token');
  };

  return {
    token,
    userInfo,
    setToken,
    setUserInfo,
    login,
    register,
    linuxdoLogin,
    fetchUserInfo,
    logout
  };
});
