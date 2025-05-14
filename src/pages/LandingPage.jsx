import React, { useState } from 'react';

function LandingPage() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [users, setUsers] = useState([{ username: 'admin', password: '1' }]);

  const openLoginForm = () => {
    setShowLoginForm(true);
    setIsRegister(false);
  };

  const closeLoginForm = () => {
    setShowLoginForm(false);
    setIsRegister(false);
  };

  const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (isRegister) {
        if (!username || !password || !confirmPassword) {
          alert('Please fill in all fields');
          return;
        }
        if (password.length < 6) {
          alert('Password must be at least 6 characters');
          return;
        }
        if (password !== confirmPassword) {
          alert('Passwords do not match');
          return;
        }
        if (users.find((user) => user.username === username)) {
          alert('Username already exists');
          return;
        }
        setUsers([...users, { username, password }]);
        alert('Registration successful');
        closeLoginForm();
      } else {
        const user = users.find((user) => user.username === username && user.password === password);
        if (user) {
          alert('Login successful');
          closeLoginForm();
        } else {
          alert('Invalid username or password');
        }
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-orange-600">
            {isRegister ? 'Register' : 'Admin Login'}
          </h2>
          <div className="mb-4">
            <label className="block mb-1 font-semibold" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-semibold" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </div>
          {isRegister && (
            <div className="mb-6">
              <label className="block mb-1 font-semibold" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
            </div>
          )}
          <div className="flex justify-between items-center mb-4">
            <button
              type="button"
              onClick={closeLoginForm}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
            >
              {isRegister ? 'Register' : 'Login'}
            </button>
          </div>
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm text-blue-600 hover:underline"
            >
              {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 flex flex-col">
      <header className="flex justify-between items-center p-6 bg-white shadow-md">
        <h1 className="text-3xl font-bold text-orange-600">EventOrganizer</h1>
        <button
          onClick={openLoginForm}
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
            onClick={openLoginForm}
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

      {showLoginForm && <LoginForm />}
    </div>
  );
}

export default LandingPage;
