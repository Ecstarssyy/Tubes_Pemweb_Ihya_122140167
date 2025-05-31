// src/services/eventService.js
import { get, post, put, del } from './api';

export const fetchEventsData = async (filters = {}, sortKey = 'date', page = 1, perPage = 9) => {
  try {
    // Backend dummy saat ini mengembalikan semua event tanpa pagination/filtering server-side
    // Endpoint: GET /api/events
    const backendResponse = await get('/api/events'); 
    let allEvents = backendResponse.events || []; 
    const totalFromBackend = backendResponse.total || allEvents.length; // Jika backend berikan total

    // --- Implementasi Filter, Sort, Paginate di Frontend (SAMA SEPERTI SEBELUMNYA) ---
    if (filters.category) {
      allEvents = allEvents.filter(event => event.category && event.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.location) {
      allEvents = allEvents.filter(event => event.location && event.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.priceMin) {
      allEvents = allEvents.filter(event => typeof event.price === 'number' && event.price >= Number(filters.priceMin));
    }
    if (filters.priceMax) {
        allEvents = allEvents.filter(event => typeof event.price === 'number' && event.price <= Number(filters.priceMax));
    }
    if (filters.dateFrom) {
        allEvents = allEvents.filter(event => event.date && new Date(event.date) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
        allEvents = allEvents.filter(event => event.date && new Date(event.date) <= new Date(filters.dateTo));
    }

    if (sortKey === 'date') {
      allEvents.sort((a, b) => new Date(a.start_date || a.date) - new Date(b.start_date || b.date));
    } else if (sortKey === 'price') {
      allEvents.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortKey === 'title') {
      allEvents.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }
    // --- END Implementasi Filter, Sort, Paginate di Frontend ---

    const totalFiltered = allEvents.length; // Total setelah filter frontend
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedEvents = allEvents.slice(start, end);

    // Kembalikan totalFiltered agar pagination sesuai dengan hasil filter frontend
    return { events: paginatedEvents, total: totalFiltered };

  } catch (error) {
    console.error('Fetch events error in eventService:', error);
    throw error;
  }
};

export const fetchEvent = async (eventId) => {
  try {
    // Endpoint: GET /api/events/{event_id}
    return await get(`/api/events/${eventId}`);
  } catch (error) {
    console.error(`Fetch event detail error for eventId ${eventId}:`, error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    // Endpoint: POST /api/events
    return await post('/api/events', eventData);
  } catch (error) {
    console.error('Create event error in eventService:', error);
    throw error;
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    // Endpoint: PUT /api/events/{event_id}
    return await put(`/api/events/${eventId}`, eventData);
  } catch (error) {
    console.error(`Update event error for eventId ${eventId}:`, error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    // Endpoint: DELETE /api/events/{event_id}
    await del(`/api/events/${eventId}`); // del tidak mengembalikan body jika sukses (204)
    return { success: true, message: 'Event berhasil dihapus.' }; 
  } catch (error) {
    console.error(`Delete event error for eventId ${eventId}:`, error);
    throw error;
  }
};

// API methods untuk Event Detail Page
export const getRegistrationStats = async (eventId) => {
  try {
    // Endpoint: GET /api/events/{event_id}/registration-stats
    return await get(`/api/events/${eventId}/registration-stats`);
  } catch (error) {
    console.error(`Fetch registration stats error for ${eventId}:`, error);
    // Jangan kembalikan data dummy di service, biarkan hook atau komponen yang memutuskan
    throw error; 
  }
};

export const getUserRegistration = async (eventId) => {
  try {
    // Endpoint: GET /api/users/me/events/{event_id}/registration
    // Backend akan menggunakan token auth untuk identifikasi user
    return await get(`/api/users/me/events/${eventId}/registration`);
  } catch (error) {
    console.error(`Fetch user registration error for ${eventId}:`, error);
    throw error;
  }
};

export const getParticipants = async (eventId, limit = 10) => {
  try {
    // Endpoint: GET /api/events/{event_id}/participants?limit={limit}
    return await get(`/api/events/${eventId}/participants?limit=${limit}`); // Respons: { "participants": [...], "total": ... }
  } catch (error) {
    console.error(`Fetch participants error for ${eventId}:`, error);
    throw error;
  }
};

export const getRelatedEvents = async (eventId, limit = 3) => {
  try {
    // Endpoint: GET /api/events/{event_id}/related?limit={limit}
    return await get(`/api/events/${eventId}/related?limit=${limit}`); // Respons: { "events": [...] }
  } catch (error) {
    console.error(`Fetch related events error for ${eventId}:`, error);
    throw error;
  }
};