import { useState, useEffect, useCallback } from 'react';
import { fetchEvent } from '../services/eventService';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const cachedFetch = async (key, fetchFunction) => {
  const cached = sessionStorage.getItem(key);
  const now = Date.now();

  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (now - timestamp < CACHE_DURATION) {
      return data;
    }
  }

  const freshData = await fetchFunction();
  sessionStorage.setItem(key, JSON.stringify({
    data: freshData,
    timestamp: now
  }));

  return freshData;
};

export const useEventDetail = (eventId) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEventDetail = useCallback(async () => {
    try {
      setLoading(true);
      const data = await cachedFetch(`event_${eventId}`, () => fetchEvent(eventId));
      setEvent(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load event details.');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEventDetail();
  }, [fetchEventDetail]);

  return { event, loading, error, refetch: fetchEventDetail };
};
