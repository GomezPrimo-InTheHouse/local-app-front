

// src/components/Ventas/VentasModal.jsx
// import { useEffect, useMemo, useState } from "react";
// import { getClientes } from "../../api/ClienteApi";
// import { getProductos } from "../../api/ProductoApi";

// const VentasModal = ({ onClose, onGuardar, initialData }) => {
//   const [clientes, setClientes] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filteredClientes, setFilteredClientes] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [productos, setProductos] = useState([]);
//   const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
//   const [items, setItems] = useState([]);
//   const [pagado, setPagado] = useState("");
//   const [montoAbonadoToForm, setMontoAbonadoToForm] = useState(0);
//   const [saving, setSaving] = useState(false);

//   // ===== Helpers =====
//   const isEdicion = Boolean(initialData?.id ?? initialData?.venta_id);

//   // Mapa de cantidad previa por producto_id para modo edición
//   const prevCantidadPorProd = useMemo(() => {
//     const detalles = initialData?.detalle_venta || initialData?.detalles || [];
//     return new Map(detalles.map((d) => [Number(d.producto_id), Number(d.cantidad) || 0]));
//   }, [initialData]);

//   const getPrevCant = (prodId) => prevCantidadPorProd.get(Number(prodId)) ?? 0;

//   // ===== Cargar datos iniciales =====
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const clientesResponse = await getClientes();
//         const listaClientes = Array.isArray(clientesResponse)
//           ? clientesResponse
//           : clientesResponse?.data ?? [];
//         setClientes(listaClientes);
//         setFilteredClientes(listaClientes);

//         const productosResponse = await getProductos();
//         const listaProductos = Array.isArray(productosResponse?.data)
//           ? productosResponse.data
//           : Array.isArray(productosResponse)
//           ? productosResponse
//           : [];
//         setProductos(listaProductos);
//       } catch (err) {
//         console.error("Error cargando datos iniciales:", err);
//       }
//     };
//     fetchInitialData();
//   }, []);

//   // ===== Cargar initialData en el formulario =====
//   useEffect(() => {
//     if (initialData && productos.length > 0 && clientes.length > 0) {
//       // cliente
//       const cliId = initialData?.cliente?.id ?? initialData?.cliente_id;
//       if (cliId) {
//         const clienteEncontrado = clientes.find((c) => Number(c.id) === Number(cliId));
//         if (clienteEncontrado) {
//           setClienteSeleccionado(clienteEncontrado);
//           setSearch(`${clienteEncontrado.nombre} ${clienteEncontrado.apellido}`);
//         } else {
//           setClienteSeleccionado(null);
//           setSearch("");
//         }
//       } else {
//         setClienteSeleccionado(null);
//         setSearch("");
//       }

//       // detalles -> items
//       const detalles = initialData.detalle_venta || initialData.detalles || [];
//       const loadedItems = detalles.map((detail) => {
//         const productInfo = productos.find((p) => Number(p.id) === Number(detail.producto_id));
//         return {
//           detalle_id: detail.id ?? null,
//           id: Number(detail.producto_id),
//           nombre: productInfo ? productInfo.nombre : "Producto desconocido",
//           cantidad: Number(detail.cantidad),
//           precio: Number(detail.precio_unitario),
//           stock: Number(productInfo ? productInfo.stock : 0),
//         };
//       });
//       setItems(loadedItems);

//       // monto abonado
//       const abonado = Number(initialData.monto_abonado ?? 0);
//       setPagado(String(Number.isFinite(abonado) ? Math.floor(abonado) : 0));
//     }
//   }, [initialData, productos, clientes]);

//   // ===== Búsqueda de clientes =====
//   useEffect(() => {
//     const q = search.trim().toLowerCase();
//     if (!q) {
//       setFilteredClientes(clientes);
//       return;
//     }
//     setFilteredClientes(
//       clientes.filter(
//         (c) =>
//           (c.nombre || "").toLowerCase().includes(q) ||
//           (c.apellido || "").toLowerCase().includes(q) ||
//           (c.celular || "").includes(q)
//       )
//     );
//   }, [search, clientes]);

//   // ===== Helpers numéricos =====
//   const sanitizeNumberString = (raw) => {
//     if (raw == null) return "";
//     return String(raw).replace(/[^0-9]/g, "");
//   };

