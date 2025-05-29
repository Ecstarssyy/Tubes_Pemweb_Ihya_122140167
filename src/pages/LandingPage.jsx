import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LandingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const featuredEvents = [
    { id: 1, title: 'Music Concert', date: '2024-07-15', image: 'https://source.unsplash.com/400x200/?concert,music' },
    { id: 2, title: 'Art Exhibition', date: '2024-08-01', image: 'https://source.unsplash.com/400x200/?art,exhibition' },
    { id: 3, title: 'Tech Conference', date: '2024-09-10', image: 'https://source.unsplash.com/400x200/?technology,conference' },
  ];

  const eventCategories = [
    { name: 'Music', icon: '🎵' },
    { name: 'Art', icon: '🎨' },
    { name: 'Technology', icon: '💻' },
    { name: 'Sports', icon: '🏅' },
    { name: 'Education', icon: '📚' },
  ];

  const recentEvents = [
    { id: 4, title: 'Food Festival', date: '2024-06-20' },
    { id: 5, title: 'Marathon', date: '2024-06-25' },
    { id: 6, title: 'Book Fair', date: '2024-07-05' },
  ];

  const filteredEvents = featuredEvents.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 text-gray-900 p-8">
      <header className="max-w-6xl mx-auto mb-8 text-center text-white">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">Welcome to Event Organizer</h1>
        <p className="text-xl mb-8 drop-shadow-md">
          Manage your events and participants efficiently with our powerful and easy-to-use platform.
        </p>
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchTerm.trim() !== '') {
              e.preventDefault();
              navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            }
          }}
          className="w-full max-w-md px-4 py-2 rounded shadow-lg text-gray-900"
        />
      </header>

      <section className="max-w-6xl mx-auto mb-12 relative">
        <h2 className="text-3xl font-semibold mb-4 text-white drop-shadow-md">Featured Events</h2>
        <div className="relative overflow-hidden rounded-lg shadow-lg">
          <img
            src={featuredEvents[currentSlide].image}
            alt={featuredEvents[currentSlide].title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 text-white">
            <h3 className="text-xl font-bold">{featuredEvents[currentSlide].title}</h3>
            <p>{featuredEvents[currentSlide].date}</p>
          </div>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition"
            aria-label="Previous Slide"
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition"
            aria-label="Next Slide"
          >
            ›
          </button>
        </div>
      </section>

      <section className="max-w-6xl mx-auto mb-12">
        <h2 className="text-3xl font-semibold mb-4 text-white drop-shadow-md">Event Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {eventCategories.map(category => (
            <Link
              key={category.name}
              to={`/category/${category.name.toLowerCase()}`}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg cursor-pointer hover:scale-105 transform transition"
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <div className="text-lg font-semibold">{category.name}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto mb-12 bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-3xl font-semibold mb-4 text-gray-900">Recent Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentEvents.map(event => (
            <div
              key={event.id}
              className="p-4 border rounded shadow hover:shadow-lg transition cursor-pointer"
            >
              <h3 className="text-xl font-bold">{event.title}</h3>
              <p className="text-gray-600">{event.date}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center">
        <Link
          to="/login"
          className="inline-block bg-white text-orange-500 font-bold py-2 px-6 rounded-lg shadow hover:shadow-lg transition duration-300"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
