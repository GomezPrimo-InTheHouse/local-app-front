// src/api/EstadosApi.jsx
import axios from './Axios';

const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;
const API_URL = `${API_BASE_URL}/estado`;

export const http = axios.create({
  baseURL: API_URL,
  withCredentials: true, // si usás cookies
  headers: {
    "ngrok-skip-browser-warning": "true",   // <-- CLAVE
  },
});
// ✅ Obtener todos los estados
export const getEstados = async () => {
  const { data } = await axios.get(API_URL);
  return data; // [{ id, nombre, descripcion }, ...]
};

// 🔎 Utilidad: obtener el nombre del estado por id (opcional)
export const findEstadoNombre = (estados, estadoId) => {
  const est = estados?.find(e => Number(e.id) === Number(estadoId));
  return est?.nombre ?? "Sin estado";
};


// obtener estado por ambito

export const getEstadoByAmbito = async (ambito) => {
  try {
    const { data } = await axios.get(`${API_URL}/${ambito}`);
    return data; 
  } catch (error) {
    console.error("Error al obtener estado por ambito:", error);
    throw error;
  }
};
