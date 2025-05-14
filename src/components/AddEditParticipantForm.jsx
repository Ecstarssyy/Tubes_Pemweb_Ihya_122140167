import React, { useState, useEffect } from 'react';
import ErrorMessage from './ErrorMessage';

function AddEditParticipantForm({ participant, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    attendanceStatus: 'Registered'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (participant) {
      setFormData({
        name: participant.name,
        email: participant.email,
        phone: participant.phone,
        attendanceStatus: participant.attendanceStatus
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        attendanceStatus: 'Registered'
      });
    }
    setErrors({});
  }, [participant]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^[0-9-+()]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(formData);
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Failed to save participant'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {participant ? 'Edit Participant' : 'Add Participant'}
        </h2>

        {errors.submit && (
          <ErrorMessage
            message={errors.submit}
            onClose={() => setErrors(prev => ({ ...prev, submit: '' }))}
          />
        )}

        <div className="mb-3">
          <label className="block font-semibold mb-1" htmlFor="name">
            Name {errors.name && <span className="text-red-500 text-sm">({errors.name})</span>}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-3">
          <label className="block font-semibold mb-1" htmlFor="email">
            Email {errors.email && <span className="text-red-500 text-sm">({errors.email})</span>}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-3">
          <label className="block font-semibold mb-1" htmlFor="phone">
            Phone {errors.phone && <span className="text-red-500 text-sm">({errors.phone})</span>}
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
            value={formData.phone}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1" htmlFor="attendanceStatus">
            Attendance Status
          </label>
          <select
            id="attendanceStatus"
            name="attendanceStatus"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={formData.attendanceStatus}
            onChange={handleChange}
            disabled={isSubmitting}
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
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEditParticipantForm;
