import { create } from 'zustand';
import { taskService } from '../services/taskService';

export const useTaskStore = create((set, get) => ({
  tasks: [],
  selectedTask: null,
  loading: false,
  error: null,
  filters: {
    completed: null,
    priority: null,
    category: null,
    search: '',
  },

  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const filters = get().filters;
      const cleanFilters = {};
      
      if (filters.completed !== null) cleanFilters.completed = filters.completed;
      if (filters.priority) cleanFilters.priority = filters.priority;
      if (filters.category) cleanFilters.category = filters.category;
      if (filters.search) cleanFilters.search = filters.search;
      
      const tasks = await taskService.getTasks(cleanFilters);
      set({ tasks, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al cargar tareas', loading: false });
    }
  },

  createTask: async (taskData) => {
    set({ loading: true, error: null });
    try {
      const newTask = await taskService.createTask(taskData);
      set({ tasks: [newTask, ...get().tasks], loading: false });
      return newTask;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al crear tarea', loading: false });
      throw error;
    }
  },

  updateTask: async (id, taskData) => {
    set({ loading: true, error: null });
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      set({
        tasks: get().tasks.map((task) => (task._id === id ? updatedTask : task)),
        loading: false,
      });
      return updatedTask;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al actualizar tarea', loading: false });
      throw error;
    }
  },

  deleteTask: async (id) => {
    set({ loading: true, error: null });
    try {
      await taskService.deleteTask(id);
      set({ tasks: get().tasks.filter((task) => task._id !== id), loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al eliminar tarea', loading: false });
      throw error;
    }
  },

  toggleComplete: async (id) => {
    try {
      const updatedTask = await taskService.toggleComplete(id);
      set({
        tasks: get().tasks.map((task) => (task._id === id ? updatedTask : task)),
      });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al actualizar tarea' });
      throw error;
    }
  },

  toggleSubtask: async (taskId, subtaskId) => {
    try {
      const updatedTask = await taskService.toggleSubtask(taskId, subtaskId);
      set({
        tasks: get().tasks.map((task) => (task._id === taskId ? updatedTask : task)),
      });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al actualizar subtarea' });
      throw error;
    }
  },

  setSelectedTask: (task) => set({ selectedTask: task }),

  clearError: () => set({ error: null }),
}));
