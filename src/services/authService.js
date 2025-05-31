// src/services/authService.js
import { get, post } from './api';

export const AuthService = {
  login: async (username, password) => {
    try {
      const responseData = await post('/api/login', { username, password });
      // Backend dummy login (views.py) seharusnya mengembalikan:
      // { status: "success", message: "Login berhasil!", user: user_data_to_return, token: "dummy-token-for-username" }
      if (responseData && responseData.token && responseData.user) {
        localStorage.setItem('authToken', responseData.token);
        // User data (termasuk role) akan disimpan ke context oleh LoginPage/App
        return responseData; // Kembalikan semua data agar bisa diproses di LoginPage
      } else {
        // Jika respons tidak sesuai harapan
        throw new Error(responseData.message || 'Format respons login tidak sesuai.');
      }
    } catch (error) {
      console.error('Login error in AuthService:', error);
      // Hapus token jika login gagal karena kredensial salah atau error lain
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      throw error; // Lempar error agar bisa ditangani UI
    }
  },

  register: async (username, password, email) => {
    try {
      const responseData = await post('/api/register', { username, password, email });
      // Backend dummy register (views.py) seharusnya mengembalikan:
      // { status: "success", message: "Registrasi berhasil!", user: user_data_to_return }
      return responseData; 
    } catch (error) {
      console.error('Registration error in AuthService:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await post('/logout'); // Panggil API logout backend (mungkin hanya untuk formalitas jika stateless)
    } catch (error) {
      console.warn('Logout API call failed, proceeding with client-side logout:', error.message);
    } finally {
      // Selalu bersihkan state sisi klien
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    }
    return { success: true }; // Anggap logout klien selalu berhasil
  },

  fetchCurrentUser: async () => {
    // Fungsi ini akan dipanggil oleh AuthContext untuk mengambil detail user jika ada token
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Tidak perlu melempar error, cukup kembalikan null jika tidak ada token
      // AuthContext akan menangani ini dengan setUser(null)
      return null; 
    }
    try {
      // Endpoint /api/users/me sudah kita definisikan di backend dummy (views.py)
      const userData = await get('/users/me'); 
      // Backend dummy mengembalikan { id, username, email, role }
      return userData; 
    } catch (error) {
      console.error("Failed to fetch current user with token:", error.message);
      // Jika token tidak valid atau ada error, hapus token dan data user
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      throw error; // Biarkan AuthContext menangani error ini
    }
  }
};