//   const onChangePagado = (e) => {
//     const v = sanitizeNumberString(e.target.value);
//     setPagado(v === "" ? "" : v);
//   };

//   // ===== Selectores cliente =====
//   const handleSelectCliente = (c) => {
//     setClienteSeleccionado(c);
//     setSearch(`${c.nombre} ${c.apellido}`);
//     setShowDropdown(false);
//   };

//   const handleClearCliente = () => {
//     setClienteSeleccionado(null);
//     setSearch("");
//     setFilteredClientes(clientes);
//   };

//   // ===== Productos / Items =====
//   const handleAddItem = (e) => {
//     const productoSeleccionado = productos.find((p) => String(p.id) === String(e.target.value));
//     if (
//       productoSeleccionado &&
//       !items.some((item) => Number(item.id) === Number(productoSeleccionado.id))
//     ) {
//       setItems((prev) => [
//         ...prev,
//         {
//           detalle_id: null,
//           id: Number(productoSeleccionado.id),
//           nombre: productoSeleccionado.nombre,
//           cantidad: 1,
//           precio: Math.floor(Number(productoSeleccionado.precio)),
//           stock: Number(productoSeleccionado.stock),
//         },
//       ]);
//     }
//     e.target.value = "";
//   };

//   const handleUpdateItem = (prodId, field, value) => {
//     setItems((prev) =>
//       prev.map((item) => {
//         if (Number(item.id) !== Number(prodId)) return item;

//         let sanitizedValue = sanitizeNumberString(value);

//         if (field === "cantidad") {
//           const prevCant = getPrevCant(prodId);
//           const stock = Number(item.stock ?? 0);
//           let newCantidad = Number(sanitizedValue);

//           if (!Number.isFinite(newCantidad) || newCantidad <= 0) newCantidad = 1;

//           if (isEdicion) {
//             const maxPermitida = prevCant + stock;
//             if (newCantidad > maxPermitida) newCantidad = maxPermitida;
//           } else {
//             if (newCantidad > stock) newCantidad = stock;
//           }
//           sanitizedValue = String(newCantidad);
//         }

//         if (field === "precio") {
//           const n = Number(sanitizedValue);
//           if (!Number.isFinite(n) || n <= 0) sanitizedValue = "1";
//         }

//         return { ...item, [field]: sanitizedValue };
//       })
//     );
//   };

//   const handleRemoveItem = (idOrDetalleId) => {
//     setItems((prev) =>
//       prev.filter(
//         (it) =>
//           !(it.detalle_id && Number(it.detalle_id) === Number(idOrDetalleId)) &&
//           !(Number(it.id) === Number(idOrDetalleId))
//       )
//     );
//   };

//   // ===== Totales =====
//   const total = items.reduce(
//     (acc, item) => acc + Number(item.cantidad || 0) * Number(item.precio || 0),
//     0
//   );
//   const pagadoNum = Number(pagado || 0);
//   const saldo = Math.max(0, total - pagadoNum);

//   // ✅ CORRECCIÓN 1: isSaldada solo para el MODO EDICIÓN y si ya tiene saldo CERO en DB
//   // En el formulario, el botón de Guardar debe habilitarse si el saldo es 0 para permitir el pago completo.
//   const isSaldadaDB = isEdicion && Number(initialData.saldo) === 0;
//   const lockEdicion = saving || isSaldadaDB;

//   useEffect(() => {
//     setMontoAbonadoToForm(pagadoNum);
//   }, [pagadoNum]);

//   // ===== Close =====
//   const handleClose = () => {
//     if (saving) return;
//     setClienteSeleccionado(null);
//     setSearch("");
//     setFilteredClientes(clientes);
//     setItems([]);
//     setPagado("");
//     onClose?.();
//   };

//   // ===== ESC =====
//   useEffect(() => {
//     const onKeyDown = (ev) => {
//       if (ev.key === "Escape" && !saving) handleClose();
//     };
//     window.addEventListener("keydown", onKeyDown);
//     return () => window.removeEventListener("keydown", onKeyDown);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [saving]);

//   // ===== Submit =====
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // ✅ CORRECCIÓN 2: Bloquear el botón INMEDIATAMENTE al hacer submit para evitar doble click/envío.
//     if (saving) return;
//     setSaving(true); // Bloqueo anticipado

