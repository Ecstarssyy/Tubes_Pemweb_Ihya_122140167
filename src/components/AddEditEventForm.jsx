import React, { useState, useEffect } from 'react';

const AddEditEventForm = ({ event, onSave, onCancel }) => {
  const [name, setName] = useState(event ? event.name : '');
  const [date, setDate] = useState(event ? event.date : '');
  const [location, setLocation] = useState(event ? event.location : '');
  const [description, setDescription] = useState(event ? event.description : '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (event) {
      setName(event.name);
      setDate(event.date);
      setLocation(event.location);
      setDescription(event.description);
    }
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !date || !location) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    onSave({ name, date, location, description });
  };

  return (
    <div className="max-w-lg mx-auto p-6 border rounded shadow bg-white">
      <h2 className="text-xl font-bold mb-4">{event ? 'Edit Event' : 'Add Event'}</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Event Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Date *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Location *</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            rows={4}
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {event ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditEventForm;
