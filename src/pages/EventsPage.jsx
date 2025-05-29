  import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchEventsData as fetchEvents, createEvent, updateEvent, deleteEvent } from '../services/eventService';
import AddEditEventForm from '../components/AddEditEventForm';

const categories = ['Music', 'Art', 'Technology', 'Food', 'Sports', 'Education'];

function EventsPage() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    priceMin: '',
    priceMax: '',
    dateFrom: '',
    dateTo: '',
  });
  const [sortKey, setSortKey] = useState('date'); // 'date' or 'price' or 'title'
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const eventsPerPage = 3;

  // Get user from localStorage to check role
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchEventsData();
  }, [filters, sortKey, currentPage]);

  const fetchEventsData = async () => {
    setLoading(true);
    try {
      const { events, total } = await fetchEvents(filters, sortKey, currentPage, eventsPerPage);
      setEvents(events);
      setTotalEvents(total);
      setError(null);
    } catch (err) {
      setError('Failed to fetch events. Please try again later.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalEvents / eventsPerPage);

  // Handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortKey(e.target.value);
  };

  const handleViewToggle = (mode) => {
    setViewMode(mode);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Admin CRUD handlers
  const handleAddClick = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  const handleEditClick = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        setActionLoading(true);
        await deleteEvent(id);
        setEvents(events.filter(e => e.id !== id));
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to delete event. Please try again.');
        console.error('Error deleting event:', err);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleSave = async (eventData) => {
    try {
      setActionLoading(true);
      if (editingEvent) {
        const updatedEvent = await updateEvent(editingEvent.id, eventData);
        setEvents(events.map(e => (e.id === updatedEvent.id ? updatedEvent : e)));
      } else {
        const newEvent = await createEvent(eventData);
        setEvents([newEvent, ...events]);
      }
      setShowForm(false);
      setEditingEvent(null);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to save event. Please try again.');
      console.error('Error saving event:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Events Listing</h1>

      {/* Show Add/Edit form for admin */}
      {user && user.role === 'admin' && (
        <div className="mb-6">
          {!showForm && (
            <button
              onClick={handleAddClick}
              className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              disabled={actionLoading}
            >
              Add Event
            </button>
          )}
          {showForm && (
            <AddEditEventForm
              event={editingEvent}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-6 gap-4">
        <select name="category" value={filters.category} onChange={handleFilterChange} className="border rounded p-2">
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleFilterChange}
          className="border rounded p-2"
        />
        <input
          type="number"
          name="priceMin"
          placeholder="Min Price"
          value={filters.priceMin}
          onChange={handleFilterChange}
          className="border rounded p-2"
          min="0"
        />
        <input
          type="number"
          name="priceMax"
          placeholder="Max Price"
          value={filters.priceMax}
          onChange={handleFilterChange}
          className="border rounded p-2"
          min="0"
        />
        <input
          type="date"
          name="dateFrom"
          value={filters.dateFrom}
          onChange={handleFilterChange}
          className="border rounded p-2"
        />
        <input
          type="date"
          name="dateTo"
          value={filters.dateTo}
          onChange={handleFilterChange}
          className="border rounded p-2"
        />
      </div>

      {/* Sort and View Toggle */}
      <div className="flex justify-between items-center mb-6">
        <select value={sortKey} onChange={handleSortChange} className="border rounded p-2">
          <option value="date">Sort by Date</option>
          <option value="price">Sort by Price</option>
          <option value="title">Sort by Title</option>
        </select>
        <div>
          <button
            onClick={() => handleViewToggle('grid')}
            className={`px-4 py-2 rounded-l ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Grid
          </button>
          <button
            onClick={() => handleViewToggle('list')}
            className={`px-4 py-2 rounded-r ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            List
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && <div className="mb-4 text-red-600">{error}</div>}

      {/* Events Display */}
      {loading ? (
        <div>Loading events...</div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event.id} className="border rounded shadow p-4 hover:shadow-lg transition relative">
              <Link to={`/events/${event.id}`}>
                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-600">{event.date} - {event.location}</p>
                <p className="text-gray-800 font-bold">${event.price}</p>
              </Link>
              {/* Removed View Participants link as per user request */}
              {/* <div className="mt-2">
                <Link
                  to={`/events/${event.id}/participants`}
                  className="inline-block px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  View Participants
                </Link>
              </div> */}
              {user && user.role === 'admin' && (
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEditClick(event)}
                    className="px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                    disabled={actionLoading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(event.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    disabled={actionLoading}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          {events.map(event => (
            <div key={event.id} className="border rounded shadow p-4 hover:shadow-lg transition flex flex-col md:flex-row md:items-center md:justify-between relative">
              <Link to={`/events/${event.id}`}>
                <div>
                  <h2 className="text-xl font-semibold">{event.title}</h2>
                  <p className="text-gray-600">{event.date} - {event.location}</p>
                </div>
                <p className="text-gray-800 font-bold">${event.price}</p>
              </Link>
              {user && user.role === 'admin' && (
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEditClick(event)}
                    className="px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                    disabled={actionLoading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(event.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    disabled={actionLoading}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded ${page === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

export default EventsPage;
