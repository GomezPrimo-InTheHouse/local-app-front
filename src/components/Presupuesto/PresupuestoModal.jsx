// import { useState, useEffect } from "react";
// import {
//   createPresupuesto,
//   updatePresupuesto,
// } from "../../api/PresupuestoApi";

// const PresupuestoModal = ({
//   isOpen,
//   onClose,
//   ingresoSeleccionado,
//   presupuesto, // si existe, es modo edición
//   onPresupuestoGuardado,
// }) => {
//   const esEdicion = !!presupuesto;

//   const [formData, setFormData] = useState({
//     fecha: new Date().toISOString().split("T")[0],
//     costo: "",
//     total: "",
//     observaciones: "",
//     estado: "pendiente",
//   });

//   useEffect(() => {
//     if (isOpen) {
//       if (esEdicion) {
//         // Modo edición
//         setFormData({
//           fecha: presupuesto.fecha_presupuesto?.split("T")[0] || "",
//           costo: presupuesto.costo_presupuesto || "",
//           total: presupuesto.total_presupuesto || "",
//           observaciones: presupuesto.observaciones_presupuesto || "",
//           estado: presupuesto.estado_presupuesto || "pendiente",
//         });
//       } else {
//         // Modo creación
//         setFormData({
//           fecha: new Date().toISOString().split("T")[0],
//           costo: 0,
//           total: "",
//           observaciones: "",
//           estado: "pendiente",
//         });
//       }
//     }
//   }, [isOpen, presupuesto, esEdicion]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // console.log('Datos', esEdicion, presupuesto, ingresoSeleccionado);
//       if (esEdicion && presupuesto?.presupuesto_id) {
//         await updatePresupuesto(presupuesto.presupuesto_id, {
//           ingreso_id: presupuesto.ingreso_id,
//           fecha: formData.fecha,
//           costo: Number(formData.costo),
//           total: Number(formData.total),
//           observaciones: formData.observaciones,
//           estado: formData.estado,
//         });
//       } else {
//         // if (!ingresoSeleccionado?.id) {
//         //   alert("No hay ingreso seleccionado.");
//         //   return;
//         // }

//         await createPresupuesto({
//           ingreso_id: ingresoSeleccionado.id,
//           fecha: formData.fecha,
//           costo: Number(formData.costo),
//           total: Number(formData.total),
//           observaciones: formData.observaciones,
//           estado: formData.estado,
//         });
//       }

//       if (onPresupuestoGuardado) onPresupuestoGuardado();
//       onClose();
//     } catch (error) {
//       console.error("Error al guardar presupuesto:", error);
//       alert("Ocurrió un error al guardar el presupuesto.");
//     }
//   };




//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//       <div className="bg-neutral-800 p-6 rounded-xl w-full max-w-lg shadow-lg text-neutral-100 max-h-[80vh] overflow-y-auto">
//         <h2 className="text-xl font-semibold mb-4">
//           {esEdicion ? "Editar Presupuesto" : "Agregar Presupuesto"}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Fecha */}
//           <label className="block mb-2">Fecha</label>
//           <input
//             type="date"
//             name="fecha"
//             value={formData.fecha}
//             onChange={handleChange}
//             className="w-full bg-neutral-700 text-white p-2 rounded"
//             required
//           />

        
       

//           {/* Total */}
          
//           {/* Costo */}
//           <label className="block mb-2">Costo de Materiales</label>
//           <input
//             type="text" // 🔹 lo cambiamos a text para poder formatear con puntos
//             name="costo"
//             value={
//               formData.costo
//                 ? formData.costo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
//                 : ""
//             }
//             onChange={(e) => {
//               // 🔹 Quitamos puntos o comas y guardamos como entero
//               const rawValue = e.target.value.replace(/\./g, "").replace(/,/g, "");
//               setFormData({
//                 ...formData,
//                 costo: rawValue === "" ? "" : parseInt(rawValue, 10),
//               });
//             }}
//             placeholder="Costo de materiales"
//             className="w-full bg-neutral-700 text-white p-2 rounded"
//             required
//           />



//           {/* Total */}
//           <label className="block mb-1">Total (incluye mano de obra)</label>
//           <input
//             type="text"
//             name="total"
//             value={
//               formData.total
//                 ? formData.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
//                 : ""
//             }
//             onChange={(e) => {
//               const rawValue = e.target.value.replace(/\./g, "").replace(/,/g, "");
//               setFormData({
//                 ...formData,
//                 total: rawValue === "" ? "" : parseInt(rawValue, 10),
//               });
//             }}
//             placeholder="Total (incluye mano de obra)"
//             className="w-full bg-neutral-700 text-white p-2 rounded"
//             required
//           />


