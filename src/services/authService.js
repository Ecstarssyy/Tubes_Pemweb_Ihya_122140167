import api from './api';

// Add users array to store registered users
let users = [
  { username: 'admin', password: '1', role: 'admin' }
];

export const AuthService = {
  login: async (username, password) => {
    try {
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        return { success: true, user: { username, role: user.role } };
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (username, password) => {
    try {
      // Check if username already exists
      if (users.some(u => u.username === username)) {
        throw new Error('Username already exists');
      }
      
      // Add new user
      const newUser = { username, password, role: 'user' };
      users.push(newUser);
      
      return { success: true, user: { username, role: 'user' } };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
};
