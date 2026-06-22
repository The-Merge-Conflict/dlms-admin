// src/lib/api/axios-client.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Before every request: attach the JWT token from the cookie
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('dlms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// After every response: if the server says 401 (Unauthorized), go to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('dlms_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;