//           {/* Observaciones */}
//           <label className="block mb-1">Observaciones</label>
//           <textarea
//             name="observaciones"
//             value={formData.observaciones}
//             onChange={handleChange}
//             placeholder="Observaciones (opcional)"
//             className="w-full bg-neutral-700 text-white p-2 rounded"
//           />

//           {/* Estado */}
//           <label className="block mb-1">Estado</label>
//           <select
//             name="estado"
//             value={formData.estado}
//             onChange={handleChange}
//             className="w-full bg-neutral-700 text-white p-2 rounded"
//           >
//             <option value="pendiente">Pendiente</option>
//             <option value="aprobado">Aprobado</option>
//             <option value="no aprobado">No Aprobado</option>
//           </select>

//           {/* Botones */}
//           <div className="flex justify-end gap-3 mt-1">
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
//               {esEdicion ? "Actualizar" : "Guardar"}
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
} from "../../api/PresupuestoApi";
import { getEstadoByAmbito } from "../../api/EstadoApi.jsx";

const PresupuestoModal = ({
  isOpen,
  onClose,
  ingresoSeleccionado,   // { id: number }  <-- requerido para crear
  presupuesto,           // objeto para edición (o null/undefined si es alta)
  esEdicion = false,
  onPresupuestoGuardado, // callback para refrescar lista en el padre
  showAlert,             // opcional: alert global del padre
}) => {
  const [estados, setEstados] = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(true);

  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0],
    costo: "",
    total: "",
    observaciones: "",
    estado_id: "", // 👈 ahora trabajamos con estado_id
  });

  // 👉 Buscar el id del estado "Pendiente" para el default (si existe)
  const pendienteId = useMemo(() => {
    const p = estados.find(
      (e) => e.nombre?.toLowerCase?.() === "pendiente"
    );
    return p?.id ?? "";
  }, [estados]);

  // Cargar estados cuando abre
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        setLoadingEstados(true);
        const lista = await getEstadoByAmbito('presupuesto');
        setEstados(lista || []);
      } catch (e) {
        console.error("Error cargando estados:", e);
      } finally {
        setLoadingEstados(false);
      }
    })();
  }, [isOpen]);

  // Prefill (edición o alta)
  useEffect(() => {
    if (!isOpen) return;

    if (esEdicion && presupuesto) {
      // 🛠️ Edición
     setFormData({
        fecha: presupuesto.fecha_presupuesto
          ? new Date(presupuesto.fecha_presupuesto).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        costo: String(presupuesto.costo_presupuesto ?? ""),
        total: String(presupuesto.total_presupuesto ?? ""),
        observaciones: presupuesto.observaciones_presupuesto ?? "",
        estado_id: String(presupuesto.estado_presupuesto_id ?? ""),
      });
    } else {
      // ➕ Alta
      setFormData({
        fecha: new Date().toISOString().split("T")[0],
        costo: "",
        total: "",
        observaciones: "",
        estado_id: "", // se setea al seleccionar; si querés default: pendienteId
      });
    }
  }, [isOpen, esEdicion, presupuesto, pendienteId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Fuerzo números enteros para costo/total (tu DB es integer)
    if (name === "costo" || name === "total") {
      const limpio = value.replace(/[^\d]/g, "");
      setFormData((prev) => ({ ...prev, [name]: limpio }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    try {
      if (esEdicion ) {
        console.log('ejecutando el updatePresupuesto', presupuesto.presupuesto_id)
        // if (!presupuesto?.id) {
        //   showAlert?.("No hay presupuesto válido para editar", "error");
        //   return;
        // }

        await updatePresupuesto(presupuesto.presupuesto_id, {
          ingreso_id: presupuesto.ingreso_id ?? null, 
          fecha: formData.fecha,
          costo: parseInt(formData.costo || 0, 10),
          total: parseInt(formData.total || 0, 10),
          observaciones: formData.observaciones || "",
          estado_id: formData.estado_id ? Number(formData.estado_id) : null,
        });
        showAlert?.("Presupuesto actualizado ✅", "success");
      } else {
        // Crear
        if (!ingresoSeleccionado?.id) {
          showAlert?.("No hay ingreso seleccionado.", "error");
          return;
        }

        await createPresupuesto({
          ingreso_id: ingresoSeleccionado.id,
          fecha: formData.fecha,
          costo: parseInt(formData.costo || 0, 10),
          total: parseInt(formData.total || 0, 10),
          observaciones: formData.observaciones || "",
          estado_id: formData.estado_id
            ? Number(formData.estado_id)
            : pendienteId || null,
        });
        showAlert?.("Presupuesto creado ✅", "success");
      }

      onPresupuestoGuardado?.(); // refresca lista en el padre
      onClose();
    } catch (error) {
      console.error("Error al guardar presupuesto:", error);
      showAlert?.("Error al guardar presupuesto ❌", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-neutral-800 p-6 rounded-xl w-full max-w-lg shadow-lg text-neutral-100 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {esEdicion ? "Editar Presupuesto" : "Agregar nuevo Presupuesto"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Fecha */}
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="w-full bg-neutral-700 text-white p-2 rounded"
            required
          />

          {/* Costo */}
          <div>
            <label className="block mb-2 text-sm text-gray-300">Costo de Materiales</label>
            <input
              inputMode="numeric"
              name="costo"
              value={formData.costo}
              onChange={handleChange}
              placeholder="Costo de materiales"
              className="w-full bg-neutral-700 text-white p-2 rounded"
              required
            />
            {formData.costo && (
              <p className="text-xs text-gray-400 mt-1">
                Vista: {Number(formData.costo).toLocaleString("es-AR")}
              </p>
            )}
          </div>

          {/* Total */}
          <div>
            <label className="block mb-2 text-sm text-gray-300">Total (incluye mano de obra)</label>
            <input
              inputMode="numeric"
              name="total"
              value={formData.total}
              onChange={handleChange}
              placeholder="Total (incluye mano de obra)"
              className="w-full bg-neutral-700 text-white p-2 rounded"
              required
            />
            {formData.total && (
              <p className="text-xs text-gray-400 mt-1">
                Vista: {Number(formData.total).toLocaleString("es-AR")}
              </p>
            )}
          </div>

          {/* Observaciones */}
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            placeholder="Observaciones (opcional)"
            className="w-full bg-neutral-700 text-white p-2 rounded"
          />

          {/* Estado (estado_id) */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Estado</label>
            <select
              name="estado_id"
              value={formData.estado_id}
              onChange={handleChange}
              className="w-full bg-neutral-700 text-white p-2 rounded"
              required
            >
              <option value="">Selecciona un estado</option>
              {loadingEstados ? (
                <option disabled>Cargando estados...</option>
              ) : (
                estados.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))
              )}
            </select>
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


// src/components/presupuestos/PresupuestoModal.jsx
// import { useEffect, useMemo, useState } from "react";
// import {
//   createPresupuesto,
//   updatePresupuesto,
// } from "../../api/PresupuestoApi";
// import { getEstados } from "../../api/EstadoApi.jsx";

// const PresupuestoModal = ({
//   isOpen,
//   onClose,
//   ingresoSeleccionado,   // { id: number }  <-- requerido para crear
//   presupuesto,           // objeto para edición (o null/undefined si es alta)
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

//   // 👉 Auto-detectar si es edición
//   const esEdicion = !!presupuesto;


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
//         const lista = await getEstados();
//         setEstados(lista || []);
//       } catch (e) {
//         console.error("Error cargando estados:", e);
//       } finally {
//         setLoadingEstados(false);
//       }
//     })();
//   }, [isOpen]);

//   // Limpiar formulario al cerrar
//   useEffect(() => {
//     if (!isOpen) {
//       setFormData({
//         fecha: new Date().toISOString().split("T")[0],
//         costo: "",
//         total: "",
//         observaciones: "",
//         estado_id: "",
//       });
//     }
//   }, [isOpen]);

//   // Prefill (edición o alta)
//   useEffect(() => {
//     if (!isOpen) return;

//     if (esEdicion && presupuesto) {
//       // 🛠️ Edición - cargar datos existentes
//       console.log("Cargando datos para edición:", presupuesto); // Debug
//       setFormData({
//         fecha: presupuesto.fecha_presupuesto
//           ? new Date(presupuesto.fecha_presupuesto).toISOString().split("T")[0]
//           : new Date().toISOString().split("T")[0],
//         costo: String(presupuesto.costo_presupuesto ?? ""),
//         total: String(presupuesto.total_presupuesto ?? ""),
//         observaciones: presupuesto.observaciones_presupuesto ?? "",
//         estado_id: String(presupuesto.estado_presupuesto_id ?? ""),
//       });
//     } else {
//       // ➕ Alta - formulario limpio con defaults
//       console.log("Modo creación, formulario limpio"); // Debug
//       setFormData({
//         fecha: new Date().toISOString().split("T")[0],
//         costo: "",
//         total: "",
//         observaciones: "",
//         estado_id: pendienteId || "", // usar pendiente como default si existe
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
//       if (esEdicion) {
//         if (!presupuesto?.id) {
//           showAlert?.("No hay presupuesto válido para editar", "error");
//           return;
//         }
//         await updatePresupuesto(presupuesto.id, {
//           ingreso_id: presupuesto.ingreso_id ?? null, // no tocar si no es necesario
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
//           {esEdicion ? "Editar Presupuesto" : "Agregar Presupuesto"}
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
