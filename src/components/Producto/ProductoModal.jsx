// // src/components/productos/ProductoModal.jsx
// import { useEffect, useState } from "react";
// import { getEstadoByAmbito } from "../../api/EstadoApi.jsx"; // opcional: para cargar estados de producto

// const ProductoModal = ({ isOpen, onClose, onSave, producto = null }) => {
//   const [form, setForm] = useState({
//     nombre: "",
//     stock: "",
//     precio: "",
//     descripcion: "",
//     estado_id: "",
//     categoria: "",
//     costo: ""
//   });

//   const [estados, setEstados] = useState([]);
//   const [focused, setFocused] = useState({ stock: false, precio: false, costo: false });

//   // Cargar estados (si los querés en el select)
//   useEffect(() => {
//     if (!isOpen) return;
//     (async () => {
//       try {
//         const lista = await getEstadoByAmbito('producto'); // asume getEstados retorna array
//         setEstados(lista || []);
//       } catch (e) {
//         console.error("No se pudieron cargar estados:", e);
//       }
//     })();
//   }, [isOpen]);

//   // Inicializa/Resetea el formulario cuando se abre/cierra o cambia producto
//   useEffect(() => {
//     if (!isOpen) {
//       // reset
//       setForm({
//         nombre: "",
//         stock: "",
//         precio: "",
//         descripcion: "",
//         estado_id: "",
//         categoria: "",
//         costo: ""
//       });
//       setFocused({ stock: false, precio: false });
//       return;
//     }

//     if (producto) {
//       // cargar datos del producto (modo edición)
//       setForm({
//         nombre: producto.nombre ?? "",
//         stock: producto.stock != null ? String(producto.stock) : "",
//         // aseguramos que precio venga como string con punto decimal si corresponde
//         precio:
//           producto.precio != null
//             ? String(producto.precio).replace(",", ".")
//             : "",
//         descripcion: producto.descripcion ?? "",
//         estado_id:
//           producto.estado_id != null ? String(producto.estado_id) : "",
//         categoria: producto.categoria ?? "",
//         costo: producto.costo != null ? String(producto.costo).replace(",", ".") : ""
//       });
//     } else {
//       // nuevo producto: valores vacíos
//       setForm({
//         nombre: "",
//         stock: "",
//         precio: "",
//         descripcion: "",
//         estado_id: "",
//         categoria: "",
//         costo: ""
//       });
//     }
//   }, [isOpen, producto]);

//   // ---------- Helpers de sanitización / formateo ----------
//   const sanitizeIntegerInput = (val) => {
//     if (!val) return "";
//     // quitar todo lo que no sea dígito
//     let v = String(val).replace(/\D+/g, "");
//     // quitar ceros a la izquierda (no dejar "0" inicial)
//     v = v.replace(/^0+(?=\d)/, "");
//     return v;
//   };

//   const sanitizeDecimalInput = (val) => {
//     if (!val) return "";
//     // permitir dígitos y un único punto decimal
//     let v = String(val).replace(/,/g, "."); // normalizar comas a punto
//     // quitar todo lo que no sea dígito o punto
//     v = v.replace(/[^0-9.]/g, "");
//     // dejar un solo punto
//     const parts = v.split(".");
//     if (parts.length > 1) {
//       v = parts[0] + "." + parts.slice(1).join("");
//     }
//     // evitar ceros a la izquierda en la parte entera (pero permitir "0" si es 0.x)
//     v = v.replace(/^0+(?=\d)/, "");
//     return v;
//   };

//   const formatIntegerDisplay = (val) => {
//     if (!val && val !== 0) return "";
//     const n = Number(val);
//     if (isNaN(n)) return "";
//     return new Intl.NumberFormat("es-AR").format(n);
//   };

//   const formatDecimalDisplay = (val) => {
//     if (val === "" || val == null) return "";
//     const n = Number(val);
//     if (isNaN(n)) return "";
//     // si tiene parte decimal preservamos la cantidad de decimales que tiene el input
//     const decimals = String(val).includes(".") ? String(val).split(".")[1].length : 0;
//     return new Intl.NumberFormat("es-AR", {
//       minimumFractionDigits: decimals,
//       maximumFractionDigits: decimals,
//     }).format(n);
//   };

//   // ---------- Handlers ----------
//   const handleTextChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleStockChange = (rawValue) => {
//     const s = sanitizeIntegerInput(rawValue);
//     setForm((prev) => ({ ...prev, stock: s }));
//   };

