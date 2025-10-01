// src/api/EstadosApi.jsx
import axios from "axios";

const API_URL = "http://localhost:7001/estado";

// ✅ Obtener todos los estados
export const getEstados = async () => {
  const { data } = await axios.get(API_URL);
  return data; // [{ id, nombre, descripcion }, ...]
};

// 🔎 Utilidad: obtener el nombre del estado por id (opcional)
export const findEstadoNombre = (estados, estadoId) => {
  const est = estados?.find(e => Number(e.id) === Number(estadoId));
  return est?.nombre ?? "Sin estado";
};


// obtener estado por ambito

export const getEstadoByAmbito = async (ambito) => {
  try {
    const { data } = await axios.get(`${API_URL}/${ambito}`);
    return data; 
  } catch (error) {
    console.error("Error al obtener estado por ambito:", error);
    throw error;
  }
};
