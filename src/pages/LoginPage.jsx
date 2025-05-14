import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import { AuthService } from '../services/authService';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Get the return URL from location state, or default to /events
  const from = location.state?.from?.pathname || '/events';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    if (isRegistering && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError('');

      let result;
      if (isRegistering) {
        // Handle registration
        result = await AuthService.register(username, password);
      } else {
        // Handle login
        result = await AuthService.login(username, password);
      }

      if (result.success) {
        const userData = {
          username: result.user.username,
          role: result.user.role,
          token: 'dummy-token'
        };
        await onLogin(userData);
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(isRegistering ? 'Registration failed. Please try again.' : 'Login failed. Please try again.');
      console.error(isRegistering ? 'Registration error:' : 'Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold mb-8 text-center text-orange-600">
          {isRegistering ? 'Register' : 'Login'}
        </h2>
        
        {error && <ErrorMessage message={error} />}

        <div className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          {isRegistering && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
          >
            {loading ? 'Loading...' : (isRegistering ? 'Register' : 'Login')}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="text-sm text-orange-600 hover:text-orange-500"
            >
              {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
