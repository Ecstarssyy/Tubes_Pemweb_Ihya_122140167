// src/pages/LandingPage.jsx
import React, { useState, useEffect, useRef } from 'react'; // Tambahkan useEffect dan useRef
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import Button from '../components/Button'; // Pastikan path ini benar

// Ganti dengan ikon yang lebih sesuai atau library ikon Anda
import { Search, Music, Palette, Cpu, Trophy, BookOpen, ArrowRight, ArrowLeft, MapPin, CalendarDays, Ticket, CheckCircle, Star } from 'lucide-react';

// Fungsi untuk gambar placeholder (ganti dengan gambar nyata atau layanan seperti Unsplash yang lebih spesifik)
const unsplashImage = (keywords, width = 800, height = 600, seed = '') => `https://source.unsplash.com/${width}x${height}/?${keywords}${seed ? '&' + seed : ''}`;

function LandingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const sliderRef = useRef(null); // Untuk auto-slide

  // Data dengan gambar placeholder yang lebih beragam
  const featuredEventsData = [
    { id: 1, title: 'Konser Harmoni Senja', date: '15 Juli 2025', image: unsplashImage('live,music,sunset,audience', 800, 600, 'feat1'), location: 'Amphitheater Kota', price: 'Rp 450.000' },
    { id: 2, title: 'Pameran "Dimensi Abstrak"', date: '1-10 Agustus 2025', image: unsplashImage('abstract,art,gallery,modern',800, 600, 'feat2'), location: 'Museum Seni Modern', price: 'Rp 50.000' },
    { id: 3, title: 'KTT Inovasi Digital 2025', date: '10 September 2025', image: unsplashImage('conference,digital,innovation,speaker', 800, 600, 'feat3'), location: 'Hotel Grand Ballroom', price: 'Rp 2.500.000' },
    { id: 4, title: 'Festival Kuliner Nusantara', date: '20-22 September 2025', image: unsplashImage('food,festival,street,crowd',800, 600, 'feat4'), location: 'Alun-Alun Kota', price: 'Gratis Masuk' },
    { id: 5, title: 'Workshop Coding Intensif', date: '5-7 Oktober 2025', image: unsplashImage('coding,workshop,laptop,developer',800, 600, 'feat5'), location: 'Gedung Inovasi Lt. 3', price: 'Rp 1.200.000' },
  ];

  const eventCategoriesData = [
    { name: 'Musik', icon: <Music size={28} />, linkSuffix: 'musik', color: 'text-pink-600', bgColor: 'bg-pink-100', hoverColor: 'hover:bg-pink-200' },
    { name: 'Seni & Budaya', icon: <Palette size={28} />, linkSuffix: 'seni-budaya', color: 'text-purple-600', bgColor: 'bg-purple-100', hoverColor: 'hover:bg-purple-200' },
    { name: 'Teknologi', icon: <Cpu size={28} />, linkSuffix: 'teknologi', color: 'text-blue-600', bgColor: 'bg-blue-100', hoverColor: 'hover:bg-blue-200' },
    { name: 'Olahraga', icon: <Trophy size={28} />, linkSuffix: 'olahraga', color: 'text-green-600', bgColor: 'bg-green-100', hoverColor: 'hover:bg-green-200' },
    { name: 'Edukasi', icon: <BookOpen size={28} />, linkSuffix: 'edukasi', color: 'text-yellow-600', bgColor: 'bg-yellow-100', hoverColor: 'hover:bg-yellow-200' },
  ];
  
  const fadeInUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: "easeOut" } };
  const staggerContainer = { animate: { transition: { staggerChildren: 0.1 } } };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      e.preventDefault();
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % featuredEventsData.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + featuredEventsData.length + featuredEventsData.length) % featuredEventsData.length); // Modulo yang benar untuk negatif

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Ganti slide setiap 5 detik
    return () => clearInterval(interval);
  }, [currentSlide]);


  return (
    <div className="min-h-screen bg-brand-bg font-sans text-brand-dark"> {/* Latar utama halaman: #EAEFEF, Teks utama: #333446 */}
      {/* Navigation Bar */}
      <nav className="bg-white shadow-custom-light sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold font-heading text-brand-dark hover:text-brand-medium transition-colors">
            EventKita
          </Link>
          <div className="space-x-2 sm:space-x-4 flex items-center">
            <Link to="/events" className="text-sm sm:text-base text-brand-dark hover:text-brand-medium transition-colors px-2 py-2 sm:px-3 rounded-md">
              Semua Event
            </Link>
            <Button onClick={() => navigate('/login')} variant="primary" size="sm">
              Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        className="bg-brand-dark py-24 md:py-32 text-white relative overflow-hidden" // Latar hero: #333446
        // Untuk efek paralaks sederhana atau gambar latar:
        // style={{ backgroundImage: `url(${unsplashImage('event,audience,celebration',1920,1080,'hero')})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        {/* <div className="absolute inset-0 bg-brand-dark opacity-70"></div> Overlay jika pakai gambar latar */}
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading mb-6 leading-tight"
          >
            Temukan & Hadiri Event Impian Anda
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-brand-light mb-10 max-w-3xl mx-auto" // Teks sub-hero: #B8CFCE
          >
            Jelajahi ribuan event menarik, mulai dari konser musik, seminar, workshop, hingga festival budaya yang tak terlupakan.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            className="relative max-w-2xl mx-auto"
          >
            <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Cari nama event, kota, atau kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full px-5 py-4 pl-12 sm:pl-14 rounded-lg shadow-custom-strong border-2 border-transparent focus:ring-2 focus:ring-brand-medium focus:border-transparent text-brand-dark"
            />
          </motion.div>
          <motion.div variants={fadeInUp} className="mt-10">
            <Button onClick={() => navigate('/events')} variant="light" size="lg" className="text-brand-dark hover:bg-brand-light font-semibold">
                Jelajahi Semua Event
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Events Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <motion.h2 variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="text-3xl md:text-4xl font-bold font-heading text-center mb-16 text-brand-dark">
            Event Unggulan Untuk Anda
          </motion.h2>
          
          <div className="relative">
            <div className="overflow-hidden" ref={sliderRef}>
              <motion.div 
                className="flex"
                drag="x" // Memungkinkan drag horizontal
                dragConstraints={{ left: -(featuredEventsData.length -1) * (sliderRef.current ? sliderRef.current.offsetWidth / (window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 768 ? 2 : 1)) : 300) , right: 0 }} // Batasan drag
                // Penggunaan animate dan currentSlide di sini bisa jadi lebih kompleks jika ingin snapping sempurna dengan drag
                // Untuk snapping sempurna, library slider akan lebih mudah
                style={{ x: `${-currentSlide * 100 / (window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 768 ? 2 : 1))}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
              >
                {featuredEventsData.map((event) => (
                  <motion.div
                    key={event.id}
                    className={`w-full flex-shrink-0 px-2 md:px-3 
                                ${window.innerWidth >= 1024 ? 'lg:w-1/3' : (window.innerWidth >= 768 ? 'md:w-1/2' : 'w-full')}`}
                    variants={fadeInUp} // Bisa dihapus jika animasi drag sudah cukup
                  >
                    <div className="bg-white rounded-xl shadow-custom-strong overflow-hidden group h-full flex flex-col transform hover:-translate-y-1 transition-transform duration-300">
                      <div className="relative">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-56 sm:h-60 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                         <div className="absolute top-3 right-3 bg-brand-light text-brand-dark text-xs font-semibold px-2.5 py-1.5 rounded-md shadow-sm">
                           {event.price.toLowerCase().includes('gratis') ? 'Gratis' : 'Berbayar'}
                         </div>
                      </div>
                      <div className="p-5 sm:p-6 flex flex-col flex-grow">
                        <h3 className="text-lg sm:text-xl font-semibold font-heading text-brand-dark mb-2 group-hover:text-brand-medium transition-colors line-clamp-2">{event.title}</h3>
                        <div className="flex items-center text-sm text-gray-600 mb-1.5">
                          <CalendarDays size={15} className="mr-2 flex-shrink-0 text-brand-medium" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-4">
                          <MapPin size={15} className="mr-2 flex-shrink-0 text-brand-medium" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                        <div className="mt-auto pt-2 border-t border-gray-100">
                          <Button variant="secondary" size="sm" onClick={() => navigate(`/events/${event.id}`)} className="w-full">
                            Lihat Detail
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {featuredEventsData.length > (window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 768 ? 2 : 1)) && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute top-1/2 left-0 -translate-x-2 md:-translate-x-4 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2.5 shadow-custom-strong transition-all hover:scale-110 z-10"
                  aria-label="Previous Slide"
                >
                  <ArrowLeft className="text-brand-dark" size={20}/>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute top-1/2 right-0 translate-x-2 md:translate-x-4 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2.5 shadow-custom-strong transition-all hover:scale-110 z-10"
                  aria-label="Next Slide"
                >
                  <ArrowRight className="text-brand-dark" size={20}/>
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Event Categories Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.h2 variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="text-3xl md:text-4xl font-bold font-heading text-center mb-16 text-brand-dark">
            Jelajahi Berdasarkan Kategori
          </motion.h2>
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {eventCategoriesData.map(category => (
              <motion.div variants={fadeInUp} key={category.name}>
                <Link
                  to={`/category/${category.linkSuffix}`}
                  className={`group flex flex-col items-center justify-center text-center p-6 rounded-xl shadow-custom-light hover:shadow-custom-strong transform hover:-translate-y-1.5 transition-all duration-300 ${category.bgColor} ${category.hoverColor}`}
                >
                  <div className={`mb-4 p-4 rounded-full ${category.color} ${category.bgColor.replace('bg-opacity-30', 'bg-opacity-50')} group-hover:scale-110 transition-transform`}>
                    {category.icon}
                  </div>
                  <div className={`font-semibold text-brand-dark group-hover:${category.color} transition-colors`}>{category.name}</div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* How it Works Section */}
      <section className="py-16 md:py-24 bg-brand-bg"> {/* Latar: #EAEFEF */}
        <div className="container mx-auto px-6">
          <motion.h2 variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="text-3xl md:text-4xl font-bold font-heading text-center mb-16 text-brand-dark">
            Mulai Dalam 3 Langkah Mudah
          </motion.h2>
          <motion.div 
            className="grid md:grid-cols-3 gap-8 md:gap-10"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { icon: <Search size={32} className="text-brand-medium"/>, title: "1. Cari & Temukan", description: "Gunakan pencarian atau jelajahi kategori untuk menemukan event yang Anda minati dari ribuan pilihan." },
              { icon: <Ticket size={32} className="text-brand-medium"/>, title: "2. Daftar Mudah", description: "Proses pendaftaran yang cepat dan simpel untuk event pilihan Anda, langsung dari genggaman." },
              { icon: <CheckCircle size={32} className="text-brand-medium"/>, title: "3. Hadiri & Nikmati", description: "Dapatkan e-tiket Anda dan nikmati pengalaman event yang tak terlupakan bersama kami." },
            ].map((step, index) => (
              <motion.div variants={fadeInUp} transition={{ ...fadeInUp.transition, delay: index * 0.1 }} key={step.title} className="bg-white p-8 rounded-xl shadow-custom-strong text-center transform hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="inline-block p-5 bg-brand-light bg-opacity-40 rounded-full mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold font-heading mb-3 text-brand-dark">{step.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonial Section (Contoh Tambahan) */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.h2 variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="text-3xl md:text-4xl font-bold font-heading text-center mb-16 text-brand-dark">
            Apa Kata Mereka?
          </motion.h2>
          <motion.div 
            className="grid md:grid-cols-2 gap-8 md:gap-10"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { name: "Andi P.", role: "Musisi", testimony: "Platform ini sangat membantu saya menemukan gigs dan workshop musik terbaru. Tampilannya juga enak dilihat!", avatar: unsplashImage('man,musician,portrait',100,100,'testi1') },
              { name: "Sarah K.", role: "Event Organizer", testimony: "Mengelola pendaftaran event jadi lebih mudah dan efisien. Fitur laporannya juga sangat detail.", avatar: unsplashImage('woman,professional,portrait',100,100,'testi2') },
            ].map((item, index) => (
                <motion.div variants={fadeInUp} transition={{ ...fadeInUp.transition, delay: index * 0.1 }} key={item.name} className="bg-brand-bg p-8 rounded-xl shadow-custom-light">
                    <div className="flex items-center mb-4">
                        <img src={item.avatar} alt={item.name} className="w-14 h-14 rounded-full mr-4 object-cover"/>
                        <div>
                            <h4 className="font-semibold text-brand-dark">{item.name}</h4>
                            <p className="text-sm text-brand-medium">{item.role}</p>
                        </div>
                    </div>
                    <p className="text-gray-700 italic">"{item.testimony}"</p>
                    <div className="flex mt-3">
                        {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />)}
                    </div>
                </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-brand-dark text-brand-light py-16"> {/* Warna latar: #333446, Teks: #B8CFCE */}
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h5 className="text-lg font-semibold font-heading text-white mb-3">EventKita</h5>
              <p className="text-sm text-brand-light leading-relaxed">Platform Anda untuk menemukan dan mengelola event terbaik. Mudah, cepat, dan menyenangkan.</p>
            </div>
            <div>
              <h5 className="text-lg font-semibold font-heading text-white mb-3">Tautan Cepat</h5>
              <ul className="space-y-2 text-sm">
                <li><Link to="/events" className="hover:text-white transition-colors">Semua Event</Link></li>
                <li><Link to="/categories" className="hover:text-white transition-colors">Kategori</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Hubungi Kami</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold font-heading text-white mb-3">Ikuti Kami</h5>
              <div className="flex space-x-4">
                {/* Ganti dengan link media sosial Anda dan ikon yang sesuai */}
                <a href="#" className="hover:text-white transition-colors">Facebook</a>
                <a href="#" className="hover:text-white transition-colors">Instagram</a>
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
              </div>
            </div>
          </div>
          <div className="border-t border-brand-medium border-opacity-30 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} EventKita. Dirancang dengan penuh semangat.</p>
          </div>
        </div>
      </footer>
    </div>
  
  );

}

export default LandingPage;