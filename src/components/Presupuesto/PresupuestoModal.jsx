

// // src/components/presupuestos/PresupuestoModal.jsx
// import { useEffect, useMemo, useState } from "react";
// import {
//   createPresupuesto,
//   updatePresupuesto,
//   savePresupuestoDetalles,
//   getPresupuestoWithDetalles,
// } from "../../api/PresupuestoApi";
// import { getEstadoByAmbito } from "../../api/EstadoApi.jsx";
// import { getProductosRepuestoByTipoEquipo } from "../../api/ProductoApi.jsx";

// const PresupuestoModal = ({
//   isOpen,
//   onClose,
//   ingresoSeleccionado,   // { id: number } — ahora es orden_trabajo_id
//   presupuesto,
//   esEdicion = false,
//   onPresupuestoGuardado,
//   showAlert,
//   tipoEquipo,
// }) => {
//   const [estados, setEstados] = useState([]);
//   const [loadingEstados, setLoadingEstados] = useState(true);
//   const [productos, setProductos] = useState([]);
//   const [loadingProductos, setLoadingProductos] = useState(false);

//   const [formData, setFormData] = useState({
//     fecha: new Date().toISOString().split("T")[0],
//     costo: "",
//     total: "",
//     observaciones: "",
//     estado_id: "",
//   });

//   const [busquedaProd, setBusquedaProd] = useState("");
//   const [productoSeleccionadoId, setProductoSeleccionadoId] = useState("");
//   const [cantidadProducto, setCantidadProducto] = useState("1");
//   const [precioProducto, setPrecioProducto] = useState("");
//   const [lineas, setLineas] = useState([]);

//   const pendienteId = useMemo(() => {
//     const p = estados.find(e => e.nombre?.toLowerCase() === "pendiente");
//     return p?.id ?? "";
//   }, [estados]);

//   useEffect(() => {
//     if (!isOpen) return;
//     (async () => {
//       try {
//         setLoadingEstados(true);
//         const lista = await getEstadoByAmbito("presupuesto");
//         setEstados(lista || []);
//       } catch (e) {
//         console.error("Error cargando estados:", e);
//       } finally {
//         setLoadingEstados(false);
//       }
//     })();
//   }, [isOpen]);

//   useEffect(() => {
//     if (!isOpen) return;
//     (async () => {
//       try {
//         setLoadingProductos(true);
//         const lista = await getProductosRepuestoByTipoEquipo(tipoEquipo);
//         setProductos(Array.isArray(lista) ? lista : []);
//       } catch (e) {
//         console.error("Error cargando productos:", e);
//         setProductos([]);
//       } finally {
//         setLoadingProductos(false);
//       }
//     })();
//   }, [isOpen, tipoEquipo]);

//   useEffect(() => {
//     if (!isOpen) return;
//     if (esEdicion && presupuesto) {
//       setFormData({
//         fecha: presupuesto.fecha_presupuesto
//           ? new Date(presupuesto.fecha_presupuesto).toISOString().split("T")[0]
//           : new Date().toISOString().split("T")[0],
//         costo: String(presupuesto.costo_presupuesto ?? ""),
//         total: String(presupuesto.total_presupuesto ?? ""),
//         observaciones: presupuesto.observaciones_presupuesto ?? "",
//         estado_id: String(presupuesto.estado_presupuesto_id ?? pendienteId ?? ""),
//       });
//       setLineas([]);
//     } else {
//       setFormData({
//         fecha: new Date().toISOString().split("T")[0],
//         costo: "",
//         total: "",
//         observaciones: "",
//         estado_id: pendienteId ? String(pendienteId) : "",
//       });
//       setLineas([]);
//     }
//     setBusquedaProd("");
//     setProductoSeleccionadoId("");
//     setCantidadProducto("1");
//     setPrecioProducto("");
//   }, [isOpen, esEdicion, presupuesto, pendienteId]);

