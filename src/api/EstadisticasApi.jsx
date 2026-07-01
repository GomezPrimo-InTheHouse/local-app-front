import axios from './Axios';

const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;
const API_URL = `${API_BASE_URL}/estadisticas`.replace(/\/$/, "");

export const http = axios.create({
  baseURL: API_URL,
  withCredentials: true, // si usás cookies
  headers: {
    "ngrok-skip-browser-warning": "true",   // <-- CLAVE
  },
  params: {
    "ngrok-skip-browser-warning": "true", // <-- CLAVE extra
  },
});

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

//ventas

export const getResumenVentasPorMes = async (mes, anio) => {
    try {
      const params = {};
      if (mes) params.mes = mes;
      if (anio) params.anio = anio;
      
      const response = await axios.get(`${API_URL}/resumen-ventas-mes`, { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener el resumen de ventas por mes:', error);
      throw error;
    }
  }

  // ✅ Obtiene el resumen de ventas por un período dado (GET)
  export const getResumenVentasPorPeriodo = async (fecha_inicio, fecha_fin) => {
    try {
      const response = await axios.get(`${API_URL}/resumen-ventas-periodo`, {
        params: {
          fecha_inicio,
          fecha_fin
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener el resumen de ventas por período:', error);
      throw error;
    }
  }

  // ✅ Obtiene el resumen de cuenta de un cliente específico
   export const getResumenCuentaCliente = async (clienteId) => {
    try {
      const response = await axios.get(`${API_URL}/resumen-cuenta-cliente/${clienteId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el resumen de cuenta del cliente ${clienteId}:`, error);
      throw error;
    }
  }

  // ✅ Obtiene el resumen por período usando un método POST
  export const postResumenPorPeriodo = async (fecha_inicio, fecha_fin) => {
    try {
      const response = await axios.post(`${API_URL}/resumen-por-periodo`, {
        fecha_inicio,
        fecha_fin
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener el resumen por período (POST):', error);
      throw error;
    }
  }

  export const getDatosHistoricos = async () => {
    try {
      const response = await axios.get(`${API_URL}/estadisticas-historicas`);
      return response.data
    } catch (error) {
      console.error('Error al obtener los datos históricos:', error);
      throw error;
    }
  }

