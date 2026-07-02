// src/api/CelularApi.jsx
import axios from "./Axios";

const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;
const API_URL = `${API_BASE_URL}/celular`;

// Helper para armar el FormData (mismo criterio que buildProductoFormData)
const buildCelularFormData = (celular) => {
  const formData = new FormData();

  const appendIfDefined = (key, value) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, String(value));
    }
  };

  appendIfDefined("nombre", celular.nombre);
  appendIfDefined("marca", celular.marca);
  appendIfDefined("color", celular.color);
  appendIfDefined("stock", celular.stock);
  appendIfDefined("descripcion", celular.descripcion);
  appendIfDefined("descripcion_web", celular.descripcion_web);
  appendIfDefined("costo_usd", celular.costo_usd);
  appendIfDefined("margen_porcentaje", celular.margen_porcentaje);
  appendIfDefined("ram_gb", celular.ram_gb);
  appendIfDefined("almacenamiento_gb", celular.almacenamiento_gb);
  appendIfDefined("gama", celular.gama);
  appendIfDefined("tipo_entrega", celular.tipo_entrega);
  appendIfDefined("oferta", celular.oferta);
  appendIfDefined("precio", celular.precio); // precio final (recomendado o ajustado a mano)

  if (celular.subir_web !== undefined && celular.subir_web !== null) {
    formData.append("subir_web", celular.subir_web ? "true" : "false");
  }

  // Imágenes: los nombres de campo deben coincidir con el backend ('foto', 'foto2')
  if (celular.file) formData.append("foto", celular.file);
  if (celular.file2) formData.append("foto2", celular.file2);

  return formData;
};

// ======================
// GET listado con filtros (marca, ram_gb, almacenamiento_gb, gama, tipo_entrega)
// ======================
export const getCelulares = async (filtros = {}) => {
  const { data } = await axios.get(API_URL, { params: filtros });
  return data; // { success, data: [...], dolar: {...} }
};

export const getOpcionesFiltroCelulares = async () => {
  const { data } = await axios.get(`${API_URL}/opciones-filtro`);
  return data;
};

export const getCelularById = async (id) => {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data;
};

// ======================
// CREATE con multipart/form-data
// ======================
export const createCelular = async (celular) => {
  const formData = buildCelularFormData(celular);

  const { data } = await axios.post(API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });

  return data;
};

// ======================
// UPDATE con multipart/form-data
// ======================
export const updateCelular = async (id, celularActualizado) => {
  const formData = buildCelularFormData(celularActualizado);

  const { data } = await axios.put(`${API_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });

  return data;
};

export const deleteCelular = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
  return data;
};