import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [cryptos, setCryptos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    if (!localStorage.getItem('isLoggedIn')) {
      navigate('/');
    }

    // Fetch crypto data
    // In a real app, you'd use an API like CoinGecko
    const mockData = [
      { id: 1, name: 'Bitcoin', symbol: 'BTC', price: 50000 },
      { id: 2, name: 'Ethereum', symbol: 'ETH', price: 3000 },
      { id: 3, name: 'Litecoin', symbol: 'LTC', price: 150 },
    ];
    setCryptos(mockData);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">CryptoWeb Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cryptos.map((crypto) => (
          <div key={crypto.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{crypto.name}</h2>
            <p className="text-gray-600 mb-2">Symbol: {crypto.symbol}</p>
            <p className="text-lg font-bold">${crypto.price.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;