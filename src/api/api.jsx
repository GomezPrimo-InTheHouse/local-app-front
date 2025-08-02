// ../src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:7001/api",
});

export default api;
