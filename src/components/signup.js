import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from './authservice';
import './login.css'; // We'll use the same CSS as the Login component
import App from '../App'

const SignUp = ({ onSignUp }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('') //do
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await authService.signUp(email, password);
      onSignUp(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Sign Up for CryptoTracker</h2>
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
        <button type="submit">Sign Up</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default SignUp;