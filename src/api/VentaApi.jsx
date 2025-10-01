// src/api/VentaApi.js
import axios from "axios";

const API_URL = "http://localhost:7001/venta"; // tu endpoint base

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
export const getVentas = async () => {
  try {
    const { data } = await axios.get(API_URL);
    return data;
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    throw error.response?.data || { success: false, error: "Error al obtener ventas" };
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
