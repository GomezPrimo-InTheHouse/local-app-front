// src/api/ProductoApi.jsx
import axios from "axios";

const API_URL = "http://localhost:7001/producto";

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
