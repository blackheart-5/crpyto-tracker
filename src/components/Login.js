import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from './authservice';
import './auth.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await authService.login(email, password);
      onLogin(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Welcome back</h2>
        <p className="auth-subtitle">Log in to track your crypto</p>

        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <button type="submit" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>

        {error && <p className="auth-error">{error}</p>}

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
        <p className="auth-hint">Demo login: user@example.com / password123</p>
      </form>
    </div>
  );
};

export default Login;
