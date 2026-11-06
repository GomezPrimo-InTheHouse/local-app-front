// src/api/ServicioApi.jsx
import axios from "./Axios";

const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;
const API_URL = `${API_BASE_URL}/servicio`;
const PRESUPUESTO_URL = `${API_BASE_URL}/presupuesto`;

const unwrap = (res) => res?.data?.data ?? res?.data;
const errorDe = (error, fallback) => error?.response?.data || { success: false, error: fallback };

// ---------- Catálogo ----------
export const getServicios = async ({ incluirInactivos = false } = {}) => {
  try {
    return unwrap(await axios.get(API_URL, { params: incluirInactivos ? { incluirInactivos: true } : {} })) || [];
  } catch (e) { throw errorDe(e, "Error al obtener servicios"); }
};

export const getCategoriasServicio = async () => {
  try { return unwrap(await axios.get(`${API_URL}/categorias`)) || []; }
  catch (e) { throw errorDe(e, "Error al obtener categorías"); }
};

export const createCategoriaServicio = async (nombre) => {
  try { return unwrap(await axios.post(`${API_URL}/categorias`, { nombre })); }
  catch (e) { throw errorDe(e, "Error al crear la categoría"); }
};

export const createServicio = async (servicio) => {
  try { return unwrap(await axios.post(API_URL, servicio)); }
  catch (e) { throw errorDe(e, "Error al crear el servicio"); }
};

export const updateServicio = async (id, cambios) => {
  try { return unwrap(await axios.put(`${API_URL}/${id}`, cambios)); }
  catch (e) { throw errorDe(e, "Error al actualizar el servicio"); }
};

export const aumentarPreciosServicios = async ({ porcentaje, categoria_id = null }) => {
  try { return unwrap(await axios.post(`${API_URL}/aumento-masivo`, { porcentaje, categoria_id })); }
  catch (e) { throw errorDe(e, "Error al aplicar el aumento"); }
};

// ---------- Configuración ----------
export const getConfiguracionServicios = async () => {
  try { return unwrap(await axios.get(`${API_URL}/configuracion`)); }
  catch (e) { throw errorDe(e, "Error al obtener la configuración"); }
};

export const updateConfiguracionServicios = async (cambios) => {
  try { return unwrap(await axios.put(`${API_URL}/configuracion`, cambios)); }
  catch (e) { throw errorDe(e, "Error al guardar la configuración"); }
};

// ---------- Líneas de servicio de un presupuesto ----------
export const getPresupuestoServicios = async (presupuestoId) => {
  try { return unwrap(await axios.get(`${PRESUPUESTO_URL}/${presupuestoId}/servicios`)) || []; }
  catch (e) { throw errorDe(e, "Error al obtener los servicios del presupuesto"); }
};

export const savePresupuestoServicios = async (presupuestoId, lineas) => {
  try { return unwrap(await axios.post(`${PRESUPUESTO_URL}/${presupuestoId}/servicios`, { lineas })); }
  catch (e) { throw errorDe(e, "Error al guardar los servicios del presupuesto"); }
};