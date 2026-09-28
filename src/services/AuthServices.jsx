// // src/services/AuthService.js
// import api from "../api/Axios.jsx";
// import axios from "axios";


// const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;
// const API_URL = `${API_BASE_URL}`.replace(/\/$/, "");

// const AuthService = {
//   register: async (payload) => {
//     // payload: { nombre, email, password, rol, estado_id }
//     const resp = await api.post("/auth/register", payload);
//     return resp.data;
//   },

//   login: async ({ email, password, totp }) => {
//     // Basic Auth en header + totp en body
//     const basic = "Basic " + btoa(`${email}:${password}`);
//     const resp = await axios.post(
//       `${API_URL}/auth/login`,
//       { totp },
//       { headers: { Authorization: basic, "Content-Type": "application/json" } }
//     );
//     return resp.data; // { accessToken, refreshToken }
//   },

//   logout: async () => {
//     // intenta notificar al backend, pero igual limpia localStorage
//     try {
//       const email = localStorage.getItem("auth_email");
//       await axios.post(`${API_URL}/auth/logout`, { email });
//     } catch (err) {
//       // ignore
//     }
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("auth_email");
//     delete api.defaults.headers.common["Authorization"];
//   },

//   refreshAccessToken: async (email) => {
//     const resp = await axios.post(`${API_URL}/auth/refresh-token`, { email });
//     return resp.data; 
//   },
// };

// export default AuthService;


// src/services/AuthService.js
import api from "../api/Axios.jsx";
import axios from "axios";


const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;
const API_URL = `${API_BASE_URL}`.replace(/\/$/, "");

const AuthService = {
  register: async (payload) => {
    // payload: { nombre, email, password, rol }  rol: 'admin' | 'tecnico' (requiere token de admin)
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
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await axios.post(`${API_URL}/auth/logout`, { refreshToken });
      }
    } catch (err) {
      // ignore
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("auth_email");
    delete api.defaults.headers.common["Authorization"];
  },

  refreshAccessToken: async (refreshToken) => {
    const resp = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
    return resp.data; 
  },
};

export default AuthService;