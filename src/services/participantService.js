import api from './api';

export const ParticipantService = {
  getEventParticipants: async (eventId) => {
    try {
      const response = await api.get(`/events/${eventId}/participants`);
      return response.data;
    } catch (error) {
      console.error('Get participants error:', error);
      throw error;
    }
  },

  createParticipant: async (eventId, participantData) => {
    try {
      const response = await api.post(`/events/${eventId}/participants`, participantData);
      return response.data;
    } catch (error) {
      console.error('Create participant error:', error);
      throw error;
    }
  },

  updateParticipant: async (eventId, participantId, participantData) => {
    try {
      const response = await api.put(`/events/${eventId}/participants/${participantId}`, participantData);
      return response.data;
    } catch (error) {
      console.error('Update participant error:', error);
      throw error;
    }
  },

  deleteParticipant: async (eventId, participantId) => {
    try {
      await api.delete(`/events/${eventId}/participants/${participantId}`);
      return true;
    } catch (error) {
      console.error('Delete participant error:', error);
      throw error;
    }
  }
};
