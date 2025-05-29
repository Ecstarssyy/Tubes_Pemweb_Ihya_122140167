import * as api from './api';

export const fetchEventsData = async (filters = {}, sortKey = 'date', page = 1, perPage = 3) => {
  try {
    const response = await api.get('/events');
    let events = response;

    // Apply filters locally since backend is in-memory and does not support filtering
    if (filters.category) {
      events = events.filter(event => event.category === filters.category);
    }
    if (filters.location) {
      events = events.filter(event => event.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.priceMin) {
      events = events.filter(event => event.price >= Number(filters.priceMin));
    }
    if (filters.priceMax) {
      events = events.filter(event => event.price <= Number(filters.priceMax));
    }
    if (filters.dateFrom) {
      events = events.filter(event => event.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      events = events.filter(event => event.date <= filters.dateTo);
    }

    // Sorting
    if (sortKey === 'date') {
      events.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortKey === 'price') {
      events.sort((a, b) => a.price - b.price);
    } else if (sortKey === 'title') {
      events.sort((a, b) => a.title.localeCompare(b.title));
    }

    // Pagination
    const total = events.length;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedEvents = events.slice(start, end);

    return { events: paginatedEvents, total };
  } catch (error) {
    console.error('Fetch events error:', error);
    throw error;
  }
};

export const fetchEvent = async (eventId) => {
  try {
    const response = await api.get(`/events/${eventId}`);
    return response;
  } catch (error) {
    console.error('Fetch event error:', error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/events', eventData);
    return response;
  } catch (error) {
    console.error('Create event error:', error);
    throw error;
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await api.put(`/events/${eventId}`, eventData);
    return response;
  } catch (error) {
    console.error('Update event error:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    await api.delete(`/events/${eventId}`);
    return true;
  } catch (error) {
    console.error('Delete event error:', error);
    throw error;
  }
};

// New API methods for Event Detail Page data fetching

export const getRegistrationStats = async (eventId) => {
  try {
    const response = await api.get(`/events/${eventId}/registration-stats`);
    return response;
  } catch (error) {
    console.error('Fetch registration stats error:', error);
    throw error;
  }
};

export const getUserRegistration = async (eventId) => {
  try {
    const response = await api.get(`/users/me/events/${eventId}/registration`);
    return response;
  } catch (error) {
    console.error('Fetch user registration error:', error);
    throw error;
  }
};

export const getParticipants = async (eventId, limit = 10) => {
  try {
    const response = await api.get(`/events/${eventId}/participants?limit=${limit}`);
    return response;
  } catch (error) {
    console.error('Fetch participants error:', error);
    throw error;
  }
};

export const getRelatedEvents = async (eventId, limit = 3) => {
  try {
    const response = await api.get(`/events/${eventId}/related?limit=${limit}`);
    return response;
  } catch (error) {
    console.error('Fetch related events error:', error);
    throw error;
  }
};
