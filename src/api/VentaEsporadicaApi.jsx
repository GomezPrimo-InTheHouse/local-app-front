// src/api/VentaEsporadicaApi.js
import axios from './Axios';

const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;
const API_URL = `${API_BASE_URL}/venta/esporadica`;

export const createVentaEsporadica = async (payload) => {
  try {
    const { data } = await axios.post(API_URL, payload);
    return data;
  } catch (error) {
    console.error('Error al crear venta esporádica:', error);
    throw error.response?.data || { success: false, error: 'Error al crear venta esporádica.' };
  }
};

export const getVentasEsporadicas = async () => {
  try {
    const { data } = await axios.get(API_URL);
    return data;
  } catch (error) {
    console.error('Error al obtener ventas esporádicas:', error);
    throw error.response?.data || { success: false, error: 'Error al obtener ventas esporádicas.' };
  }
};