// src/api/OrdenTrabajoApi.js
import axios from './Axios';

const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;
const API_URL = `${API_BASE_URL}/orden-trabajo`;

// Obtener todas las órdenes de trabajo
export const getOrdenesTrabajo = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

// Obtener orden de trabajo por ID (con equipo + cliente embebido)
export const getOrdenTrabajoById = async (id) => {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data;
};

// Obtener historial de órdenes de un equipo
export const getOrdenesByEquipo = async (equipoId) => {
  const { data } = await axios.get(`${API_URL}/equipo/${equipoId}`);
  return data;
};

// Obtener todas las OTs de todos los equipos de un cliente
export const getOrdenesByCliente = async (clienteId) => {
  const { data } = await axios.get(`${API_URL}/cliente/${clienteId}`);
  return data;
};

// Crear nueva orden de trabajo
// payload: { equipo_id, fecha_ingreso, estado_id, falla_reportada, patron?, password?, diagnostico? }
export const createOrdenTrabajo = async (ordenTrabajo) => {
  const { data } = await axios.post(API_URL, ordenTrabajo);
  return data;
};

// Actualizar orden de trabajo
export const updateOrdenTrabajo = async (id, ordenTrabajo) => {
  const { data } = await axios.put(`${API_URL}/${id}`, ordenTrabajo);
  return data;
};

// Eliminar orden de trabajo
export const deleteOrdenTrabajo = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
  return data;
};