//   const handlePrecioChange = (rawValue) => {
//     const s = sanitizeDecimalInput(rawValue);
//     setForm((prev) => ({ ...prev, precio: s }));
//   };

//   const handleCostoChange = (rawValue) => {
//     const s = sanitizeDecimalInput(rawValue);
//     setForm((prev) => ({ ...prev, costo: s }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // validaciones mínimas
//     if (!form.nombre.trim()) {
//       alert("El nombre es obligatorio.");
//       return;
//     }
//     if (form.precio === "" || isNaN(Number(form.precio))) {
//       alert("El precio es obligatorio y debe ser numérico.");
//       return;
//     }

//     //armo el payload para enviar al padre

//     //costo es un valor de tipo decimal
//     const payload = {
//       nombre: form.nombre.trim(),
//       stock: form.stock ? parseInt(form.stock, 10) : 0,
//       precio: form.precio ? parseFloat(form.precio) : 0,
//       descripcion: form.descripcion.trim(),
//       estado_id: form.estado_id ? Number(form.estado_id) : null,
//       categoria: form.categoria.trim(),
//       costo: form.costo ? parseFloat(form.costo) : 0,
//     };

//     // entregamos payload al padre (que realizará create/update)
//     onSave && onSave(payload);
//     onClose && onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
//       <div className="w-full max-w-xl bg-neutral-900 text-white rounded-2xl shadow-2xl border border-gray-800 overflow-auto">
//         <div className="px-6 py-5 border-b border-gray-800">
//           <h2 className="text-xl font-semibold text-white">
//             {producto ? "Editar Producto" : "Nuevo Producto"}
//           </h2>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           {/* Nombre */}
//           <div>
//             <label className="block text-sm text-gray-300 mb-1">Nombre *</label>
//             <input
//               name="nombre"
//               value={form.nombre}
//               onChange={handleTextChange}
//               className="w-full bg-neutral-800 text-white p-2 rounded border border-gray-700 focus:outline-none focus:ring-0"
//               placeholder="Nombre del producto"
//               required
//             />
//           </div>
//           {/* Categoría */}
//           <div>
//             <label className="block text-sm text-gray-300 mb-1">Categoría</label>
//             <input
//               name="categoria"
//               value={form.categoria}
//               onChange={handleTextChange}
//               className="w-full bg-neutral-800 text-white p-2 rounded border border-gray-700 focus:outline-none focus:ring-0"
//               placeholder="Categoría del producto (opcional)"
//             />
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             {/* Stock */}
//             <div>
//               <label className="block text-sm text-gray-300 mb-1">Stock</label>
//               <input
//                 type="text"
//                 inputMode="numeric"
//                 value={focused.stock ? form.stock : formatIntegerDisplay(form.stock)}
//                 onFocus={() => setFocused((f) => ({ ...f, stock: true }))}
//                 onBlur={() => setFocused((f) => ({ ...f, stock: false }))}
//                 onChange={(e) => handleStockChange(e.target.value)}
//                 placeholder="0"
//                 className="w-full bg-neutral-800 text-white p-2 rounded border border-gray-700 focus:outline-none"
//               />
//             </div>
//             {/* Costo */}
//             <div>
//               <label className="block text-sm text-gray-300 mb-1">Costo</label>
//               <input
//                 type="text"
//                 inputMode="decimal"
//                 value={focused.costo ? form.costo : formatDecimalDisplay(form.costo)}
//                 onFocus={() => setFocused((f) => ({ ...f, costo: true }))}
//                 onBlur={() => setFocused((f) => ({ ...f, costo: false }))}
//                 onChange={(e) => handleCostoChange(e.target.value)}
//                 placeholder="0.00"
//                 className="w-full bg-neutral-800 text-white p-2 rounded border border-gray-700 focus:outline-none"
//                 required
//               />
//             </div>

//             {/* Precio */}
//             <div>
//               <label className="block text-sm text-gray-300 mb-1">Precio *</label>
//               <input
//                 type="text"
//                 inputMode="decimal"
//                 value={focused.precio ? form.precio : formatDecimalDisplay(form.precio)}
//                 onFocus={() => setFocused((f) => ({ ...f, precio: true }))}
//                 onBlur={() => setFocused((f) => ({ ...f, precio: false }))}
//                 onChange={(e) => handlePrecioChange(e.target.value)}
//                 placeholder="0.00"
//                 className="w-full bg-neutral-800 text-white p-2 rounded border border-gray-700 focus:outline-none"
//                 required
//               />
//             </div>
//           </div>

