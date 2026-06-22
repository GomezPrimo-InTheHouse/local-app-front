// src/api/EquiposApi.jsx
import axios from './Axios';

const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;
const API_URL = `${API_BASE_URL}/equipo`.replace(/\/$/, "");

export const http = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "ngrok-skip-browser-warning": "true" },
  params:  { "ngrok-skip-browser-warning": "true" },
});

// Obtener todos los equipos
export const getEquipos = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// Obtener equipo por ID
export const getEquipoById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

// Crear equipo nuevo
export const createEquipo = async (equipo) => {
  const res = await axios.post(API_URL, equipo);
  return res.data;
};

// Modificar equipo existente
export const updateEquipo = async (id, equipo) => {
  const res = await axios.put(`${API_URL}/${id}`, equipo);
  return res.data;
};

// Eliminar equipo
export const deleteEquipo = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};

// Obtener equipos por tipo
// La RPC devuelve { status, count, data: [...] }
// Normalizamos para que tenga el mismo formato que getEquipos
export const getEquiposByTipo = async (tipo) => {
  const res  = await axios.get(`${API_URL}/tipo/${tipo}`);
  const rows = res.data?.data || [];
  // Aseguramos que cada fila tenga fecha_ingreso válida como fallback
  return rows.map(eq => ({
    ...eq,
    fecha_ingreso: eq.fecha_ingreso ?? null,
    created_at:    eq.created_at    ?? null,
  }));
};

// Obtener equipos por cliente
// El backend devuelve { status, count, data: [...] } si hay equipos
// o { success: true, message: '...' } si no hay — normalizamos a array siempre
export const getEquiposByClienteId = async (clienteId) => {
  const res = await axios.get(`${API_URL}/cliente/${clienteId}`);
  // Si viene con .data es porque hay equipos; si no, devolvemos array vacío
  const rows = res.data?.data ?? res.data;
  return Array.isArray(rows) ? rows : [];
};
