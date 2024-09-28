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
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import CryptoList from './components/CryptoList';
import CryptoChart from './components/CryptoChart';
import Login from './components/Login';
import SignUp from './components/signup.js';
import { fetchCryptoData } from './api/cryptoApi';
import authService from './components/authservice';
import './App.css';

function App() {
  // const [user, setUser] = useState(authService.getCurrentUser());
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

  const handleLogin = (user) => {
    setUser(user);
  };

  const handleSignUp = (user) => {
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
          {user ? (
            <div className='header_nav'>
              <nav>
                <ul>
                  <li><Link to='/dashboard'>Home</Link></li>
                  <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
              </nav>
            </div>
          ) : (
            <div className='header_nav'>
              <nav>
                <ul>
                  <li><Link to='/login'>Login</Link></li>
                  <li><Link to='/signup'>Sign Up</Link></li>
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
                    <p>Welcome, {user.email}!</p>
                    <CryptoList 
                      cryptoData={cryptoData} 
                      onSelectCrypto={setSelectedCrypto}
                      selectedCrypto={selectedCrypto}
                    />
                    <p>Price Tracking for {selectedCrypto.name}!</p>
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