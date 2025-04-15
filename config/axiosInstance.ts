import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://medical-app-peach.vercel.app/api', // 👈 Set your base URL here
  headers: {
    'Content-Type': 'application/json',
    // Add auth headers if needed, e.g. Authorization: `Bearer ${token}`
  },
  timeout: 10000, // optional: timeout after 10 seconds
});

export default axiosInstance;