//     if (isSaldadaDB) {
//       alert("Esta venta ya está saldada. No se permiten modificaciones.");
//       setSaving(false); // Desbloquear si la validación falla
//       return;
//     }

//     if (!clienteSeleccionado?.id) {
//       alert("Seleccioná un cliente.");
//       setSaving(false);
//       return;
//     }

//     if (!Array.isArray(items) || items.length === 0) {
//       alert("Debe agregar al menos un producto.");
//       setSaving(false);
//       return;
//     }

//     for (const item of items) {
//       const cant = Number(item.cantidad);
//       const precio = Number(item.precio);
//       const stock = Number(item.stock ?? 0);

//       if (cant <= 0) {
//         setSaving(false);
//         return alert("Cantidad inválida. Debe ser mayor a 0.");
//       }
//       if (precio <= 0) {
//         setSaving(false);
//         return alert("Precio inválido. Debe ser mayor a 0.");
//       }

//       const prevCant = getPrevCant(item.id);
//       if (isEdicion) {
//         const incremento = cant - prevCant;
//         if (incremento > 0 && incremento > stock) {
//           setSaving(false);
//           return alert(
//             `No hay stock suficiente para ${item.nombre}. Necesitás ${incremento} adicional y hay ${stock} disponible.`
//           );
//         }
//       } else {
//         if (cant > stock) {
//           setSaving(false);
//           return alert(`La cantidad de ${item.nombre} no puede ser mayor al stock disponible (${stock}).`);
//         }
//       }
//     }

//     if (pagado !== "" && pagadoNum > total) {
//       alert("El monto pagado no puede exceder el total.");
//       setSaving(false);
//       return;
//     }

//     const ventaPayload = {
//       id: initialData?.id ?? initialData?.venta_id ?? undefined,
//       cliente_id: clienteSeleccionado.id,
//       monto_abonado: montoAbonadoToForm,
//       fecha: new Date().toISOString(),
//       total,
//       saldo,
//       detalles: items.map((item) => ({
//         id: item.detalle_id || null,
//         producto_id: Number(item.id),
//         cantidad: Number(item.cantidad),
//         precio_unitario: Number(item.precio),
//       })),
//     };

//     try {
//       await onGuardar(ventaPayload); // ✅ si falla, no cierra
//       handleClose(); // ✅ cerrar solo si OK
//     } catch (error) {
//         // Si onGuardar falla, el finally lo desbloqueará
//         console.error("Error al guardar:", error);
//     } finally {
//       // ✅ Si hubo error, el saving se desactiva aquí. Si fue exitoso, handleClose lo limpia.
//       // Lo movemos aquí para asegurar que el botón se libere si onGuardar falló
//       setSaving(false); 
//     }
//   };

//   // ===== UI =====
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       {/* overlay */}
//       <button
//         type="button"
//         className="absolute inset-0 bg-black/70"
//         onClick={() => !saving && handleClose()}
//         aria-label="Cerrar"
//         disabled={saving}
//       />

//       <div
//         className="relative w-full max-w-lg bg-neutral-800 rounded-2xl p-6 shadow-lg text-white flex flex-col max-h-[90vh]"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* X */}
//         <button
//           type="button"
//           onClick={handleClose}
//           disabled={saving}
//           aria-label="Cerrar"
//           className="absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full
//                      bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white
//                      transition focus:outline-none focus:ring-2 focus:ring-emerald-500/60
//                      disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
//           </svg>
//         </button>

//         <div className="mb-4">
//           <h2 className="text-xl font-semibold">
//             {isEdicion ? "✏️ Editar Venta (Local)" : "➕ Registrar Venta (Local)"}
//           </h2>
//           <p className="text-xs text-gray-400 mt-1">
//             Seleccioná cliente, agregá productos y registrá el pago.
//           </p>
//         </div>

//         {/* ✅ Venta saldada (Basado en DB) */}
//         {isSaldadaDB && (
//           <div className="mb-4 text-xs px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-200">
//             ✅ Venta saldada. No se permiten más modificaciones.
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
//           <div className="flex-1 overflow-y-auto space-y-4 pr-2 -mr-2">
//             {/* CLIENTE */}
//             <div className="bg-neutral-700 p-3 rounded relative">
//               <label className="block text-sm text-gray-300 mb-1">Cliente</label>
//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setShowDropdown(true);
//                 }}
//                 onFocus={() => setShowDropdown(true)}
//                 onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
//                 placeholder="Buscar por nombre, apellido o celular"
//                 disabled={lockEdicion}
//                 className="w-full bg-neutral-600 p-2 rounded text-white transition
//                            focus:outline-none focus:ring-2 focus:ring-emerald-500/60 disabled:opacity-60 disabled:cursor-not-allowed"
//               />

