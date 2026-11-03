// // src/api/VentaApi.js
// import axios from './Axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;
// const API_URL = `${API_BASE_URL}/venta`;

// export const http = axios.create({
//   baseURL: API_URL,
//   withCredentials: true, // si usás cookies
//   headers: {
//     "ngrok-skip-browser-warning": "true",   // <-- CLAVE
//   },
// });

// // Crear una nueva venta
// export const createVenta = async (ventaData) => {
//   console.log("Datos de venta a enviar:", ventaData);
//   try {
//     const { data } = await axios.post(API_URL, ventaData);
//     return data;
//   } catch (error) {
//     console.error("Error al crear venta:", error);
//     throw error.response?.data || { success: false, error: "Error al crear venta" };
//   }
// };

// // Obtener todas las ventas
// // export const getVentas = async () => {
// //   try {
// //     const { data } = await axios.get(API_URL);
// //     return data;
// //   } catch (error) {
// //     console.error("Error al obtener ventas:", error);
// //     throw error.response?.data || { success: false, error: "Error al obtener ventas" };
// //   }
// // };

// // Obtener todas las ventas (con soporte de filtro por canal)
// export const getVentas = async (canal = "todos") => {
//   try {
//     // Usamos params de axios para construir el querystring
//     const params = {};

//     // Solo enviamos el canal si no es "todos"
//     if (canal && canal !== "todos") {
//       params.canal = canal; // "local" | "web_shop"
//     }

//     const { data } = await axios.get(API_URL, { params });
//     return data;
//   } catch (error) {
//     console.error("Error al obtener ventas:", error);
//     throw (
//       error.response?.data || {
//         success: false,
//         error: "Error al obtener ventas",
//       }
//     );
//   }
// };

// // Obtener una venta por ID
// export const getVentaById = async (id) => {
//   try {
//     const { data } = await axios.get(`${API_URL}/${id}`);
//     return data;
//   } catch (error) {
//     console.error(`Error al obtener venta con id ${id}:`, error);
//     throw error.response?.data || { success: false, error: "Error al obtener venta" };
//   }
// };

// // Modificar una venta
// export const updateVenta = async (id, ventaData) => {

//   try {
//     const { data } = await axios.put(`${API_URL}/${id}`, ventaData);
//     return data;
//   } catch (error) {
//     console.error(`Error al actualizar venta con id ${id}:`, error);
//     throw error.response?.data || { success: false, error: "Error al actualizar venta" };
//   }
// };

// // Eliminar una venta
// export const deleteVenta = async (id) => {
//   try {
//     const { data } = await axios.delete(`${API_URL}/${id}`);
//     return data;
//   } catch (error) {
//     console.error(`Error al eliminar venta con id ${id}:`, error);
//     throw error.response?.data || { success: false, error: "Error al eliminar venta" };
//   }
// };


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

// Registrar un pago en UNA venta (local o web). Queda en el historial de pagos.
// Acepta registrarPagoVenta(id, 5000) o registrarPagoVenta(id, { monto, metodo_pago, observaciones })
export const registrarPagoVenta = async (id, montoOPago) => {
  const body =
    typeof montoOPago === "object" && montoOPago !== null
      ? { ...montoOPago, monto: Number(montoOPago.monto) }
      : { monto: Number(montoOPago) };
  try {
    const { data } = await axios.patch(`${API_URL}/${id}/pago`, body);
    return data;
  } catch (error) {
    console.error(`Error al registrar pago de la venta ${id}:`, error);
    throw error.response?.data || { success: false, error: "Error al registrar el pago" };
  }
};

// Historial de pagos de ventas de un cliente
// → { deuda_total, total_pagado, ventas: [...], pagos: [...] }
export const getPagosVentasCliente = async (clienteId) => {
  try {
    const { data } = await axios.get(`${API_URL}/pagos/cliente/${clienteId}`);
    return data?.data ?? data;
  } catch (error) {
    console.error(`Error al obtener pagos de ventas del cliente ${clienteId}:`, error);
    throw error.response?.data || { success: false, error: "Error al obtener el historial de pagos" };
  }
};

// Pago del cliente repartido entre sus ventas con saldo (la más vieja primero)
export const pagarVentasCliente = async (clienteId, { monto, metodo_pago, observaciones }) => {
  try {
    const { data } = await axios.post(`${API_URL}/pagos/cliente/${clienteId}`, {
      monto: Number(monto),
      metodo_pago,
      observaciones,
    });
    return data;
  } catch (error) {
    console.error(`Error al registrar pago del cliente ${clienteId}:`, error);
    throw error.response?.data || { success: false, error: "Error al registrar el pago" };
  }
};

// Anular un pago (queda en el historial como anulado)
export const anularPagoVenta = async (pagoId, motivo) => {
  try {
    const { data } = await axios.patch(`${API_URL}/pagos/${pagoId}/anular`, { motivo });
    return data;
  } catch (error) {
    console.error(`Error al anular el pago ${pagoId}:`, error);
    throw error.response?.data || { success: false, error: "Error al anular el pago" };
  }
};