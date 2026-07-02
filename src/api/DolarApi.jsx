// src/api/DolarApi.jsx
import axios from "./Axios";

const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;
const API_URL = `${API_BASE_URL}/dolar`;

// GET /dolar/actual — devuelve la cotización de hoy (fetch automático si no existe)
export const getCotizacionActual = async () => {
  const { data } = await axios.get(`${API_URL}/actual`);
  return data; // { success, data: { valor, fuente, fecha } }
};

// POST /dolar/manual — override manual del valor de hoy
export const setCotizacionManual = async (valor) => {
  const { data } = await axios.post(`${API_URL}/manual`, { valor });
  return data;
};