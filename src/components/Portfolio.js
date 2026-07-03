import React, { useMemo, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import portfolioService from './portfolioService';
import './Portfolio.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const usd = (value, digits = 2) =>
  value == null
    ? '—'
    : value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: digits,
      });

const pct = (value) => (value == null ? '—' : `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`);

// Distinct-ish colors for the allocation chart.
const SLICE_COLORS = [
  '#22d3a6', '#0ea5e9', '#a78bfa', '#f472b6', '#fbbf24',
  '#34d399', '#60a5fa', '#f87171', '#fb923c', '#c084fc',
];

function Portfolio({ user, cryptoData }) {
  const email = user?.email;
  const [holdings, setHoldings] = useState(() => portfolioService.getHoldings(email));

  const [coinId, setCoinId] = useState('');
  const [amount, setAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [formError, setFormError] = useState('');

  const coinsById = useMemo(() => {
    const map = new Map();
    cryptoData.forEach((c) => map.set(c.id, c));
    return map;
  }, [cryptoData]);

  const coinOptions = useMemo(
    () => [...cryptoData].sort((a, b) => a.name.localeCompare(b.name)),
    [cryptoData]
  );

  // Enrich each holding with live market data + derived value/P&L.
  const rows = useMemo(() => {
    return holdings
      .map((h) => {
        const coin = coinsById.get(h.coinId);
        if (!coin) return null;
        const value = h.amount * coin.current_price;
        const cost = h.buyPrice != null ? h.amount * h.buyPrice : null;
        const pl = cost != null ? value - cost : null;
        const plPct = cost ? (pl / cost) * 100 : null;
        const change24h = coin.price_change_percentage_24h ?? 0;
        return { ...h, coin, value, cost, pl, plPct, change24h };
      })
      .filter(Boolean)
      .sort((a, b) => b.value - a.value);
  }, [holdings, coinsById]);

  const totals = useMemo(() => {
    const totalValue = rows.reduce((s, r) => s + r.value, 0);
    const totalCost = rows.reduce((s, r) => s + (r.cost ?? 0), 0);
    const hasCost = rows.some((r) => r.cost != null);
    const totalPL = hasCost ? totalValue - totalCost : null;
    const totalPLPct = totalCost > 0 ? (totalPL / totalCost) * 100 : null;

    // Weighted 24h change: compare today's value to yesterday's implied value.
    const prevValue = rows.reduce(
      (s, r) => s + r.value / (1 + r.change24h / 100),
      0
    );
    const change24h = prevValue > 0 ? ((totalValue - prevValue) / prevValue) * 100 : null;

    return { totalValue, totalCost, totalPL, totalPLPct, change24h };
  }, [rows]);

  const chartData = useMemo(() => {
    if (rows.length === 0) return null;
    return {
      labels: rows.map((r) => r.coin.symbol.toUpperCase()),
      datasets: [
        {
          data: rows.map((r) => r.value),
          backgroundColor: rows.map((_, i) => SLICE_COLORS[i % SLICE_COLORS.length]),
          borderColor: '#16213a',
          borderWidth: 2,
        },
      ],
    };
  }, [rows]);

  const handleAdd = (e) => {
    e.preventDefault();
    setFormError('');
    const amt = parseFloat(amount);
    const price = buyPrice.trim() === '' ? null : parseFloat(buyPrice);

    if (!coinId) return setFormError('Pick a coin.');
    if (!Number.isFinite(amt) || amt <= 0) return setFormError('Enter a valid amount.');
    if (price != null && (!Number.isFinite(price) || price < 0))
      return setFormError('Enter a valid buy price, or leave it blank.');

    setHoldings(portfolioService.addHolding(email, { coinId, amount: amt, buyPrice: price }));
    setCoinId('');
    setAmount('');
    setBuyPrice('');
  };

  const handleRemove = (id) => setHoldings(portfolioService.removeHolding(email, id));
  const handleClear = () => {
    if (window.confirm('Remove all holdings from your portfolio?')) {
      setHoldings(portfolioService.clear(email));
    }
  };

  const useCurrentPrice = () => {
    const coin = coinsById.get(coinId);
    if (coin) setBuyPrice(String(coin.current_price));
  };

  return (
    <div className="portfolio">
      <div className="portfolio__head">
        <h1>Your Portfolio</h1>
        {rows.length > 0 && (
          <button className="portfolio__clear" onClick={handleClear}>
            Clear all
          </button>
        )}
      </div>

      {/* Summary metrics */}
      <div className="portfolio__stats">
        <div className="stat">
          <span className="stat__label">Total value</span>
          <span className="stat__value">{usd(totals.totalValue)}</span>
        </div>
        <div className="stat">
          <span className="stat__label">24h change</span>
          <span className={`stat__value ${totals.change24h >= 0 ? 'up' : 'down'}`}>
            {pct(totals.change24h)}
          </span>
        </div>
        <div className="stat">
          <span className="stat__label">Total cost</span>
          <span className="stat__value">
            {totals.totalCost > 0 ? usd(totals.totalCost) : '—'}
          </span>
        </div>
        <div className="stat">
          <span className="stat__label">Profit / loss</span>
          <span
            className={`stat__value ${
              totals.totalPL == null ? '' : totals.totalPL >= 0 ? 'up' : 'down'
            }`}
          >
            {totals.totalPL == null ? '—' : usd(totals.totalPL)}
            {totals.totalPLPct != null && (
              <small> ({pct(totals.totalPLPct)})</small>
            )}
          </span>
        </div>
      </div>

      {/* Add form */}
      <form className="portfolio__form" onSubmit={handleAdd}>
        <div className="field">
          <label htmlFor="pf-coin">Coin</label>
          <select id="pf-coin" value={coinId} onChange={(e) => setCoinId(e.target.value)}>
            <option value="">Select a coin…</option>
            {coinOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.symbol.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="pf-amount">Amount</label>
          <input
            id="pf-amount"
            type="number"
            step="any"
            min="0"
            placeholder="0.5"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="pf-price">
            Buy price <span className="muted">(optional)</span>
          </label>
          <div className="price-input">
            <input
              id="pf-price"
              type="number"
              step="any"
              min="0"
              placeholder="cost per coin"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
            />
            <button type="button" onClick={useCurrentPrice} disabled={!coinId} title="Use current price">
              Now
            </button>
          </div>
        </div>
        <button type="submit" className="portfolio__add">
          Add holding
        </button>
        {formError && <p className="portfolio__error">{formError}</p>}
      </form>

      {rows.length === 0 ? (
        <div className="portfolio__empty">
          <p>No holdings yet.</p>
          <p className="muted">Add a coin above to start tracking your portfolio.</p>
        </div>
      ) : (
        <div className="portfolio__body">
          <div className="portfolio__chart">
            <h3>Allocation</h3>
            <Doughnut
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: '62%',
                plugins: {
                  legend: { position: 'bottom', labels: { color: '#e6edf7' } },
                  tooltip: {
                    callbacks: {
                      label: (ctx) => {
                        const share = totals.totalValue
                          ? (ctx.parsed / totals.totalValue) * 100
                          : 0;
                        return `${ctx.label}: ${usd(ctx.parsed)} (${share.toFixed(1)}%)`;
                      },
                    },
                  },
                },
              }}
            />
          </div>

          <div className="portfolio__table-wrap">
            <table className="portfolio__table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Amount</th>
                  <th>Price</th>
                  <th>Value</th>
                  <th>24h</th>
                  <th>P/L</th>
                  <th aria-label="actions" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.coinId}>
                    <td>
                      <div className="asset">
                        <img src={r.coin.image} alt="" width="24" height="24" />
                        <div>
                          <strong>{r.coin.name}</strong>
                          <small>{r.coin.symbol.toUpperCase()}</small>
                        </div>
                      </div>
                    </td>
                    <td>{r.amount}</td>
                    <td>{usd(r.coin.current_price, r.coin.current_price < 1 ? 6 : 2)}</td>
                    <td>{usd(r.value)}</td>
                    <td className={r.change24h >= 0 ? 'up' : 'down'}>{pct(r.change24h)}</td>
                    <td className={r.pl == null ? '' : r.pl >= 0 ? 'up' : 'down'}>
                      {r.pl == null ? '—' : usd(r.pl)}
                      {r.plPct != null && <small> ({pct(r.plPct)})</small>}
                    </td>
                    <td>
                      <button
                        className="row-remove"
                        onClick={() => handleRemove(r.coinId)}
                        aria-label={`Remove ${r.coin.name}`}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Portfolio;
