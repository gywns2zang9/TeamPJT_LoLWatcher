import axios from 'axios';

const BASE_URL = process.env.REACT_APP_LOLWATCHER_API_URL!;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
});

export default axiosInstance;
