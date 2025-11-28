// src/api/CategoriaProductoApi.jsx
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL_BACKEND + "/categoria-producto";

export const getCategoriasProducto = async () => {
  const res = await axios.get(API_URL);
  // debería devolver: [{ id, nombre, descripcion, tipo_equipo, ... }, ...]
  return res.data?.data || res.data; // ajustalo según tu backend
};
