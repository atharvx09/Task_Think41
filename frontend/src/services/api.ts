// services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // change if deployed
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
