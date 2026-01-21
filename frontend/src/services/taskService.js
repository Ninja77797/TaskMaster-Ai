import api from './api';

export const taskService = {
  getTasks: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/tasks?${params}`);
    return response.data;
  },

  getTask: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  toggleComplete: async (id) => {
    const response = await api.patch(`/tasks/${id}/toggle`);
    return response.data;
  },

  toggleSubtask: async (taskId, subtaskId) => {
    const response = await api.patch(`/tasks/${taskId}/subtasks/${subtaskId}`);
    return response.data;
  },
};
