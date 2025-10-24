// src/api/clienteApi.js
// import axios from "axios";
import axios from "./Axios.jsx" 

const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;
const API_URL = `${API_BASE_URL}/cliente`.replace(/\/$/, "");

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

// 🔹 Obtener todos los clientes
export const getClientes = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// 🔹 Obtener cliente por ID
export const getClienteById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  console.log(res.data)
  return res.data;
};

// 🔹 Crear cliente nuevo
export const createCliente = async (cliente) => {
  const res = await axios.post(API_URL, cliente);
  return res.data;
};

// 🔹 Actualizar cliente existente
export const updateCliente = async (id, cliente) => {
  const res = await axios.put(`${API_URL}/${id}`, cliente);
  return res.data;
};

// 🔹 Eliminar cliente por ID
export const deleteCliente = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
