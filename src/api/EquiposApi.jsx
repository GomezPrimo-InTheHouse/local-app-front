// src/api/equipoApi.js
import axios from './Axios';

const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;
const API_URL = `${API_BASE_URL}/equipo`.replace(/\/$/, "");

export const http = axios.create({
  baseURL: API_URL,
  withCredentials: true, // si usás cookies
  headers: {
    "ngrok-skip-browser-warning": "true",   // <-- CLAVE
  },
  params: {
    "ngrok-skip-browser-warning": "true", // <-- CLAVE extra
  },
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

export const deleteEquipo = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};


export const getEquiposByTipo = async (tipo) => {
  const res = await axios.get(`${API_URL}/tipo/${tipo}`);
  return res.data?.data || []; // Aseguramos que siempre sea un array
};

export const getEquiposByClienteId = async (clienteId) => {
  const res = await axios.get(`${API_URL}/cliente/${clienteId}`);
  return res.data?.data; 
};



