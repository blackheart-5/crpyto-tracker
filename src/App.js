// import React, { useState, useEffect } from 'react';
// // import ReactDOM from 'react-dom'
// import CryptoList from './components/CryptoList';
// import CryptoChart from './components/CryptoChart';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { fetchCryptoData } from './api/cryptoApi';
// import './App.css';


// function App() {
//   // const [user, setUser] = useState(null);
//   const [cryptoData, setCryptoData] = useState([]);
//   const [selectedCrypto, setSelectedCrypto] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);
//         const data = await fetchCryptoData();
//         setCryptoData(data);
//         if (data.length > 0) {
//           setSelectedCrypto(data[0]);
//         }
//         setIsLoading(false);
//       } catch (err) {
//         console.error('Error in fetchData:', err);
//         setError(`Failed to fetch crypto data: ${err.message}`);
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//     const interval = setInterval(fetchData, 600000000); // Refresh every minute
//     return () => clearInterval(interval);
//   }, []);

//   if (isLoading) return <div className="loading">Loading...</div>;
//   if (error) return <div className="error">{error}</div>;
//   // const handleLogin = (email) => {
//   //   setUser({ email });
//   // };

//   // if (!user) {
//   //   return <Login onLogin={handleLogin} />;
//   // }




//   // return (
//   //   <div className="container mx-auto px-4">
//   //     <h1 className="text-3xl font-bold my-4">Crypto Tracker</h1>
//   //     <p className="mb-4">Welcome, {user.email}!</p>
//   //     {error && <div className="text-red-500 mb-4">{error}</div>}
//   //     <CryptoTracker data={cryptoData} />
//   //   </div>
//   // );




//   return (
//     <div className="App">

//       <header className="App-header">
//         <h1>CryptoTracker</h1>
//         <div className='header_nav'>
//           <nav>
//             <ul>
//               <td>
//                 <tr> <a href='#home'>Home</a>  </tr>
//               </td>
//               <td>
//                 <tr> <a href='#home'>Login</a>  </tr>
//               </td>
//               <td>
//                 <tr> <a href='#home'>Keeptrack</a>  </tr>
//               </td>
//             </ul>
//           </nav>
//         </div>
//       </header>


//       <main className="App-main">
//         <p> Welcome!! Today would be different. </p>
//         <CryptoList 
//           cryptoData={cryptoData} 
//           onSelectCrypto={setSelectedCrypto}
//           selectedCrypto={selectedCrypto}
//         />
//         {selectedCrypto && (
//           <CryptoChart 
//             crypto={selectedCrypto}
//           />
//         )}
//       </main>

//       <footer className="footer">
//         <p>&copy; 2023 CryptoCurrencyTracker. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CryptoList from './components/CryptoList';
import CryptoChart from './components/CryptoChart';
import Login from './components/Login';
import { fetchCryptoData } from './api/cryptoApi';
import authService from './components/authservice';
import './App.css';

function App() {
  const [user, setUser] = useState(authService.getCurrentUser());
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

    if (user) {
      fetchData();
      const interval = setInterval(fetchData, 600000); // Refresh every 10 minutes
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogin = (user) => {
    setUser(user);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>CryptoTracker</h1>
          {user && (
            <div className='header_nav'>
              <nav>
                <ul>
                  <li><a href='/dashboard'>Home</a></li>
                  <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
              </nav>
            </div>
          )}
        </header>

        <main className="App-main">
          <Routes>
            <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
            <Route 
              path="/dashboard" 
              element={
                user ? (
                  <>
                    <p>Welcome, {user.email}!</p>
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
          <p>&copy; 2023 CryptoCurrencyTracker. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;