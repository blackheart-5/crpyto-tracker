import axios from 'axios';

const API_URL = 'https://api.coingecko.com/api/v3';

const client = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Turn axios errors into human-friendly messages (CoinGecko's free tier
// rate-limits aggressively, so surface that clearly).
const toFriendlyError = (error, fallback) => {
  if (error.response) {
    if (error.response.status === 429) {
      return new Error('Rate limit reached. Please wait a moment and try again.');
    }
    return new Error(`${fallback} (server responded ${error.response.status}).`);
  }
  if (error.request) {
    return new Error('Network error — check your internet connection.');
  }
  return new Error(fallback);
};

export const fetchCryptoData = async () => {
  try {
    const response = await client.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: true,
        price_change_percentage: '24h',
      },
    });
    return response.data;
  } catch (error) {
    throw toFriendlyError(error, 'Failed to fetch cryptocurrency data');
  }
};

export const fetchCryptoHistory = async (id, days = 30) => {
  try {
    const response = await client.get(`/coins/${id}/market_chart`, {
      params: { vs_currency: 'usd', days },
    });
    return response.data.prices;
  } catch (error) {
    throw toFriendlyError(error, 'Failed to fetch price history');
  }
};
