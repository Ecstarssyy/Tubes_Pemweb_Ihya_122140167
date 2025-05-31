// src/pages/CategoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchEventsData } from '../services/eventService'; // Kita gunakan fetchEventsData yang ada, lalu filter di frontend untuk sementara
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button'; // Jika diperlukan untuk pagination atau aksi lain
import { MapPin, CalendarDays, Ticket, ListFilter } from 'lucide-react';

// Fungsi untuk gambar placeholder
const unsplashImage = (keywords, width = 600, height = 400, seed = '') => `https://source.unsplash.com/${width}x${height}/?${keywords}${seed ? '&' + seed : ''}`;

function CategoryPage() {
  const { categoryName } = useParams(); // Mengambil nama kategori dari URL (misal: "musik", "seni-budaya")
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const eventsPerPage = 9; // Jumlah event per halaman

  const formattedCategoryName = categoryName?.replace(/-/g, ' ') || 'Kategori';

  useEffect(() => {
    const loadEventsByCategory = async () => {
      setLoading(true);
      setError(null);
      try {
        // Untuk sementara, kita fetch semua event lalu filter di frontend.
        // Idealnya, backend harus menyediakan endpoint untuk fetch event by category.
        // Misal: await fetchEventsByCategory(categoryName, currentPage, eventsPerPage);
        const { events: allEvents, total } = await fetchEventsData({}, 'date', 1, 1000); // Ambil semua event dulu
        
        const filteredEvents = allEvents.filter(event => 
          event.category && event.category.toLowerCase().replace(/\s+/g, '-') === categoryName
        );

        // Implementasi pagination sederhana di frontend
        const totalFilteredEvents = filteredEvents.length;
        setTotalPages(Math.ceil(totalFilteredEvents / eventsPerPage));
        const paginatedEvents = filteredEvents.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage);
        
        setEvents(paginatedEvents);

      } catch (err) {
        setError(`Gagal memuat event untuk kategori "${formattedCategoryName}". Silakan coba lagi.`);
        console.error('Error fetching category events:', err);
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      loadEventsByCategory();
    } else {
      setError("Nama kategori tidak ditemukan.");
      setLoading(false);
    }
  }, [categoryName, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-brand-bg py-8"> {/* Latar: #EAEFEF */}
      <div className="container mx-auto px-4 sm:px-6">
        <header className="mb-10 text-center">
          <p className="text-brand-medium font-semibold mb-1">Menampilkan Event Untuk</p>
          <h1 className="text-4xl sm:text-5xl font-bold font-heading text-brand-dark capitalize">
            {formattedCategoryName}
          </h1>
        </header>

        {error && <div className="mb-6"><ErrorMessage message={error} onClose={() => setError(null)} /></div>}

        {/* TODO: Tambahkan opsi filter dan sort jika diperlukan, mirip EventsPage */}
        {/* <div className="mb-8 p-4 sm:p-6 bg-white rounded-xl shadow-custom-light">
          <p className="text-gray-600">Filter dan opsi urutkan...</p>
        </div> */}

        {loading ? (
          <LoadingSpinner />
        ) : events.length === 0 ? (
          <div className="text-center py-16 text-gray-500 bg-white rounded-xl shadow-custom-light p-8">
            <ListFilter size={48} className="mx-auto mb-4 text-brand-light" />
            <h3 className="text-2xl font-semibold text-brand-dark mb-2">Oops! Belum Ada Event</h3>
            <p className="max-w-md mx-auto">Saat ini tidak ada event yang tersedia untuk kategori "{formattedCategoryName}". Silakan cek kembali nanti atau jelajahi kategori lainnya.</p>
            <Button variant="primary" className="mt-6" onClick={() => navigate('/events')}>
                Lihat Semua Event
            </Button>
          </div>
        ) : (
          <>
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
                    <p className="text-sm text-gray-600 mb-1"><CalendarDays size={14} className="inline mr-1.5 text-brand-medium" />{event.date ? new Date(event.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric'}) : 'N/A'}</p>
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
          </>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;