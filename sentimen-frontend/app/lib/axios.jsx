import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000', // Ganti dengan URL basis API Anda
  timeout: 10000, // Batas waktu permintaan (opsional)
  headers: {
        'X-Requested-With': 'XMLHttpRequest',
        // 'Access-Control-Allow-Origin': "*"
    },
});

export default instance;
