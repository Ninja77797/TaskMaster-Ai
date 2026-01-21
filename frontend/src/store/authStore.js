import { create } from 'zustand';
import { authService } from '../services/authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data, token: data.token, loading: false });
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.register(userData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data, token: data.token, loading: false });
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al registrar usuario';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.updateProfile(profileData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data, token: data.token, loading: false });
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar perfil';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  deleteAccount: async () => {
    set({ loading: true, error: null });
    try {
      await authService.deleteAccount();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null, loading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar la cuenta';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  uploadAvatar: async (file) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.uploadAvatar(file);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data, token: data.token, loading: false });
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al subir la foto de perfil';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  loginWithGoogle: () => {
    const base = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;
    const authUrl = `${base}/api/auth/google`;
    window.location.href = authUrl;
  },

  loginWithToken: async (token) => {
    set({ loading: true, error: null });
    try {
      localStorage.setItem('token', token);
      const profile = await authService.getProfile();
      const user = { ...profile, token };
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, loading: false });
      return user;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const errorMessage =
        error.response?.data?.message || 'Error al completar inicio de sesión con Google';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  clearError: () => set({ error: null }),
}));
