import api from './api';

export const ParticipantService = {
  getAllParticipants: async () => {
    try {
      const response = await api.get('/participants');
      return response.data;
    } catch (error) {
      console.error('Error fetching participants:', error);
      throw error;
    }
  },

  getParticipantById: async (id) => {
    try {
      const response = await api.get(`/participants/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching participant:', error);
      throw error;
    }
  },

  createParticipant: async (participantData) => {
    try {
      const response = await api.post('/participants', participantData);
      return response.data;
    } catch (error) {
      console.error('Error creating participant:', error);
      throw error;
    }
  },

  updateParticipant: async (id, participantData) => {
    try {
      const response = await api.put(`/participants/${id}`, participantData);
      return response.data;
    } catch (error) {
      console.error('Error updating participant:', error);
      throw error;
    }
  },

  deleteParticipant: async (id) => {
    try {
      const response = await api.delete(`/participants/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting participant:', error);
      throw error;
    }
  },
};
