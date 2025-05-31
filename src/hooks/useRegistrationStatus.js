// src/hooks/useRegistrationStatus.js
import { useState, useEffect, useCallback } from 'react';
import { getRegistrationStats } from '../services/eventService'; //

const POLLING_INTERVAL = 30000; // 30 detik (tetap)
const MAX_RETRIES = 3; // (tetap)

// fetchWithRetry tetap bisa digunakan
const fetchWithRetry = async (fetchFunction, maxRetries = MAX_RETRIES) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetchFunction();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

export const useRegistrationStatus = (eventId) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true); // Awalnya true saat pertama kali load
  const [error, setError] = useState(null);

  const fetchStatus = useCallback(async () => {
    if (!eventId) {
      setError("Event ID tidak valid untuk status registrasi.");
      setLoading(false);
      setStatus(null);
      return;
    }
    // Tidak set loading true di sini agar polling tidak selalu menunjukkan spinner besar
    // kecuali untuk pemanggilan awal.
    // setLoading(true); // Mungkin tidak perlu untuk setiap poll, hanya initial load.
    setError(null);
    try {
      const data = await fetchWithRetry(() => getRegistrationStats(eventId));
      setStatus(data); // Backend dummy kini mengembalikan struktur yang lebih baik
    } catch (err) {
      console.error(`Error in useRegistrationStatus for eventId ${eventId}:`, err);
      setError(err.message || 'Gagal memuat status registrasi event.');
      // Jangan setStatus ke null agar data lama tetap tampil saat polling gagal,
      // kecuali jika ini adalah error kritis pertama.
      // setStatus(null); 
    } finally {
      // setLoading(false); // Hanya set false jika ini adalah initial load
    }
  }, [eventId]);

  useEffect(() => {
    setLoading(true); // Set loading true hanya untuk pemanggilan awal
    fetchStatus().finally(() => setLoading(false)); // Pastikan loading false setelah fetch awal selesai

    const intervalId = setInterval(fetchStatus, POLLING_INTERVAL);
    return () => clearInterval(intervalId);
  }, [fetchStatus]); // fetchStatus sudah di-memoize dengan eventId

  return { status, loading, error, refetch: fetchStatus };
};