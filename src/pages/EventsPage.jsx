import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AddEditEventForm from '../components/AddEditEventForm';
import { EventService } from '../services/eventService';

function EventsPage({ onLogout }) {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await EventService.getAllEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch events. Please try again later.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  const handleEditClick = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };
  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await EventService.deleteEvent(id);
        setEvents(events.filter((event) => event.id !== id));
      } catch (err) {
        alert('Failed to delete event. Please try again.');
        console.error('Error deleting event:', err);
      }
    }
  };

  const handleSave = async (eventData) => {
    try {
      if (editingEvent) {
        // Edit existing event
        const updatedEvent = await EventService.updateEvent(editingEvent.id, eventData);
        setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
      } else {
        // Add new event
        const newEvent = await EventService.createEvent(eventData);
        setEvents([...events, newEvent]);
      }
      setShowForm(false);
      setEditingEvent(null);
    } catch (err) {
      alert('Failed to save event. Please try again.');
      console.error('Error saving event:', err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={onLogout} />      <main className="p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Events</h1>
          <button
            className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            onClick={handleAddClick}
          >
            Add Event
          </button>
        </header>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
          {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <table className="w-full border-collapse border border-gray-300">
              {/* ...existing code... */}
            </table>
            {showForm && (
              <AddEditEventForm
                event={editingEvent}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            )}
          </>
        )}

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Location</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{event.name}</td>
                <td className="border border-gray-300 px-4 py-2">{event.date}</td>
                <td className="border border-gray-300 px-4 py-2">{event.location}</td>
                <td className="border border-gray-300 px-4 py-2">{event.description}</td>
                <td className="border border-gray-300 px-4 py-2">{event.status}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="mr-2 text-blue-600 hover:underline"
                    onClick={() => handleEditClick(event)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDeleteClick(event.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
      {showForm && (
        <AddEditEventForm
          event={editingEvent}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

export default EventsPage;
