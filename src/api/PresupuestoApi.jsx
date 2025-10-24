// src/api/PresupuestoApi.jsx
import axios from './Axios';

const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;
const API_URL = `${API_BASE_URL}/presupuesto`;

export const http = axios.create({
  baseURL: API_URL,
  withCredentials: true, // si usás cookies
  headers: {
    "ngrok-skip-browser-warning": "true",   // <-- CLAVE
  },
});

// Obtener todos los presupuestos
export const getPresupuestos = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

// Obtener presupuestos de un equipo
export const getPresupuestosByEquipo = async (equipoId) => {
  const { data } = await axios.get(`${API_URL}/${equipoId}`);
  return data;
};

// Obtener presupuestos por ingreso
export const getPresupuestosByIngreso = async (ingresoId) => {
  const { data } = await axios.get(`${API_URL}/ingreso/${ingresoId}`);
  return data;
};

// Crear presupuesto
export const createPresupuesto = async (nuevoPresupuesto) => {
  const { data } = await axios.post(API_URL, nuevoPresupuesto);
  return data;
};

// Actualizar presupuesto
export const updatePresupuesto = async (id, presupuestoActualizado) => {
  const { data } = await axios.put(`${API_URL}/${id}`, presupuestoActualizado);
  return data;
};

// Eliminar presupuesto
export const deletePresupuesto = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
  return data;
};

// Obtener presupuesto por ID
export const getPresupuestoById = async (id) => {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data;
};

export const getBalancesPresupuestos = async () => {
  const { data } = await axios.get(`${API_URL}/balance`);
  return data;
};

// src/api/PresupuestoAp


