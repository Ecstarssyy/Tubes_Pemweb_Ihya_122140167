import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventDetail } from '../hooks/useEventDetail';
import { useRegistrationStatus } from '../hooks/useRegistrationStatus';
import { useUserRegistrationStatus } from '../hooks/useUserRegistrationStatus';
import { useParticipantsPreview } from '../hooks/useParticipantsPreview';
import { useRelatedEvents } from '../hooks/useRelatedEvents';

function EventDetailPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const { event, loading: eventLoading, error: eventError, refetch: refetchEvent } = useEventDetail(eventId);
  const { status: registrationStatus, loading: regLoading, error: regError, refetch: refetchReg } = useRegistrationStatus(eventId);
  const { registration: userRegistration, loading: userRegLoading, error: userRegError, refetch: refetchUserReg } = useUserRegistrationStatus(eventId);
  const { participantsData, loading: participantsLoading, error: participantsError, refetch: refetchParticipants } = useParticipantsPreview(eventId);
  const [loadRelated, setLoadRelated] = useState(false);
  const { relatedEvents, loading: relatedLoading, error: relatedError } = useRelatedEvents(eventId, 3, loadRelated);

  const relatedRef = useRef();

  // Lazy load related events when relatedRef is visible
  useEffect(() => {
    if (!relatedRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setLoadRelated(true);
        observer.disconnect();
      }
    });
    observer.observe(relatedRef.current);
    return () => observer.disconnect();
  }, []);

  const handleRegisterClick = () => {
    if (!userRegistration) {
      navigate('/login');
    } else {
      navigate(`/events/${eventId}/participants`);
    }
  };

  if (eventLoading) return <div>Loading event details...</div>;
  if (eventError) return <div>{eventError}</div>;
  if (!event) return <div>Event not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p className="mb-2"><strong>Description:</strong> {event.description}</p>
      <p className="mb-2"><strong>Location:</strong> {event.location}</p>
      <p className="mb-2"><strong>Start Date:</strong> {new Date(event.start_date).toLocaleString()}</p>
      <p className="mb-2"><strong>End Date:</strong> {new Date(event.end_date).toLocaleString()}</p>
      <p className="mb-2"><strong>Category:</strong> {event.category}</p>
      <p className="mb-2"><strong>Price:</strong> ${event.price.toFixed(2)}</p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Registration Status</h2>
      {regLoading && <p>Loading registration status...</p>}
      {regError && <p className="text-red-600">{regError}</p>}
      {registrationStatus && (
        <div>
          <p>Total Registered: {registrationStatus.total_registered} / {registrationStatus.max_participants}</p>
          <p>Available Spots: {registrationStatus.available_spots}</p>
          <p>Status: {registrationStatus.registration_status}</p>
          {registrationStatus.is_full && <p className="text-red-600">Event is full</p>}
        </div>
      )}

      <h2 className="text-2xl font-semibold mt-6 mb-2">Your Registration</h2>
      {userRegLoading && <p>Loading your registration status...</p>}
      {userRegError && <p className="text-red-600">{userRegError}</p>}
      {userRegistration ? (
        <div>
          <p>Status: {userRegistration.status}</p>
          <p>Payment Status: {userRegistration.payment_status}</p>
          {userRegistration.can_cancel && <p>You can cancel until {new Date(userRegistration.cancellation_deadline).toLocaleString()}</p>}
        </div>
      ) : (
        <p>You are not registered for this event.</p>
      )}

      <button
        onClick={handleRegisterClick}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {userRegistration ? 'View Your Registration' : 'Register for Event'}
      </button>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Participants Preview</h2>
      {participantsLoading && <p>Loading participants...</p>}
      {participantsError && <p className="text-red-600">{participantsError}</p>}
      {participantsData.show_participants ? (
        <ul>
          {participantsData.participants.map(p => (
            <li key={p.id} className="mb-2 flex items-center">
              <img src={p.profile_image} alt={p.name} className="w-8 h-8 rounded-full mr-2" />
              <span>{p.name} (Registered on {new Date(p.registration_date).toLocaleDateString()})</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>Participants list is private.</p>
      )}

      <h2 className="text-2xl font-semibold mt-6 mb-2" ref={relatedRef}>Related Events</h2>
      {relatedLoading && <p>Loading related events...</p>}
      {relatedError && <p className="text-red-600">{relatedError}</p>}
      <ul>
        {relatedEvents.map(e => (
          <li key={e.id} className="mb-2 cursor-pointer" onClick={() => navigate(`/events/${e.id}`)}>
            <img src={e.image_url} alt={e.title} className="w-16 h-10 object-cover inline-block mr-2" />
            <span>{e.title} - {new Date(e.start_date).toLocaleDateString()} - ${e.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventDetailPage;