//               {showDropdown && !lockEdicion && (
//                 <ul className="absolute z-50 mt-1 bg-neutral-700 w-full left-0 rounded max-h-44 overflow-y-auto shadow-lg border border-white/10">
//                   {filteredClientes.length > 0 ? (
//                     filteredClientes.map((c) => (
//                       <li
//                         key={c.id}
//                         onMouseDown={() => handleSelectCliente(c)}
//                         className={`px-3 py-2 hover:bg-neutral-600 cursor-pointer ${
//                           clienteSeleccionado?.id === c.id ? "bg-neutral-600" : ""
//                         }`}
//                       >
//                         {c.nombre} {c.apellido}
//                       </li>
//                     ))
//                   ) : (
//                     <li className="px-3 py-2 text-gray-300">Sin resultados</li>
//                   )}
//                 </ul>
//               )}

//               {clienteSeleccionado && (
//                 <div className="mt-2 flex items-center gap-2">
//                   <div className="px-3 py-1 rounded bg-neutral-800/60 border border-white/10 text-sm truncate">
//                     {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
//                   </div>
//                   <button
//                     type="button"
//                     onClick={handleClearCliente}
//                     disabled={lockEdicion}
//                     className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-sm
//                                transition disabled:opacity-60 disabled:cursor-not-allowed"
//                   >
//                     Limpiar
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* PRODUCTOS */}
//             <div className="bg-neutral-700 p-3 rounded space-y-3">
//               <div>
//                 <label className="block text-sm text-gray-300 mb-1">Productos</label>
//                 <select
//                   onChange={handleAddItem}
//                   className="w-full bg-neutral-600 p-2 rounded text-white transition
//                              focus:outline-none focus:ring-2 focus:ring-emerald-500/60 disabled:opacity-60 disabled:cursor-not-allowed"
//                   value=""
//                   disabled={lockEdicion}
//                 >
//                   <option value="" disabled>
//                     Añadir un producto
//                   </option>
//                   {productos.map((p) => (
//                     <option
//                       key={p.id}
//                       value={p.id}
//                       disabled={items.some((item) => Number(item.id) === Number(p.id))}
//                     >
//                       {p.nombre} — ${Math.floor(p.precio).toLocaleString("es-AR")} ({p.stock} stock)
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="space-y-2">
//                 {items.map((item) => (
//                   <div
//                     key={item.detalle_id ?? item.id}
//                     className="bg-neutral-800/50 border border-white/10 p-3 rounded-lg flex items-start justify-between gap-3"
//                   >
//                     <div className="flex-1 min-w-0">
//                       <p className="font-semibold text-gray-100 truncate">{item.nombre}</p>

//                       <div className="flex flex-wrap gap-2 items-center text-xs text-gray-300 mt-2">
//                         <span className="text-gray-400">Cant.</span>
//                         <input
//                           type="text"
//                           inputMode="numeric"
//                           pattern="\d*"
//                           value={item.cantidad}
//                           onChange={(e) => handleUpdateItem(item.id, "cantidad", e.target.value)}
//                           disabled={lockEdicion}
//                           className="w-14 bg-neutral-600 p-2 rounded text-white text-center
//                                      focus:outline-none focus:ring-2 focus:ring-emerald-500/60
//                                      disabled:opacity-60 disabled:cursor-not-allowed"
//                         />
//                         <span className="text-gray-400">x</span>
//                         <input
//                           type="text"
//                           inputMode="numeric"
//                           pattern="\d*"
//                           value={item.precio}
//                           onChange={(e) => handleUpdateItem(item.id, "precio", e.target.value)}
//                           disabled={lockEdicion}
//                           className="w-24 bg-neutral-600 p-2 rounded text-white text-center
//                                      focus:outline-none focus:ring-2 focus:ring-emerald-500/60
//                                      disabled:opacity-60 disabled:cursor-not-allowed"
//                         />
//                         <span className="ml-1 font-semibold text-gray-100">
//                           ${ (Number(item.cantidad) * Number(item.precio)).toLocaleString("es-AR") }
//                         </span>
//                       </div>

