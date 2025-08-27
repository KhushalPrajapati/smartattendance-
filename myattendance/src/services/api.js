import axios from "axios";

// Change this to match your Django backend URL
const BASE_URL = "http://127.0.0.1:8000/api/";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
