// src/pages/EventDetailPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEventDetail } from '../hooks/useEventDetail'; //
import { useRegistrationStatus } from '../hooks/useRegistrationStatus'; //
import { useUserRegistrationStatus } from '../hooks/useUserRegistrationStatus'; //
import { useParticipantsPreview } from '../hooks/useParticipantsPreview'; //
import { useRelatedEvents } from '../hooks/useRelatedEvents'; //
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner'; //
import ErrorMessage from '../components/ErrorMessage'; //
import { MapPin, CalendarDays, Ticket, Users, Clock, Info, ThumbsUp, Link as LinkIcon } from 'lucide-react';

// Fungsi untuk gambar placeholder
const unsplashImage = (keywords, width = 1200, height = 500, seed = '') => `https://source.unsplash.com/${width}x${height}/?${keywords}${seed ? '&' + seed : ''}`;

function EventDetailPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const { event, loading: eventLoading, error: eventError } = useEventDetail(eventId);
  const { status: registrationStatus, loading: regLoading, error: regError } = useRegistrationStatus(eventId);
  const { registration: userRegistration, loading: userRegLoading, error: userRegError } = useUserRegistrationStatus(eventId); // Membutuhkan AuthContext untuk user

  // Handle case when user is null to avoid destructuring errors
  const safeUserRegistration = user ? userRegistration : null;

  const { participantsData, loading: participantsLoading, error: participantsError } = useParticipantsPreview(eventId, 5); // Ambil 5 preview
  
  const relatedRef = useRef(null);
  const [loadRelated, setLoadRelated] = useState(false);
  const { relatedEvents, loading: relatedLoading, error: relatedError } = useRelatedEvents(eventId, 3, loadRelated);
  

  useEffect(() => {
    if (!relatedRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setLoadRelated(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 }); // Trigger saat 10% elemen terlihat
    observer.observe(relatedRef.current);
    return () => observer.disconnect();
  }, [relatedRef]); // Tambahkan relatedRef sebagai dependency

  const handleRegisterClick = () => {
    if (!user) { // Cek jika user belum login dari localStorage atau AuthContext
      navigate('/login', { state: { from: `/events/${eventId}` } }); // Redirect ke login dengan state
    } else {
      // Arahkan ke halaman pendaftaran event spesifik atau proses registrasi
      // Untuk sekarang, kita asumsikan ParticipantsPage adalah untuk admin
      // jadi mungkin perlu halaman registrasi baru untuk user
      alert('Fitur registrasi event sedang dalam pengembangan.');
      // navigate(`/events/${eventId}/register`); // contoh
    }
  };
  
  if (eventLoading) return <div className="min-h-screen flex items-center justify-center bg-brand-bg"><LoadingSpinner /></div>;
  if (eventError) return <div className="container mx-auto p-6"><ErrorMessage message={eventError} /></div>;
  if (!event) return <div className="container mx-auto p-6 text-center text-xl text-gray-500">Event tidak ditemukan.</div>;

  const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start text-brand-dark mb-3">
      <div className="flex-shrink-0 w-6 h-6 mr-3 text-brand-medium">{icon}</div>
      <div>
        <span className="font-semibold block text-sm">{label}</span>
        <span className="text-gray-700 text-base">{value || '-'}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bg py-8"> {/* Latar: #EAEFEF */}
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header Event */}
        <div className="mb-8 p-6 sm:p-8 bg-white rounded-xl shadow-custom-strong">
          <img 
            src={unsplashImage(event.category || 'event,party', 1200, 400, event.id)} 
            alt={event.title} 
            className="w-full h-64 md:h-80 object-cover rounded-lg mb-6 shadow-md"
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-brand-dark mb-4">{event.title || 'Judul Event'}</h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 mb-6 text-sm text-gray-600">
            <div className="flex items-center"><CalendarDays size={18} className="mr-2 text-brand-medium"/> Mulai: {event.start_date ? new Date(event.start_date).toLocaleString('id-ID', {dateStyle: 'full', timeStyle: 'short'}) : '-'}</div>
            <div className="flex items-center"><Clock size={18} className="mr-2 text-brand-medium"/> Selesai: {event.end_date ? new Date(event.end_date).toLocaleString('id-ID', {dateStyle: 'full', timeStyle: 'short'}) : '-'}</div>
            <div className="flex items-center"><MapPin size={18} className="mr-2 text-brand-medium"/> Lokasi: {event.location || '-'}</div>
            <div className="flex items-center"><Users size={18} className="mr-2 text-brand-medium"/> Kategori: {event.category || '-'}</div>
            <div className="flex items-center col-span-1 md:col-span-2 lg:col-span-1"><Ticket size={18} className="mr-2 text-brand-medium"/> Harga: Rp {Number(event.price || 0).toLocaleString('id-ID')}</div>
          </div>
          <p className="text-gray-700 leading-relaxed mb-6">{event.description || 'Deskripsi event tidak tersedia.'}</p>
          
          <Button onClick={handleRegisterClick} variant="primary" size="lg" className="w-full sm:w-auto">
            {safeUserRegistration ? 'Lihat Registrasi Anda' : 'Daftar Event Ini'}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Kolom Kiri: Detail Tambahan & Registrasi */}
          <div className="lg:col-span-2 space-y-8">
            {/* Status Registrasi Event */}
            <div className="p-6 bg-white rounded-xl shadow-custom-light">
              <h2 className="text-2xl font-semibold font-heading text-brand-dark mb-4">Status Registrasi Event</h2>
              {regLoading && <LoadingSpinner />}
              {regError && <ErrorMessage message={regError} />}
              {registrationStatus && !regLoading && !regError && (
                <div className="space-y-3">
                  <DetailItem icon={<Users size={20}/>} label="Total Terdaftar" value={`${registrationStatus.total_registered} / ${registrationStatus.max_participants || '∞'}`} />
                  <DetailItem icon={<ThumbsUp size={20}/>} label="Slot Tersedia" value={registrationStatus.available_spots || (registrationStatus.max_participants ? (registrationStatus.max_participants - registrationStatus.total_registered) : 'Tidak terbatas')} />
                  <DetailItem icon={<Info size={20}/>} label="Status" value={registrationStatus.is_full ? <span className="text-red-600 font-semibold">PENUH</span> : <span className="text-green-600 font-semibold">{registrationStatus.registration_status || 'TERSEDIA'}</span>} />
                </div>
              )}
            </div>

            {/* Status Registrasi Pengguna */}
            {user && ( // Hanya tampilkan jika user login
            <div className="p-6 bg-white rounded-xl shadow-custom-light">
              <h2 className="text-2xl font-semibold font-heading text-brand-dark mb-4">Registrasi Anda</h2>
              {userRegLoading && <LoadingSpinner />}
              {userRegError && <ErrorMessage message={userRegError} />}
              {userRegistration && !userRegLoading && !userRegError ? (
                <div className="space-y-3">
                  <DetailItem icon={<Info size={20}/>} label="Status Pendaftaran Anda" value={<span className="font-semibold text-brand-action">{userRegistration.status || 'Terdaftar'}</span>} />
                  <DetailItem icon={<Ticket size={20}/>} label="Status Pembayaran" value={userRegistration.payment_status || 'Lunas'} />
                  {userRegistration.can_cancel && <DetailItem icon={<Clock size={20}/>} label="Batas Pembatalan" value={new Date(userRegistration.cancellation_deadline).toLocaleString('id-ID')} />}
                </div>
              ) : (
                !userRegLoading && !userRegError && <p className="text-gray-600">Anda belum terdaftar untuk event ini.</p>
              )}
            </div>
            )}
          </div>

          {/* Kolom Kanan: Partisipan & Event Terkait */}
          <div className="lg:col-span-1 space-y-8">
            {/* Preview Partisipan */}
            <div className="p-6 bg-white rounded-xl shadow-custom-light">
              <h2 className="text-2xl font-semibold font-heading text-brand-dark mb-4">Beberapa Partisipan</h2>
              {participantsLoading && <LoadingSpinner />}
              {participantsError && <ErrorMessage message={participantsError} />}
              {participantsData && participantsData.participants && !participantsLoading && !participantsError && (
                participantsData.show_participants && participantsData.participants.length > 0 ? (
                  <ul className="space-y-3">
                    {participantsData.participants.map(p => (
                      <li key={p.id} className="flex items-center">
                        <img src={p.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || 'P')}&background=B8CFCE&color=333446`} alt={p.name} className="w-10 h-10 rounded-full mr-3 shadow-sm" />
                        <div>
                            <span className="font-medium text-brand-dark text-sm">{p.name || 'Partisipan'}</span>
                            <p className="text-xs text-gray-500">Terdaftar: {p.registration_date ? new Date(p.registration_date).toLocaleDateString('id-ID') : '-'}</p>
                        </div>
                      </li>
                    ))}
                     {participantsData.total_count > participantsData.participants.length &&
                        <Link to={`/events/${eventId}/all-participants`} className="text-sm text-brand-medium hover:text-brand-dark hover:underline mt-3 block">Lihat semua partisipan...</Link>
                     }
                  </ul>
                ) : (
                  <p className="text-gray-600 text-sm">{participantsData.show_participants ? 'Belum ada partisipan.' : 'Daftar partisipan bersifat privat.'}</p>
                )
              )}
            </div>

            {/* Event Terkait */}
            <div className="p-6 bg-white rounded-xl shadow-custom-light" ref={relatedRef}>
              <h2 className="text-2xl font-semibold font-heading text-brand-dark mb-4">Event Terkait</h2>
              {relatedLoading && <LoadingSpinner />}
              {relatedError && <ErrorMessage message={relatedError} />}
              {relatedEvents && relatedEvents.length > 0 && !relatedLoading && !relatedError && (
                <ul className="space-y-4">
                  {relatedEvents.map(e => (
                    <li key={e.id} className="group">
                      <Link to={`/events/${e.id}`} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-brand-bg transition-colors">
                        <img src={e.image_url || unsplashImage(e.category || 'event', 100, 80, e.id)} alt={e.title} className="w-20 h-16 object-cover rounded-md shadow-sm flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-brand-dark group-hover:text-brand-medium text-sm line-clamp-2">{e.title || 'Event Terkait'}</h4>
                          <p className="text-xs text-gray-500">{e.start_date ? new Date(e.start_date).toLocaleDateString('id-ID') : '-'}</p>
                          <p className="text-xs text-brand-medium font-semibold">Rp {Number(e.price || 0).toLocaleString('id-ID')}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {loadRelated && !relatedLoading && relatedEvents && relatedEvents.length === 0 && (
                  <p className="text-gray-600 text-sm">Tidak ada event terkait.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetailPage;