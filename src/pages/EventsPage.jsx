import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

function EventsPage({ onLogout }) {
  const [events, setEvents] = useState([]);

  // Placeholder: Fetch events from backend API
  useEffect(() => {
    // TODO: Replace with actual API call
    setEvents([
      {
        id: 1,
        name: 'Sample Event 1',
        date: '2024-07-01',
        location: 'Online',
        description: 'This is a sample event.',
        status: 'Upcoming',
      },
      {
        id: 2,
        name: 'Sample Event 2',
        date: '2024-06-15',
        location: 'New York',
        description: 'Another sample event.',
        status: 'Ongoing',
      },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={onLogout} />
      <main className="p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Events</h1>
          <button
            className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            onClick={() => alert('Add Event form to be implemented')}
          >
            Add Event
          </button>
        </header>

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
                    onClick={() => alert('Edit Event form to be implemented')}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => alert('Delete Event confirmation to be implemented')}
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
    </div>
  );
}

