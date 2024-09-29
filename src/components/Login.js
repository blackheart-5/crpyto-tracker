import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from './authservice.js';
import './login.css';
import './signup.js'


const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await authService.login(email, password);
      onLogin(user);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login to CryptoTracker</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
          <ul>
            <button type="submit">Login</button>
          </ul>
    
        
        
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Login;