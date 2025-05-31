// src/services/participantService.js
import { get, post, put, del } from './api';

export const ParticipantService = {
  getEventParticipants: async (eventId) => {
    try {
      // Endpoint: /api/events/{event_id}/participants
      // Backend views.py sudah menghandle GET ini
      return await get(`/events/${eventId}/participants`); // Responsnya: { "participants": [...] }
    } catch (error) {
      console.error(`Get participants error for event ${eventId}:`, error);
      throw error;
    }
  },

  createParticipant: async (eventId, participantData) => {
    try {
      // Endpoint: /api/events/{event_id}/participants (method POST)
      // Backend views.py sudah menghandle POST ini
      return await post(`/events/${eventId}/participants`, participantData);
    } catch (error) {
      console.error(`Create participant error for event ${eventId}:`, error);
      throw error;
    }
  },

  updateParticipant: async (eventId, participantId, participantData) => {
    try {
      // Perlu endpoint PUT /api/events/{event_id}/participants/{participant_id} di backend
      return await put(`/events/${eventId}/participants/${participantId}`, participantData);
    } catch (error) {
      console.error(`Update participant error for event ${eventId}, participant ${participantId}:`, error);
      throw error;
    }
  },

  deleteParticipant: async (eventId, participantId) => {
    try {
      // Perlu endpoint DELETE /api/events/{event_id}/participants/{participant_id} di backend
      await del(`/events/${eventId}/participants/${participantId}`);
      return { success: true, message: 'Partisipan berhasil dihapus.' };
    } catch (error) {
      console.error(`Delete participant error for event ${eventId}, participant ${participantId}:`, error);
      throw error;
    }
  }
};