import { useState, useEffect, useCallback } from 'react';
import { getParticipants } from '../services/eventService';

const POLLING_INTERVAL = 60000; // 60 seconds
const MAX_RETRIES = 3;

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

export const useParticipantsPreview = (eventId, limit = 10) => {
  const [participantsData, setParticipantsData] = useState({ total_count: 0, participants: [], show_participants: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchParticipants = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchWithRetry(() => getParticipants(eventId, limit));
      setParticipantsData(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load participants.');
    } finally {
      setLoading(false);
    }
  }, [eventId, limit]);

  useEffect(() => {
    fetchParticipants();
    const interval = setInterval(fetchParticipants, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchParticipants]);

  return { participantsData, loading, error, refetch: fetchParticipants };
};
