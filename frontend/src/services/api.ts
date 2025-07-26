// services/api.ts
import axios from "axios";
// api.ts (update)
const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const api = axios.create({
  baseURL: "http://localhost:5000/api", // change if deployed
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
