// // src/api/ProductoApi.jsx
// import axios from './Axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;
// const API_URL = `${API_BASE_URL}/producto`;

// export const http = axios.create({
//   baseURL: API_URL,
//   withCredentials: true, // si usás cookies
//   headers: {
//     "ngrok-skip-browser-warning": "true",   // <-- CLAVE
//   },
// });

// export const getProductos = async () => {
//   const { data } = await axios.get(API_URL);
//   return data;
// };

// export const getProductoById = async (id) => {
//   const { data } = await axios.get(`${API_URL}/${id}`);
//   return data;
// };

// export const createProducto = async (producto) => {
//   const { data } = await axios.post(API_URL, producto);
//   return data;
// };

// export const updateProducto = async (id, productoActualizado) => {
  
//   const { data } = await axios.put(`${API_URL}/${id}`, productoActualizado);
//   return data;
// };

// export const deleteProducto = async (id) => {
//   const { data } = await axios.delete(`${API_URL}/${id}`);
//   return data;
// };

// export const buscarProductos = async (nombre) => {
//   try {
//     const res = await fetch(
//       `${API_URL}/buscar?nombre=${encodeURIComponent(nombre)}`
//     );
//     const data = await res.json();
//     if (!res.ok) {
//       throw new Error(data.error || "Error buscando productos");
//     }
//     return data.data; // devuelve el array de productos
//   } catch (err) {
//     console.error("Error en buscarProductos:", err.message);
//     return [];
//   }
// };

// export const getProductosRepuestoByTipoEquipo = async (tipoEquipo) => {
//   const res = await axios.get(
//     `${API_URL}/repuestos`,
//     { params: { tipo_equipo: tipoEquipo || null } }
//   );
//   return res.data?.data || res.data;
// };



// src/api/ProductoApi.jsx
import axios from "./Axios";

const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;
const API_URL = `${API_BASE_URL}/producto`;

// Si más adelante querés usar este http, lo podemos unificar,
// pero por ahora dejamos la lógica como la tenías.
export const http = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

// Helper para armar FormData con todas las características nuevas
const buildProductoFormData = (producto) => {
  const formData = new FormData();

  // Campos básicos
  if (producto.nombre != null) {
    formData.append("nombre", producto.nombre);
  }
  if (producto.stock != null) {
    formData.append("stock", String(producto.stock));
  }
  if (producto.precio != null) {
    formData.append("precio", String(producto.precio));
  }
  if (producto.descripcion != null) {
    formData.append("descripcion", producto.descripcion);
  }
  if (producto.estado_id != null) {
    formData.append("estado_id", String(producto.estado_id));
  }
  if (producto.categoria_id != null) {
    formData.append("categoria_id", String(producto.categoria_id));
  }
  if (producto.costo != null) {
    formData.append("costo", String(producto.costo));
  }

  // ✅ Nuevo: subir_web (boolean)
  // lo mandamos como "true"/"false" para que parseBoolean del backend lo tome bien
  if (producto.subir_web !== undefined && producto.subir_web !== null) {
    formData.append(
      "subir_web",
      producto.subir_web ? "true" : "false"
    );
  }

  // ✅ Nuevo: oferta (numérica, opcional)
  if (
    producto.oferta !== undefined &&
    producto.oferta !== null &&
    producto.oferta !== ""
  ) {
    formData.append("oferta", String(producto.oferta));
  }

  // ✅ Nuevo: foto (File)
  // MUY IMPORTANTE: el string "foto" tiene que coincidir con lo que usaste en Multer:
  //   upload.single("foto")
  if (producto.file) {
    formData.append("foto", producto.file);
  }

  return formData;
};

// ======================
// GETs y DELETE igual que antes
// ======================
export const getProductos = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const getProductoById = async (id) => {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data;
};

// ======================
// CREATE con multipart/form-data
// ======================
export const createProducto = async (producto) => {
  const formData = buildProductoFormData(producto);

  const { data } = await axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });

  return data;
};

// ======================
// UPDATE con multipart/form-data
// ======================
export const updateProducto = async (id, productoActualizado) => {
  const formData = buildProductoFormData(productoActualizado);

  const { data } = await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });

  return data;
};

export const deleteProducto = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
  return data;
};

export const buscarProductos = async (nombre) => {
  try {
    const res = await fetch(
      `${API_URL}/buscar?nombre=${encodeURIComponent(nombre)}`
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Error buscando productos");
    }
    return data.data; // array de productos
  } catch (err) {
    console.error("Error en buscarProductos:", err.message);
    return [];
  }
};

export const getProductosRepuestoByTipoEquipo = async (tipoEquipo) => {
  const res = await axios.get(`${API_URL}/repuestos`, {
    params: { tipo_equipo: tipoEquipo || null },
  });
  return res.data?.data || res.data;
};
