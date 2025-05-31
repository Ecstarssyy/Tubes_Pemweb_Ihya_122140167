import { useState, useEffect, useCallback } from 'react';
import { ParticipantService } from '../services/participantService';

export function useParticipants(eventId, isAdmin, userEmail) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchParticipants = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      let data = await ParticipantService.getEventParticipants(eventId);
      if (!isAdmin && userEmail) {
        data = data.filter(p => p.email === userEmail);
      }
      setParticipants(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch participants. Please try again later.');
      console.error('Error fetching participants:', err);
    } finally {
      setLoading(false);
    }
  }, [eventId, isAdmin, userEmail]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  const deleteParticipant = async (id) => {
    if (!isAdmin) return;
    setActionLoading(true);
    try {
      await ParticipantService.deleteParticipant(eventId, id);
      setParticipants(prev => prev.filter(p => p.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to delete participant. Please try again.');
      console.error('Error deleting participant:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const saveParticipant = async (participantData, editingParticipant) => {
    if (!isAdmin) return;
    setActionLoading(true);
    try {
      if (editingParticipant) {
        const updatedParticipant = await ParticipantService.updateParticipant(
          eventId,
          editingParticipant.id,
          participantData
        );
        setParticipants(prev => prev.map(p => (p.id === updatedParticipant.id ? updatedParticipant : p)));
      } else {
        const newParticipant = await ParticipantService.createParticipant(eventId, participantData);
        setParticipants(prev => [...prev, newParticipant]);
      }
      setError(null);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to save participant. Please try again.');
      console.error('Error saving participant:', err);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    participants,
    loading,
    error,
    actionLoading,
    fetchParticipants,
    deleteParticipant,
    saveParticipant,
  };
}
