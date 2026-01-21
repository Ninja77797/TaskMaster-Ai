import api from './api';

export const aiService = {
  generateSubtasks: async (taskData) => {
    const response = await api.post('/ai/subtasks', taskData);
    return response.data;
  },

  suggestPriority: async (taskData) => {
    const response = await api.post('/ai/priority', taskData);
    return response.data;
  },

  estimateTime: async (taskData) => {
    const response = await api.post('/ai/estimate-time', taskData);
    return response.data;
  },

  autoTag: async (taskData) => {
    const response = await api.post('/ai/tags', taskData);
    return response.data;
  },

  parseNaturalLanguage: async (text) => {
    const response = await api.post('/ai/parse', { text });
    return response.data;
  },

  chat: async (message, taskId = null, history = []) => {
    const response = await api.post('/ai/chat', { message, taskId, history });
    return response.data;
  },

  analyzeTask: async (taskData) => {
    const response = await api.post('/ai/analyze', taskData);
    return response.data;
  },
};
