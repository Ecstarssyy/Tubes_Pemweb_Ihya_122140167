// src/components/AddEditEventForm.jsx
import React, { useState, useEffect } from 'react';
import Button from './Button';
import { Save, XCircle, Calendar, MapPin, Tag, DollarSign, FileText, Clock, Image as ImageIcon } from 'lucide-react';

const AddEditEventForm = ({ event, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '', // Tanggal utama acara
    startTime: '', // Waktu mulai
    endTime: '', // Waktu selesai
    location: '',
    price: '',
    category: '',
    imageUrl: '', // URL gambar event
    maxParticipants: '' // Kapasitas maksimal
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date ? new Date(event.date).toISOString().split('T')[0] : (event.start_date ? new Date(event.start_date).toISOString().split('T')[0] : ''),
        startTime: event.start_time || (event.start_date ? new Date(event.start_date).toTimeString().substring(0,5) : ''),
        endTime: event.end_time || (event.end_date ? new Date(event.end_date).toTimeString().substring(0,5) : ''),
        location: event.location || '',
        price: event.price === undefined || event.price === null ? '' : String(event.price),
        category: event.category || '',
        imageUrl: event.image_url || '',
        maxParticipants: event.max_participants === undefined || event.max_participants === null ? '' : String(event.max_participants),
      });
    } else {
      // Reset form untuk mode tambah
      setFormData({
        title: '', description: '', date: '', startTime: '', endTime: '',
        location: '', price: '', category: '', imageUrl: '', maxParticipants: ''
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!formData.title || !formData.date || !formData.location || !formData.category || formData.price === '' || !formData.startTime || !formData.endTime) {
      setError('Harap isi semua field yang wajib diisi (Judul, Tanggal, Waktu, Lokasi, Kategori, Harga).');
      return;
    }
    
    const startDateTime = formData.date && formData.startTime ? new Date(`${formData.date}T${formData.startTime}:00`).toISOString() : null;
    // Untuk end_date, jika event berlangsung lebih dari sehari, tanggalnya mungkin berbeda.
    // Untuk kesederhanaan, asumsikan tanggal selesai sama dengan tanggal mulai jika tidak ada input tanggal selesai terpisah.
    const endDateTime = formData.date && formData.endTime ? new Date(`${formData.date}T${formData.endTime}:00`).toISOString() : null;

    onSave({ 
      ...formData,
      price: Number(formData.price),
      maxParticipants: formData.maxParticipants ? Number(formData.maxParticipants) : null, // Kirim null jika kosong
      start_date: startDateTime,
      end_date: endDateTime,
      // 'date' bisa jadi duplikat jika start_date sudah mencakup tanggal, tergantung preferensi backend
    });
  };

  const inputClass = "w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-brand-medium text-sm disabled:bg-gray-100 disabled:cursor-not-allowed";
  const labelClass = "block mb-1.5 font-semibold text-brand-dark text-sm";
  const iconInputClass = "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400";

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-custom-strong"> {/* Dihapus max-w-3xl mx-auto agar bisa fleksibel di parent */}
      <h2 className="text-2xl font-bold font-heading mb-6 text-brand-dark">
        {event ? 'Edit Event' : 'Tambah Event Baru'}
      </h2>
      {error && <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className={labelClass}>Judul Event *</label>
          <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} className={inputClass} required disabled={isLoading}/>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="date" className={labelClass}>Tanggal Event *</label>
            <div className="relative">
                <Calendar size={18} className={iconInputClass}/>
                <input id="date" name="date" type="date" value={formData.date} onChange={handleChange} className={`${inputClass} pl-10`} required disabled={isLoading}/>
            </div>
          </div>
           <div>
            <label htmlFor="category" className={labelClass}>Kategori *</label>
             <div className="relative">
                <Tag size={18} className={iconInputClass}/>
                <select id="category" name="category" value={formData.category} onChange={handleChange} className={`${inputClass} bg-white pl-10 appearance-none`} required disabled={isLoading}>
                  <option value="">Pilih Kategori</option>
                  {['Music', 'Art & Culture', 'Technology', 'Food & Drink', 'Sports', 'Education', 'Conference', 'Workshop', 'Festival', 'Charity', 'Community', 'Other'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
             </div>
          </div>
        </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
                <label htmlFor="startTime" className={labelClass}>Waktu Mulai *</label>
                 <div className="relative">
                    <Clock size={18} className={iconInputClass}/>
                    <input id="startTime" name="startTime" type="time" value={formData.startTime} onChange={handleChange} className={`${inputClass} pl-10`} required disabled={isLoading}/>
                </div>
            </div>
            <div>
                <label htmlFor="endTime" className={labelClass}>Waktu Selesai *</label>
                <div className="relative">
                    <Clock size={18} className={iconInputClass}/>
                    <input id="endTime" name="endTime" type="time" value={formData.endTime} onChange={handleChange} className={`${inputClass} pl-10`} required disabled={isLoading}/>
                </div>
            </div>
        </div>

        <div>
          <label htmlFor="location" className={labelClass}>Lokasi *</label>
          <div className="relative">
            <MapPin size={18} className={iconInputClass}/>
            <input id="location" name="location" type="text" value={formData.location} onChange={handleChange} className={`${inputClass} pl-10`} required disabled={isLoading}/>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
            <label htmlFor="price" className={labelClass}>Harga (Rp) *</label>
            <div className="relative">
                <DollarSign size={18} className={iconInputClass}/>
                <input id="price" name="price" type="number" placeholder="0 untuk gratis" value={formData.price} onChange={handleChange} className={`${inputClass} pl-10`} min="0" required disabled={isLoading}/>
            </div>
            </div>
            <div>
            <label htmlFor="maxParticipants" className={labelClass}>Kapasitas Maksimal</label>
            <input id="maxParticipants" name="maxParticipants" type="number" placeholder="Kosongkan jika tak terbatas" value={formData.maxParticipants} onChange={handleChange} className={inputClass} min="1" disabled={isLoading}/>
            </div>
        </div>
        
        <div>
          <label htmlFor="imageUrl" className={labelClass}>URL Gambar Event</label>
          <div className="relative">
            <ImageIcon size={18} className={iconInputClass}/>
            <input id="imageUrl" name="imageUrl" type="url" placeholder="https://example.com/image.jpg" value={formData.imageUrl} onChange={handleChange} className={`${inputClass} pl-10`} disabled={isLoading}/>
          </div>
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>Deskripsi Event</label>
          <div className="relative">
            {/* <FileText size={18} className="absolute left-3 top-3 text-gray-400"/> */}
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} className={`${inputClass} min-h-[120px]`} rows={5} disabled={isLoading}/>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="light" onClick={onCancel} icon={XCircle} className="text-brand-dark" disabled={isLoading}>
            Batal
          </Button>
          <Button type="submit" variant="primary" icon={Save} disabled={isLoading}>
            {isLoading ? 'Menyimpan...' : (event ? 'Update Event' : 'Simpan Event')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddEditEventForm;