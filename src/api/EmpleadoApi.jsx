// src/api/EmpleadoApi.jsx — gestión de empleados (solo admin)
import axios from "./Axios";

const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;
const API_URL = `${API_BASE_URL}/empleado`;

const errorDe = (e, fallback) => new Error(e?.response?.data?.error || e?.response?.data?.msg || fallback);

export const getEmpleados = async () => {
  try { return (await axios.get(API_URL)).data; }
  catch (e) { throw errorDe(e, "Error al obtener empleados"); }
};

// { nombre, email, password, modulos[] } → { data, qrCodeDataURL }
export const createEmpleado = async (empleado) => {
  try { return (await axios.post(API_URL, empleado)).data; }
  catch (e) { throw errorDe(e, "Error al crear el empleado"); }
};

// { nombre?, email?, modulos? }
export const updateEmpleado = async (id, cambios) => {
  try { return (await axios.put(`${API_URL}/${id}`, cambios)).data; }
  catch (e) { throw errorDe(e, "Error al actualizar el empleado"); }
};

export const resetPasswordEmpleado = async (id, password) => {
  try { return (await axios.post(`${API_URL}/${id}/reset-password`, { password })).data; }
  catch (e) { throw errorDe(e, "Error al restablecer la contraseña"); }
};

// → { qrCodeDataURL }
export const resetTotpEmpleado = async (id) => {
  try { return (await axios.post(`${API_URL}/${id}/reset-totp`)).data; }
  catch (e) { throw errorDe(e, "Error al restablecer el código TOTP"); }
};

export const bajaEmpleado = async (id) => {
  try { return (await axios.post(`${API_URL}/${id}/baja`)).data; }
  catch (e) { throw errorDe(e, "Error al dar de baja el empleado"); }
};

export const reactivarEmpleado = async (id) => {
  try { return (await axios.post(`${API_URL}/${id}/reactivar`)).data; }
  catch (e) { throw errorDe(e, "Error al reactivar el empleado"); }
};
