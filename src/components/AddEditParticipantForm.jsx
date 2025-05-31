// src/components/AddEditParticipantForm.jsx
import React, { useState, useEffect } from 'react';
import Button from './Button';
import { Save, XCircle, User, Mail, Phone, CheckSquare } from 'lucide-react';

function AddEditParticipantForm({ eventId, participant, onSave, onCancel, isLoading }) { // Tambah prop isLoading
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    attendanceStatus: 'Belum Dikonfirmasi'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (participant) {
      setFormData({
        name: participant.name || '',
        email: participant.email || '',
        phone: participant.phone || '',
        attendanceStatus: participant.attendanceStatus || 'Belum Dikonfirmasi'
      });
    } else {
      setFormData({ name: '', email: '', phone: '', attendanceStatus: 'Belum Dikonfirmasi' });
    }
  }, [participant]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.name || !formData.email) {
      setError('Nama dan Email wajib diisi.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError('Format email tidak valid.');
        return;
    }
    onSave(formData);
  };
  
  const inputClass = "w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-brand-medium text-sm disabled:bg-gray-100 disabled:cursor-not-allowed";
  const labelClass = "block mb-1.5 font-semibold text-brand-dark text-sm";
  const iconInputClass = "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm mb-4">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="name" className={labelClass}>Nama Lengkap *</label>
        <div className="relative">
            <User size={18} className={iconInputClass} />
            <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className={`${inputClass} pl-10`}
            disabled={isLoading}
            />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>Email *</label>
         <div className="relative">
            <Mail size={18} className={iconInputClass} />
            <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={`${inputClass} pl-10`}
            disabled={isLoading}
            />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>Nomor Telepon</label>
        <div className="relative">
            <Phone size={18} className={iconInputClass} />
            <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Contoh: 08123456789"
            className={`${inputClass} pl-10`}
            disabled={isLoading}
            />
        </div>
      </div>
      
      <div>
        <label htmlFor="attendanceStatus" className={labelClass}>Status Kehadiran</label>
        <div className="relative">
            <CheckSquare size={18} className={iconInputClass} />
            <select
                id="attendanceStatus"
                name="attendanceStatus"
                value={formData.attendanceStatus}
                onChange={handleChange}
                className={`${inputClass} bg-white pl-10 appearance-none`}
                disabled={isLoading}
            >
                <option value="Belum Dikonfirmasi">Belum Dikonfirmasi</option>
                <option value="Hadir">Hadir</option>
                <option value="Tidak Hadir">Tidak Hadir</option>
                <option value="Mungkin Hadir">Mungkin Hadir</option>
            </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="light"
          onClick={onCancel}
          icon={XCircle}
          className="text-brand-dark"
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button
          type="submit"
          variant="primary"
          icon={Save}
          disabled={isLoading}
        >
          {isLoading ? 'Menyimpan...' : (participant ? 'Update Partisipan' : 'Tambah Partisipan')}
        </Button>
      </div>
    </form>
  );
}

export default AddEditParticipantForm;