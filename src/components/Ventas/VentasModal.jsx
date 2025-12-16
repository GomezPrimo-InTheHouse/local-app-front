

// // src/components/Ventas/VentasModal.jsx
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

//   // ===== Helpers =====
//   const isEdicion = Boolean(initialData?.id ?? initialData?.venta_id);

//   // Mapa de cantidad previa por producto_id para modo edición
//   const prevCantidadPorProd = useMemo(() => {
//     const detalles = initialData?.detalle_venta || initialData?.detalles || [];
//     return new Map(
//       detalles.map((d) => [
//         Number(d.producto_id),
//         Number(d.cantidad) || 0,
//       ])
//     );
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

//       // detalles -> items (normalizando: item.id = producto_id)
//       const detalles = initialData.detalle_venta || initialData.detalles || [];
//       const loadedItems = detalles.map((detail) => {
//         const productInfo = productos.find((p) => Number(p.id) === Number(detail.producto_id));
//         return {
//           detalle_id: detail.id ?? null,      // id del detalle (para updates)
//           id: Number(detail.producto_id),     // ⚠️ normalizamos: id SIEMPRE es producto_id
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

//   // ===== Helpers numéricos =====
//   const sanitizeNumberString = (raw) => {
//     if (raw == null) return "";
//     return String(raw).replace(/[^0-9]/g, "");
//   };

//   const onChangePagado = (e) => {
//     const v = sanitizeNumberString(e.target.value);
//     setPagado(v === "" ? "" : v);
//   };

//   // ===== Productos / Items =====
//   const handleAddItem = (e) => {
//     const productoSeleccionado = productos.find(
//       (p) => String(p.id) === String(e.target.value)
//     );
//     if (productoSeleccionado && !items.some((item) => Number(item.id) === Number(productoSeleccionado.id))) {
//       setItems((prev) => [
//         ...prev,
//         {
//           detalle_id: null,
//           id: Number(productoSeleccionado.id), // normalizamos id = producto_id
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
//           const prevCant = getPrevCant(prodId);      // cantidad previa (0 si creación)
//           const stock = Number(item.stock ?? 0);
//           let newCantidad = Number(sanitizedValue);

//           // Si valor inválido, al menos 1
//           if (!Number.isFinite(newCantidad) || newCantidad <= 0) newCantidad = 1;

//           if (isEdicion) {
//             // Máximo permitido = lo ya vendido + lo que hoy está disponible
//             const maxPermitida = prevCant + stock;
//             if (newCantidad > maxPermitida) newCantidad = maxPermitida;
//           } else {
//             // Creación: máximo = stock actual
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
//     // Si hay detalle_id, quitamos por detalle_id; si no, por id (producto)
//     setItems((prev) =>
//       prev.filter(
//         (it) =>
//           !(it.detalle_id && Number(it.detalle_id) === Number(idOrDetalleId)) &&
//           !(Number(it.id) === Number(idOrDetalleId))
//       )
//     );
//   };

//   // ===== Totales =====
//   const total = items.reduce((acc, item) => {
//     const cantidadNum = Number(item.cantidad || 0);
//     const precioNum = Number(item.precio || 0);
//     return acc + cantidadNum * precioNum;
//   }, 0);

//   const pagadoNum = Number(pagado || 0);
//   const saldo = Math.max(0, total - pagadoNum);

//   useEffect(() => {
//     setMontoAbonadoToForm(pagadoNum);
//   }, [pagadoNum]);

