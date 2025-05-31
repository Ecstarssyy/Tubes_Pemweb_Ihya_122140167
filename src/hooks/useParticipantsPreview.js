// src/hooks/useParticipantsPreview.js
import { useState, useEffect, useCallback } from 'react';
import { getParticipants } from '../services/eventService'; //

const POLLING_INTERVAL = 60000; // 60 detik (tetap)
const MAX_RETRIES = 3; // (tetap)

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

export const useParticipantsPreview = (eventId, limit = 5) => { // Ubah default limit jika perlu
  // Struktur data yang diharapkan oleh EventDetailPage.jsx adalah:
  // { total_count: 0, participants: [], show_participants: false }
  // Backend dummy untuk getParticipants akan mengembalikan { "participants": [...] }
  // Kita akan coba sesuaikan di sini.
  const [participantsData, setParticipantsData] = useState({ 
    total_count: 0, 
    participants: [], 
    show_participants: true // Default ke true, atau ambil dari setting event jika ada
  });
  const [loading, setLoading] = useState(true); // Awalnya true
  const [error, setError] = useState(null);

  const fetchPreviewParticipants = useCallback(async () => {
    if (!eventId) {
      setError("Event ID tidak valid untuk preview partisipan.");
      setLoading(false);
      setParticipantsData({ total_count: 0, participants: [], show_participants: true });
      return;
    }
    // setLoading(true); // Tidak untuk setiap poll
    setError(null);
    try {
      const response = await fetchWithRetry(() => getParticipants(eventId, limit));
      // Asumsi response adalah: { "participants": [...], "total": ... } dari backend yang sudah diupdate
      // atau hanya { "participants": [...] } dari backend dummy saat ini
      
      const fetchedParticipants = response.participants || [];
      const totalCount = response.total || fetchedParticipants.length; // Jika backend tidak beri total, hitung dari yang diterima

      setParticipantsData({
        total_count: totalCount,
        participants: fetchedParticipants, // Ambil array partisipan dari respons
        // show_participants bisa diambil dari setting event jika ada, untuk sekarang default true
        show_participants: true 
      });
    } catch (err) {
      console.error(`Error in useParticipantsPreview for eventId ${eventId}:`, err);
      setError(err.message || 'Gagal memuat preview partisipan.');
      // setParticipantsData({ total_count: 0, participants: [], show_participants: true }); // Reset jika error kritis
    } finally {
      // setLoading(false); // Tidak untuk setiap poll
    }
  }, [eventId, limit]);

  useEffect(() => {
    setLoading(true); // Set loading true hanya untuk pemanggilan awal
    fetchPreviewParticipants().finally(() => setLoading(false));

    const intervalId = setInterval(fetchPreviewParticipants, POLLING_INTERVAL);
    return () => clearInterval(intervalId);
  }, [fetchPreviewParticipants]); // fetchPreviewParticipants sudah di-memoize

  return { participantsData, loading, error, refetch: fetchPreviewParticipants };
};