// src/pages/SearchResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { fetchEventsData } from '../services/eventService'; // Gunakan fetchEventsData yang ada, filter di frontend
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import { MapPin, CalendarDays, Ticket, SearchX } from 'lucide-react';

const unsplashImage = (keywords, width = 600, height = 400, seed = '') => `https://source.unsplash.com/${width}x${height}/?${keywords}${seed ? '&' + seed : ''}`;

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Untuk tombol kembali

  // Pagination (jika diperlukan, implementasi mirip CategoryPage atau EventsPage)
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(0);
  // const eventsPerPage = 9;

  useEffect(() => {
    const loadSearchResults = async () => {
      if (!query) {
        setEvents([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // Untuk sementara, fetch semua event, lalu filter di frontend.
        // Idealnya, backend menyediakan endpoint pencarian:
        // await fetchEventsBySearchQuery(query, currentPage, eventsPerPage);
        const { events: allEvents } = await fetchEventsData({}, 'date', 1, 1000); // Ambil semua event

        const lowerCaseQuery = query.toLowerCase();
        const searchResults = allEvents.filter(event => 
          (event.title && event.title.toLowerCase().includes(lowerCaseQuery)) ||
          (event.location && event.location.toLowerCase().includes(lowerCaseQuery)) ||
          (event.category && event.category.toLowerCase().includes(lowerCaseQuery)) ||
          (event.description && event.description.toLowerCase().includes(lowerCaseQuery))
        );
        setEvents(searchResults);
      } catch (err) {
        setError(`Gagal melakukan pencarian untuk "${query}". Silakan coba lagi.`);
        console.error('Error fetching search results:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSearchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-brand-bg py-8"> {/* Latar: #EAEFEF */}
      <div className="container mx-auto px-4 sm:px-6">
        <header className="mb-10 text-center">
          {query ? (
            <>
              <p className="text-brand-medium font-semibold mb-1">Hasil Pencarian Untuk</p>
              <h1 className="text-4xl sm:text-5xl font-bold font-heading text-brand-dark">
                "{query}"
              </h1>
            </>
          ) : (
            <h1 className="text-4xl sm:text-5xl font-bold font-heading text-brand-dark">
              Hasil Pencarian
            </h1>
          )}
        </header>

        {error && <div className="mb-6"><ErrorMessage message={error} onClose={() => setError(null)} /></div>}

        {loading ? (
          <LoadingSpinner />
        ) : !query ? (
            <div className="text-center py-16 text-gray-500 bg-white rounded-xl shadow-custom-light p-8">
                 <SearchX size={48} className="mx-auto mb-4 text-brand-light" />
                <h3 className="text-2xl font-semibold text-brand-dark mb-2">Masukkan Kata Kunci</h3>
                <p className="max-w-md mx-auto">Silakan masukkan kata kunci pada kolom pencarian untuk menemukan event.</p>
                <Button variant="primary" className="mt-6" onClick={() => navigate('/')}>
                    Kembali ke Beranda
                </Button>
            </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 text-gray-500 bg-white rounded-xl shadow-custom-light p-8">
            <SearchX size={48} className="mx-auto mb-4 text-brand-light" />
            <h3 className="text-2xl font-semibold text-brand-dark mb-2">Oops! Tidak Ada Hasil</h3>
            <p className="max-w-md mx-auto">Kami tidak menemukan event yang cocok dengan kata kunci "{query}". Coba gunakan kata kunci lain atau jelajahi semua event.</p>
             <Button variant="primary" className="mt-6" onClick={() => navigate('/events')}>
                Lihat Semua Event
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {events.map(event => (
              <div key={event.id} className="bg-white rounded-xl shadow-custom-strong overflow-hidden group transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
                <Link to={`/events/${event.id}`} className="block">
                  <img src={unsplashImage(event.category || 'event', 600, 400, event.id)} alt={event.title} className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity" />
                </Link>
                <div className="p-5 flex flex-col flex-grow">
                  <Link to={`/events/${event.id}`} className="block">
                    <h2 className="text-lg font-semibold font-heading text-brand-dark mb-2 group-hover:text-brand-medium transition-colors line-clamp-2">{event.title || 'Nama Event'}</h2>
                  </Link>
                  <p className="text-sm text-gray-600 mb-1 line-clamp-1"><MapPin size={14} className="inline mr-1.5 text-brand-medium" />{event.location || 'N/A'}</p>
                  <p className="text-sm text-gray-600 mb-1"><CalendarDays size={14} className="inline mr-1.5 text-brand-medium" />{event.date ? new Date(event.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : 'N/A'}</p>
                  <p className="text-sm font-semibold text-brand-dark mb-3"><Ticket size={14} className="inline mr-1.5 text-brand-medium" />Rp {Number(event.price || 0).toLocaleString('id-ID')}</p>
                  
                  <div className="mt-auto pt-3 border-t border-gray-100">
                    <Link to={`/events/${event.id}`} className="w-full block">
                        <Button variant="secondary" size="sm" className="w-full">Lihat Detail</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          // TODO: Tambahkan pagination jika hasil pencarian banyak
        )}
      </div>
    </div>
  );
}

export default SearchResultsPage;