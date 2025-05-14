import React, { useState, useEffect } from 'react';

function ParticipantsPage({ onLogout }) {
  const [participants, setParticipants] = useState([]);

  // Placeholder: Fetch participants from backend API
  useEffect(() => {
    // TODO: Replace with actual API call
    setParticipants([
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        attendanceStatus: 'Registered',
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '987-654-3210',
        attendanceStatus: 'Attended',
      },
    ]);
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
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
        <button
          className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          onClick={() => alert('Add Participant form to be implemented')}
        >
          Add Participant
        </button>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Phone</th>
              <th className="border border-gray-300 px-4 py-2">Attendance Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant) => (
              <tr key={participant.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{participant.name}</td>
                <td className="border border-gray-300 px-4 py-2">{participant.email}</td>
                <td className="border border-gray-300 px-4 py-2">{participant.phone}</td>
                <td className="border border-gray-300 px-4 py-2">{participant.attendanceStatus}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="mr-2 text-blue-600 hover:underline"
                    onClick={() => alert('Edit Participant form to be implemented')}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => alert('Delete Participant confirmation to be implemented')}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {participants.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No participants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ParticipantsPage;
