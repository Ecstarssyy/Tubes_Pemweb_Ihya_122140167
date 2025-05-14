import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Event Organizer</h1>
        <p className="text-xl text-gray-600 mb-8">Manage your events and participants efficiently</p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
