import axios from "axios";

const API_URL = "http://localhost:7002/twilio";


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
