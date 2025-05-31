// src/hooks/useUserRegistrationStatus.js
import { useState, useEffect, useCallback } from 'react';
import { getUserRegistration } from '../services/eventService'; //
import { useAuth } from '../context/AuthContext'; //

export const useUserRegistrationStatus = (eventId) => {
  const { user } = useAuth(); // Mengambil user dari AuthContext
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(false); // Awalnya false, jadi true saat fetch
  const [error, setError] = useState(null);

  const fetchRegistration = useCallback(async () => {
    if (!eventId) {
      setError("Event ID tidak valid untuk status registrasi pengguna.");
      setRegistration(null);
      return;
    }
    if (!user) { // Jika user tidak login, tidak perlu fetch
      setRegistration(null);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      // getUserRegistration mungkin perlu user.id atau akan diambil dari token di backend
      const data = await getUserRegistration(eventId); // Backend dummy kini mengembalikan struktur yang lebih baik
      setRegistration(data);
    } catch (err) {
      console.error(`Error in useUserRegistrationStatus for eventId ${eventId}, user ${user ? user.username : 'unknown'}:`, err);
      setError(err.message || 'Gagal memuat status registrasi Anda untuk event ini.');
      setRegistration(null);
    } finally {
      setLoading(false);
    }
  }, [eventId, user]); // Tambahkan user sebagai dependency

  useEffect(() => {
    fetchRegistration();
  }, [fetchRegistration]); // fetchRegistration sudah di-memoize

  return { registration, loading, error, refetch: fetchRegistration };
};