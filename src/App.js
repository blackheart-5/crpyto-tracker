import React, { useState, useEffect } from 'react';
import CryptoList from './components/CryptoList';
import CryptoChart from './components/CryptoChart';
import { fetchCryptoData } from './api/cryptoApi';
import './App.css';

function App() {
  const [cryptoData, setCryptoData] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchCryptoData();
        setCryptoData(data);
        if (data.length > 0) {
          setSelectedCrypto(data[0]);
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError(`Failed to fetch crypto data: ${err.message}`);
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>CryptoTracker</h1>
      </header>
      <main className="App-main">
        <CryptoList 
          cryptoData={cryptoData} 
          onSelectCrypto={setSelectedCrypto}
          selectedCrypto={selectedCrypto}
        />
        {selectedCrypto && (
          <CryptoChart 
            crypto={selectedCrypto}
          />
        )}
      </main>
    </div>
  );
}

export default App;