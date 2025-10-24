// src/api/axios.js
import axios from "axios";



const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;
const API_URL = `${API_BASE_URL}`.replace(/\/$/, "");

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
  params: {
    "ngrok-skip-browser-warning": "true", // <-- CLAVE extra
  },
});

// --- Manejo de refresh en concurrencia ---
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}
function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

// request: si hay accessToken en localStorage lo pone
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && !config.headers["Authorization"]) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// response: si 401 -> intenta refresh (excepto si ya es refresh-token o login)
api.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const originalRequest = error.config;

    // Si no hay respuesta o código distinto a 401 -> propagar
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // No reintentar refresh si ya estamos llamando al endpoint de refresh
    if (originalRequest.url?.includes("/auth/refresh-token")) {
      // Si falló la renovación: limpiar y redirigir a login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("auth_email");
      return Promise.reject(error);
    }

    if (originalRequest._retry) return Promise.reject(error);
    originalRequest._retry = true;

    if (isRefreshing) {
      // Si ya hay un refresh en curso, esperar el nuevo token
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((token) => {
          if (!token) return reject(error);
          originalRequest.headers["Authorization"] = "Bearer " + token;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;
    const email = localStorage.getItem("auth_email");
    try {
      const resp = await axios.post(`${API_URL}/auth/refresh-token`, { email });
      const newAccessToken = resp.data.accessToken;
      // actualizar storage y defaults
      localStorage.setItem("accessToken", newAccessToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
      onRefreshed(newAccessToken);
      return api(originalRequest);
    } catch (refreshError) {
      // no se pudo renovar -> limpiar y forzar login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("auth_email");
      onRefreshed(null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
