// lib/api.ts
import { baseURL } from '@/utils/Uri';
import axios from 'axios';

const api = axios.create({
  baseURL: baseURL, // Ganti sesuai base URL backend kamu
  withCredentials: true, // Agar cookie HttpOnly ikut dikirim
});

api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      console.log("Session expired or unauthorized");
    }
    return Promise.reject(err);
  }
);

export default api;
