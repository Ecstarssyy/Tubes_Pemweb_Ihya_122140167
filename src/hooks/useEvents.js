import { useState, useEffect, useCallback } from 'react';
import { fetchEventsData } from '../services/eventService';

const eventsPerPage = 3;

export function useEvents(initialFilters = {}, initialSortKey = 'date') {
  const [filters, setFilters] = useState(initialFilters);
  const [sortKey, setSortKey] = useState(initialSortKey);
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const { events, total } = await fetchEventsData(filters, sortKey, currentPage, eventsPerPage);
      setEvents(events);
      setTotalEvents(total);
      setError(null);
    } catch (err) {
      setError('Failed to fetch events. Please try again later.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, sortKey, currentPage]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    filters,
    setFilters,
    sortKey,
    setSortKey,
    currentPage,
    setCurrentPage,
    events,
    totalEvents,
    loading,
    error,
    eventsPerPage,
    totalPages: Math.ceil(totalEvents / eventsPerPage),
    refetch: fetchEvents,
  };
}
