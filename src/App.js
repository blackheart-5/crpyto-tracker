import React, { useState, useEffect, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
  NavLink,
} from 'react-router-dom';
import CryptoList from './components/CryptoList';
import CryptoChart from './components/CryptoChart';
import Portfolio from './components/Portfolio';
import Login from './components/Login';
import SignUp from './components/signup';
import { fetchCryptoData } from './api/cryptoApi';
import authService from './components/authservice';
import './App.css';

const REFRESH_INTERVAL = 60000; // 60s — stays under CoinGecko's free rate limit

function Dashboard({ user, cryptoData, selectedCrypto, onSelectCrypto, lastUpdated, onRefresh, refreshing }) {
  return (
    <>
      <div className="dashboard-bar">
        <p className="welcome">
          Welcome back, <strong>{user.name}</strong>
        </p>
        <div className="dashboard-bar__meta">
          {lastUpdated && (
            <span className="updated">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button className="refresh-btn" onClick={onRefresh} disabled={refreshing}>
            {refreshing ? 'Refreshing…' : '↻ Refresh'}
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <CryptoList
          cryptoData={cryptoData}
          onSelectCrypto={onSelectCrypto}
          selectedCrypto={selectedCrypto}
        />
        {selectedCrypto && <CryptoChart crypto={selectedCrypto} />}
      </div>
    </>
  );
}

function App() {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [cryptoData, setCryptoData] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async ({ silent } = {}) => {
    if (silent) setRefreshing(true);
    else setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCryptoData();
      setCryptoData(data);
      setSelectedCrypto((prev) => {
        if (!prev) return data[0] ?? null;
        return data.find((c) => c.id === prev.id) ?? prev;
      });
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    loadData();
    const id = setInterval(() => loadData({ silent: true }), REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, [user, loadData]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCryptoData([]);
    setSelectedCrypto(null);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Link to={user ? '/dashboard' : '/login'} className="brand">
            <span className="brand__mark">₿</span>
            <span className="brand__name">CryptoTracker</span>
          </Link>
          <nav>
            {user ? (
              <>
                <NavLink to="/dashboard">Market</NavLink>
                <NavLink to="/portfolio">Portfolio</NavLink>
                <a
                  href="https://www.investopedia.com/learn-how-to-trade-the-market-in-5-steps-4692230"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn to Trade
                </a>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
              </>
            )}
          </nav>
        </header>

        <main className="App-main">
          <Routes>
            <Route
              path="/login"
              element={
                !user ? <Login onLogin={setUser} /> : <Navigate to="/dashboard" />
              }
            />
            <Route
              path="/signup"
              element={
                !user ? <SignUp onSignUp={setUser} /> : <Navigate to="/dashboard" />
              }
            />
            <Route
              path="/dashboard"
              element={
                !user ? (
                  <Navigate to="/login" />
                ) : isLoading ? (
                  <div className="loading">Loading market data…</div>
                ) : error ? (
                  <div className="error">
                    <p>{error}</p>
                    <button onClick={() => loadData()}>Try again</button>
                  </div>
                ) : (
                  <Dashboard
                    user={user}
                    cryptoData={cryptoData}
                    selectedCrypto={selectedCrypto}
                    onSelectCrypto={setSelectedCrypto}
                    lastUpdated={lastUpdated}
                    onRefresh={() => loadData({ silent: true })}
                    refreshing={refreshing}
                  />
                )
              }
            />
            <Route
              path="/portfolio"
              element={
                !user ? (
                  <Navigate to="/login" />
                ) : isLoading ? (
                  <div className="loading">Loading market data…</div>
                ) : error ? (
                  <div className="error">
                    <p>{error}</p>
                    <button onClick={() => loadData()}>Try again</button>
                  </div>
                ) : (
                  <Portfolio user={user} cryptoData={cryptoData} />
                )
              }
            />
            <Route
              path="*"
              element={<Navigate to={user ? '/dashboard' : '/login'} />}
            />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2024 CryptoTracker · Data by CoinGecko</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
