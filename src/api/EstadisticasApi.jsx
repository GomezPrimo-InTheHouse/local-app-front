import axios from 'axios';

const API_URL = 'http://localhost:7001/estadisticas';

export const getTrabajosDelMes = async (mes, anio) => {
  try {
    const res = await axios.get(`${API_URL}/trabajos-mes`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener trabajos del mes:", error);
    throw error;
  }
};

// 🔹 Obtener clientes frecuentes
export const getClientesFrecuentes = async (mes, anio) => {
  try {
    const res = await axios.get(`${API_URL}/clientes-frecuentes`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener clientes frecuentes:", error);
    throw error;
  }
};

// 🔹 Obtener reparaciones más comunes
export const getReparacionesComunes = async (mes, anio) => {
  try {
    const res = await axios.get(`${API_URL}/reparaciones-comunes`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener reparaciones comunes:", error);
    throw error;
  }
};

// 🔹 Obtener equipos más comunes
export const getEquiposComunes = async (mes, anio) => {
  try {
    const res = await axios.get(`${API_URL}/equipos-comunes`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener equipos comunes:", error);
    throw error;
  }
};

// 🔹 Obtener resumen general del mes (costos, facturación, balance)
// export const getResumenPorMes = async (mes, anio) => {
//   try {
//     const res = await axios.get(`${API_URL}/resumen-mes`, {
//       params: { mes, anio },
//     });
//     return res.data;
//   } catch (error) {
//     console.error("Error al obtener resumen por mes:", error);
//     throw error;
//   }
// };
export const getResumenPorMes = async (mes, anio) => {
  try {
    if (!mes) throw new Error("El parámetro 'mes' es obligatorio");
    
    const res = await axios.get(`${API_URL}/resumen-mes`, {
      params: { 
        mes: Number(mes), 
        anio: anio ? Number(anio) : new Date().getFullYear() 
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error al obtener resumen por mes:", error);
    throw error;
  }
};