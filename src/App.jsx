import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import EventsPage from './pages/EventsPage';
import ParticipantsPage from './pages/ParticipantsPage';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';

function App() {
  // For simplicity, using local state for authentication status
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="/events"
          element={
            <>
              <Navbar onLogout={isAuthenticated ? handleLogout : undefined} />
              <EventsPage isAdmin={isAuthenticated} onLogout={handleLogout} />
            </>
          }
        />
        <Route
          path="/participants"
          element={
            <>
              <Navbar onLogout={isAuthenticated ? handleLogout : undefined} />
              <ParticipantsPage isAdmin={isAuthenticated} onLogout={handleLogout} />
            </>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
