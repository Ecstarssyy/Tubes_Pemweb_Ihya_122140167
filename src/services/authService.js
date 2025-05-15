import api from './api';

// Add users array to store registered users
let users = [
  { username: 'admin', password: '1', role: 'admin' }
];

export const AuthService = {
  // Mock API call to check if the user is logged in
  isLoggedIn: async () => {
    // Return true if the user is logged in,
    // otherwise return false
    try {
      const response = await api.get('/auth/check');
      return response.data.isLoggedIn;
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  },
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
