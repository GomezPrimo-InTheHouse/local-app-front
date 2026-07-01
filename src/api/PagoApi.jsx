// // src/api/PagoApi.jsx
// import axios from './Axios'; // Se asume que este es el axios configurado


// const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;
// const API_URL = `${API_BASE_URL}/pago`;

// /**
//  * Obtiene el historial completo de equipos, presupuestos y pagos de un cliente.
//  * Endpoint: GET /pago/cliente/:clienteId
//  * @param {number} clienteId
//  * @returns {Promise<Array>} Lista de equipos con detalles de presupuesto y pagos.
//  */
// export const getPagosCliente = async (clienteId) => {
//     try {
//         const response = await axios.get(`${API_URL}/cliente/${clienteId}`);
//         // Se espera que la respuesta sea un array con la estructura anidada
//         return response.data;
//     } catch (error) {
//         console.error("Error al obtener historial de pagos:", error);
//         // Lanzar el error para que el frontend lo maneje
//         throw error; 
//     }
// };

// /**
//  * Registra un nuevo abono (pago o ajuste) contra un presupuesto.
//  * Endpoint: POST /pago/abono
//  * @param {object} pagoData - Debe incluir: presupuesto_id, monto, metodo_pago, [observaciones]
//  */
// export const createPagoAbono = async (pagoData) => {
//     try {
//         // Enviar la data del pago. El backend debe manejar el cálculo del saldo.
//         const response = await axios.post(`${API_URL}/abono`, pagoData);
//         return response.data;
//     } catch (error) {
//         console.error("Error al registrar el abono:", error);
//         // Lanzar el error para que el frontend pueda mostrar una alerta.
//         throw error;
//     }
// };

// src/api/PagoApi.jsx
import axios from './Axios';

const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;
const API_URL      = `${API_BASE_URL}/pago`;

/**
 * Historial completo de pagos de un cliente.
 * GET /pago/cliente/:clienteId
 */
export const getPagosCliente = async (clienteId) => {
  try {
    const response = await axios.get(`${API_URL}/cliente/${clienteId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener historial de pagos:", error);
    throw error;
  }
};

/**
 * Registra un abono vinculado a una orden de trabajo.
 * POST /pago/abono
 * pagoData debe incluir: { orden_trabajo_id, monto, metodo_pago, observaciones? }
 */
export const createPagoAbono = async (pagoData) => {
  try {
    const response = await axios.post(`${API_URL}/abono`, pagoData);
    return response.data;
  } catch (error) {
    console.error("Error al registrar el abono:", error);
    throw error;
  }
};

/**
 * Actualiza un abono existente.
 * PUT /pago/abono/:id
 */
export const updatePagoAbono = async (id, pagoData) => {
  try {
    const response = await axios.put(`${API_URL}/abono/${id}`, pagoData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el abono:", error);
    throw error;
  }
};