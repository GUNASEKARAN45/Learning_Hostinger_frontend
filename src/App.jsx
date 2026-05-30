import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Auth from './components/Auth';
import MathGame from './components/MathGame';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Check if user is already logged in on page load
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCheckingSession(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // Token expired or invalid
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (checkingSession) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} style={{ color: 'var(--primary)' }} />
        <p className="text-gray-400">Verifying session...</p>
      </div>
    );
  }

  return (
    <>
      {user ? (
        <MathGame user={user} onLogout={handleLogout} />
      ) : (
        <Auth onAuthSuccess={handleAuthSuccess} />
      )}
    </>
  );
}

export default App;
