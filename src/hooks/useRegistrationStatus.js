import { useState, useEffect, useCallback } from 'react';
import { getRegistrationStats } from '../services/eventService';

const POLLING_INTERVAL = 30000; // 30 seconds
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

export const useRegistrationStatus = (eventId) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchWithRetry(() => getRegistrationStats(eventId));
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load registration status.');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  return { status, loading, error, refetch: fetchStatus };
};