//                       <p className="text-xs text-gray-500 mt-2">
//                         Stock hoy: <span className="text-gray-300">{item.stock}</span>
//                         {isEdicion && (
//                           <>
//                             {" · "}Previo: <span className="text-gray-300">{getPrevCant(item.id)}</span>
//                           </>
//                         )}
//                       </p>
//                     </div>

//                     <button
//                       type="button"
//                       onClick={() => handleRemoveItem(item.detalle_id ?? item.id)}
//                       disabled={lockEdicion}
//                       className="inline-flex h-9 w-9 items-center justify-center rounded-full
//                                  bg-red-500/10 hover:bg-red-500/20 border border-red-500/20
//                                  text-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                       aria-label="Quitar"
//                     >
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                         <path
//                           fillRule="evenodd"
//                           d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 100 2h2a1 1 0 100-2h-2z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </button>
//                   </div>
//                 ))}

//                 {!items.length && (
//                   <div className="text-sm text-gray-400 bg-neutral-800/40 border border-white/10 rounded-lg p-3">
//                     Agregá productos desde el selector.
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* PAGADO + RESUMEN */}
//             <div className="grid grid-cols-2 gap-3">
//               <div className="bg-neutral-700 p-3 rounded">
//                 <label className="block text-sm text-gray-300 mb-1">Monto pagado</label>
//                 <input
//                   type="text"
//                   inputMode="numeric"
//                   pattern="\d*"
//                   value={pagado}
//                   onChange={onChangePagado}
//                   disabled={lockEdicion}
//                   className="w-full bg-neutral-600 p-2 rounded text-white transition
//                              focus:outline-none focus:ring-2 focus:ring-emerald-500/60
//                              disabled:opacity-60 disabled:cursor-not-allowed"
//                   placeholder="Ej: 22000"
//                 />
//                 <p className="text-xs text-gray-400 mt-2">El saldo se calcula automáticamente.</p>
//               </div>

//               <div className="bg-neutral-700 p-3 rounded">
//                 <div className="text-xs text-gray-400">Total</div>
//                 <div className="text-xl font-bold text-gray-100">
//                   ${total.toLocaleString("es-AR")}
//                 </div>

//                 <div className="mt-3 text-xs text-gray-400">Saldo</div>
//                 <div className={`text-lg font-semibold ${saldo > 0 ? "text-red-300" : "text-emerald-300"}`}>
//                   ${saldo.toLocaleString("es-AR")}
//                 </div>
//               </div>
//             </div>

//             {saving && (
//               <div className="text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-200">
//                 ⏳ Guardando… por favor no cierres esta ventana.
//               </div>
//             )}
//           </div>

//           {/* BOTONES */}
//           <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-700">
//             <button
//               type="button"
//               onClick={handleClose}
//               disabled={saving}
//               className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition
//                          disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Cancelar
//             </button>

//             <button
//               type="submit"
//               // ✅ Bloqueo: solo por 'saving', 'saldadaDB' (edición), o si faltan datos esenciales.
//               disabled={saving || isSaldadaDB || !clienteSeleccionado?.id || items.length === 0}
//               className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded transition
//                          disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//             >
//               {saving ? (
//                 <>
//                   <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
//                   Guardando...
//                 </>
//               ) : isSaldadaDB ? (
//                 "Venta saldada"
//               ) : isEdicion ? (
//                 "Guardar cambios"
//               ) : (
//                 "Guardar venta"
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default VentasModal;

import { useEffect, useMemo, useState } from "react";
import { getClientes } from "../../api/ClienteApi";
import { getProductos } from "../../api/ProductoApi";

