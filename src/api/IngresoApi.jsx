import axios from "axios";

const API_URL = "http://localhost:7001/ingreso";

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
