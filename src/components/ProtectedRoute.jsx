// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// Anda mungkin ingin mengambil user dari AuthContext di sini daripada prop
// import { useAuth } from '../context/AuthContext'; 

// Jika menggunakan prop user:
const ProtectedRoute = ({ children, user, requiredRole }) => {
  // Jika menggunakan AuthContext:
  // const { user } = useAuth(); 
  const location = useLocation();

  if (!user) {
    // Redirect ke halaman login, simpan lokasi saat ini agar bisa kembali setelah login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Jika role tidak sesuai, redirect ke halaman utama atau halaman "unauthorized"
    // Untuk kesederhanaan, redirect ke halaman utama event
    return <Navigate to="/events" replace />; 
  }

  return children;
};

export default ProtectedRoute;