//           {/* Descripción */}
//           <div>
//             <label className="block text-sm text-gray-300 mb-1">Descripción</label>
//             <textarea
//               name="descripcion"
//               value={form.descripcion}
//               onChange={handleTextChange}
//               rows={3}
//               className="w-full bg-neutral-800 text-white p-2 rounded border border-gray-700 focus:outline-none"
//               placeholder="Detalles / observaciones (opcional)"
//             />
//           </div>

//           {/* Estado (si quieres) */}
//           <div>
//             <label className="block text-sm text-gray-300 mb-1">Estado</label>
//             <select
//               name="estado_id"
//               value={form.estado_id}
//               onChange={handleTextChange}
//               className="w-full bg-neutral-800 text-white p-2 rounded border border-gray-700 focus:outline-none"
//             >
//               <option value="">-- Seleccionar estado --</option>
//               {estados.map((s) => (
//                 <option key={s.id} value={s.id}>
//                   {s.nombre}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Botones */}
//           <div className="flex justify-end gap-3 mt-4">
//             <button
//               type="button"
//               onClick={() => {
//                 onClose && onClose();
//               }}
//               className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-white font-semibold"
//             >
//               Cancelar
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white font-bold"
//             >
//               Guardar
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProductoModal;

// src/components/productos/ProductoModal.jsx
// import { useEffect, useState } from "react";
// import { getEstadoByAmbito } from "../../api/EstadoApi.jsx";
// import { getCategoriasProducto } from "../../api/CategoriaProductoApi.jsx"; // 👈 nuevo import

// const ProductoModal = ({ isOpen, onClose, onSave, producto = null }) => {
//   const [form, setForm] = useState({
//     nombre: "",
//     stock: "",
//     precio: "",
//     descripcion: "",
//     estado_id: "",
//     categoria_id: "",   // 👈 ahora usamos categoria_id, no texto libre
//     costo: "",
//   });

//   const [estados, setEstados] = useState([]);
//   const [categorias, setCategorias] = useState([]);
//   const [loadingCategorias, setLoadingCategorias] = useState(false);
//   const [focused, setFocused] = useState({
//     stock: false,
//     precio: false,
//     costo: false,
//   });

//   // ==========================
//   // Cargar estados (ámbito: producto)
//   // ==========================
//   useEffect(() => {
//     if (!isOpen) return;
//     (async () => {
//       try {
//         const lista = await getEstadoByAmbito("producto");
//         setEstados(lista || []);
//       } catch (e) {
//         console.error("No se pudieron cargar estados:", e);
//       }
//     })();
//   }, [isOpen]);

//   // ==========================
//   // Cargar categorías centralizadas
//   // ==========================
//   useEffect(() => {
//     if (!isOpen) return;
//     (async () => {
//       try {
//         setLoadingCategorias(true);
//         const lista = await getCategoriasProducto(); // 👈 debe devolver [{id, nombre, descripcion, tipo_equipo}, ...]
//         setCategorias(lista || []);
//       } catch (e) {
//         console.error("No se pudieron cargar categorías de producto:", e);
//       } finally {
//         setLoadingCategorias(false);
//       }
//     })();
//   }, [isOpen]);

//   // ==========================
//   // Inicializa / resetea el formulario
//   // ==========================
//   useEffect(() => {
//     if (!isOpen) {
//       // reset completo
//       setForm({
//         nombre: "",
//         stock: "",
//         precio: "",
//         descripcion: "",
//         estado_id: "",
//         categoria_id: "",
//         costo: "",
//       });
//       setFocused({ stock: false, precio: false, costo: false });
//       return;
//     }

//     if (producto) {
//       // 👇 Modo edición
//       setForm({
//         nombre: producto.nombre ?? "",
//         stock: producto.stock != null ? String(producto.stock) : "",
//         precio:
//           producto.precio != null
//             ? String(producto.precio).replace(",", ".")
//             : "",
//         descripcion: producto.descripcion ?? "",
//         estado_id:
//           producto.estado_id != null ? String(producto.estado_id) : "",
//         categoria_id:
//           producto.categoria_id != null ? String(producto.categoria_id) : "",
//         costo:
//           producto.costo != null
//             ? String(producto.costo).replace(",", ".")
//             : "",
//       });
//     } else {
//       // 👇 Modo nuevo producto
//       setForm({
//         nombre: "",
//         stock: "",
//         precio: "",
//         descripcion: "",
//         estado_id: "",
//         categoria_id: "",
//         costo: "",
//       });
//     }
//   }, [isOpen, producto]);

