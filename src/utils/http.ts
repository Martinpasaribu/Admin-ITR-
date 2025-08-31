// utils/http.ts
import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:5000/api/v1", // sesuaikan endpoint backend kamu
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default http;
