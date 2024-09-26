import axios from 'axios';

const API_URL = 'https://api.coingecko.com/api/v3';

export const fetchCryptoData = async () => {
  try {
    console.log('Fetching crypto data...');
    const response = await axios.get(`${API_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 200,
        page: 1,
        sparkline: false
      }
    });
    console.log('Crypto data fetched successfully');
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto data:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    throw error;
  }
};

// export const fetchCryptoData = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/coins/markets`, {
//       params: {
//         vs_currency: 'usd',
//         order: 'market_cap_desc',
//         per_page: 10,
//         page: 1,
//         sparkline: false
//       },
//       timeout: 10000 // Set a timeout of 10 seconds
//     });
//     return response.data;
//   } catch (error) {
//     if (error.response) {
//       // The request was made and the server responded with a status code
//       // that falls out of the range of 2xx
//       throw new Error(`API Error: ${error.response.status} - ${error.response.data.error}`);
//     } else if (error.request) {
//       // The request was made but no response was received
//       throw new Error('Network Error: No response received from the server. Please check your internet connection.');
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       throw new Error(`Request Error: ${error.message}`);
//     }
//   }
// };






export const fetchCryptoHistory = async (id) => {
  try {
    console.log(`Fetching history for crypto id: ${id}`);
    const response = await axios.get(`${API_URL}/coins/${id}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: 30
      }
    });
    console.log('Crypto history fetched successfully');
    return response.data.prices;
  } catch (error) {
    console.error('Error fetching crypto history:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    throw error;
  }
};