//   // ==========================
//   // Helpers de sanitización / formateo
//   // ==========================
//   const sanitizeIntegerInput = (val) => {
//     if (!val) return "";
//     let v = String(val).replace(/\D+/g, ""); // solo dígitos
//     v = v.replace(/^0+(?=\d)/, ""); // sin ceros a la izquierda
//     return v;
//   };

//   const sanitizeDecimalInput = (val) => {
//     if (!val) return "";
//     let v = String(val).replace(/,/g, "."); // normalizar coma → punto
//     v = v.replace(/[^0-9.]/g, ""); // solo números y punto
//     const parts = v.split(".");
//     if (parts.length > 1) {
//       v = parts[0] + "." + parts.slice(1).join("");
//     }
//     v = v.replace(/^0+(?=\d)/, ""); // sin ceros a la izquierda
//     return v;
//   };

//   const formatIntegerDisplay = (val) => {
//     if (!val && val !== 0) return "";
//     const n = Number(val);
//     if (isNaN(n)) return "";
//     return new Intl.NumberFormat("es-AR").format(n);
//   };

//   const formatDecimalDisplay = (val) => {
//     if (val === "" || val == null) return "";
//     const n = Number(val);
//     if (isNaN(n)) return "";
//     const decimals = String(val).includes(".")
//       ? String(val).split(".")[1].length
//       : 0;
//     return new Intl.NumberFormat("es-AR", {
//       minimumFractionDigits: decimals,
//       maximumFractionDigits: decimals,
//     }).format(n);
//   };

//   // ==========================
//   // Handlers
//   // ==========================
//   const handleTextChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleStockChange = (rawValue) => {
//     const s = sanitizeIntegerInput(rawValue);
//     setForm((prev) => ({ ...prev, stock: s }));
//   };

//   const handlePrecioChange = (rawValue) => {
//     const s = sanitizeDecimalInput(rawValue);
//     setForm((prev) => ({ ...prev, precio: s }));
//   };

//   const handleCostoChange = (rawValue) => {
//     const s = sanitizeDecimalInput(rawValue);
//     setForm((prev) => ({ ...prev, costo: s }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Validaciones mínimas
//     if (!form.nombre.trim()) {
//       alert("El nombre es obligatorio.");
//       return;
//     }
//     if (form.precio === "" || isNaN(Number(form.precio))) {
//       alert("El precio es obligatorio y debe ser numérico.");
//       return;
//     }
//     if (!form.categoria_id) {
//       alert("Debe seleccionar una categoría para el producto.");
//       return;
//     }

//     // Payload que va al padre (y luego al backend)
//     const payload = {
//       nombre: form.nombre.trim(),
//       stock: form.stock ? parseInt(form.stock, 10) : 0,
//       precio: form.precio ? parseFloat(form.precio) : 0,
//       descripcion: form.descripcion.trim(),
//       estado_id: form.estado_id ? Number(form.estado_id) : null,
//       categoria_id: form.categoria_id ? Number(form.categoria_id) : null,
//       costo: form.costo ? parseFloat(form.costo) : 0,
//     };

//     onSave && onSave(payload);
//     onClose && onClose();
//   };

//   if (!isOpen) return null;

//   // ==========================
//   // UI
//   // ==========================
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
//       <div className="w-full max-w-xl bg-neutral-900 text-white rounded-2xl shadow-2xl border border-gray-800 overflow-auto max-h-[90vh]">
//         {/* Header */}
//         <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
//           <h2 className="text-xl font-semibold text-white">
//             {producto ? "Editar Producto" : "Nuevo Producto"}
//           </h2>
//           <button
//             type="button"
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-200 text-sm"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           {/* Nombre */}
//           <div>
//             <label className="block text-sm text-gray-300 mb-1">
//               Nombre *
//             </label>
//             <input
//               name="nombre"
//               value={form.nombre}
//               onChange={handleTextChange}
//               className="w-full bg-neutral-800 text-white p-2 rounded border border-gray-700 focus:outline-none focus:ring-0"
//               placeholder="Nombre del producto"
//               required
//             />
//           </div>

