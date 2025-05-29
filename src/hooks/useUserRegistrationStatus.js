import { useState, useEffect, useCallback } from 'react';
import { getUserRegistration } from '../services/eventService';
import { useAuth } from '../context/AuthContext';

export const useUserRegistrationStatus = (eventId) => {
  const { user } = useAuth();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRegistration = useCallback(async () => {
    if (!user) {
      setRegistration(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getUserRegistration(eventId);
      setRegistration(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load user registration status.');
    } finally {
      setLoading(false);
    }
  }, [eventId, user]);

  useEffect(() => {
    fetchRegistration();
  }, [fetchRegistration]);

  return { registration, loading, error, refetch: fetchRegistration };
};
