import axios from './Axios';

const API_BASE_URL_TWILIO = import.meta.env.VITE_API_URL_BACKEND;
const API_URL = `${API_BASE_URL_TWILIO}/twilio`;

export const http = axios.create({
  baseURL: API_URL,
  withCredentials: true, // si usás cookies
  headers: {
    "ngrok-skip-browser-warning": "true",   // <-- CLAVE
  },
});


// enviar mensaje a un numero
// src/api/twilioApi.js
export const enviarMensaje = async ({ numero, cliente, equipo }) => {
  try {
    
    const response = await axios.post(`${API_URL}/enviar-mensaje`, {
        numero, 
        cliente,
        equipo
    });
    
    console.log("Respuesta de Twilio:", response);

    return await response.data;

  } catch (error) {
    console.error("❌ Error en enviarMensaje:", error);
    throw error;
  }
};