//   // ===== Submit con validación de stock incremental =====
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!Array.isArray(items) || items.length === 0) {
//       alert("Debe agregar al menos un producto.");
//       return;
//     }

//     for (const item of items) {
//       const cant = Number(item.cantidad);
//       const precio = Number(item.precio);
//       const stock = Number(item.stock ?? 0);
//       if (cant <= 0) {
//         alert("Cantidad inválida. Debe ser mayor a 0.");
//         return;
//       }
//       if (precio <= 0) {
//         alert("Precio inválido. Debe ser mayor a 0.");
//         return;
//       }

//       const prevCant = getPrevCant(item.id); // 0 si es creación
//       if (isEdicion) {
//         const incremento = cant - prevCant; // sólo validamos el extra
//         if (incremento > 0 && incremento > stock) {
//           alert(
//             `No hay stock suficiente para ${item.nombre}. Necesitás ${incremento} adicional y hay ${stock} disponible.`
//           );
//           return;
//         }
//       } else {
//         if (cant > stock) {
//           alert(
//             `La cantidad de ${item.nombre} no puede ser mayor al stock disponible (${stock}).`
//           );
//           return;
//         }
//       }
//     }

//     if (pagado !== "" && pagadoNum > total) {
//       alert("El monto pagado no puede exceder el total.");
//       return;
//     }

//     const ventaPayload = {
//       id: initialData?.id ?? initialData?.venta_id ?? undefined, // si editás y tu API lo usa
//       cliente_id: clienteSeleccionado?.id || null,
//       monto_abonado: montoAbonadoToForm,
//       fecha: new Date().toISOString(),
//       total,
//       saldo,
//       detalles: items.map((item) => ({
//         id: item.detalle_id || null,      // para update de detalle
//         producto_id: Number(item.id),     // ⚠️ siempre producto_id desde item.id
//         cantidad: Number(item.cantidad),
//         precio_unitario: Number(item.precio),
//       })),
//     };

//     onGuardar(ventaPayload);
//     handleClose();
//   };

//   const handleClose = () => {
//     setClienteSeleccionado(null);
//     setSearch("");
//     setFilteredClientes(clientes);
//     setItems([]);
//     setPagado("");
//     onClose();
//   };

//   // ===== UI =====
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-lg bg-neutral-800 rounded-2xl p-6 shadow-lg text-white relative flex flex-col max-h-[90vh]">
//         <h2 className="text-xl font-semibold mb-4">
//           {initialData ? "✏️ Editar Venta" : "➕ Registrar Nueva Venta"}
//         </h2>

//         <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
//           <div className="flex-1 overflow-y-auto space-y-4 pr-2 -mr-2">
//             {/* CLIENTE */}
//             <div>
//               <label className="block text-sm text-gray-300 mb-1">Cliente</label>
//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setShowDropdown(true);
//                 }}
//                 onFocus={() => setShowDropdown(true)}
//                 onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
//                 placeholder="Buscar cliente por nombre, apellido o celular"
//                 className="w-full bg-neutral-700 p-2 rounded text-white"
//               />
//               {showDropdown && (
//                 <ul className="absolute z-50 mt-1 bg-neutral-700 w-[calc(100%-3rem)] rounded max-h-44 overflow-y-auto shadow-lg">
//                   {filteredClientes.length > 0 ? (
//                     filteredClientes.map((c) => (
//                       <li
//                         key={c.id}
//                         onClick={() => handleSelectCliente(c)}
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
//                   <div className="px-3 py-1 rounded bg-neutral-700 text-sm">
//                     {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
//                   </div>
//                   <button
//                     type="button"
//                     onClick={handleClearCliente}
//                     className="px-2 py-1 bg-red-600 rounded text-sm hover:bg-red-500"
//                   >
//                     Limpiar
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* PRODUCTOS */}
//             <div>
//               <label className="block text-sm text-gray-300 mb-1">Productos</label>
//               <select onChange={handleAddItem} className="w-full bg-neutral-700 p-2 rounded text-white" value="">
//                 <option value="" disabled>
//                   Añade un producto
//                 </option>
//                 {productos.map((p) => (
//                   <option
//                     key={p.id}
//                     value={p.id}
//                     disabled={items.some((item) => Number(item.id) === Number(p.id))}
//                   >
//                     {p.nombre} — ${Math.floor(p.precio).toLocaleString("es-AR")} ({p.stock} en stock)
//                   </option>
//                 ))}
//               </select>

//               <div className="mt-4 space-y-2">
//                 {items.map((item) => (
//                   <div
//                     key={item.detalle_id ?? item.id}
//                     className="bg-neutral-700 p-3 rounded-lg flex items-center justify-between gap-3"
//                   >
//                     <div className="flex-1 min-w-0">
//                       <p className="font-semibold text-gray-100 truncate">{item.nombre}</p>

