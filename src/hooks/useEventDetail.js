// src/hooks/useEventDetail.js
import { useState, useEffect, useCallback } from 'react';
import { fetchEvent } from '../services/eventService'; //

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes (tetap)

// Fungsi cachedFetch tetap bisa digunakan atau disederhanakan jika tidak mau caching
const cachedFetch = async (key, fetchFunction) => {
  const cachedItem = sessionStorage.getItem(key);
  const now = Date.now();

  if (cachedItem) {
    try {
      const { data, timestamp } = JSON.parse(cachedItem);
      if (now - timestamp < CACHE_DURATION) {
        return data;
      }
    } catch (e) {
      console.warn("Failed to parse cached item:", e);
      sessionStorage.removeItem(key); // Hapus cache yang rusak
    }
  }

  const freshData = await fetchFunction();
  try {
    sessionStorage.setItem(key, JSON.stringify({
      data: freshData,
      timestamp: now
    }));
  } catch (e) {
    console.warn("Failed to set cache item (possibly storage full):", e);
  }
  return freshData;
};


export const useEventDetail = (eventId) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEventDetail = useCallback(async () => {
    if (!eventId) {
      setError("Event ID tidak valid.");
      setLoading(false);
      setEvent(null);
      return;
    }
    try {
      setLoading(true);
      setError(null); // Reset error sebelum fetch baru
      // Gunakan cachedFetch atau langsung panggil fetchEvent jika tidak mau caching
      const data = await cachedFetch(`event_${eventId}`, () => fetchEvent(eventId));
      // const data = await fetchEvent(eventId); // Tanpa caching
      setEvent(data);
    } catch (err) {
      console.error(`Error in useEventDetail for eventId ${eventId}:`, err);
      setError(err.message || 'Gagal memuat detail event.');
      setEvent(null); // Set event ke null jika error
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEventDetail();
  }, [fetchEventDetail]); // fetchEventDetail sudah di-memoize dengan useCallback

  return { event, loading, error, refetch: fetchEventDetail };
};