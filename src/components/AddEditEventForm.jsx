import React, { useState, useEffect } from 'react';

function AddEditEventForm({ event, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Upcoming');

  useEffect(() => {
    if (event) {
      setName(event.name);
      setDate(event.date);
      setLocation(event.location);
      setDescription(event.description);
      setStatus(event.status);
    } else {
      setName('');
      setDate('');
      setLocation('');
      setDescription('');
      setStatus('Upcoming');
    }
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !date || !location || !description || !status) {
      alert('Please fill in all fields');
      return;
    }
    onSave({
      id: event ? event.id : Date.now(),
      name,
      date,
      location,
      description,
      status,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">{event ? 'Edit Event' : 'Add Event'}</h2>
        <div className="mb-3">
          <label className="block font-semibold mb-1" htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="block font-semibold mb-1" htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="block font-semibold mb-1" htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="block font-semibold mb-1" htmlFor="description">Description</label>
          <textarea
            id="description"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1" htmlFor="status">Status</label>
          <select
            id="status"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEditEventForm;
