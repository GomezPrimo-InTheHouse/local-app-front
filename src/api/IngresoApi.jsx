import axios from './Axios';

const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;
const API_URL = `${API_BASE_URL}/ingreso`;

export const http = axios.create({
  baseURL: API_URL,
  withCredentials: true, // si usás cookies
  headers: {
    "ngrok-skip-browser-warning": "true",   // <-- CLAVE
  },
});

// Obtener todos los ingresos
export const getIngresos = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// Obtener ingresos por equipo
export const getIngresosByEquipo = async (equipoId) => {
  const res = await axios.get(`${API_URL}/equipo/${equipoId}`);
  return res.data;
};

// Crear nuevo ingreso
export const createIngreso = async (ingreso) => {
  const res = await axios.post(API_URL, ingreso);
  return res.data;
};

// Actualizar ingreso
export const updateIngreso = async (id, ingreso) => {
  const res = await axios.put(`${API_URL}/${id}`, ingreso);
  return res.data;
};

// Eliminar ingreso
export const deleteIngreso = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
