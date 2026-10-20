import api from './api';

export const taskService = {
  async getTodayTasks() {
    const res = await api.get('/tasks/today');
    return res.data;
  },

  async generateTasks(regenerate = false) {
    const res = await api.post('/tasks/generate', { regenerate });
    return res.data;
  },

  async toggleTask(taskId, isCompleted) {
    const res = await api.patch(`/tasks/${taskId}`, { is_completed: isCompleted });
    return res.data;
  },

  async submitDailyProgress() {
    const res = await api.post('/tasks/submit');
    return res.data;
  },

  async getTaskHistory(params = {}) {
    const res = await api.get('/tasks/history', { params });
    return res.data;
  },

  async getDashboardStats() {
    const res = await api.get('/dashboard/stats');
    return res.data;
  },
};
