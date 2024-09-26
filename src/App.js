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


// import React, { useState, useEffect } from 'react';
// import { fetchCryptoData } from './api/cryptoApi';
// import CryptoList from './components/CryptoList';
// import CryptoChart from './components/CryptoChart';
// import './App.css';

// function App() {
//   const [cryptoData, setCryptoData] = useState([]);
//   const [selectedCrypto, setSelectedCrypto] = useState(null);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const data = await fetchCryptoData();
//         setCryptoData(data);
//         setError(null);
//       } catch (err) {
//         console.error('Error in fetchData:', err);
//         setError(err.message || 'An unexpected error occurred. Please try again later.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleSelectCrypto = (crypto) => {
//     setSelectedCrypto(crypto);
//   };

//   return (
//     <div className="app">
//       <header className="app-header">
//         <h1>Crypto Tracker</h1>
//       </header>
//       <main className="app-main">
//         {isLoading ? (
//           <div className="loading">Loading cryptocurrency data...</div>
//         ) : error ? (
//           <div className="error-message">
//             <h2>Error</h2>
//             <p>{error}</p>
//             <button onClick={() => window.location.reload()}>Retry</button>
//           </div>
//         ) : (
//           <>
//             <section className="crypto-list-section">
//               <h2>Cryptocurrencies</h2>
//               <CryptoList cryptoData={cryptoData} onSelectCrypto={handleSelectCrypto} />
//             </section>
//             <section className="crypto-chart-section">
//               <h2>Price Chart</h2>
//               {selectedCrypto ? (
//                 <CryptoChart crypto={selectedCrypto} />
//               ) : (
//                 <p>Select a cryptocurrency to view its chart</p>
//               )}
//             </section>
//           </>
//         )}
//       </main>
//       <footer className="app-footer">
//         <p>&copy; 2024 Crypto Tracker. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }

// export default App;