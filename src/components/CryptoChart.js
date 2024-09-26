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
  Legend
);

function CryptoChart({ crypto }) {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const history = await fetchCryptoHistory(crypto.id);
        const labels = history.map(item => new Date(item[0]).toLocaleDateString());
        const prices = history.map(item => item[1]);

        setChartData({
          labels,
          datasets: [
            {
              label: `${crypto.name} Price`,
              data: prices,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              tension: 0.1
            }
          ]
        });
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch chart data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [crypto]);

  if (isLoading) return <div className="loading">Loading chart...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!chartData) return null;

  return (
    <div className="chart-container">
      <h2>{crypto.name} Price Tracking</h2>
      <Line 
        data={chartData} 
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: `${crypto.name} Price Last 30 Days`
            }
          }
        }} 
      />
    </div>
  );
}

export default CryptoChart;