//                       <div className="flex gap-2 items-center text-xs text-gray-400 mt-1">
//                         <span>Cant.</span>
//                         <input
//                           type="number"
//                           inputMode="numeric"
//                           pattern="\d*"
//                           value={item.cantidad}
//                           onChange={(e) => handleUpdateItem(item.id, "cantidad", e.target.value)}
//                           className="w-12 bg-neutral-600 p-1 rounded text-white text-center"
//                         />
//                         <span>x</span>
//                         <input
//                           type="text"
//                           inputMode="numeric"
//                           pattern="\d*"
//                           value={item.precio}
//                           onChange={(e) => handleUpdateItem(item.id, "precio", e.target.value)}
//                           className="w-16 bg-neutral-600 p-1 rounded text-white text-center"
//                         />
//                         <span className="text-gray-300 font-bold ml-1">
//                           ${ (Number(item.cantidad) * Number(item.precio)).toLocaleString("es-AR") }
//                         </span>
//                       </div>

//                       <p className="text-xs text-gray-500 mt-1">
//                         Stock disponible hoy: <span className="text-gray-300">{item.stock}</span>
//                         {isEdicion && (
//                           <>
//                             {" · "}Cantidad previa:{" "}
//                             <span className="text-gray-300">{getPrevCant(item.id)}</span>
//                           </>
//                         )}
//                       </p>
//                     </div>

//                     <button
//                       type="button"
//                       onClick={() => handleRemoveItem(item.detalle_id ?? item.id)}
//                       className="text-red-400 hover:text-red-500 transition-colors self-start"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 100 2h2a1 1 0 100-2h-2z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* PAGADO */}
//             <div>
//               <label className="block text-sm text-gray-300 mb-1">Monto Pagado</label>
//               <input
//                 type="text"
//                 inputMode="numeric"
//                 pattern="\d*"
//                 value={pagado}
//                 onChange={onChangePagado}
//                 className="w-full bg-neutral-700 p-2 rounded text-white"
//               />
//             </div>

//             {/* Resumen */}
//             <div className="flex justify-between items-center text-sm text-gray-200 mt-2">
//               <div>
//                 <div>Total:</div>
//                 <div className="text-xl font-bold">${total.toLocaleString("es-AR")}</div>
//               </div>
//               <div>
//                 <div>Saldo:</div>
//                 <div className={`text-lg font-semibold ${saldo > 0 ? "text-red-400" : "text-green-400"}`}>
//                   ${saldo.toLocaleString("es-AR")}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Botones */}
//           <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-700">
//             <button
//               type="button"
//               onClick={handleClose}
//               className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
//             >
//               Cancelar
//             </button>
//             <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded">
//               {initialData ? "Guardar Cambios" : "Guardar Venta"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default VentasModal;

// src/components/Ventas/VentasModal.jsx
import { useEffect, useMemo, useState } from "react";
import { getClientes } from "../../api/ClienteApi";
import { getProductos } from "../../api/ProductoApi";

