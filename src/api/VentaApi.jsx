// src/api/VentaApi.js
import axios from './Axios';

const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;
const API_URL = `${API_BASE_URL}/venta`;

export const http = axios.create({
  baseURL: API_URL,
  withCredentials: true, // si usás cookies
  headers: {
    "ngrok-skip-browser-warning": "true",   // <-- CLAVE
  },
});

// Crear una nueva venta
export const createVenta = async (ventaData) => {
  console.log("Datos de venta a enviar:", ventaData);
  try {
    const { data } = await axios.post(API_URL, ventaData);
    return data;
  } catch (error) {
    console.error("Error al crear venta:", error);
    throw error.response?.data || { success: false, error: "Error al crear venta" };
  }
};

// Obtener todas las ventas
// export const getVentas = async () => {
//   try {
//     const { data } = await axios.get(API_URL);
//     return data;
//   } catch (error) {
//     console.error("Error al obtener ventas:", error);
//     throw error.response?.data || { success: false, error: "Error al obtener ventas" };
//   }
// };

// Obtener todas las ventas (con soporte de filtro por canal)
export const getVentas = async (canal = "todos") => {
  try {
    // Usamos params de axios para construir el querystring
    const params = {};

    // Solo enviamos el canal si no es "todos"
    if (canal && canal !== "todos") {
      params.canal = canal; // "local" | "web_shop"
    }

    const { data } = await axios.get(API_URL, { params });
    return data;
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    throw (
      error.response?.data || {
        success: false,
        error: "Error al obtener ventas",
      }
    );
  }
};

// Obtener una venta por ID
export const getVentaById = async (id) => {
  try {
    const { data } = await axios.get(`${API_URL}/${id}`);
    return data;
  } catch (error) {
    console.error(`Error al obtener venta con id ${id}:`, error);
    throw error.response?.data || { success: false, error: "Error al obtener venta" };
  }
};

// Modificar una venta
export const updateVenta = async (id, ventaData) => {

  try {
    const { data } = await axios.put(`${API_URL}/${id}`, ventaData);
    return data;
  } catch (error) {
    console.error(`Error al actualizar venta con id ${id}:`, error);
    throw error.response?.data || { success: false, error: "Error al actualizar venta" };
  }
};

// Eliminar una venta
export const deleteVenta = async (id) => {
  try {
    const { data } = await axios.delete(`${API_URL}/${id}`);
    return data;
  } catch (error) {
    console.error(`Error al eliminar venta con id ${id}:`, error);
    throw error.response?.data || { success: false, error: "Error al eliminar venta" };
  }
};
