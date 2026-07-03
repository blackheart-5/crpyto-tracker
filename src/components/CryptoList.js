import React, { useMemo, useState } from 'react';
import './CryptoList.css';

const formatPrice = (value) => {
  if (value == null) return '—';
  const digits = value < 1 ? 6 : 2;
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
  });
};

const formatPercent = (value) => (value == null ? '—' : `${value.toFixed(2)}%`);

function CryptoList({ cryptoData, onSelectCrypto, selectedCrypto }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cryptoData;
    return cryptoData.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
    );
  }, [cryptoData, query]);

  return (
    <div className="crypto-list">
      <div className="crypto-list__header">
        <h2>Top Cryptocurrencies</h2>
        <input
          type="search"
          className="crypto-list__search"
          placeholder="Search by name or symbol…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search cryptocurrencies"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="crypto-list__empty">No coins match “{query}”.</p>
      ) : (
        <ul>
          {filtered.map((crypto) => {
            const change = crypto.price_change_percentage_24h;
            const isUp = change >= 0;
            return (
              <li
                key={crypto.id}
                className={selectedCrypto?.id === crypto.id ? 'selected' : ''}
                onClick={() => onSelectCrypto(crypto)}
              >
                <img src={crypto.image} alt="" width="28" height="28" />
                <span className="crypto-list__name">
                  {crypto.name}
                  <small>{crypto.symbol.toUpperCase()}</small>
                </span>
                <span className="crypto-list__price">
                  {formatPrice(crypto.current_price)}
                </span>
                <span className={isUp ? 'positive' : 'negative'}>
                  {isUp ? '▲' : '▼'} {formatPercent(Math.abs(change ?? 0))}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default CryptoList;
