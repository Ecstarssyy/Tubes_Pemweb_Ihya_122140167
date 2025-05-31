// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { AuthService } from '../services/authService';
import Button from '../components/Button'; // Impor komponen Button
import { useNavigate } from 'react-router-dom'; // Impor useNavigate

const LoginPage = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [role, setRole] = useState('participant'); // Role tetap ada untuk simulasi awal
  const [isLoading, setIsLoading] = useState(false); // State untuk loading
  const navigate = useNavigate(); // Hook untuk navigasi

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true); // Mulai loading

    try {
      if (isRegister) {
        await AuthService.register(username, password, email);
        setSuccessMessage('Registrasi berhasil! Silakan login.');
        setIsRegister(false); // Kembali ke form login setelah sukses register
        // Reset form fields
        setUsername('');
        setPassword('');
        setEmail('');
      } else {
        // Panggil AuthService.login yang sudah diupdate
        const authData = await AuthService.login(username, password);
        
        // Asumsi backend (setelah diintegrasikan) akan mengembalikan user data termasuk role.
        // Untuk saat ini, karena backend views.py masih dummy, onLogin akan
        // dipanggil dengan role yang dipilih di frontend.
        // Nanti, data pengguna (termasuk role) harusnya datang dari authData.user
        const userDataForOnLogin = {
          username: username, // atau authData.user.username jika backend mengembalikan
          role: role,       // atau authData.user.role jika backend mengembalikan
          // id: authData.user.id, // jika backend mengembalikan
        };

        if (onLogin) {
          onLogin(userDataForOnLogin); // Panggil onLogin dengan data pengguna
        }
        setSuccessMessage('Login berhasil!');
        navigate('/events'); // Navigasi ke halaman events setelah login sukses
      }
    } catch (err) {
      setError(err.message || (isRegister ? 'Registrasi gagal.' : 'Login gagal.'));
    } finally {
      setIsLoading(false); // Selesai loading
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 sm:p-6"> {/* Latar: #EAEFEF */}
      <div className="max-w-md w-full bg-white rounded-xl shadow-custom-strong p-8 sm:p-10">
        <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-8 text-center text-brand-dark">
          {isRegister ? 'Buat Akun Baru' : 'Selamat Datang Kembali'}
        </h2>
        
        {error && <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md text-center">{error}</div>}
        {successMessage && <div className="mb-4 text-sm text-green-600 bg-green-100 p-3 rounded-md text-center">{successMessage}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1.5 font-semibold text-brand-dark text-sm">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-brand-medium"
            />
          </div>
          {isRegister && (
            <div>
              <label className="block mb-1.5 font-semibold text-brand-dark text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={isRegister}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-brand-medium"
              />
            </div>
          )}
          <div>
            <label className="block mb-1.5 font-semibold text-brand-dark text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-brand-medium"
            />
          </div>
          {!isRegister && (
            <div>
              <label className="block mb-1.5 font-semibold text-brand-dark text-sm">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-brand-medium bg-white"
              >
                <option value="participant">Participant</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
          <Button
            type="submit"
            variant="primary" // Menggunakan variant primary dari Button.jsx
            className="w-full !py-3" // Override padding y jika perlu dengan !
            disabled={isLoading}
          >
            {isLoading ? (isRegister ? 'Mendaftarkan...' : 'Masuk...') : (isRegister ? 'Register' : 'Login')}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setError('');
              setSuccessMessage('');
              setIsRegister(!isRegister);
            }}
            className="text-sm text-brand-medium hover:text-brand-dark hover:underline transition-colors"
          >
            {isRegister ? 'Sudah punya akun? Login di sini' : "Belum punya akun? Daftar sekarang"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;