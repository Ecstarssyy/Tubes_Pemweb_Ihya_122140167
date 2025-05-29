export const AuthService = {
  login: async (username, password) => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
      const data = await response.json();
      localStorage.setItem('user_id', data.user_id);
      return { success: true, user_id: data.user_id };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  register: async (username, password, email) => {
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }
      const data = await response.json();
      localStorage.setItem('user_id', data.user_id);
      return { success: true, user_id: data.user_id };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  logout: async () => {
    try {
      localStorage.removeItem('user_id');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
};