//           {/* Categoría (select centralizado) */}
//           <div>
//             <label className="block text-sm text-gray-300 mb-1">
//               Categoría *
//             </label>
//             <select
//               name="categoria_id"
//               value={form.categoria_id}
//               onChange={handleTextChange}
//               className="w-full bg-neutral-800 text-white p-2 rounded border border-gray-700 focus:outline-none focus:ring-0"
//               required
//             >
//               <option value="">
//                 {loadingCategorias
//                   ? "Cargando categorías..."
//                   : "-- Seleccionar categoría --"}
//               </option>
//               {!loadingCategorias &&
//                 categorias.map((cat) => (
//                   <option key={cat.id} value={cat.id}>
//                     {cat.nombre}
//                     {cat.tipo_equipo
//                       ? ` (${cat.tipo_equipo.toUpperCase()})`
//                       : ""}
//                   </option>
//                 ))}
//             </select>
//             <p className="mt-1 text-xs text-gray-400">
//               Estas categorías vienen centralizadas desde la base de datos.
//             </p>
//           </div>

//           {/* Stock / Costo / Precio */}
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             {/* Stock */}
//             <div>
//               <label className="block text-sm text-gray-300 mb-1">Stock</label>
//               <input
//                 type="text"
//                 inputMode="numeric"
//                 value={
//                   focused.stock
//                     ? form.stock
//                     : formatIntegerDisplay(form.stock)
//                 }
//                 onFocus={() => setFocused((f) => ({ ...f, stock: true }))}
//                 onBlur={() => setFocused((f) => ({ ...f, stock: false }))}
//                 onChange={(e) => handleStockChange(e.target.value)}
//                 placeholder="0"
//                 className="w-full bg-neutral-800 text-white p-2 rounded border border-gray-700 focus:outline-none"
//               />
//             </div>

//             {/* Costo */}
//             <div>
//               <label className="block text-sm text-gray-300 mb-1">
//                 Costo
//               </label>
//               <input
//                 type="text"
//                 inputMode="decimal"
//                 value={
//                   focused.costo
//                     ? form.costo
//                     : formatDecimalDisplay(form.costo)
//                 }
//                 onFocus={() => setFocused((f) => ({ ...f, costo: true }))}
//                 onBlur={() => setFocused((f) => ({ ...f, costo: false }))}
//                 onChange={(e) => handleCostoChange(e.target.value)}
//                 placeholder="0.00"
//                 className="w-full bg-neutral-800 text-white p-2 rounded border border-gray-700 focus:outline-none"
//                 required
//               />
//             </div>

//             {/* Precio */}
//             <div>
//               <label className="block text-sm text-gray-300 mb-1">
//                 Precio *
//               </label>
//               <input
//                 type="text"
//                 inputMode="decimal"
//                 value={
//                   focused.precio
//                     ? form.precio
//                     : formatDecimalDisplay(form.precio)
//                 }
//                 onFocus={() => setFocused((f) => ({ ...f, precio: true }))}
//                 onBlur={() => setFocused((f) => ({ ...f, precio: false }))}
//                 onChange={(e) => handlePrecioChange(e.target.value)}
//                 placeholder="0.00"
//                 className="w-full bg-neutral-800 text-white p-2 rounded border border-gray-700 focus:outline-none"
//                 required
//               />
//             </div>
//           </div>

//           {/* Descripción */}
//           <div>
//             <label className="block text-sm text-gray-300 mb-1">
//               Descripción
//             </label>
//             <textarea
//               name="descripcion"
//               value={form.descripcion}
//               onChange={handleTextChange}
//               rows={3}
//               className="w-full bg-neutral-800 text-white p-2 rounded border border-gray-700 focus:outline-none"
//               placeholder="Detalles / observaciones (opcional)"
//             />
//           </div>

//           {/* Estado */}
//           <div>
//             <label className="block text-sm text-gray-300 mb-1">
//               Estado
//             </label>
//             <select
//               name="estado_id"
//               value={form.estado_id}
//               onChange={handleTextChange}
//               className="w-full bg-neutral-800 text-white p-2 rounded border border-gray-700 focus:outline-none"
//             >
//               <option value="">-- Seleccionar estado --</option>
//               {estados.map((s) => (
//                 <option key={s.id} value={s.id}>
//                   {s.nombre}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Botones */}
//           <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-white font-semibold"
//             >
//               Cancelar
//             </button>
//             <button
//               type="submit"
//               className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white font-bold"
//             >
//               Guardar
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProductoModal;

// src/components/productos/ProductoModal.jsx
import { useEffect, useState } from "react";
import { getEstadoByAmbito } from "../../api/EstadoApi.jsx";
import { getCategoriasProducto } from "../../api/CategoriaProductoApi.jsx";
import AlertNotification from "../Alerta/AlertNotification.jsx";

