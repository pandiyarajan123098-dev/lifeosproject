import api from './api';

export const profileService = {
  async getProfile() {
    const res = await api.get('/profile');
    return res.data;
  },

  async saveOnboarding(data) {
    const res = await api.post('/profile', data);
    return res.data;
  },

  async updateProfile(data) {
    const res = await api.put('/profile', data);
    return res.data;
  },

  async getInterests() {
    const res = await api.get('/profile/interests');
    return res.data;
  },

  async updateInterests(interests) {
    const res = await api.put('/profile/interests', { interests });
    return res.data;
  },

  async getSkills() {
    const res = await api.get('/profile/skills');
    return res.data;
  },

  async updateSkills(skills) {
    const res = await api.put('/profile/skills', { skills });
    return res.data;
  },
};
