import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import ParticipantsPage from './pages/ParticipantsPage';
import LandingPage from './pages/LandingPage';
import CategoryPage from './pages/CategoryPage';
import SearchResultsPage from './pages/SearchResultsPage';
import EventSettingsPage from './pages/EventSettingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthService } from './services/authService';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const params = useParams();
  const eventId = params.eventId || null;

  React.useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = async (userData) => {
    try {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      // Navigation will be handled by the LoginPage component
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {user && <Navbar user={user} onLogout={handleLogout} eventId={eventId} />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/events" replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
        {/* Public routes */}
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:eventId" element={<EventDetailPage />} />
        {/* Protected admin routes */}
        <Route
          path="/events/:eventId/participants"
          element={
            <ProtectedRoute user={user} requiredRole="admin">
              <ParticipantsPageWrapper onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/event-settings"
          element={
            <ProtectedRoute user={user} requiredRole="admin">
              <EventSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ErrorBoundary>
  );
}

function ParticipantsPageWrapper({ onLogout }) {
  const { eventId } = useParams();
  return <ParticipantsPage onLogout={onLogout} eventId={eventId} />;
}

export default AppWrapper;