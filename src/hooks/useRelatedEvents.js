// src/hooks/useRelatedEvents.js
import { useState, useEffect, useCallback } from 'react';
import { getRelatedEvents } from '../services/eventService'; //

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

export const useRelatedEvents = (eventId, limit = 3, shouldLoad = false) => {
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(false); // Awalnya false, jadi true saat fetch
  const [error, setError] = useState(null);

  const fetchRelated = useCallback(async () => {
    if (!shouldLoad || !eventId) { // Jangan fetch jika tidak seharusnya atau eventId tidak ada
        setRelatedEvents([]); // Reset jika tidak load
        return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithRetry(() => getRelatedEvents(eventId, limit));
      setRelatedEvents(data.events || []); // Backend dummy kini mengembalikan { "events": [...] }
    } catch (err) {
      console.error(`Error in useRelatedEvents for eventId ${eventId}:`, err);
      setError(err.message || 'Gagal memuat event terkait.');
      setRelatedEvents([]); // Reset jika error
    } finally {
      setLoading(false);
    }
  }, [eventId, limit, shouldLoad]); // Tambahkan eventId ke dependencies

  useEffect(() => {
    fetchRelated();
  }, [fetchRelated]); // fetchRelated sudah di-memoize

  return { relatedEvents, loading, error, refetch: fetchRelated };
};