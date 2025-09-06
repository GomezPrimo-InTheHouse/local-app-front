import axios from 'axios';

const API_URL = 'http://localhost:7001/historial';

// historial de equipo
export const getHistorialEquipo = async (equipoId) => {
  const res = await axios.get(`${API_URL}/equipo/${equipoId}`);
  return res.data || [];
};