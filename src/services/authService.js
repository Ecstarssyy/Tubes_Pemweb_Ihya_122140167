import api from './api';

export const AuthService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/login', { username, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (username, password, email) => {
    try {
      const response = await api.post('/register', { username, password, email });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      localStorage.removeItem('token');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
};
