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
      const user = await authService.signUp(email, password, name);
      onSignUp(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <nav>
          <ul>
            <h2>Sign Up</h2>
          </ul>
          <ul>

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
          </ul>
          <ul>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </ul>
          <ul>  
            <input
              type="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </ul>
          <ul>
            <button type="submit">Sign Up</button>
          </ul>
        </nav>

        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default SignUp;