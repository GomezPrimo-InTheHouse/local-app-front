// src/api/equipoApi.js
import axios from 'axios';

const API_URL = 'http://localhost:7001/equipo';

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
  return res.data?.data; // Dependiendo de tu backend: { status, data }
};



