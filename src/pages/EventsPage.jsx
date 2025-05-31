// src/pages/EventsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchEventsData, createEvent, updateEvent, deleteEvent } from '../services/eventService'; // Pastikan service sudah diupdate
import AddEditEventForm from '../components/AddEditEventForm'; //
import LoadingSpinner from '../components/LoadingSpinner'; //
import ErrorMessage from '../components/ErrorMessage'; //
import Button from '../components/Button'; // Impor komponen Button
import { PlusCircle, Edit3, Trash2, LayoutGrid, List } from 'lucide-react'; // Contoh ikon

const categories = ['Music', 'Art', 'Technology', 'Food', 'Sports', 'Education'];

function EventsPage() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filters, setFilters] = useState({
    category: '', location: '', priceMin: '', priceMax: '', dateFrom: '', dateTo: '',
  });
  const [sortKey, setSortKey] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const eventsPerPage = 6; // Tingkatkan jumlah item per halaman jika diinginkan

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const { events: fetchedEvents, total } = await fetchEventsData(filters, sortKey, currentPage, eventsPerPage);
        setEvents(fetchedEvents);
        setTotalEvents(total);
      } catch (err) {
        setError('Gagal memuat event. Silakan coba lagi nanti.');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, [filters, sortKey, currentPage]);

  const totalPages = Math.ceil(totalEvents / eventsPerPage);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleSortChange = (e) => setSortKey(e.target.value);
  const handleViewToggle = (mode) => setViewMode(mode);
  const handlePageChange = (page) => setCurrentPage(page);

  const handleAddClick = () => { setEditingEvent(null); setShowForm(true); };
  const handleEditClick = (event) => { setEditingEvent(event); setShowForm(true); };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus event ini? Tindakan ini tidak dapat dibatalkan.')) {
      setActionLoading(true);
      try {
        await deleteEvent(id);
        setEvents(prevEvents => prevEvents.filter(e => e.id !== id));
        // Mungkin perlu fetch ulang data untuk menyesuaikan totalEvents dan pagination
      } catch (err) {
        setError(err.message || 'Gagal menghapus event.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleSave = async (eventData) => {
    setActionLoading(true);
    try {
      if (editingEvent) {
        const updated = await updateEvent(editingEvent.id, eventData);
        setEvents(events.map(e => (e.id === updated.id ? updated : e)));
      } else {
        const newEvent = await createEvent(eventData);
        setEvents([newEvent, ...events]); // Tambahkan ke awal atau fetch ulang
      }
      setShowForm(false);
      setEditingEvent(null);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan event.');
    } finally {
      setActionLoading(false);
    }
  };
  const handleCancel = () => { setShowForm(false); setEditingEvent(null); };

  const renderInput = (name, placeholder, type = "text", value, min) => (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      min={min}
      onChange={handleFilterChange}
      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-brand-medium text-sm"
    />
  );
   const renderSelect = (name, value, options, placeholder) => (
    <select 
      name={name} 
      value={value} 
      onChange={name === "sortKey" ? handleSortChange : handleFilterChange} 
      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-brand-medium bg-white text-sm"
    >
      <option value="">{placeholder}</option>
      {options.map(opt => typeof opt === 'string' ? <option key={opt} value={opt}>{opt}</option> : <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  );


  return (
    <div className="min-h-screen bg-brand-bg py-8"> {/* Latar: #EAEFEF */}
      <div className="container mx-auto px-4 sm:px-6">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-brand-dark">Temukan Event Menarik</h1>
          {isAdmin && !showForm && (
            <Button onClick={handleAddClick} variant="primary" className="mt-4" disabled={actionLoading}>
              <PlusCircle size={18} className="mr-2 inline-block" /> Tambah Event Baru
            </Button>
          )}
        </header>

        {isAdmin && showForm && (
          <div className="mb-8 p-6 bg-white rounded-xl shadow-custom-strong">
            <AddEditEventForm event={editingEvent} onSave={handleSave} onCancel={handleCancel} />
          </div>
        )}

        {error && <div className="mb-6"><ErrorMessage message={error} onClose={() => setError(null)} /></div>}

        {/* Filters and Sort */}
        <div className="mb-8 p-4 sm:p-6 bg-white rounded-xl shadow-custom-light">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {renderInput("location", "Lokasi", "text", filters.location)}
            {renderSelect("category", filters.category, categories, "Semua Kategori")}
            {renderInput("priceMin", "Harga Min", "number", filters.priceMin, "0")}
            {renderInput("priceMax", "Harga Max", "number", filters.priceMax, "0")}
            {renderInput("dateFrom", "Dari Tanggal", "date", filters.dateFrom)}
            {renderInput("dateTo", "Sampai Tanggal", "date", filters.dateTo)}
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {renderSelect("sortKey", sortKey, 
                [{value: 'date', label: 'Urutkan Berdasarkan Tanggal'}, {value: 'price', label: 'Harga'}, {value: 'title', label: 'Judul'}],
                "Urutkan"
            )}
            <div className="flex items-center space-x-1 border border-gray-300 rounded-md p-0.5">
              {[
                { mode: 'grid', label: 'Grid', icon: <LayoutGrid size={18} /> },
                { mode: 'list', label: 'List', icon: <List size={18} /> }
              ].map(v => (
                <button
                  key={v.mode}
                  onClick={() => handleViewToggle(v.mode)}
                  title={v.label}
                  className={`px-3 py-1.5 rounded-md text-sm flex items-center transition-colors
                              ${viewMode === v.mode ? 'bg-brand-action text-white' : 'bg-transparent text-brand-dark hover:bg-gray-100'}`}
                >
                  {v.icon} <span className="ml-1.5 hidden sm:inline">{v.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Events Display */}
        {loading ? (
          <LoadingSpinner />
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <h3 className="text-xl">Oops! Tidak ada event yang ditemukan.</h3>
            <p className="mt-2">Coba ubah filter pencarian Anda.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {events.map(event => (
              <div key={event.id} className="bg-white rounded-xl shadow-custom-strong overflow-hidden group transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
                <Link to={`/events/${event.id}`} className="block">
                  <img src={unsplashImage(event.category || 'event', 600,400,event.id)} alt={event.title} className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity" />
                </Link>
                <div className="p-5 flex flex-col flex-grow">
                  <Link to={`/events/${event.id}`} className="block">
                    <h2 className="text-lg font-semibold font-heading text-brand-dark mb-2 group-hover:text-brand-medium transition-colors line-clamp-2">{event.title || 'Nama Event Tidak Tersedia'}</h2>
                  </Link>
                  <p className="text-sm text-gray-600 mb-1 line-clamp-1"><MapPin size={14} className="inline mr-1.5 text-brand-medium" />{event.location || 'Lokasi Tidak Diketahui'}</p>
                  <p className="text-sm text-gray-600 mb-1"><CalendarDays size={14} className="inline mr-1.5 text-brand-medium" />{event.date ? new Date(event.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric'}) : 'Tanggal Tidak Diketahui'}</p>
                  <p className="text-sm font-semibold text-brand-dark mb-3"><Ticket size={14} className="inline mr-1.5 text-brand-medium" />Rp {Number(event.price || 0).toLocaleString('id-ID')}</p>
                  
                  <div className="mt-auto pt-3 border-t border-gray-100">
                    {isAdmin && (
                      <div className="flex space-x-2 justify-end">
                        <Button onClick={() => handleEditClick(event)} variant="light" size="sm" disabled={actionLoading} className="!p-2">
                          <Edit3 size={16} />
                        </Button>
                        <Button onClick={() => handleDeleteClick(event.id)} variant="light" size="sm" disabled={actionLoading} className="!p-2 hover:!bg-red-100 hover:!text-red-600">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : ( // List View
          <div className="space-y-4">
            {events.map(event => (
              <div key={event.id} className="bg-white rounded-xl shadow-custom-strong overflow-hidden group p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 transform hover:shadow-2xl transition-shadow duration-300">
                <img src={unsplashImage(event.category || 'event', 200,150,event.id)} alt={event.title} className="w-full sm:w-40 h-auto sm:h-28 object-cover rounded-md group-hover:opacity-90 transition-opacity" />
                <div className="flex-grow">
                  <Link to={`/events/${event.id}`} className="block">
                    <h2 className="text-lg font-semibold font-heading text-brand-dark mb-1 group-hover:text-brand-medium transition-colors">{event.title || 'Nama Event Tidak Tersedia'}</h2>
                  </Link>
                  <p className="text-sm text-gray-600 mb-0.5 line-clamp-1"><MapPin size={14} className="inline mr-1.5 text-brand-medium" />{event.location || 'Lokasi Tidak Diketahui'}</p>
                  <p className="text-sm text-gray-600 mb-0.5"><CalendarDays size={14} className="inline mr-1.5 text-brand-medium" />{event.date ? new Date(event.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric'}) : 'Tanggal Tidak Diketahui'}</p>
                  <p className="text-sm font-semibold text-brand-dark"><Ticket size={14} className="inline mr-1.5 text-brand-medium" />Rp {Number(event.price || 0).toLocaleString('id-ID')}</p>
                </div>
                <div className="w-full sm:w-auto mt-3 sm:mt-0 flex sm:flex-col items-center sm:items-end space-x-2 sm:space-x-0 sm:space-y-2">
                   <Link to={`/events/${event.id}`} className="w-full sm:w-auto">
                        <Button variant="secondary" size="sm" className="w-full sm:w-auto">Lihat Detail</Button>
                   </Link>
                  {isAdmin && (
                    <div className="flex space-x-2">
                      <Button onClick={() => handleEditClick(event)} variant="light" size="sm" disabled={actionLoading} className="!p-2">
                        <Edit3 size={16} />
                      </Button>
                      <Button onClick={() => handleDeleteClick(event.id)} variant="light" size="sm" disabled={actionLoading} className="!p-2 hover:!bg-red-100 hover:!text-red-600">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 space-x-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                variant={page === currentPage ? "primary" : "light"}
                size="sm"
                className={`!px-3 !py-1.5 ${page === currentPage ? '' : 'text-brand-dark'}`}
              >
                {page}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventsPage;