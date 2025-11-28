

// // src/components/presupuestos/PresupuestoModal.jsx
// import { useEffect, useMemo, useState } from "react";
// import {
//   createPresupuesto,
//   updatePresupuesto,
// } from "../../api/PresupuestoApi";
// import { getEstadoByAmbito } from "../../api/EstadoApi.jsx";

// const PresupuestoModal = ({
//   isOpen,
//   onClose,
//   ingresoSeleccionado,   // { id: number }  <-- requerido para crear
//   presupuesto,           // objeto para edición (o null/undefined si es alta)
//   esEdicion = false,
//   onPresupuestoGuardado, // callback para refrescar lista en el padre
//   showAlert,             // opcional: alert global del padre
// }) => {
//   const [estados, setEstados] = useState([]);
//   const [loadingEstados, setLoadingEstados] = useState(true);

//   const [formData, setFormData] = useState({
//     fecha: new Date().toISOString().split("T")[0],
//     costo: "",
//     total: "",
//     observaciones: "",
//     estado_id: "", // 👈 ahora trabajamos con estado_id
//   });

//   // 👉 Buscar el id del estado "Pendiente" para el default (si existe)
//   const pendienteId = useMemo(() => {
//     const p = estados.find(
//       (e) => e.nombre?.toLowerCase?.() === "pendiente"
//     );
//     return p?.id ?? "";
//   }, [estados]);

//   // Cargar estados cuando abre
//   useEffect(() => {
//     if (!isOpen) return;
//     (async () => {
//       try {
//         setLoadingEstados(true);
//         const lista = await getEstadoByAmbito('presupuesto');
//         setEstados(lista || []);
//       } catch (e) {
//         console.error("Error cargando estados:", e);
//       } finally {
//         setLoadingEstados(false);
//       }
//     })();
//   }, [isOpen]);

//   // Prefill (edición o alta)
//   useEffect(() => {
//     if (!isOpen) return;

//     if (esEdicion && presupuesto) {
//       // 🛠️ Edición
//      setFormData({
//         fecha: presupuesto.fecha_presupuesto
//           ? new Date(presupuesto.fecha_presupuesto).toISOString().split("T")[0]
//           : new Date().toISOString().split("T")[0],
//         costo: String(presupuesto.costo_presupuesto ?? ""),
//         total: String(presupuesto.total_presupuesto ?? ""),
//         observaciones: presupuesto.observaciones_presupuesto ?? "",
//         estado_id: String(presupuesto.estado_presupuesto_id ?? ""),
//       });
//     } else {
//       // ➕ Alta
//       setFormData({
//         fecha: new Date().toISOString().split("T")[0],
//         costo: "",
//         total: "",
//         observaciones: "",
//         estado_id: "", // se setea al seleccionar; si querés default: pendienteId
//       });
//     }
//   }, [isOpen, esEdicion, presupuesto, pendienteId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Fuerzo números enteros para costo/total (tu DB es integer)
//     if (name === "costo" || name === "total") {
//       const limpio = value.replace(/[^\d]/g, "");
//       setFormData((prev) => ({ ...prev, [name]: limpio }));
//       return;
//     }

//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
   
//     try {
//       if (esEdicion ) {
//         console.log('ejecutando el updatePresupuesto', presupuesto.presupuesto_id)
//         // if (!presupuesto?.id) {
//         //   showAlert?.("No hay presupuesto válido para editar", "error");
//         //   return;
//         // }

//         await updatePresupuesto(presupuesto.presupuesto_id, {
//           ingreso_id: presupuesto.ingreso_id ?? null, 
//           fecha: formData.fecha,
//           costo: parseInt(formData.costo || 0, 10),
//           total: parseInt(formData.total || 0, 10),
//           observaciones: formData.observaciones || "",
//           estado_id: formData.estado_id ? Number(formData.estado_id) : null,
//         });
//         showAlert?.("Presupuesto actualizado ✅", "success");
//       } else {
//         // Crear
//         if (!ingresoSeleccionado?.id) {
//           showAlert?.("No hay ingreso seleccionado.", "error");
//           return;
//         }

//         await createPresupuesto({
//           ingreso_id: ingresoSeleccionado.id,
//           fecha: formData.fecha,
//           costo: parseInt(formData.costo || 0, 10),
//           total: parseInt(formData.total || 0, 10),
//           observaciones: formData.observaciones || "",
//           estado_id: formData.estado_id
//             ? Number(formData.estado_id)
//             : pendienteId || null,
//         });
//         showAlert?.("Presupuesto creado ✅", "success");
//       }

//       onPresupuestoGuardado?.(); // refresca lista en el padre
//       onClose();
//     } catch (error) {
//       console.error("Error al guardar presupuesto:", error);
//       showAlert?.("Error al guardar presupuesto ❌", "error");
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//       <div className="bg-neutral-800 p-6 rounded-xl w-full max-w-lg shadow-lg text-neutral-100 max-h-[80vh] overflow-y-auto">
//         <h2 className="text-xl font-semibold mb-4">
//           {esEdicion ? "Editar Presupuesto" : "Agregar nuevo Presupuesto"}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Fecha */}
//           <input
//             type="date"
//             name="fecha"
//             value={formData.fecha}
//             onChange={handleChange}
//             className="w-full bg-neutral-700 text-white p-2 rounded"
//             required
//           />

//           {/* Costo */}
//           <div>
//             <label className="block mb-2 text-sm text-gray-300">Costo de Materiales</label>
//             <input
//               inputMode="numeric"
//               name="costo"
//               value={formData.costo}
//               onChange={handleChange}
//               placeholder="Costo de materiales"
//               className="w-full bg-neutral-700 text-white p-2 rounded"
//               required
//             />
//             {formData.costo && (
//               <p className="text-xs text-gray-400 mt-1">
//                 Vista: {Number(formData.costo).toLocaleString("es-AR")}
//               </p>
//             )}
//           </div>

//           {/* Total */}
//           <div>
//             <label className="block mb-2 text-sm text-gray-300">Total (incluye mano de obra)</label>
//             <input
//               inputMode="numeric"
//               name="total"
//               value={formData.total}
//               onChange={handleChange}
//               placeholder="Total (incluye mano de obra)"
//               className="w-full bg-neutral-700 text-white p-2 rounded"
//               required
//             />
//             {formData.total && (
//               <p className="text-xs text-gray-400 mt-1">
//                 Vista: {Number(formData.total).toLocaleString("es-AR")}
//               </p>
//             )}
//           </div>

//           {/* Observaciones */}
//           <textarea
//             name="observaciones"
//             value={formData.observaciones}
//             onChange={handleChange}
//             placeholder="Observaciones (opcional)"
//             className="w-full bg-neutral-700 text-white p-2 rounded"
//           />

//           {/* Estado (estado_id) */}
//           <div>
//             <label className="block text-sm text-gray-300 mb-1">Estado</label>
//             <select
//               name="estado_id"
//               value={formData.estado_id}
//               onChange={handleChange}
//               className="w-full bg-neutral-700 text-white p-2 rounded"
//               required
//             >
//               <option value="">Selecciona un estado</option>
//               {loadingEstados ? (
//                 <option disabled>Cargando estados...</option>
//               ) : (
//                 estados.map((e) => (
//                   <option key={e.id} value={e.id}>
//                     {e.nombre}
//                   </option>
//                 ))
//               )}
//             </select>
//           </div>

//           {/* Botones */}
//           <div className="flex justify-end gap-3 mt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
//             >
//               Cancelar
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded"
//             >
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
  savePresupuestoDetalles, // 🔹 nueva función en tu PresupuestoApi
} from "../../api/PresupuestoApi";
import { getEstadoByAmbito } from "../../api/EstadoApi.jsx";
import { getProductosRepuestoByTipoEquipo, getPresupuestoWithDetalles } from "../../api/ProductoApi.jsx"; // 🔹 nueva función en tu ProductoApi

const PresupuestoModal = ({
  isOpen,
  onClose,
  ingresoSeleccionado,   // { id: number } para alta
  presupuesto,           // objeto para edición (o null)
  esEdicion = false,
  onPresupuestoGuardado, // callback para refrescar lista
  showAlert,             // alert global del padre
  tipoEquipo,            // ej: "celular", "notebook" (opcional)
}) => {
  const [estados, setEstados] = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(true);

  // Productos sugeridos (repuestos) según tipo de equipo
  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(false);

  // Form principal
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0],
    costo: "",
    total: "",
    observaciones: "",
    estado_id: "",
  });

  // Manejo de líneas de productos
  const [busquedaProd, setBusquedaProd] = useState("");
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState("");
  const [cantidadProducto, setCantidadProducto] = useState("1");
  const [precioProducto, setPrecioProducto] = useState("");
  const [lineas, setLineas] = useState([]); // { producto_id, nombre, cantidad, precio_unitario, subtotal }

  // 👉 Buscar el id del estado "Pendiente" para default
  const pendienteId = useMemo(() => {
    const p = estados.find(
      (e) => e.nombre?.toLowerCase?.() === "pendiente"
    );
    return p?.id ?? "";
  }, [estados]);

  // ===================== Cargar ESTADOS al abrir =====================
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

  // ===================== Cargar PRODUCTOS sugeridos al abrir =====================
  useEffect(() => {
    if (!isOpen) return;

    (async () => {
      try {
        setLoadingProductos(true);
        // Si no viene tipoEquipo, podrías traer todos los repuestos o filtrar por defecto
        const lista = await getProductosRepuestoByTipoEquipo(tipoEquipo);
        setProductos(Array.isArray(lista) ? lista : []);
      } catch (e) {
        console.error("Error cargando productos para presupuesto:", e);
        showAlert?.(
          "No se pudieron cargar los productos sugeridos para este presupuesto",
          "warning"
        );
        setProductos([]);
      } finally {
        setLoadingProductos(false);
      }
    })();
  }, [isOpen, tipoEquipo, showAlert]);

  // ===================== Prefill (edición / alta) =====================
  useEffect(() => {
    if (!isOpen) return;

    if (esEdicion && presupuesto) {
      // 🔹 Cabecera
      setFormData({
        fecha: presupuesto.fecha_presupuesto
          ? new Date(presupuesto.fecha_presupuesto).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        costo: String(presupuesto.costo_presupuesto ?? ""),
        total: String(presupuesto.total_presupuesto ?? ""),
        observaciones: presupuesto.observaciones_presupuesto ?? "",
        estado_id: String(presupuesto.estado_presupuesto_id ?? pendienteId ?? ""),
      });

      // 🔹 Líneas de productos (si más adelante las traés desde el backend)
      // Por ahora, dejamos vacío hasta que expongas presupuesto_detalle en tu API:
      setLineas([]);
    } else {
      // ➕ Alta
      setFormData({
        fecha: new Date().toISOString().split("T")[0],
        costo: "",
        total: "",
        observaciones: "",
        estado_id: pendienteId ? String(pendienteId) : "",
      });
      setLineas([]);
    }

    // Reset selección producto
    setBusquedaProd("");
    setProductoSeleccionadoId("");
    setCantidadProducto("1");
    setPrecioProducto("");
  }, [isOpen, esEdicion, presupuesto, pendienteId]);

  // ===================== Handlers básicos del form =====================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "costo" || name === "total") {
      const limpio = value.replace(/[^\d]/g, "");
      setFormData((prev) => ({ ...prev, [name]: limpio }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Cuando cambia el producto seleccionado, sugerimos precio por defecto
  useEffect(() => {
    if (!productoSeleccionadoId) {
      setPrecioProducto("");
      return;
    }
    const prod = productos.find(
      (p) => Number(p.id) === Number(productoSeleccionadoId)
    );
    if (prod) {
      setPrecioProducto(
        prod.precio != null ? String(prod.precio).replace(",", ".") : ""
      );
    }
  }, [productoSeleccionadoId, productos]);

  // ===================== Gestión de líneas =====================
  const handleAgregarLinea = () => {
    const prodId = Number(productoSeleccionadoId);
    if (!prodId) {
      showAlert?.("Seleccioná un producto para agregar.", "warning");
      return;
    }

    const cantidad = parseInt(cantidadProducto || "0", 10);
    const precioUnit = parseFloat(precioProducto || "0");

    if (!cantidad || cantidad <= 0) {
      showAlert?.("La cantidad debe ser mayor a 0.", "warning");
      return;
    }
    if (!precioUnit || precioUnit <= 0) {
      showAlert?.("El precio unitario debe ser mayor a 0.", "warning");
      return;
    }

    const prod = productos.find((p) => Number(p.id) === prodId);
    const nombre = prod?.nombre || `Producto #${prodId}`;
    const subtotal = cantidad * precioUnit;

    setLineas((prev) => {
      // Si ya existe en la lista, acumulamos
      const idx = prev.findIndex((l) => l.producto_id === prodId);
      if (idx >= 0) {
        const copia = [...prev];
        const linea = copia[idx];
        const nuevaCant = linea.cantidad + cantidad;
        copia[idx] = {
          ...linea,
          cantidad: nuevaCant,
          precio_unitario: precioUnit,
          subtotal: nuevaCant * precioUnit,
        };
        return copia;
      }

      return [
        ...prev,
        {
          tempId: `${prodId}-${Date.now()}`,
          producto_id: prodId,
          nombre,
          cantidad,
          precio_unitario: precioUnit,
          subtotal,
        },
      ];
    });

    // Reset campos de producto
    setCantidadProducto("1");
    // Dejamos el producto seleccionado para poder agregar más rápido
  };

  const handleEliminarLinea = (tempIdOrProdId) => {
    setLineas((prev) =>
      prev.filter(
        (l) => l.tempId !== tempIdOrProdId && l.producto_id !== tempIdOrProdId
      )
    );
  };

  const totalProductos = useMemo(
    () => lineas.reduce((acc, l) => acc + (l.subtotal || 0), 0),
    [lineas]
  );

  // ===================== Submit =====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.fecha) {
        showAlert?.("La fecha es obligatoria", "error");
        return;
      }

      if (formData.total === "" || isNaN(Number(formData.total))) {
        showAlert?.("El total es obligatorio y debe ser numérico", "error");
        return;
      }

      // Costo puede ser 0 (ej: mano de obra solamente o sin cargar costo materiales)
      const payloadCabecera = {
        ingreso_id: esEdicion ? (presupuesto.ingreso_id ?? null) : ingresoSeleccionado?.id ?? null,
        fecha: formData.fecha,
        costo: formData.costo ? parseInt(formData.costo, 10) : 0,
        total: formData.total ? parseInt(formData.total, 10) : 0,
        observaciones: formData.observaciones || "",
        estado_id: formData.estado_id ? Number(formData.estado_id) : pendienteId || null,
      };

      if (!esEdicion && !payloadCabecera.ingreso_id) {
        showAlert?.("No hay ingreso seleccionado para este presupuesto.", "error");
        return;
      }

      let presupuestoId = null;

      if (esEdicion) {
        const idPresupuesto =
          presupuesto?.presupuesto_id ?? presupuesto?.id ?? null;

        if (!idPresupuesto) {
          showAlert?.("No hay presupuesto válido para editar.", "error");
          return;
        }

        await updatePresupuesto(idPresupuesto, {
          fecha: payloadCabecera.fecha,
          costo: payloadCabecera.costo,
          total: payloadCabecera.total,
          observaciones: payloadCabecera.observaciones,
          estado_id: payloadCabecera.estado_id,
        });

        presupuestoId = idPresupuesto;
        showAlert?.("Presupuesto actualizado ✅", "success");
      } else {
        // Crear presupuesto
        const creado = await createPresupuesto(payloadCabecera);
        // depende de cómo lo devuelve tu backend (ajusta si es necesario)
        presupuestoId = creado?.id ?? creado?.presupuesto_id ?? null;

        if (!presupuestoId) {
          showAlert?.(
            "No se pudo obtener el ID del presupuesto creado.",
            "error"
          );
          return;
        }

        showAlert?.("Presupuesto creado ✅", "success");
      }

      // 🔹 Guardar detalle de productos si hay líneas
      if (presupuestoId && lineas.length > 0) {
        const detallesPayload = lineas.map((l) => ({
          producto_id: l.producto_id,
          cantidad: l.cantidad,
          precio_unitario: l.precio_unitario,
        }));

        await savePresupuestoDetalles(presupuestoId, detallesPayload);
      }

      onPresupuestoGuardado?.();
      onClose();
    } catch (error) {
      console.error("Error al guardar presupuesto:", error);
      showAlert?.("Error al guardar presupuesto ❌", "error");
    }
  };

  if (!isOpen) return null;

  // ===================== UI =====================
  const productosFiltrados = productos.filter((p) => {
    if (!busquedaProd.trim()) return true;
    const q = busquedaProd.toLowerCase();
    return (
      p.nombre?.toLowerCase().includes(q) ||
      p.descripcion?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-neutral-800 p-6 rounded-xl w-full max-w-2xl shadow-lg text-neutral-100 max-h-[85vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {esEdicion ? "Editar Presupuesto" : "Agregar nuevo Presupuesto"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ========== CABECERA ========== */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-sm text-gray-300">
                Fecha
              </label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="w-full bg-neutral-700 text-white p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-300">
                Costo materiales (taller)
              </label>
              <input
                inputMode="numeric"
                name="costo"
                value={formData.costo}
                onChange={handleChange}
                placeholder="0"
                className="w-full bg-neutral-700 text-white p-2 rounded"
              />
              {formData.costo && (
                <p className="text-xs text-gray-400 mt-1">
                  Vista:{" "}
                  {Number(formData.costo).toLocaleString("es-AR")}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-300">
                Total (productos + mano de obra) *
              </label>
              <input
                inputMode="numeric"
                name="total"
                value={formData.total}
                onChange={handleChange}
                placeholder="0"
                className="w-full bg-neutral-700 text-white p-2 rounded"
                required
              />
              {formData.total && (
                <p className="text-xs text-gray-400 mt-1">
                  Vista:{" "}
                  {Number(formData.total).toLocaleString("es-AR")}
                </p>
              )}
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block mb-1 text-sm text-gray-300">
              Observaciones
            </label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              placeholder="Observaciones (opcional)"
              className="w-full bg-neutral-700 text-white p-2 rounded"
              rows={3}
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Estado
            </label>
            <select
              name="estado_id"
              value={formData.estado_id}
              onChange={handleChange}
              className="w-full bg-neutral-700 text-white p-2 rounded"
              required
            >
              <option value="">
                {loadingEstados ? "Cargando estados..." : "Seleccioná un estado"}
              </option>
              {!loadingEstados &&
                estados.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))}
            </select>
          </div>

          {/* ========== SECCIÓN PRODUCTOS ========== */}
          <div className="border border-white/10 rounded-xl p-3 sm:p-4 bg-neutral-900/40">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 className="text-sm font-semibold">
                Productos sugeridos para este presupuesto
              </h3>
              {tipoEquipo && (
                <span className="text-[11px] text-neutral-300/80">
                  Equipo: <span className="font-medium">{tipoEquipo}</span>
                </span>
              )}
            </div>

            {/* Buscador + select */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={busquedaProd}
                  onChange={(e) => setBusquedaProd(e.target.value)}
                  placeholder="Buscar por nombre / descripción..."
                  className="w-full bg-neutral-700 text-white p-2 rounded text-sm"
                />
                <select
                  value={productoSeleccionadoId}
                  onChange={(e) => setProductoSeleccionadoId(e.target.value)}
                  className="w-full bg-neutral-700 text-white p-2 rounded mt-2 text-sm"
                  disabled={loadingProductos}
                >
                  <option value="">
                    {loadingProductos
                      ? "Cargando productos..."
                      : "Seleccioná un producto"}
                  </option>
                  {productosFiltrados.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}{" "}
                      {p.precio != null
                        ? `— $${Number(p.precio).toLocaleString("es-AR")}`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={cantidadProducto}
                    onChange={(e) => setCantidadProducto(e.target.value)}
                    className="w-20 bg-neutral-700 text-white p-2 rounded text-sm"
                    placeholder="Cant."
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={precioProducto}
                    onChange={(e) => setPrecioProducto(e.target.value)}
                    className="flex-1 bg-neutral-700 text-white p-2 rounded text-sm"
                    placeholder="Precio unit."
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAgregarLinea}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-sm font-semibold py-2 rounded"
                  disabled={loadingProductos}
                >
                  Agregar producto
                </button>
              </div>
            </div>

            {/* Lista de líneas */}
            {lineas.length > 0 ? (
              <div className="mt-3 border-t border-white/10 pt-3 space-y-2">
                <div className="flex justify-between text-xs text-neutral-300">
                  <span>Productos agregados</span>
                  <span>
                    Total productos:{" "}
                    <strong>
                      $
                      {totalProductos.toLocaleString("es-AR", {
                        maximumFractionDigits: 2,
                      })}
                    </strong>
                  </span>
                </div>

                <ul className="space-y-2 text-xs sm:text-sm">
                  {lineas.map((l) => (
                    <li
                      key={l.tempId ?? `${l.producto_id}-${l.nombre}`}
                      className="flex items-center justify-between gap-2 rounded-lg bg-neutral-800/80 px-2 py-1.5"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{l.nombre}</p>
                        <p className="text-neutral-300/80">
                          {l.cantidad} unid. x $
                          {l.precio_unitario.toLocaleString("es-AR", {
                            maximumFractionDigits: 2,
                          })}{" "}
                          ={" "}
                          <span className="font-semibold">
                            $
                            {l.subtotal.toLocaleString("es-AR", {
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleEliminarLinea(l.tempId ?? l.producto_id)
                        }
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>

                <p className="mt-2 text-[11px] text-neutral-400">
                  Tip: este total de productos es independiente del campo
                  <span className="font-semibold"> Total</span>. Podés usarlo
                  como referencia para definir mano de obra y margen.
                </p>
              </div>
            ) : (
              <p className="mt-2 text-[11px] text-neutral-400">
                Aún no agregaste productos. Podés guardar un presupuesto solo
                con mano de obra, o sumar productos para que luego se
                conviertan en venta.
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded"
            >
              {esEdicion ? "Guardar cambios" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PresupuestoModal;
