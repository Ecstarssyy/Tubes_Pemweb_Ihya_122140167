import React, { useState, useEffect } from 'react';

function AddEditParticipantForm({ participant, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('Registered');

  useEffect(() => {
    if (participant) {
      setName(participant.name);
      setEmail(participant.email);
      setPhone(participant.phone);
      setAttendanceStatus(participant.attendanceStatus);
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setAttendanceStatus('Registered');
    }
  }, [participant]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !attendanceStatus) {
      alert('Please fill in all fields');
      return;
    }
    onSave({
      id: participant ? participant.id : Date.now(),
      name,
      email,
      phone,
      attendanceStatus,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">{participant ? 'Edit Participant' : 'Add Participant'}</h2>
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
          <label className="block font-semibold mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="block font-semibold mb-1" htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1" htmlFor="attendanceStatus">Attendance Status</label>
          <select
            id="attendanceStatus"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={attendanceStatus}
            onChange={(e) => setAttendanceStatus(e.target.value)}
          >
            <option value="Registered">Registered</option>
            <option value="Attended">Attended</option>
            <option value="Absent">Absent</option>
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

export default AddEditParticipantForm;
