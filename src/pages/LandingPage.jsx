import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 flex flex-col">
      <header className="flex justify-between items-center p-6 bg-white shadow-md">
        <h1 className="text-3xl font-bold text-orange-600">EventOrganizer</h1>
        <button
          onClick={() => navigate('/login')}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
        >
          Login
        </button>
      </header>

      <main className="flex-grow flex flex-col md:flex-row items-center justify-center px-6 md:px-20 text-white">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h2 className="text-5xl font-extrabold mb-6">
            Organize Your Events Effortlessly
          </h2>
          <p className="text-lg mb-8">
            Manage seminars, workshops, conferences, and more with ease. Track participants and generate reports all in one place.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-orange-600 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100 transition"
          >
            Get Started
          </button>
        </div>
        <div className="md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
            alt="Event organization"
            className="rounded-lg shadow-lg"
          />
        </div>
      </main>

      <footer className="p-6 bg-white text-center text-gray-600">
        &copy; 2025 EventOrganizer. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;
