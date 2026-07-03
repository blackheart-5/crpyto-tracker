import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { fetchCryptoHistory } from '../api/cryptoApi';
import './CryptoChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RANGES = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
];

function CryptoChart({ crypto }) {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    let cancelled = false;

    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const history = await fetchCryptoHistory(crypto.id, days);
        if (cancelled) return;
        const labels = history.map((item) =>
          new Date(item[0]).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })
        );
        const prices = history.map((item) => item[1]);

        setChartData({
          labels,
          datasets: [
            {
              label: `${crypto.name} price (USD)`,
              data: prices,
              borderColor: '#22d3a6',
              backgroundColor: 'rgba(34, 211, 166, 0.15)',
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 4,
              tension: 0.3,
              fill: true,
            },
          ],
        });
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchHistory();
    return () => {
      cancelled = true;
    };
  }, [crypto, days]);

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h2>
          <img src={crypto.image} alt="" width="24" height="24" />
          {crypto.name} price
        </h2>
        <div className="chart-ranges">
          {RANGES.map((r) => (
            <button
              key={r.days}
              className={days === r.days ? 'active' : ''}
              onClick={() => setDays(r.days)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <div className="chart-state">Loading chart…</div>}
      {error && <div className="chart-state chart-state--error">{error}</div>}
      {!isLoading && !error && chartData && (
        <div className="chart-canvas">
          <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) =>
                    ctx.parsed.y.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }),
                },
              },
            },
            scales: {
              x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } },
              y: {
                ticks: {
                  callback: (v) => `$${Number(v).toLocaleString()}`,
                },
              },
            },
          }}
          />
        </div>
      )}
    </div>
  );
}

export default CryptoChart;
