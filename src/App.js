import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import CryptoList from './components/CryptoList';
import CryptoChart from './components/CryptoChart';
import Login from './components/Login';
import SignUp from './components/signup.js';
import { fetchCryptoData } from './api/cryptoApi';
import authService from './components/authservice';
import './App.css';
import MySvgComponent from './components/MySvgComponent.js';
import logo from "./components/images.jpg"

function App() {
  const [user, setUser] = useState(() => {
    const currentUser = authService.getCurrentUser();
    console.log('Initial user state:', currentUser);
    return currentUser;
  });
  const [cryptoData, setCryptoData] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('useEffect called, user:', user);
    const fetchData = async () => {
      try {
        console.log('Fetching data...');
        setIsLoading(true);
        setError(null);
        const data = await fetchCryptoData();
        console.log('Data fetched:', data);
        setCryptoData(data);
        if (data.length > 0) {
          setSelectedCrypto(data[0]);
        }
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError(`Failed to fetch crypto data: ${err.message}`);
      } finally {
        console.log('Setting isLoading to false');
        setIsLoading(false);
      }
    };
  
    if (user) {
      fetchData();
    } else {
      console.log('No user, setting isLoading to false');
      setIsLoading(false);
    }
  }, [user]);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleSignUp = (newUser) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <MySvgComponent/>
      <Router>
        <div className="App">
          <header className="App-header">
            <div className='header-block'>
              <h1><img src={logo} alt='CryptoTracker'/>CryptoTracker</h1>
            </div>
            {user ? (
              <div className='header_nav'>
                <nav>
                  <ul>
                    <li><Link to='https://www.investopedia.com/learn-how-to-trade-the-market-in-5-steps-4692230'>Learn to Trade</Link></li>
                    <li><button onClick={handleLogout}>Logout</button></li>
                  </ul>
                </nav>
              </div>
            ) : (
              <div className='header_nav'>
                <nav>
                  <ul>
                    <li><Link to='/login'>Login</Link></li>
                    <li><Link to='/signup'>Sign-Up</Link></li>
                  </ul>
                </nav>
              </div>
            )}
          </header>

          <main className="App-main">
            <Routes>
              <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
              <Route path="/signup" element={!user ? <SignUp onSignUp={handleSignUp} /> : <Navigate to='login' />} />
              <Route 
                path="/dashboard" 
                element={
                  user ? (
                    <>
                      <p>Welcome {user.name} to the world of Trading</p>
                      <CryptoList 
                        cryptoData={cryptoData} 
                        onSelectCrypto={setSelectedCrypto}
                        selectedCrypto={selectedCrypto}
                      />
                      {selectedCrypto && (
                        <>
                          <p>Price Tracking for {<img src={selectedCrypto.image} alt={selectedCrypto.name} />} {selectedCrypto.name}</p>
                          <CryptoChart 
                            crypto={selectedCrypto}
                          />
                        </>
                      )}
                    </>
                  ) : (
                    <Navigate to="/login" />
                  )
                } 
              />
              <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
            </Routes>
          </main>

          <footer className="footer">
            <p>&copy; 2024 CryptoCurrencyTracker. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </>
  );
}

export default App;