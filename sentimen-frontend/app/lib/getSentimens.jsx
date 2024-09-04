import axios from './axios';

const fetchData = async () => {
  try {
    const response = await axios.get('/api/data'); // Contoh permintaan GET ke '/api/data'
    return response.json()
  } catch (error) {
    throw new Error(`failed to fetch call center data:${error}`)
  }
};

fetchData();
