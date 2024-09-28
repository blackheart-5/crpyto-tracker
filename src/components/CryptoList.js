import React from 'react';
import './CryptoList.css';

function CryptoList({ cryptoData, onSelectCrypto, selectedCrypto }) {
  return (
    <div className="crypto-list">
      
      <h2>Top Cryptocurrencies</h2>
      <ul>
        {cryptoData.map((crypto) => (
          <li 
            key={crypto.id} 
            className={selectedCrypto && selectedCrypto.id === crypto.id ? 'selected' : ''}
            onClick={() => onSelectCrypto(crypto)}
          >
            <img src={crypto.image} alt={crypto.name} />
            <span>{crypto.name}</span>
            <span>${crypto.current_price.toFixed(2)}</span>
            <span className={crypto.price_change_percentage_24h > 0 ? 'positive' : 'negative'}>
              {crypto.price_change_percentage_24h.toFixed(2)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CryptoList;