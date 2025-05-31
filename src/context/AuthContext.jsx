// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthService } from '../services/authService'; // Pastikan path benar

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Untuk loading awal saat cek sesi

  const fetchCurrentUserCallback = useCallback(async () => {
    // Tidak perlu setLoading(true) di sini karena ini dipanggil dalam useEffect
    // dan juga bisa dipanggil manual. setLoading(true) utama ada di useEffect.
    try {
      const currentUser = await AuthService.fetchCurrentUser(); // Mengambil dari service
      if (currentUser && currentUser.id) { // Pastikan user valid
        setUser(currentUser);
        localStorage.setItem('user', JSON.stringify(currentUser)); // Update localStorage
      } else {
        // Token mungkin ada tapi tidak valid, atau tidak ada token
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        setUser(null);
      }
    } catch (e) {
      console.warn("Sesi tidak valid atau gagal mengambil data pengguna:", e.message);
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      setUser(null);
    }
    // setLoading(false) akan dihandle oleh useEffect utama
  }, []);


  useEffect(() => {
    const initializeAuth = async () => {
        setLoading(true);
        await fetchCurrentUserCallback();
        setLoading(false);
    };
    initializeAuth();
  }, [fetchCurrentUserCallback]);


  const login = (userDataFromAuthService) => {
    // userDataFromAuthService adalah respons dari AuthService.login
    // yang berisi { status, message, user, token }
    if (userDataFromAuthService && userDataFromAuthService.user) {
      setUser(userDataFromAuthService.user);
      localStorage.setItem('user', JSON.stringify(userDataFromAuthService.user));
      // Token sudah disimpan oleh AuthService.login jika ada
    } else {
      // Handle kasus jika login API tidak mengembalikan user
      console.error("Login service did not return expected user data.");
    }
  };

  const logout = async () => {
    setLoading(true); // Bisa ditambahkan feedback loading saat logout
    await AuthService.logout(); // Ini sudah menghapus localStorage item
    setUser(null);
    setLoading(false);
  };

  const value = {
    user,
    login,
    logout,
    loading, 
    fetchCurrentUser: fetchCurrentUserCallback // Ekspor fungsi untuk refresh user jika perlu
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Tampilkan children hanya jika loading awal selesai, atau tampilkan spinner global */}
      {/* {!loading ? children : <GlobalLoadingSpinner />} */}
      {children} 
    </AuthContext.Provider>
  );
};