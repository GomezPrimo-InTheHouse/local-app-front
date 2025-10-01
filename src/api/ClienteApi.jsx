// src/api/clienteApi.js
import axios from "axios";

const API_URL = "http://localhost:7001/cliente";

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
