import React, { useState, useEffect } from 'react';
import AddEditParticipantForm from '../components/AddEditParticipantForm';
import { ParticipantService } from '../services/participantService';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';

function ParticipantsPage({ onLogout, eventId }) {
  const [participants, setParticipants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    if (eventId) {
      fetchParticipants();
    }
  }, [eventId]);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      let data = await ParticipantService.getEventParticipants(eventId);
      if (!isAdmin) {
        // Filter participants to only those matching logged-in user's email
        data = data.filter(p => p.email === user.email);
      }
      setParticipants(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch participants. Please try again later.');
      console.error('Error fetching participants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingParticipant(null);
    setShowForm(true);
  };

  const handleEditClick = (participant) => {
    setEditingParticipant(participant);
    setShowForm(true);
  };

  const handleDeleteClick = async (id) => {
    if (!isAdmin) return; // Only admin can delete
    if (window.confirm('Are you sure you want to delete this participant? This action cannot be undone.')) {
      try {
        setActionLoading(true);
        await ParticipantService.deleteParticipant(eventId, id);
        setParticipants(participants.filter((p) => p.id !== id));
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to delete participant. Please try again.');
        console.error('Error deleting participant:', err);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleSave = async (participantData) => {
    if (!isAdmin) return; // Only admin can save
    try {
      setActionLoading(true);
      if (editingParticipant) {
        // Edit existing participant
        const updatedParticipant = await ParticipantService.updateParticipant(
          eventId,
          editingParticipant.id,
          participantData
        );
        setParticipants(participants.map((p) =>
          p.id === updatedParticipant.id ? updatedParticipant : p
        ));
      } else {
        // Add new participant
        const newParticipant = await ParticipantService.createParticipant(eventId, participantData);
        setParticipants([...participants, newParticipant]);
      }
      setShowForm(false);
      setEditingParticipant(null);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to save participant. Please try again.');
      console.error('Error saving participant:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingParticipant(null);
  };

  return (
    <div>
      {/* Removed duplicate Navbar */}
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Participants</h1>
          <button
            onClick={onLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </header>
        <div>
          {error && (
            <ErrorMessage
              message={error}
              onClose={() => setError(null)}
            />
          )}

          <div className="flex justify-between items-center mb-4">
            {isAdmin && (
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
                onClick={handleAddClick}
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : 'Add Participant'}
              </button>
            )}

            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              onClick={fetchParticipants}
              disabled={loading || actionLoading}
            >
              Refresh List
            </button>
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Email</th>
                  <th className="border border-gray-300 px-4 py-2">Phone</th>
                  <th className="border border-gray-300 px-4 py-2">Attendance Status</th>
                  {isAdmin && <th className="border border-gray-300 px-4 py-2">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {participants.map((participant) => (
                  <tr key={participant.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{participant.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{participant.email}</td>
                    <td className="border border-gray-300 px-4 py-2">{participant.phone}</td>
                    <td className="border border-gray-300 px-4 py-2">{participant.attendanceStatus}</td>
                    {isAdmin && (
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          className="mr-2 text-blue-600 hover:underline disabled:opacity-50 disabled:no-underline"
                          onClick={() => handleEditClick(participant)}
                          disabled={actionLoading}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline disabled:opacity-50 disabled:no-underline"
                          onClick={() => handleDeleteClick(participant.id)}
                          disabled={actionLoading}
                        >
                          {actionLoading ? 'Processing...' : 'Delete'}
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {participants.length === 0 && (
                  <tr>
                    <td colSpan={isAdmin ? "5" : "4"} className="text-center py-4">
                      No participants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {showForm && isAdmin && (
          <AddEditParticipantForm
            participant={editingParticipant}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}

export default ParticipantsPage;