const VentasModal = ({ onClose, onGuardar, initialData }) => {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [productos, setProductos] = useState([]);
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

  // ===== Cargar datos iniciales =====
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const clientesResponse = await getClientes();
        const listaClientes = Array.isArray(clientesResponse)
          ? clientesResponse
          : clientesResponse?.data ?? [];
        setClientes(listaClientes);
        setFilteredClientes(listaClientes);

        const productosResponse = await getProductos();
        const listaProductos = Array.isArray(productosResponse?.data)
          ? productosResponse.data
          : Array.isArray(productosResponse)
          ? productosResponse
          : [];
        setProductos(listaProductos);
      } catch (err) {
        console.error("Error cargando datos iniciales:", err);
      }
    };
    fetchInitialData();
  }, []);

  // ===== Cargar initialData =====
  useEffect(() => {
    if (initialData && productos.length > 0 && clientes.length > 0) {
      const cliId = initialData?.cliente?.id ?? initialData?.cliente_id;
      if (cliId) {
        const clienteEncontrado = clientes.find((c) => Number(c.id) === Number(cliId));
        if (clienteEncontrado) {
          setClienteSeleccionado(clienteEncontrado);
          setSearch(`${clienteEncontrado.nombre} ${clienteEncontrado.apellido}`);
        } else {
          setClienteSeleccionado(null);
          setSearch("");
        }
      } else {
        setClienteSeleccionado(null);
        setSearch("");
      }

      const detalles = initialData.detalle_venta || initialData.detalles || [];
      const loadedItems = detalles.map((detail) => {
        const productInfo = productos.find((p) => Number(p.id) === Number(detail.producto_id));
        return {
          detalle_id: detail.id ?? null,
          id: Number(detail.producto_id),
          nombre: productInfo ? productInfo.nombre : "Producto desconocido",
          cantidad: Number(detail.cantidad),
          precio: Number(detail.precio_unitario),
          stock: Number(productInfo ? productInfo.stock : 0),
        };
      });
      setItems(loadedItems);

      const abonado = Number(initialData.monto_abonado ?? 0);
      setPagado(String(Number.isFinite(abonado) ? Math.floor(abonado) : 0));
    }
  }, [initialData, productos, clientes]);

  // ===== Búsqueda clientes =====
  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      setFilteredClientes(clientes);
      return;
    }
    setFilteredClientes(
      clientes.filter(
        (c) =>
          (c.nombre || "").toLowerCase().includes(q) ||
          (c.apellido || "").toLowerCase().includes(q) ||
          (c.celular || "").includes(q)
      )
    );
  }, [search, clientes]);

  // ===== Cerrar con ESC =====
  useEffect(() => {
    const onKeyDown = (ev) => {
      if (ev.key === "Escape" && !saving) handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saving, clientes]); // clientes para que handleClose tenga data cargada

  // ===== Helpers =====
  const handleSelectCliente = (c) => {
    setClienteSeleccionado(c);
    setSearch(`${c.nombre} ${c.apellido}`);
    setShowDropdown(false);
  };

  const handleClearCliente = () => {
    setClienteSeleccionado(null);
    setSearch("");
    setFilteredClientes(clientes);
  };

  const sanitizeNumberString = (raw) => {
    if (raw == null) return "";
    return String(raw).replace(/[^0-9]/g, "");
  };

  const onChangePagado = (e) => {
    const v = sanitizeNumberString(e.target.value);
    setPagado(v === "" ? "" : v);
  };

  // ===== Items =====
  const handleAddItem = (e) => {
    const productoSeleccionado = productos.find((p) => String(p.id) === String(e.target.value));
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
  };

  const handleUpdateItem = (prodId, field, value) => {
    setItems((prev) =>
      prev.map((item) => {
        if (Number(item.id) !== Number(prodId)) return item;

        let sanitizedValue = sanitizeNumberString(value);

        if (field === "cantidad") {
          const prevCant = getPrevCant(prodId);
          const stock = Number(item.stock ?? 0);
          let newCantidad = Number(sanitizedValue);

          if (!Number.isFinite(newCantidad) || newCantidad <= 0) newCantidad = 1;

          if (isEdicion) {
            const maxPermitida = prevCant + stock;
            if (newCantidad > maxPermitida) newCantidad = maxPermitida;
          } else {
            if (newCantidad > stock) newCantidad = stock;
          }
          sanitizedValue = String(newCantidad);
        }

        if (field === "precio") {
          const n = Number(sanitizedValue);
          if (!Number.isFinite(n) || n <= 0) sanitizedValue = "1";
        }

        return { ...item, [field]: sanitizedValue };
      })
    );
  };

  const handleRemoveItem = (idOrDetalleId) => {
    setItems((prev) =>
      prev.filter(
        (it) =>
          !(it.detalle_id && Number(it.detalle_id) === Number(idOrDetalleId)) &&
          !(Number(it.id) === Number(idOrDetalleId))
      )
    );
  };

  // ===== Totales =====
  const total = items.reduce((acc, item) => acc + Number(item.cantidad || 0) * Number(item.precio || 0), 0);
  const pagadoNum = Number(pagado || 0);
  const saldo = Math.max(0, total - pagadoNum);

  useEffect(() => {
    setMontoAbonadoToForm(pagadoNum);
  }, [pagadoNum]);

  // ===== Submit =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (!Array.isArray(items) || items.length === 0) {
      alert("Debe agregar al menos un producto.");
      return;
    }

    for (const item of items) {
      const cant = Number(item.cantidad);
      const precio = Number(item.precio);
      const stock = Number(item.stock ?? 0);

      if (cant <= 0) return alert("Cantidad inválida. Debe ser mayor a 0.");
      if (precio <= 0) return alert("Precio inválido. Debe ser mayor a 0.");

      const prevCant = getPrevCant(item.id);
      if (isEdicion) {
        const incremento = cant - prevCant;
        if (incremento > 0 && incremento > stock) {
          return alert(
            `No hay stock suficiente para ${item.nombre}. Necesitás ${incremento} adicional y hay ${stock} disponible.`
          );
        }
      } else {
        if (cant > stock) {
          return alert(`La cantidad de ${item.nombre} no puede ser mayor al stock disponible (${stock}).`);
        }
      }
    }

    if (pagado !== "" && pagadoNum > total) {
      alert("El monto pagado no puede exceder el total.");
      return;
    }

    if (!clienteSeleccionado?.id) {
      alert("Seleccioná un cliente.");
      return;
    }

    const ventaPayload = {
      id: initialData?.id ?? initialData?.venta_id ?? undefined,
      cliente_id: clienteSeleccionado.id,
      monto_abonado: montoAbonadoToForm,
      fecha: new Date().toISOString(),
      total,
      saldo,
      detalles: items.map((item) => ({
        id: item.detalle_id || null,
        producto_id: Number(item.id),
        cantidad: Number(item.cantidad),
        precio_unitario: Number(item.precio),
      })),
    };

    try {
      setSaving(true);
      await onGuardar(ventaPayload); // ✅ si falla, no cerramos
      handleClose(); // ✅ cerrar solo si OK
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (saving) return;
    setClienteSeleccionado(null);
    setSearch("");
    setFilteredClientes(clientes);
    setItems([]);
    setPagado("");
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* overlay */}
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        onClick={handleClose}
        aria-label="Cerrar"
        disabled={saving}
      />

      <div
        className="relative w-full max-w-lg bg-neutral-800 rounded-2xl p-6 shadow-lg text-white flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* X */}
        <button
          type="button"
          onClick={handleClose}
          disabled={saving}
          aria-label="Cerrar"
          className="absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full
                     bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white
                     transition focus:outline-none focus:ring-2 focus:ring-emerald-500/60
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            {isEdicion ? "✏️ Editar Venta (Local)" : "➕ Registrar Venta (Local)"}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Seleccioná cliente, agregá productos y registrá el pago.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 -mr-2">
            {/* Cliente (card) */}
            <div className="bg-neutral-700 p-3 rounded">
              <label className="block text-sm text-gray-300 mb-1">Cliente</label>

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                placeholder="Buscar por nombre, apellido o celular"
                disabled={saving}
                className="w-full bg-neutral-600 p-2 rounded text-white transition
                           focus:outline-none focus:ring-2 focus:ring-emerald-500/60 disabled:opacity-60"
              />

              {showDropdown && (
                <ul className="absolute z-50 mt-1 bg-neutral-700 w-[calc(100%-3rem)] rounded max-h-44 overflow-y-auto shadow-lg border border-white/10">
                  {filteredClientes.length > 0 ? (
                    filteredClientes.map((c) => (
                      <li
                        key={c.id}
                        onMouseDown={() => handleSelectCliente(c)}
                        className={`px-3 py-2 hover:bg-neutral-600 cursor-pointer ${
                          clienteSeleccionado?.id === c.id ? "bg-neutral-600" : ""
                        }`}
                      >
                        {c.nombre} {c.apellido}
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-gray-300">Sin resultados</li>
                  )}
                </ul>
              )}

              {clienteSeleccionado && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="px-3 py-1 rounded bg-neutral-800/60 border border-white/10 text-sm truncate">
                    {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
                  </div>
                  <button
                    type="button"
                    onClick={handleClearCliente}
                    disabled={saving}
                    className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-sm
                               transition disabled:opacity-60"
                  >
                    Limpiar
                  </button>
                </div>
              )}
            </div>

            {/* Productos (card) */}
            <div className="bg-neutral-700 p-3 rounded space-y-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Productos</label>
                <select
                  onChange={handleAddItem}
                  className="w-full bg-neutral-600 p-2 rounded text-white transition
                             focus:outline-none focus:ring-2 focus:ring-emerald-500/60 disabled:opacity-60"
                  value=""
                  disabled={saving}
                >
                  <option value="" disabled>
                    Añadir un producto
                  </option>
                  {productos.map((p) => (
                    <option
                      key={p.id}
                      value={p.id}
                      disabled={items.some((item) => Number(item.id) === Number(p.id))}
                    >
                      {p.nombre} — ${Math.floor(p.precio).toLocaleString("es-AR")} ({p.stock} stock)
                    </option>
                  ))}
                </select>
              </div>

              {/* Lista items */}
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.detalle_id ?? item.id}
                    className="bg-neutral-800/50 border border-white/10 p-3 rounded-lg flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-100 truncate">{item.nombre}</p>

                      <div className="flex flex-wrap gap-2 items-center text-xs text-gray-300 mt-2">
                        <span className="text-gray-400">Cant.</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="\d*"
                          value={item.cantidad}
                          onChange={(e) => handleUpdateItem(item.id, "cantidad", e.target.value)}
                          disabled={saving}
                          className="w-14 bg-neutral-600 p-2 rounded text-white text-center
                                     focus:outline-none focus:ring-2 focus:ring-emerald-500/60 disabled:opacity-60"
                        />
                        <span className="text-gray-400">x</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="\d*"
                          value={item.precio}
                          onChange={(e) => handleUpdateItem(item.id, "precio", e.target.value)}
                          disabled={saving}
                          className="w-24 bg-neutral-600 p-2 rounded text-white text-center
                                     focus:outline-none focus:ring-2 focus:ring-emerald-500/60 disabled:opacity-60"
                        />
                        <span className="ml-1 font-semibold text-gray-100">
                          ${ (Number(item.cantidad) * Number(item.precio)).toLocaleString("es-AR") }
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 mt-2">
                        Stock hoy: <span className="text-gray-300">{item.stock}</span>
                        {isEdicion && (
                          <>
                            {" · "}Previo: <span className="text-gray-300">{getPrevCant(item.id)}</span>
                          </>
                        )}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.detalle_id ?? item.id)}
                      disabled={saving}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full
                                 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20
                                 text-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Quitar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 100 2h2a1 1 0 100-2h-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}

                {!items.length && (
                  <div className="text-sm text-gray-400 bg-neutral-800/40 border border-white/10 rounded-lg p-3">
                    Agregá productos desde el selector.
                  </div>
                )}
              </div>
            </div>

            {/* Pago + Resumen (cards) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-neutral-700 p-3 rounded">
                <label className="block text-sm text-gray-300 mb-1">Monto pagado</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  value={pagado}
                  onChange={onChangePagado}
                  disabled={saving}
                  className="w-full bg-neutral-600 p-2 rounded text-white transition
                             focus:outline-none focus:ring-2 focus:ring-emerald-500/60 disabled:opacity-60"
                  placeholder="Ej: 22000"
                />
                <p className="text-xs text-gray-400 mt-2">
                  El saldo se calcula automáticamente.
                </p>
              </div>

              <div className="bg-neutral-700 p-3 rounded">
                <div className="text-xs text-gray-400">Total</div>
                <div className="text-xl font-bold text-gray-100">
                  ${total.toLocaleString("es-AR")}
                </div>

                <div className="mt-3 text-xs text-gray-400">Saldo</div>
                <div className={`text-lg font-semibold ${saldo > 0 ? "text-red-300" : "text-emerald-300"}`}>
                  ${saldo.toLocaleString("es-AR")}
                </div>
              </div>
            </div>

            {saving && (
              <div className="text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-200">
                ⏳ Guardando… por favor no cierres esta ventana.
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-700">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving || !clienteSeleccionado?.id || items.length === 0}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded transition
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Guardando...
                </>
              ) : isEdicion ? (
                "Guardar cambios"
              ) : (
                "Guardar venta"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VentasModal;
