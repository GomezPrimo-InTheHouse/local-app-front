// src/api/ProductoApi.jsx
import axios from './Axios';

const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;
const API_URL = `${API_BASE_URL}/producto`;

export const http = axios.create({
  baseURL: API_URL,
  withCredentials: true, // si usás cookies
  headers: {
    "ngrok-skip-browser-warning": "true",   // <-- CLAVE
  },
});

export const getProductos = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const getProductoById = async (id) => {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data;
};

export const createProducto = async (producto) => {
  const { data } = await axios.post(API_URL, producto);
  return data;
};

export const updateProducto = async (id, productoActualizado) => {
  
  const { data } = await axios.put(`${API_URL}/${id}`, productoActualizado);
  return data;
};

export const deleteProducto = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
  return data;
};

export const buscarProductos = async (nombre) => {
  try {
    const res = await fetch(
      `${API_URL}/buscar?nombre=${encodeURIComponent(nombre)}`
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Error buscando productos");
    }
    return data.data; // devuelve el array de productos
  } catch (err) {
    console.error("Error en buscarProductos:", err.message);
    return [];
  }
};


