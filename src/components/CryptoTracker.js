import React from 'react';

const CryptoTracker = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Symbol</th>
            <th className="py-2 px-4 text-left">Price</th>
            <th className="py-2 px-4 text-left">24h Change</th>
          </tr>
        </thead>
        <tbody>
          {data.map((coin) => (
            <tr key={coin.id} className="border-b">
              <td className="py-2 px-4">{coin.name}</td>
              <td className="py-2 px-4">{coin.symbol.toUpperCase()}</td>
              <td className="py-2 px-4">${coin.current_price.toFixed(2)}</td>
              <td className={`py-2 px-4 ${coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTracker;