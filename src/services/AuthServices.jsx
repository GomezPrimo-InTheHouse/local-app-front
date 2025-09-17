// src/services/AuthService.js
import api from "../api/Axios.jsx";
import axios from "axios";


const API_URL =  "http://localhost:7001";

const AuthService = {
  register: async (payload) => {
    // payload: { nombre, email, password, rol, estado_id }
    const resp = await api.post("/auth/register", payload);
    return resp.data;
  },

  login: async ({ email, password, totp }) => {
    // Basic Auth en header + totp en body
    const basic = "Basic " + btoa(`${email}:${password}`);
    const resp = await axios.post(
      `${API_URL}/auth/login`,
      { totp },
      { headers: { Authorization: basic, "Content-Type": "application/json" } }
    );
    return resp.data; // { accessToken, refreshToken }
  },

  logout: async () => {
    // intenta notificar al backend, pero igual limpia localStorage
    try {
      await api.post("/auth/logout");
    } catch (err) {
      // ignore
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("auth_email");
    delete api.defaults.headers.common["Authorization"];
  },

  refreshAccessToken: async (email) => {
    const resp = await axios.post(`${API_URL}/auth/refresh-token`, { email });
    return resp.data; // { accessToken }
  },
};

export default AuthService;
