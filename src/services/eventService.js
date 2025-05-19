import api from './api';

export const EventService = {
  getAllEvents: async () => {
    try {
      const response = await api.get('/events');
      return response.data;
    } catch (error) {
      console.error('Get events error:', error);
      throw error;
    }
  },

  getEvent: async (id) => {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get event error:', error);
      throw error;
    }
  },

  createEvent: async (eventData) => {
    try {
      const response = await api.post('/events', eventData);
      return response.data;
    } catch (error) {
      console.error('Create event error:', error);
      throw error;
    }
  },

  updateEvent: async (id, eventData) => {
    try {
      const response = await api.put(`/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error('Update event error:', error);
      throw error;
    }
  },

  deleteEvent: async (id) => {
    try {
      await api.delete(`/events/${id}`);
      return true;
    } catch (error) {
      console.error('Delete event error:', error);
      throw error;
    }
  }
};
