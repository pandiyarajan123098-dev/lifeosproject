import api from './api';

export const authService = {
  async register(data) {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  async login(credentials) {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data;
  },

  async updatePassword(data) {
    const res = await api.put('/auth/password', data);
    return res.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore logout network errors
    } finally {
      localStorage.removeItem('lifeos_token');
      localStorage.removeItem('lifeos_user');
    }
  },
};
