import React, { useState } from 'react';
import { Mail, Lock, User, LogIn, UserPlus, Loader2, AlertCircle } from 'lucide-react';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const payload = isLogin 
      ? { email, password } 
      : { username, email, password };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Store JWT token
      localStorage.setItem('token', data.token);
      onAuthSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="container">
      <div className="header">
        <div className="logo-icon">
          {isLogin ? <LogIn size={28} /> : <UserPlus size={28} />}
        </div>
        <h1 className="app-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
        <p className="app-subtitle">
          {isLogin 
            ? 'Sign in to access your math session' 
            : 'Join us and start testing your skills'}
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="input-group">
            <label className="input-label" htmlFor="username">Username</label>
            <div className="input-field-wrapper">
              <input
                id="username"
                type="text"
                className="input-field"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!isLogin}
              />
              <User className="input-icon" size={18} />
            </div>
          </div>
        )}

        <div className="input-group">
          <label className="input-label" htmlFor="email">Email Address</label>
          <div className="input-field-wrapper">
            <input
              id="email"
              type="email"
              className="input-field"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              required
            />
            <Mail className="input-icon" size={18} />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="password">Password</label>
          <div className="input-field-wrapper">
            <input
              id="password"
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Lock className="input-icon" size={18} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Please wait...</span>
            </>
          ) : (
            <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
          )}
        </button>
      </form>

      <div className="auth-toggle">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}
        <button type="button" className="auth-toggle-link" onClick={toggleAuthMode}>
          {isLogin ? 'Sign up' : 'Sign in'}
        </button>
      </div>
    </div>
  );
}