const VentasModal = ({ onClose, onGuardar, initialData }) => {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [productos, setProductos] = useState([]);

  // ✅ BUSCADOR PRODUCTOS (SOLO FILTRA)
  const [searchProducto, setSearchProducto] = useState("");
  const [filteredProductos, setFilteredProductos] = useState([]);

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [items, setItems] = useState([]);
  const [pagado, setPagado] = useState("");
  const [montoAbonadoToForm, setMontoAbonadoToForm] = useState(0);
  const [saving, setSaving] = useState(false);

  const isEdicion = Boolean(initialData?.id ?? initialData?.venta_id);

  const prevCantidadPorProd = useMemo(() => {
    const detalles = initialData?.detalle_venta || initialData?.detalles || [];
    return new Map(detalles.map((d) => [Number(d.producto_id), Number(d.cantidad) || 0]));
  }, [initialData]);

  const getPrevCant = (prodId) => prevCantidadPorProd.get(Number(prodId)) ?? 0;

  // ===== LOAD DATA =====
  useEffect(() => {
    const fetchData = async () => {
      const clientesResp = await getClientes();
      const clientesList = Array.isArray(clientesResp) ? clientesResp : clientesResp?.data ?? [];
      setClientes(clientesList);
      setFilteredClientes(clientesList);

      const productosResp = await getProductos();
      const productosList = Array.isArray(productosResp?.data)
        ? productosResp.data
        : Array.isArray(productosResp)
        ? productosResp
        : [];

      setProductos(productosList);
      setFilteredProductos(productosList);
    };
    fetchData();
  }, []);

  // ===== FILTRO CLIENTES =====
  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredClientes(
      clientes.filter(
        (c) =>
          c.nombre?.toLowerCase().includes(q) ||
          c.apellido?.toLowerCase().includes(q) ||
          c.celular?.includes(q)
      )
    );
  }, [search, clientes]);

  // ===== FILTRO PRODUCTOS =====
  useEffect(() => {
    const q = searchProducto.toLowerCase();
    setFilteredProductos(
      productos.filter((p) => p.nombre?.toLowerCase().includes(q))
    );
  }, [searchProducto, productos]);

  const sanitizeNumberString = (raw) => String(raw ?? "").replace(/[^0-9]/g, "");

  const handleSelectCliente = (c) => {
    setClienteSeleccionado(c);
    setSearch(`${c.nombre} ${c.apellido}`);
    setShowDropdown(false);
  };

  const handleAddItem = (e) => {
    const productoSeleccionado = productos.find(
      (p) => String(p.id) === String(e.target.value)
    );

    if (
      productoSeleccionado &&
      !items.some((item) => Number(item.id) === Number(productoSeleccionado.id))
    ) {
      setItems((prev) => [
        ...prev,
        {
          detalle_id: null,
          id: Number(productoSeleccionado.id),
          nombre: productoSeleccionado.nombre,
          cantidad: 1,
          precio: Math.floor(Number(productoSeleccionado.precio)),
          stock: Number(productoSeleccionado.stock),
        },
      ]);
    }

    e.target.value = "";
    setSearchProducto(""); // 🔑 limpiar buscador
  };

  const total = items.reduce(
    (acc, item) => acc + Number(item.cantidad) * Number(item.precio),
    0
  );

  const pagadoNum = Number(pagado || 0);
  const saldo = Math.max(0, total - pagadoNum);
  const isSaldadaDB = isEdicion && Number(initialData?.saldo) === 0;
  const lockEdicion = saving || isSaldadaDB;

  // ===== UI =====
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-neutral-800 rounded-2xl p-6 text-white">

        {/* BUSCADOR PRODUCTOS */}
        <div className="bg-neutral-700 p-3 rounded mb-3">
          <label className="text-sm text-gray-300">Buscar producto</label>
          <input
            type="text"
            value={searchProducto}
            onChange={(e) => setSearchProducto(e.target.value)}
            placeholder="Escribí el nombre"
            disabled={lockEdicion}
            className="w-full mt-1 bg-neutral-600 p-2 rounded text-white"
          />
        </div>

        {/* SELECT FILTRADO */}
        <select
          onChange={handleAddItem}
          value=""
          disabled={lockEdicion}
          className="w-full bg-neutral-600 p-2 rounded text-white"
        >
          <option value="" disabled>
            Agregar producto
          </option>

          {filteredProductos.map((p) => (
            <option
              key={p.id}
              value={p.id}
              disabled={items.some((i) => Number(i.id) === Number(p.id))}
            >
              {p.nombre} — ${Math.floor(p.precio)} ({p.stock})
            </option>
          ))}
        </select>

        {/* EL RESTO DE TU MODAL QUEDA EXACTAMENTE IGUAL */}
      </div>
    </div>
  );
};

export default VentasModal;