const ProductoModal = ({ isOpen, onClose, onSave, producto = null }) => {
  // --- STATES DEL FORMULARIO ---
  const [form, setForm] = useState({
    nombre: "",
    stock: "",
    precio: "",
    descripcion: "",
    estado_id: "",
    categoria_id: "",
    costo: "",
  });

  const [subirWeb, setSubirWeb] = useState(false);
  const [oferta, setOferta] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // --- STATES DE UX ---
  const [estados, setEstados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  
  // 👇 NUEVO: Estado para saber si se está guardando en la API
  const [isSaving, setIsSaving] = useState(false);
  
  const [focused, setFocused] = useState({ stock: false, precio: false, costo: false });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ message: null, type: "" });

  // --- CARGA DE DATOS ---
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const lista = await getEstadoByAmbito("producto");
        setEstados(lista || []);
      } catch (e) {
        console.error("Error estados:", e);
        setNotification({ message: "Error al cargar estados", type: "error" });
      }
    })();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        setLoadingCategorias(true);
        const lista = await getCategoriasProducto();
        setCategorias(lista || []);
      } catch (e) {
        console.error("Error categorías:", e);
        setNotification({ message: "Error al cargar categorías", type: "error" });
      } finally {
        setLoadingCategorias(false);
      }
    })();
  }, [isOpen]);

  // Limpieza de memoria
  useEffect(() => {
    return () => {
      if (previewUrl && !producto?.foto_url) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl, producto]);

  // Inicialización / Reset
  useEffect(() => {
    if (!isOpen) {
      // Reseteo completo al cerrar
      setForm({
        nombre: "", stock: "", precio: "", descripcion: "",
        estado_id: "", categoria_id: "", costo: "",
      });
      setFocused({ stock: false, precio: false, costo: false });
      setSubirWeb(false);
      setOferta("");
      setFile(null);
      setPreviewUrl(null);
      setErrors({});
      setNotification({ message: null, type: "" });
      setIsSaving(false); // Aseguramos resetear el loading
      return;
    }

    if (producto) {
      setForm({
        nombre: producto.nombre ?? "",
        stock: producto.stock != null ? String(producto.stock) : "",
        precio: producto.precio != null ? String(producto.precio).replace(",", ".") : "",
        descripcion: producto.descripcion ?? "",
        estado_id: producto.estado_id != null ? String(producto.estado_id) : "",
        categoria_id: producto.categoria_id != null ? String(producto.categoria_id) : "",
        costo: producto.costo != null ? String(producto.costo).replace(",", ".") : "",
      });
      setSubirWeb(Boolean(producto.subir_web));
      setOferta(producto.oferta != null ? String(producto.oferta) : "");
      
      if (producto.foto_url) {
        setPreviewUrl(producto.foto_url);
        setFile(null);
      } else {
        setPreviewUrl(null);
        setFile(null);
      }
    } else {
      setForm({
        nombre: "", stock: "", precio: "", descripcion: "",
        estado_id: "", categoria_id: "", costo: "",
      });
      setSubirWeb(false);
      setOferta("");
      setFile(null);
      setPreviewUrl(null);
    }
  }, [isOpen, producto]);

  // --- HELPERS ---
  const sanitizeIntegerInput = (val) => String(val).replace(/\D+/g, "").replace(/^0+(?=\d)/, "");
  const sanitizeDecimalInput = (val) => {
    let v = String(val).replace(/,/g, ".").replace(/[^0-9.]/g, "");
    const parts = v.split(".");
    if (parts.length > 1) v = parts[0] + "." + parts.slice(1).join("");
    return v.replace(/^0+(?=\d)/, "");
  };
  const formatIntegerDisplay = (val) => (val && !isNaN(Number(val))) ? new Intl.NumberFormat("es-AR").format(Number(val)) : "";
  const formatDecimalDisplay = (val) => {
    if (val === "" || val == null || isNaN(Number(val))) return "";
    const decimals = String(val).includes(".") ? String(val).split(".")[1].length : 0;
    return new Intl.NumberFormat("es-AR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(Number(val));
  };

  // --- HANDLERS ---
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleNumChange = (field, sanitizer, val) => {
      const s = sanitizer(val);
      setForm(p => ({...p, [field]: s}));
      if (errors[field]) setErrors(p => ({...p, [field]: null}));
  };

  const handleFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
        setNotification({ message: "El archivo debe ser una imagen (JPG, PNG)", type: "warning" });
        return;
    }
    if (previewUrl && !producto?.foto_url) URL.revokeObjectURL(previewUrl);
    const localUrl = URL.createObjectURL(f);
    setFile(f);
    setPreviewUrl(localUrl);
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setIsDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  // 👇 LOGICA ASINCRONA CORREGIDA PARA EL PADRE
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Evitar doble submit
    if (isSaving) return;

    const newErrors = {};

    // 1. Validaciones
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (form.precio === "" || isNaN(Number(form.precio))) newErrors.precio = "Precio inválido.";
    else if (Number(form.precio) < 0) newErrors.precio = "No puede ser negativo.";
    if (!form.categoria_id) newErrors.categoria_id = "Selecciona una categoría.";
    if (oferta !== "" && (Number(oferta) < 0 || Number(oferta) > 100)) newErrors.oferta = "Inválido (0-100%).";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setNotification({ message: "Revisa los campos en rojo.", type: "error" });
      return;
    }

    // 2. Preparar Payload
    const payload = {
      nombre: form.nombre.trim(),
      stock: form.stock ? parseInt(form.stock, 10) : 0,
      precio: form.precio ? parseFloat(form.precio) : 0,
      descripcion: form.descripcion.trim(),
      estado_id: form.estado_id ? Number(form.estado_id) : null,
      categoria_id: form.categoria_id ? Number(form.categoria_id) : null,
      costo: form.costo ? parseFloat(form.costo) : 0,
      subir_web: subirWeb,
      oferta: oferta !== "" ? Number(oferta) : null,
      file,
      eliminar_foto: (!previewUrl && producto?.foto_url) ? true : false 
    };

    // 3. Envío al padre con Try/Catch
    try {
      setIsSaving(true); // Bloquear botón
      
      // Esperamos a que el padre termine (create/update + fetch)
      if (onSave) {
        await onSave(payload);
      }
      
      // Si llegamos acá, todo salió bien en el padre
      onClose && onClose(); 

    } catch (error) {
      console.error("Error al guardar producto:", error);
      // Mostramos el error en el modal y NO cerramos
      setNotification({ 
        message: "Error al guardar. Intenta nuevamente.", 
        type: "error" 
      });
    } finally {
      setIsSaving(false); // Desbloquear botón (si falló)
    }
  };

  if (!isOpen) return null;

  const inputClass = (hasError) => `w-full bg-neutral-800 text-white p-2 rounded border transition-colors focus:outline-none ${hasError ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-emerald-500'}`;
  const labelClass = "block text-sm text-gray-300 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
      
      <AlertNotification 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ message: null, type: "" })}
      />

      <div className="w-full max-w-xl bg-neutral-900 text-white rounded-2xl shadow-2xl border border-gray-800 overflow-auto max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            {producto ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <button 
            onClick={onClose} 
            disabled={isSaving} // Deshabilitar cierre si está guardando
            className="text-gray-400 hover:text-white transition disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Nombre */}
          <div>
            <label className={labelClass}>Nombre *</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleTextChange}
              className={inputClass(errors.nombre)}
              placeholder="Ej: Auriculares Sony"
              disabled={isSaving}
            />
            {errors.nombre && <p className="text-red-400 text-xs mt-1">{errors.nombre}</p>}
          </div>

          {/* Categoría */}
          <div>
            <label className={labelClass}>Categoría *</label>
            <select
              name="categoria_id"
              value={form.categoria_id}
              onChange={handleTextChange}
              className={inputClass(errors.categoria_id)}
              disabled={isSaving}
            >
              <option value="">{loadingCategorias ? "Cargando..." : "-- Seleccionar --"}</option>
              {!loadingCategorias && categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}{cat.tipo_equipo ? ` (${cat.tipo_equipo.toUpperCase()})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Grid Stock/Costo/Precio */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Stock</label>
              <input
                inputMode="numeric"
                value={focused.stock ? form.stock : formatIntegerDisplay(form.stock)}
                onFocus={() => setFocused(p => ({...p, stock: true}))}
                onBlur={() => setFocused(p => ({...p, stock: false}))}
                onChange={(e) => handleNumChange('stock', sanitizeIntegerInput, e.target.value)}
                className={inputClass(errors.stock)}
                placeholder="0"
                disabled={isSaving}
              />
            </div>
            <div>
              <label className={labelClass}>Costo</label>
              <input
                inputMode="decimal"
                value={focused.costo ? form.costo : formatDecimalDisplay(form.costo)}
                onFocus={() => setFocused(p => ({...p, costo: true}))}
                onBlur={() => setFocused(p => ({...p, costo: false}))}
                onChange={(e) => handleNumChange('costo', sanitizeDecimalInput, e.target.value)}
                className={inputClass(errors.costo)}
                placeholder="0.00"
                disabled={isSaving}
              />
            </div>
            <div>
              <label className={labelClass}>Precio *</label>
              <input
                inputMode="decimal"
                value={focused.precio ? form.precio : formatDecimalDisplay(form.precio)}
                onFocus={() => setFocused(p => ({...p, precio: true}))}
                onBlur={() => setFocused(p => ({...p, precio: false}))}
                onChange={(e) => handleNumChange('precio', sanitizeDecimalInput, e.target.value)}
                className={inputClass(errors.precio)}
                placeholder="0.00"
                disabled={isSaving}
              />
               {errors.precio && <p className="text-red-400 text-xs mt-1">{errors.precio}</p>}
            </div>
          </div>

          {/* Oferta y Web */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div>
                <label className={labelClass}>Oferta (%)</label>
                <div className="relative">
                    <input
                        inputMode="numeric"
                        value={oferta}
                        onChange={(e) => setOferta(sanitizeIntegerInput(e.target.value))}
                        className={inputClass(errors.oferta)}
                        placeholder="Ej: 10"
                        disabled={isSaving}
                    />
                    <span className="absolute right-3 top-2 text-gray-500 text-sm">% OFF</span>
                </div>
                {errors.oferta && <p className="text-red-400 text-xs mt-1">{errors.oferta}</p>}
            </div>
            
            <div className="flex flex-col sm:items-end pt-6">
                 <button
                    type="button"
                    onClick={() => !isSaving && setSubirWeb(!subirWeb)}
                    disabled={isSaving}
                    className={`flex items-center justify-between w-full sm:w-40 px-3 py-2 rounded-full border text-sm transition ${
                        subirWeb ? "bg-emerald-600/20 border-emerald-500 text-emerald-400" : "bg-neutral-800 border-gray-600 text-gray-400"
                    } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    <span>{subirWeb ? "Publicado" : "Oculto"}</span>
                    <span className={`h-3 w-3 rounded-full ${subirWeb ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" : "bg-gray-600"}`} />
                </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleTextChange}
              rows={3}
              className={inputClass(false)}
              placeholder="Detalles..."
              disabled={isSaving}
            />
          </div>

          <div>
            <label className={labelClass}>Estado</label>
            <select
              name="estado_id"
              value={form.estado_id}
              onChange={handleTextChange}
              className={inputClass(false)}
              disabled={isSaving}
            >
              <option value="">-- Seleccionar estado --</option>
              {estados.map((s) => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
          </div>

          {/* FOTO */}
          <div>
            <label className={labelClass}>Foto del producto</label>
            <div
              className={`relative flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed px-4 py-6 cursor-pointer transition overflow-hidden group
                ${isDragOver ? "border-emerald-500 bg-emerald-900/10" : "border-gray-700 bg-neutral-800 hover:border-gray-500"}
                ${isSaving ? "opacity-50 cursor-not-allowed" : ""}
              `}
              onDragOver={(e) => { if(!isSaving){ e.preventDefault(); setIsDragOver(true); }}}
              onDragLeave={(e) => { if(!isSaving){ e.preventDefault(); setIsDragOver(false); }}}
              onDrop={(e) => { if(!isSaving) handleDrop(e); }}
            >
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Preview" className="w-full h-48 object-contain rounded-md" />
                  {!isSaving && (
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setFile(null); setPreviewUrl(null); }}
                        className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition hover:scale-110 shadow-lg z-10"
                        title="Eliminar foto"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 py-4">
                  <span className="text-3xl opacity-50">📷</span>
                  <p className="text-sm text-gray-400">Arrastra o haz clic</p>
                </div>
              )}
              
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={(e) => !isSaving && handleFile(e.target.files?.[0])}
                disabled={isSaving} 
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-lg text-gray-300 font-medium hover:bg-neutral-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold shadow-lg shadow-emerald-900/20 transition-all 
                ${isSaving ? "opacity-70 cursor-wait" : "active:scale-95"}
              `}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </span>
              ) : (
                "Guardar Producto"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductoModal;

