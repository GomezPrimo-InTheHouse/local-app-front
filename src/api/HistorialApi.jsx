// import axios from './Axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;
// const API_URL = `${API_BASE_URL}/historial`;

// export const http = axios.create({
//   baseURL: API_URL,
//   withCredentials: true, // si usás cookies
//   headers: {
//     "ngrok-skip-browser-warning": "true",   // <-- CLAVE
//   },
// });

// // historial de equipo
// export const getHistorialEquipo = async (equipoId) => {
//   const res = await axios.get(`${API_URL}/equipo/${equipoId}`);
//   return res.data || [];
// };

// export const getHistorialCliente = async (clienteId) => {
//   const res = await axios.get(`${API_URL}/cliente/${clienteId}`);
//   return res.data || [];
// }

import axios from './Axios';

const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;
const API_URL = `${API_BASE_URL}/historial`;

export const http = axios.create({
  baseURL: API_URL,
  withCredentials: true, // si usás cookies
  headers: {
    "ngrok-skip-browser-warning": "true",   // <-- CLAVE
  },
});

// historial de equipo
export const getHistorialEquipo = async (equipoId) => {
  const res = await axios.get(`${API_URL}/equipo/${equipoId}`);
  return res.data || [];
};

export const getHistorialCliente = async (clienteId) => {
  const res = await axios.get(`${API_URL}/cliente/${clienteId}`);
  return res.data || [];
}

// balance (reparaciones + ventas) de todos los clientes en una sola llamada
export const getResumenBalanceClientes = async () => {
  const res = await axios.get(`${API_URL}/resumen-clientes`);
  return res.data || [];
};

// ventas (local y web) de un cliente
export const getVentasCliente = async (clienteId) => {
  const res = await axios.get(`${API_URL}/cliente/${clienteId}/ventas`);
  return res.data || [];
};