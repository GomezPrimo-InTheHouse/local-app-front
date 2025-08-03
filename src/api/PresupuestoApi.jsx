// src/api/PresupuestoApi.jsx
import axios from "axios";

const API_URL = "http://localhost:7001/presupuesto";

// Obtener todos los presupuestos
export const getPresupuestos = async () => {
  const res = await axios.get(API_URL);
  return res.data; // <- depende de cómo tu backend responde (status/data)
};

// Crear nuevo presupuesto
export const createPresupuesto = async (presupuesto) => {
  const res = await axios.post(API_URL, presupuesto);
  return res.data;
};

// Modificar presupuesto existente
export const updatePresupuesto = async (id, presupuesto) => {
  const res = await axios.put(`${API_URL}/${id}`, presupuesto);
  return res.data;
};

// Eliminar presupuesto
export const deletePresupuesto = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
