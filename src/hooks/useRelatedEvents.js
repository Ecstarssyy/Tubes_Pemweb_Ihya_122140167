import { useState, useEffect, useCallback } from 'react';
import { getRelatedEvents } from '../services/eventService';

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

export const useRelatedEvents = (eventId, limit = 3, shouldLoad = false) => {
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRelated = useCallback(async () => {
    if (!shouldLoad) return;
    try {
      setLoading(true);
      const data = await fetchWithRetry(() => getRelatedEvents(eventId, limit));
      setRelatedEvents(data.events || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load related events.');
    } finally {
      setLoading(false);
    }
  }, [eventId, limit, shouldLoad]);

  useEffect(() => {
    fetchRelated();
  }, [fetchRelated]);

  return { relatedEvents, loading, error, refetch: fetchRelated };
};