//   useEffect(() => {
//     if (!isOpen || !esEdicion || !presupuesto?.presupuesto_id) return;
//     (async () => {
//       try {
//         const full = await getPresupuestoWithDetalles(presupuesto.presupuesto_id);
//         const detalles = (full.presupuesto_detalle || []).map(d => ({
//           producto_id:    d.producto_id,
//           cantidad:       d.cantidad,
//           precio_unitario: d.precio_unitario,
//           nombre:         d.producto?.nombre || "",
//         }));
//         setLineas(detalles);
//       } catch (error) {
//         console.error("Error cargando detalles:", error);
//       }
//     })();
//   }, [isOpen, esEdicion, presupuesto]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "costo" || name === "total") {
//       setFormData(prev => ({ ...prev, [name]: value.replace(/[^\d]/g, "") }));
//       return;
//     }
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const formatMoneySeguro = (valor) => {
//     const n = Number(valor ?? 0);
//     if (Number.isNaN(n)) return "0";
//     return n.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
//   };

//   useEffect(() => {
//     if (!productoSeleccionadoId) { setPrecioProducto(""); return; }
//     const prod = productos.find(p => Number(p.id) === Number(productoSeleccionadoId));
//     if (prod) setPrecioProducto(prod.precio != null ? String(prod.precio).replace(",", ".") : "");
//   }, [productoSeleccionadoId, productos]);

//   const handleAgregarLinea = () => {
//     const prodId   = Number(productoSeleccionadoId);
//     const cantidad = parseInt(cantidadProducto || "0", 10);
//     const precioUnit = parseFloat(precioProducto || "0");

//     if (!prodId)            { showAlert?.("Seleccioná un producto.", "warning"); return; }
//     if (!cantidad || cantidad <= 0) { showAlert?.("La cantidad debe ser mayor a 0.", "warning"); return; }
//     if (!precioUnit || precioUnit <= 0) { showAlert?.("El precio debe ser mayor a 0.", "warning"); return; }

//     const prod    = productos.find(p => Number(p.id) === prodId);
//     const nombre  = prod?.nombre || `Producto #${prodId}`;
//     const subtotal = cantidad * precioUnit;

//     setLineas(prev => {
//       const idx = prev.findIndex(l => l.producto_id === prodId);
//       if (idx >= 0) {
//         const copia = [...prev];
//         const nuevaCant = copia[idx].cantidad + cantidad;
//         copia[idx] = { ...copia[idx], cantidad: nuevaCant, precio_unitario: precioUnit, subtotal: nuevaCant * precioUnit };
//         return copia;
//       }
//       return [...prev, { tempId: `${prodId}-${Date.now()}`, producto_id: prodId, nombre, cantidad, precio_unitario: precioUnit, subtotal }];
//     });
//     setCantidadProducto("1");
//   };

//   const handleEliminarLinea = (tempIdOrProdId) => {
//     setLineas(prev => prev.filter(l => l.tempId !== tempIdOrProdId && l.producto_id !== tempIdOrProdId));
//   };

//   const totalProductos = useMemo(() => lineas.reduce((acc, l) => acc + (l.subtotal || 0), 0), [lineas]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.fecha)                              { showAlert?.("La fecha es obligatoria", "error"); return; }
//     if (formData.total === "" || isNaN(Number(formData.total))) { showAlert?.("El total es obligatorio", "error"); return; }

//     // ⬇️ CAMBIO CLAVE: orden_trabajo_id en lugar de ingreso_id
//     const payloadCabecera = {
//       orden_trabajo_id: esEdicion
//         ? (presupuesto.orden_trabajo_id ?? presupuesto.ingreso_id ?? null)
//         : ingresoSeleccionado?.id ?? null,
//       fecha:         formData.fecha,
//       costo:         formData.costo ? parseInt(formData.costo, 10) : 0,
//       total:         formData.total ? parseInt(formData.total, 10) : 0,
//       observaciones: formData.observaciones || "",
//       estado_id:     formData.estado_id ? Number(formData.estado_id) : pendienteId || null,
//     };

//     if (!esEdicion && !payloadCabecera.orden_trabajo_id) {
//       showAlert?.("No hay orden de trabajo seleccionada.", "error"); return;
//     }

//     try {
//       let presupuestoId = null;

//       if (esEdicion) {
//         const idPresupuesto = presupuesto?.presupuesto_id ?? presupuesto?.id ?? null;
//         if (!idPresupuesto) { showAlert?.("No hay presupuesto válido para editar.", "error"); return; }
//         await updatePresupuesto(idPresupuesto, {
//           fecha:         payloadCabecera.fecha,
//           costo:         payloadCabecera.costo,
//           total:         payloadCabecera.total,
//           observaciones: payloadCabecera.observaciones,
//           estado_id:     payloadCabecera.estado_id,
//         });
//         presupuestoId = idPresupuesto;
//         showAlert?.("Presupuesto actualizado ✅", "success");
//       } else {
//         const creado = await createPresupuesto(payloadCabecera);
//         presupuestoId = creado?.id ?? creado?.presupuesto_id ?? null;
//         if (!presupuestoId) { showAlert?.("No se pudo obtener el ID del presupuesto.", "error"); return; }
//         showAlert?.("Presupuesto creado ✅", "success");
//       }

//       if (presupuestoId && lineas.length > 0) {
//         await savePresupuestoDetalles(presupuestoId, lineas.map(l => ({
//           producto_id:    l.producto_id,
//           cantidad:       l.cantidad,
//           precio_unitario: l.precio_unitario,
//         })));
//       }

//       onPresupuestoGuardado?.();
//       onClose();
//     } catch (error) {
//       console.error("Error al guardar presupuesto:", error);
//       showAlert?.("Error al guardar presupuesto ❌", "error");
//     }
//   };

//   if (!isOpen) return null;

//   const productosFiltrados = productos.filter(p => {
//     if (!busquedaProd.trim()) return true;
//     const q = busquedaProd.toLowerCase();
//     return p.nombre?.toLowerCase().includes(q) || p.descripcion?.toLowerCase().includes(q);
//   });

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//       <div className="bg-neutral-800 p-6 rounded-xl w-full max-w-2xl shadow-lg text-neutral-100 max-h-[85vh] overflow-y-auto">
//         <h2 className="text-xl font-semibold mb-4">
//           {esEdicion ? "Editar Presupuesto" : "Agregar nuevo Presupuesto"}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <div>
//               <label className="block mb-1 text-sm text-gray-300">Fecha</label>
//               <input type="date" name="fecha" value={formData.fecha} onChange={handleChange}
//                 className="w-full bg-neutral-700 text-white p-2 rounded" required />
//             </div>
//             <div>
//               <label className="block mb-1 text-sm text-gray-300">Costo materiales</label>
//               <input inputMode="numeric" name="costo" value={formData.costo} onChange={handleChange}
//                 placeholder="0" className="w-full bg-neutral-700 text-white p-2 rounded" />
//               {formData.costo && <p className="text-xs text-gray-400 mt-1">Vista: {formatMoneySeguro(formData.costo)}</p>}
//             </div>
//             <div>
//               <label className="block mb-1 text-sm text-gray-300">Total (cliente) *</label>
//               <input inputMode="numeric" name="total" value={formData.total} onChange={handleChange}
//                 placeholder="0" className="w-full bg-neutral-700 text-white p-2 rounded" required />
//               {formData.total && <p className="text-xs text-gray-400 mt-1">Vista: {formatMoneySeguro(formData.total)}</p>}
//             </div>
//           </div>

//           <div>
//             <label className="block mb-1 text-sm text-gray-300">Observaciones</label>
//             <textarea name="observaciones" value={formData.observaciones} onChange={handleChange}
//               placeholder="Observaciones (opcional)" className="w-full bg-neutral-700 text-white p-2 rounded" rows={3} />
//           </div>

//           <div>
//             <label className="block text-sm text-gray-300 mb-1">Estado</label>
//             <select name="estado_id" value={formData.estado_id} onChange={handleChange}
//               className="w-full bg-neutral-700 text-white p-2 rounded" required>
//               <option value="">{loadingEstados ? "Cargando estados..." : "Seleccioná un estado"}</option>
//               {!loadingEstados && estados.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
//             </select>
//           </div>

//           {/* Sección productos */}
//           <div className="border border-white/10 rounded-xl p-3 sm:p-4 bg-neutral-900/40">
//             <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
//               <h3 className="text-sm font-semibold">Productos para este presupuesto</h3>
//               {tipoEquipo && <span className="text-[11px] text-neutral-300/80">Equipo: <span className="font-medium">{tipoEquipo}</span></span>}
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
//               <div className="sm:col-span-2">
//                 <input type="text" value={busquedaProd} onChange={e => setBusquedaProd(e.target.value)}
//                   placeholder="Buscar producto..." className="w-full bg-neutral-700 text-white p-2 rounded text-sm" />
//                 <select value={productoSeleccionadoId} onChange={e => setProductoSeleccionadoId(e.target.value)}
//                   className="w-full bg-neutral-700 text-white p-2 rounded mt-2 text-sm" disabled={loadingProductos}>
//                   <option value="">{loadingProductos ? "Cargando..." : "Seleccioná un producto"}</option>
//                   {productosFiltrados.map(p => (
//                     <option key={p.id} value={p.id}>{p.nombre}{p.precio != null ? ` — $${formatMoneySeguro(p.precio)}` : ""}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="flex flex-col gap-2">
//                 <div className="flex gap-2">
//                   <input type="number" min="1" value={cantidadProducto} onChange={e => setCantidadProducto(e.target.value)}
//                     className="w-20 bg-neutral-700 text-white p-2 rounded text-sm" placeholder="Cant." />
//                   <input type="number" step="0.01" value={precioProducto} onChange={e => setPrecioProducto(e.target.value)}
//                     className="flex-1 bg-neutral-700 text-white p-2 rounded text-sm" placeholder="Precio" />
//                 </div>
//                 <button type="button" onClick={handleAgregarLinea}
//                   className="w-full bg-emerald-600 hover:bg-emerald-700 text-sm font-semibold py-2 rounded" disabled={loadingProductos}>
//                   Agregar
//                 </button>
//               </div>
//             </div>

//             {lineas.length > 0 ? (
//               <div className="mt-3 border-t border-white/10 pt-3 space-y-2">
//                 <div className="flex justify-between text-xs text-neutral-300">
//                   <span>Productos agregados</span>
//                   <span>Total: <strong>${formatMoneySeguro(totalProductos)}</strong></span>
//                 </div>
//                 <ul className="space-y-2 text-xs sm:text-sm">
//                   {lineas.map(l => (
//                     <li key={l.tempId ?? `${l.producto_id}-${l.nombre}`}
//                       className="flex items-center justify-between gap-2 rounded-lg bg-neutral-800/80 px-2 py-1.5">
//                       <div className="flex-1 min-w-0">
//                         <p className="font-medium truncate">{l.nombre}</p>
//                         <p className="text-neutral-300/80">{l.cantidad} unid. x ${formatMoneySeguro(l.precio_unitario)} = <span className="font-semibold">${formatMoneySeguro(l.subtotal)}</span></p>
//                       </div>
//                       <button type="button" onClick={() => handleEliminarLinea(l.tempId ?? l.producto_id)}
//                         className="text-xs text-red-400 hover:text-red-300">✕</button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ) : (
//               <p className="mt-2 text-[11px] text-neutral-400">
//                 Podés guardar sin productos o sumarlos para que luego se conviertan en venta.
//               </p>
//             )}
//           </div>

//           <div className="flex justify-end gap-3 mt-4">
//             <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded">Cancelar</button>
//             <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded">
//               {esEdicion ? "Guardar cambios" : "Guardar"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PresupuestoModal;

// src/components/presupuestos/PresupuestoModal.jsx
import { useEffect, useMemo, useState } from "react";
import {
  createPresupuesto,
  updatePresupuesto,
  savePresupuestoDetalles,
  getPresupuestoWithDetalles,
} from "../../api/PresupuestoApi";
import { getEstadoByAmbito } from "../../api/EstadoApi.jsx";
import { getProductosRepuestoByTipoEquipo } from "../../api/ProductoApi.jsx";
import {
  getServicios,
  getConfiguracionServicios,
  getPresupuestoServicios,
  savePresupuestoServicios,
} from "../../api/ServicioApi.jsx";
import {
  CONFIG_DEFAULT,
  precioListaLinea,
  precioSugeridoLinea,
  diferenciaContraLista,
  formatPesos,
} from "../../utils/precioServicio.js";

// ---- Líneas de servicio ----
let _seqLinea = 0;
const nuevaKey = () => `ls-${Date.now()}-${++_seqLinea}`;
const numero = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const soloNumero = (v) => String(v ?? "").replace(",", ".").replace(/[^\d.]/g, "");

// Precio de lista del catálogo (para mostrar la diferencia): fijo = precio base;
// repuesto = costo × multiplicador del servicio, redondeado.
const precioCatalogo = (l, config) =>
  l.tipo_calculo === "repuesto"
    ? precioListaLinea({ tipo_calculo: "repuesto", costo_repuesto: l.costo_repuesto, multiplicador: l.multiplicador_catalogo ?? l.multiplicador }, config)
    : l.tipo_calculo === "manual"
      ? 0
      : numero(l.precio_base);

const recalcularLinea = (l, config) =>
  l.editado ? l : { ...l, precio_final: String(precioSugeridoLinea(l, config)) };

const PresupuestoModal = ({
  isOpen,
  onClose,
  ingresoSeleccionado,   // { id: number } — ahora es orden_trabajo_id
  presupuesto,
  esEdicion = false,
  onPresupuestoGuardado,
  showAlert,
  tipoEquipo,
}) => {
  const [estados, setEstados] = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(true);
  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(false);

  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0],
    costo: "",
    total: "",
    observaciones: "",
    estado_id: "",
  });

  const [busquedaProd, setBusquedaProd] = useState("");
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState("");
  const [cantidadProducto, setCantidadProducto] = useState("1");
  const [precioProducto, setPrecioProducto] = useState("");
  const [lineas, setLineas] = useState([]);

  // Servicios
  const [servicios, setServicios] = useState([]);
  const [configPrecios, setConfigPrecios] = useState(CONFIG_DEFAULT);
  const [busquedaServ, setBusquedaServ] = useState("");
  const [servicioSelId, setServicioSelId] = useState("");
  const [lineasServ, setLineasServ] = useState([]);
  const [teniaLineasServ, setTeniaLineasServ] = useState(false);

  const pendienteId = useMemo(() => {
    const p = estados.find(e => e.nombre?.toLowerCase() === "pendiente");
    return p?.id ?? "";
  }, [estados]);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        setLoadingEstados(true);
        const lista = await getEstadoByAmbito("presupuesto");
        setEstados(lista || []);
      } catch (e) {
        console.error("Error cargando estados:", e);
      } finally {
        setLoadingEstados(false);
      }
    })();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        setLoadingProductos(true);
        const lista = await getProductosRepuestoByTipoEquipo(tipoEquipo);
        setProductos(Array.isArray(lista) ? lista : []);
      } catch (e) {
        console.error("Error cargando productos:", e);
        setProductos([]);
      } finally {
        setLoadingProductos(false);
      }
    })();
  }, [isOpen, tipoEquipo]);

  // Catálogo de servicios + configuración de precios
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const [svs, cfg] = await Promise.all([
          getServicios(),
          getConfiguracionServicios().catch(() => CONFIG_DEFAULT),
        ]);
        setServicios(Array.isArray(svs) ? svs : []);
        setConfigPrecios({ ...CONFIG_DEFAULT, ...(cfg || {}) });
      } catch (e) {
        console.error("Error cargando servicios:", e);
        setServicios([]);
      }
    })();
  }, [isOpen]);

  // Líneas de servicio guardadas (edición)
  useEffect(() => {
    setLineasServ([]);
    setTeniaLineasServ(false);
    setBusquedaServ("");
    setServicioSelId("");
    if (!isOpen || !esEdicion || !presupuesto?.presupuesto_id) return;
    (async () => {
      try {
        const guardadas = await getPresupuestoServicios(presupuesto.presupuesto_id);
        const mapeadas = (guardadas || []).map((g) => ({
          key: nuevaKey(),
          servicio_id: g.servicio_id,
          descripcion: g.descripcion,
          categoria: g.servicio?.categoria?.nombre ?? "",
          tipo_calculo: g.tipo_calculo,
          cantidad: String(g.cantidad ?? 1),
          costo_repuesto: String(Math.round(numero(g.costo_repuesto))),
          multiplicador: String(g.multiplicador ?? g.servicio?.multiplicador ?? ""),
          multiplicador_catalogo: g.servicio?.multiplicador ?? g.multiplicador,
          precio_base: g.tipo_calculo === "fijo" ? numero(g.servicio?.precio_base ?? g.precio_lista) : 0,
          recargo_pct: g.recargo_pct ? String(g.recargo_pct) : "",
          precio_final: String(Math.round(numero(g.precio_final))),
          editado: true, // conserva el precio guardado
        }));
        setLineasServ(mapeadas);
        setTeniaLineasServ(mapeadas.length > 0);
      } catch (e) {
        console.error("Error cargando servicios del presupuesto:", e);
      }
    })();
  }, [isOpen, esEdicion, presupuesto]);

  useEffect(() => {
    if (!isOpen) return;
    if (esEdicion && presupuesto) {
      setFormData({
        fecha: presupuesto.fecha_presupuesto
          ? new Date(presupuesto.fecha_presupuesto).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        costo: String(presupuesto.costo_presupuesto ?? ""),
        total: String(presupuesto.total_presupuesto ?? ""),
        observaciones: presupuesto.observaciones_presupuesto ?? "",
        estado_id: String(presupuesto.estado_presupuesto_id ?? pendienteId ?? ""),
      });
      setLineas([]);
    } else {
      setFormData({
        fecha: new Date().toISOString().split("T")[0],
        costo: "",
        total: "",
        observaciones: "",
        estado_id: pendienteId ? String(pendienteId) : "",
      });
      setLineas([]);
    }
    setBusquedaProd("");
    setProductoSeleccionadoId("");
    setCantidadProducto("1");
    setPrecioProducto("");
  }, [isOpen, esEdicion, presupuesto, pendienteId]);

  useEffect(() => {
    if (!isOpen || !esEdicion || !presupuesto?.presupuesto_id) return;
    (async () => {
      try {
        const full = await getPresupuestoWithDetalles(presupuesto.presupuesto_id);
        const detalles = (full.presupuesto_detalle || []).map(d => ({
          producto_id:    d.producto_id,
          cantidad:       d.cantidad,
          precio_unitario: d.precio_unitario,
          nombre:         d.producto?.nombre || "",
        }));
        setLineas(detalles);
      } catch (error) {
        console.error("Error cargando detalles:", error);
      }
    })();
  }, [isOpen, esEdicion, presupuesto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "costo" || name === "total") {
      setFormData(prev => ({ ...prev, [name]: value.replace(/[^\d]/g, "") }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatMoneySeguro = (valor) => {
    const n = Number(valor ?? 0);
    if (Number.isNaN(n)) return "0";
    return n.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  useEffect(() => {
    if (!productoSeleccionadoId) { setPrecioProducto(""); return; }
    const prod = productos.find(p => Number(p.id) === Number(productoSeleccionadoId));
    if (prod) setPrecioProducto(prod.precio != null ? String(prod.precio).replace(",", ".") : "");
  }, [productoSeleccionadoId, productos]);

  const handleAgregarLinea = () => {
    const prodId   = Number(productoSeleccionadoId);
    const cantidad = parseInt(cantidadProducto || "0", 10);
    const precioUnit = parseFloat(precioProducto || "0");

    if (!prodId)            { showAlert?.("Seleccioná un producto.", "warning"); return; }
    if (!cantidad || cantidad <= 0) { showAlert?.("La cantidad debe ser mayor a 0.", "warning"); return; }
    if (!precioUnit || precioUnit <= 0) { showAlert?.("El precio debe ser mayor a 0.", "warning"); return; }

    const prod    = productos.find(p => Number(p.id) === prodId);
    const nombre  = prod?.nombre || `Producto #${prodId}`;
    const subtotal = cantidad * precioUnit;

    setLineas(prev => {
      const idx = prev.findIndex(l => l.producto_id === prodId);
      if (idx >= 0) {
        const copia = [...prev];
        const nuevaCant = copia[idx].cantidad + cantidad;
        copia[idx] = { ...copia[idx], cantidad: nuevaCant, precio_unitario: precioUnit, subtotal: nuevaCant * precioUnit };
        return copia;
      }
      return [...prev, { tempId: `${prodId}-${Date.now()}`, producto_id: prodId, nombre, cantidad, precio_unitario: precioUnit, subtotal }];
    });
    setCantidadProducto("1");
  };

  const handleEliminarLinea = (tempIdOrProdId) => {
    setLineas(prev => prev.filter(l => l.tempId !== tempIdOrProdId && l.producto_id !== tempIdOrProdId));
  };

  const totalProductos = useMemo(() => lineas.reduce((acc, l) => acc + (l.subtotal || 0), 0), [lineas]);

  // ---- Servicios: agregar / editar / quitar ----
  const serviciosFiltrados = useMemo(() => {
    const q = busquedaServ.trim().toLowerCase();
    if (!q) return servicios;
    return servicios.filter(
      (sv) => sv.nombre?.toLowerCase().includes(q) || sv.categoria?.nombre?.toLowerCase().includes(q)
    );
  }, [servicios, busquedaServ]);

  const serviciosPorCategoria = useMemo(() => {
    const map = new Map();
    for (const sv of serviciosFiltrados) {
      const k = sv.categoria?.nombre || "Otros";
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(sv);
    }
    return [...map.entries()];
  }, [serviciosFiltrados]);

  const handleAgregarServicio = () => {
    const sv = servicios.find((x) => String(x.id) === String(servicioSelId));
    if (!sv) { showAlert?.("Seleccioná un servicio.", "warning"); return; }
    const base = {
      key: nuevaKey(),
      servicio_id: sv.id,
      descripcion: sv.nombre,
      categoria: sv.categoria?.nombre ?? "",
      tipo_calculo: sv.tipo_calculo,
      cantidad: "1",
      costo_repuesto: "",
      multiplicador: String(sv.multiplicador ?? configPrecios.multiplicador_repuesto_default ?? 3),
      multiplicador_catalogo: sv.multiplicador,
      precio_base: numero(sv.precio_base),
      recargo_pct: "",
      precio_final: "",
      editado: false,
    };
    setLineasServ((prev) => [...prev, recalcularLinea(base, configPrecios)]);
    setServicioSelId("");
    setBusquedaServ("");
  };

  const handleAgregarLineaManual = () => {
    setLineasServ((prev) => [
      ...prev,
      {
        key: nuevaKey(), servicio_id: null, descripcion: "", categoria: "", tipo_calculo: "manual",
        cantidad: "1", costo_repuesto: "", multiplicador: "", precio_base: 0, recargo_pct: "",
        precio_final: "", editado: true,
      },
    ]);
  };

  const actualizarLineaServ = (key, cambios) => {
    setLineasServ((prev) =>
      prev.map((l) => {
        if (l.key !== key) return l;
        const nueva = { ...l, ...cambios };
        if ("precio_final" in cambios) return { ...nueva, editado: true };
        return recalcularLinea(nueva, configPrecios);
      })
    );
  };

  const usarSugerido = (key) => {
    setLineasServ((prev) =>
      prev.map((l) => (l.key === key ? recalcularLinea({ ...l, editado: false }, configPrecios) : l))
    );
  };

  const quitarLineaServ = (key) => setLineasServ((prev) => prev.filter((l) => l.key !== key));

  const totalServicios = useMemo(
    () => lineasServ.reduce((acc, l) => acc + numero(l.precio_final) * Math.max(1, parseInt(l.cantidad || "1", 10) || 1), 0),
    [lineasServ]
  );
  const costoServicios = useMemo(
    () => lineasServ.reduce((acc, l) => acc + numero(l.costo_repuesto) * Math.max(1, parseInt(l.cantidad || "1", 10) || 1), 0),
    [lineasServ]
  );
  const usaServicios = lineasServ.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fecha)                              { showAlert?.("La fecha es obligatoria", "error"); return; }

    // Validar líneas de servicio
    for (const l of lineasServ) {
      if (!String(l.descripcion || "").trim()) { showAlert?.("Hay una línea de servicio sin descripción.", "error"); return; }
      if (l.precio_final === "" || isNaN(Number(l.precio_final)) || Number(l.precio_final) < 0) {
        showAlert?.(`Revisá el precio de "${l.descripcion}".`, "error"); return;
      }
      if (!(parseInt(l.cantidad || "0", 10) > 0)) { showAlert?.(`Revisá la cantidad de "${l.descripcion}".`, "error"); return; }
    }

    if (!usaServicios && (formData.total === "" || isNaN(Number(formData.total)))) { showAlert?.("El total es obligatorio", "error"); return; }

    // ⬇️ CAMBIO CLAVE: orden_trabajo_id en lugar de ingreso_id
    const payloadCabecera = {
      orden_trabajo_id: esEdicion
        ? (presupuesto.orden_trabajo_id ?? presupuesto.ingreso_id ?? null)
        : ingresoSeleccionado?.id ?? null,
      fecha:         formData.fecha,
      // Con servicios, total y costo salen de la suma de las líneas
      costo:         usaServicios ? Math.round(costoServicios) : (formData.costo ? parseInt(formData.costo, 10) : 0),
      total:         usaServicios ? Math.round(totalServicios) : (formData.total ? parseInt(formData.total, 10) : 0),
      observaciones: formData.observaciones || "",
      estado_id:     formData.estado_id ? Number(formData.estado_id) : pendienteId || null,
    };

    if (!esEdicion && !payloadCabecera.orden_trabajo_id) {
      showAlert?.("No hay orden de trabajo seleccionada.", "error"); return;
    }

    try {
      let presupuestoId = null;

      if (esEdicion) {
        const idPresupuesto = presupuesto?.presupuesto_id ?? presupuesto?.id ?? null;
        if (!idPresupuesto) { showAlert?.("No hay presupuesto válido para editar.", "error"); return; }
        await updatePresupuesto(idPresupuesto, {
          fecha:         payloadCabecera.fecha,
          costo:         payloadCabecera.costo,
          total:         payloadCabecera.total,
          observaciones: payloadCabecera.observaciones,
          estado_id:     payloadCabecera.estado_id,
        });
        presupuestoId = idPresupuesto;
        showAlert?.("Presupuesto actualizado ✅", "success");
      } else {
        const creado = await createPresupuesto(payloadCabecera);
        presupuestoId = creado?.id ?? creado?.presupuesto_id ?? null;
        if (!presupuestoId) { showAlert?.("No se pudo obtener el ID del presupuesto.", "error"); return; }
        showAlert?.("Presupuesto creado ✅", "success");
      }

      // Líneas de servicio (si hay, o si se quitaron todas las que tenía)
      if (presupuestoId && (usaServicios || teniaLineasServ)) {
        await savePresupuestoServicios(presupuestoId, lineasServ.map((l) => ({
          servicio_id:    l.servicio_id,
          descripcion:    String(l.descripcion || "").trim(),
          tipo_calculo:   l.tipo_calculo,
          cantidad:       parseInt(l.cantidad || "1", 10) || 1,
          costo_repuesto: numero(l.costo_repuesto),
          multiplicador:  l.tipo_calculo === "repuesto" ? numero(l.multiplicador) : null,
          recargo_pct:    numero(l.recargo_pct),
          precio_lista:   precioCatalogo(l, configPrecios),
          precio_final:   numero(l.precio_final),
        })));
      }

      if (presupuestoId && lineas.length > 0) {
        await savePresupuestoDetalles(presupuestoId, lineas.map(l => ({
          producto_id:    l.producto_id,
          cantidad:       l.cantidad,
          precio_unitario: l.precio_unitario,
        })));
      }

      onPresupuestoGuardado?.();
      onClose();
    } catch (error) {
      console.error("Error al guardar presupuesto:", error);
      showAlert?.(error?.error ? `Error: ${error.error}` : "Error al guardar presupuesto ❌", "error");
    }
  };

  if (!isOpen) return null;

  const productosFiltrados = productos.filter(p => {
    if (!busquedaProd.trim()) return true;
    const q = busquedaProd.toLowerCase();
    return p.nombre?.toLowerCase().includes(q) || p.descripcion?.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-neutral-800 p-6 rounded-xl w-full max-w-2xl shadow-lg text-neutral-100 max-h-[85vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {esEdicion ? "Editar Presupuesto" : "Agregar nuevo Presupuesto"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-sm text-gray-300">Fecha</label>
              <input type="date" name="fecha" value={formData.fecha} onChange={handleChange}
                className="w-full bg-neutral-700 text-white p-2 rounded" required />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-300">Costo materiales</label>
              {usaServicios ? (
                <>
                  <div className="w-full bg-neutral-900/60 border border-white/10 text-white p-2 rounded">{formatPesos(costoServicios)}</div>
                  <p className="text-[11px] text-amber-300/80 mt-1">Suma de repuestos de los servicios</p>
                </>
              ) : (
                <>
                  <input inputMode="numeric" name="costo" value={formData.costo} onChange={handleChange}
                    placeholder="0" className="w-full bg-neutral-700 text-white p-2 rounded" />
                  {formData.costo && <p className="text-xs text-gray-400 mt-1">Vista: {formatMoneySeguro(formData.costo)}</p>}
                </>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-300">Total (cliente) *</label>
              {usaServicios ? (
                <>
                  <div className="w-full bg-emerald-900/30 border border-emerald-700/40 text-emerald-300 font-semibold p-2 rounded">{formatPesos(totalServicios)}</div>
                  <p className="text-[11px] text-amber-300/80 mt-1">Suma de los servicios (editá cada línea)</p>
                </>
              ) : (
                <>
                  <input inputMode="numeric" name="total" value={formData.total} onChange={handleChange}
                    placeholder="0" className="w-full bg-neutral-700 text-white p-2 rounded" required />
                  {formData.total && <p className="text-xs text-gray-400 mt-1">Vista: {formatMoneySeguro(formData.total)}</p>}
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Observaciones</label>
            <textarea name="observaciones" value={formData.observaciones} onChange={handleChange}
              placeholder="Observaciones (opcional)" className="w-full bg-neutral-700 text-white p-2 rounded" rows={3} />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Estado</label>
            <select name="estado_id" value={formData.estado_id} onChange={handleChange}
              className="w-full bg-neutral-700 text-white p-2 rounded" required>
              <option value="">{loadingEstados ? "Cargando estados..." : "Seleccioná un estado"}</option>
              {!loadingEstados && estados.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
          </div>

          {/* Sección servicios */}
          <div className="border border-amber-500/20 rounded-xl p-3 sm:p-4 bg-amber-900/10">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 className="text-sm font-semibold">🛠️ Servicios y repuestos</h3>
              {usaServicios && (
                <span className="text-xs text-neutral-300">
                  Ganancia: <strong className="text-emerald-400">{formatPesos(totalServicios - costoServicios)}</strong>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2 space-y-2">
                <input type="text" value={busquedaServ} onChange={(e) => setBusquedaServ(e.target.value)}
                  placeholder="Buscar servicio (formateo, cabezal, pantalla…)" className="w-full bg-neutral-700 text-white p-2 rounded text-sm" />
                <select value={servicioSelId} onChange={(e) => setServicioSelId(e.target.value)}
                  className="w-full bg-neutral-700 text-white p-2 rounded text-sm">
                  <option value="">{servicios.length ? "Seleccioná un servicio" : "Sin servicios cargados"}</option>
                  {serviciosPorCategoria.map(([cat, lista]) => (
                    <optgroup key={cat} label={cat}>
                      {lista.map((sv) => (
                        <option key={sv.id} value={sv.id}>
                          {sv.nombre} — {sv.tipo_calculo === "repuesto" ? `repuesto ×${Number(sv.multiplicador)}` : formatPesos(sv.precio_base)}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <button type="button" onClick={handleAgregarServicio}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-sm font-semibold py-2 rounded">
                  Agregar servicio
                </button>
                <button type="button" onClick={handleAgregarLineaManual}
                  className="w-full bg-neutral-700 hover:bg-neutral-600 text-xs py-2 rounded">
                  + Línea manual
                </button>
              </div>
            </div>

            {usaServicios ? (
              <ul className="mt-3 space-y-2">
                {lineasServ.map((l) => {
                  const cant = Math.max(1, parseInt(l.cantidad || "1", 10) || 1);
                  const sugerido = l.tipo_calculo === "manual" ? null : precioSugeridoLinea(l, configPrecios);
                  const lista = precioCatalogo(l, configPrecios);
                  const dif = l.tipo_calculo === "manual" ? null : diferenciaContraLista(l.precio_final, lista);
                  return (
                    <li key={l.key} className="rounded-lg bg-neutral-800/80 border border-white/5 p-2.5 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          {l.tipo_calculo === "manual" ? (
                            <input value={l.descripcion} onChange={(e) => actualizarLineaServ(l.key, { descripcion: e.target.value })}
                              placeholder="Descripción del trabajo" className="w-full bg-neutral-700 text-white p-1.5 rounded text-sm" />
                          ) : (
                            <p className="text-sm font-medium truncate">{l.descripcion}</p>
                          )}
                          <p className="text-[11px] text-neutral-400">
                            {l.categoria ? `${l.categoria} · ` : ""}
                            {l.tipo_calculo === "repuesto" ? "Sobre repuesto" : l.tipo_calculo === "manual" ? "Manual" : "Precio fijo"}
                          </p>
                        </div>
                        <button type="button" onClick={() => quitarLineaServ(l.key)} className="text-xs text-red-400 hover:text-red-300 px-1">✕</button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                        <label className="flex flex-col gap-1">
                          <span className="text-neutral-400">Cant.</span>
                          <input inputMode="numeric" value={l.cantidad}
                            onChange={(e) => actualizarLineaServ(l.key, { cantidad: e.target.value.replace(/[^\d]/g, "") })}
                            className="bg-neutral-700 text-white p-1.5 rounded" />
                        </label>
                        {l.tipo_calculo === "repuesto" && (
                          <>
                            <label className="flex flex-col gap-1">
                              <span className="text-neutral-400">Costo repuesto</span>
                              <input inputMode="numeric" value={l.costo_repuesto} placeholder="0"
                                onChange={(e) => actualizarLineaServ(l.key, { costo_repuesto: e.target.value.replace(/[^\d]/g, "") })}
                                className="bg-neutral-700 text-white p-1.5 rounded" />
                            </label>
                            <label className="flex flex-col gap-1">
                              <span className="text-neutral-400">Multiplicador</span>
                              <input inputMode="decimal" value={l.multiplicador}
                                onChange={(e) => actualizarLineaServ(l.key, { multiplicador: soloNumero(e.target.value) })}
                                className="bg-neutral-700 text-white p-1.5 rounded" />
                            </label>
                          </>
                        )}
                        {l.tipo_calculo !== "manual" && (
                          <label className="flex flex-col gap-1">
                            <span className="text-neutral-400">Recargo %</span>
                            <input inputMode="decimal" value={l.recargo_pct} placeholder="0"
                              onChange={(e) => actualizarLineaServ(l.key, { recargo_pct: soloNumero(e.target.value) })}
                              className="bg-neutral-700 text-white p-1.5 rounded" />
                          </label>
                        )}
                        <label className="flex flex-col gap-1">
                          <span className="text-neutral-400">Precio final</span>
                          <input inputMode="numeric" value={l.precio_final}
                            onChange={(e) => actualizarLineaServ(l.key, { precio_final: e.target.value.replace(/[^\d]/g, "") })}
                            className="bg-neutral-700 text-white p-1.5 rounded font-semibold" />
                        </label>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                        <span className="text-neutral-400">
                          {l.tipo_calculo !== "manual" && (
                            <>
                              Lista {formatPesos(lista)}
                              {dif !== null && dif !== 0 && (
                                <span className={dif < 0 ? "text-red-300" : "text-amber-300"}> · {dif > 0 ? "+" : ""}{dif.toFixed(0)}%</span>
                              )}
                              {l.editado && sugerido !== null && numero(l.precio_final) !== sugerido && (
                                <button type="button" onClick={() => usarSugerido(l.key)} className="ml-2 text-amber-400 hover:text-amber-300 underline">
                                  usar sugerido {formatPesos(sugerido)}
                                </button>
                              )}
                            </>
                          )}
                        </span>
                        <span className="text-neutral-300">
                          Subtotal: <strong>{formatPesos(numero(l.precio_final) * cant)}</strong>
                        </span>
                      </div>
                    </li>
                  );
                })}
                <li className="flex justify-between text-sm px-1 pt-1 border-t border-white/10">
                  <span className="text-neutral-400">Costo repuestos: {formatPesos(costoServicios)}</span>
                  <span>Total servicios: <strong className="text-emerald-400">{formatPesos(totalServicios)}</strong></span>
                </li>
              </ul>
            ) : (
              <p className="mt-2 text-[11px] text-neutral-400">
                Agregá servicios para calcular el total automáticamente, o cargá total y costo a mano como siempre.
              </p>
            )}
          </div>

          {/* Sección productos */}
          <div className="border border-white/10 rounded-xl p-3 sm:p-4 bg-neutral-900/40">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 className="text-sm font-semibold">Productos para este presupuesto</h3>
              {tipoEquipo && <span className="text-[11px] text-neutral-300/80">Equipo: <span className="font-medium">{tipoEquipo}</span></span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
              <div className="sm:col-span-2">
                <input type="text" value={busquedaProd} onChange={e => setBusquedaProd(e.target.value)}
                  placeholder="Buscar producto..." className="w-full bg-neutral-700 text-white p-2 rounded text-sm" />
                <select value={productoSeleccionadoId} onChange={e => setProductoSeleccionadoId(e.target.value)}
                  className="w-full bg-neutral-700 text-white p-2 rounded mt-2 text-sm" disabled={loadingProductos}>
                  <option value="">{loadingProductos ? "Cargando..." : "Seleccioná un producto"}</option>
                  {productosFiltrados.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}{p.precio != null ? ` — $${formatMoneySeguro(p.precio)}` : ""}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input type="number" min="1" value={cantidadProducto} onChange={e => setCantidadProducto(e.target.value)}
                    className="w-20 bg-neutral-700 text-white p-2 rounded text-sm" placeholder="Cant." />
                  <input type="number" step="0.01" value={precioProducto} onChange={e => setPrecioProducto(e.target.value)}
                    className="flex-1 bg-neutral-700 text-white p-2 rounded text-sm" placeholder="Precio" />
                </div>
                <button type="button" onClick={handleAgregarLinea}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-sm font-semibold py-2 rounded" disabled={loadingProductos}>
                  Agregar
                </button>
              </div>
            </div>

            {lineas.length > 0 ? (
              <div className="mt-3 border-t border-white/10 pt-3 space-y-2">
                <div className="flex justify-between text-xs text-neutral-300">
                  <span>Productos agregados</span>
                  <span>Total: <strong>${formatMoneySeguro(totalProductos)}</strong></span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm">
                  {lineas.map(l => (
                    <li key={l.tempId ?? `${l.producto_id}-${l.nombre}`}
                      className="flex items-center justify-between gap-2 rounded-lg bg-neutral-800/80 px-2 py-1.5">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{l.nombre}</p>
                        <p className="text-neutral-300/80">{l.cantidad} unid. x ${formatMoneySeguro(l.precio_unitario)} = <span className="font-semibold">${formatMoneySeguro(l.subtotal)}</span></p>
                      </div>
                      <button type="button" onClick={() => handleEliminarLinea(l.tempId ?? l.producto_id)}
                        className="text-xs text-red-400 hover:text-red-300">✕</button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-2 text-[11px] text-neutral-400">
                Podés guardar sin productos o sumarlos para que luego se conviertan en venta.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded">
              {esEdicion ? "Guardar cambios" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PresupuestoModal;