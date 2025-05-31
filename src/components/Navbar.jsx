// src/components/Navbar.jsx
import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import { LogOut, Search, Home, Settings, Users as UsersIconLucide } from 'lucide-react'; // Ganti nama alias Users

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const isAdmin = user && user.role === 'admin';

  return (
    <nav className="bg-white shadow-custom-light sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-3">
          <Link 
            to={user ? (isAdmin ? "/admin/dashboard" : "/events") : "/"}
            className="text-xl sm:text-2xl font-bold font-heading text-brand-dark hover:text-brand-medium transition-colors"
          >
            Event Organizer
          </Link>
          
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            {user && (
              <span className="text-xs sm:text-sm text-gray-600 hidden md:block">
                Halo, <span className="font-semibold text-brand-dark">{user.username}</span>!
                {isAdmin && <span className="ml-1 text-xs text-brand-action">(Admin)</span>}
              </span>
            )}
            
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2 rounded-md ${isActive ? 'bg-brand-bg text-brand-action font-semibold' : 'text-brand-dark hover:text-brand-medium hover:bg-gray-100'} transition-colors flex items-center`
              }
              end 
            >
              <Home size={16} className="sm:mr-1.5" /> <span className="hidden sm:inline">Beranda</span>
            </NavLink>

            <NavLink
              to="/events"
              className={({ isActive }) =>
                `text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2 rounded-md ${isActive ? 'bg-brand-bg text-brand-action font-semibold' : 'text-brand-dark hover:text-brand-medium hover:bg-gray-100'} transition-colors flex items-center`
              }
            >
              <Search size={16} className="sm:mr-1.5" /> <span className="hidden sm:inline">Cari Event</span>
            </NavLink>
            
            {isAdmin && (
              <>
                <NavLink
                  to="/event-settings"
                  className={({ isActive }) =>
                    `text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2 rounded-md ${isActive ? 'bg-brand-bg text-brand-action font-semibold' : 'text-brand-dark hover:text-brand-medium hover:bg-gray-100'} transition-colors flex items-center`
                  }
                >
                  <Settings size={16} className="sm:mr-1.5" /> <span className="hidden sm:inline">Pengaturan</span>
                </NavLink>
                {/* Anda bisa menambahkan link ke dashboard admin di sini jika ada */}
                {/* <NavLink
                  to="/admin/dashboard" 
                  className={({ isActive }) => ... }
                >
                  <LayoutDashboard size={16} className="sm:mr-1.5" /> <span className="hidden sm:inline">Dashboard</span>
                </NavLink> */}
              </>
            )}

            {user ? (
              <Button onClick={onLogout} variant="secondary" size="sm" className="!px-2 !py-1 sm:!px-3" icon={LogOut}>
                 <span className="hidden sm:inline">Logout</span>
              </Button>
            ) : (
              <Button onClick={() => navigate('/login')} variant="primary" size="sm" className="!px-2 !py-1 sm:!px-3">
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;