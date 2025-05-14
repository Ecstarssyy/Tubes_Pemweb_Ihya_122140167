import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar({ onLogout }) {
  return (
    <nav className="bg-orange-600 text-white px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold">EventOrganizer</div>
      <div className="space-x-6">
        <NavLink
          to="/events"
          className={({ isActive }) =>
            isActive ? 'underline font-semibold' : 'hover:underline'
          }
        >
          Events
        </NavLink>
        <NavLink
          to="/participants"
          className={({ isActive }) =>
            isActive ? 'underline font-semibold' : 'hover:underline'
          }
        >
          Participants
        </NavLink>
        <button
          onClick={onLogout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
