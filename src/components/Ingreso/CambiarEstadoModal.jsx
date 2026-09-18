
// // src/components/Ingreso/CambiarEstadoModal.jsx
// import { useEffect, useState } from "react";
// import { updateOrdenTrabajo } from "../../api/OrdenTrabajoApi.jsx";
// import { getEstadoByAmbito } from "../../api/EstadoApi.jsx";

// const toInputDate = (value) => {
//   if (!value) return "";
//   const d = new Date(value);
//   if (isNaN(d)) return "";
//   const y   = d.getFullYear();
//   const m   = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${y}-${m}-${day}`;
// };

// const CambiarEstadoModal = ({
//   isOpen,
//   onClose,
//   ingresoActual,  // { id, estado_id, fecha_ingreso, fecha_egreso, falla_reportada, ... }
//   onSuccess,
//   onError,
//   onUpdated
// }) => {
//   const [estados, setEstados]               = useState([]);
//   const [loadingEstados, setLoadingEstados] = useState(true);
//   const [estado_id, setEstadoId]            = useState("");
//   const [fechaIngreso, setFechaIngreso]     = useState("");
//   const [fechaEgreso, setFechaEgreso]       = useState("");
//   const [diagnostico, setDiagnostico]       = useState("");

//   // Reset al abrir
//   useEffect(() => {
//     if (isOpen) {
//       setEstadoId("");
//       setFechaIngreso("");
//       setFechaEgreso("");
//       setDiagnostico("");
//     }
//   }, [isOpen]);

//   // Cargar estados de OT
//   useEffect(() => {
//     if (!isOpen) return;
//     (async () => {
//       try {
//         setLoadingEstados(true);
//         // Los estados de la OT usan el mismo ámbito que 'equipo'
//         const lista = await getEstadoByAmbito('equipo');
//         setEstados(Array.isArray(lista) ? lista : []);
//       } catch (e) {
//         console.error("Error cargando estados:", e);
//         setEstados([]);
//       } finally {
//         setLoadingEstados(false);
//       }
//     })();
//   }, [isOpen]);

//   // Inicializar valores cuando tenemos estado + ingresoActual
//   useEffect(() => {
//     if (!isOpen || !ingresoActual || estados.length === 0) return;

//     const currentEstadoId = ingresoActual.estado_id ?? ingresoActual.estado ?? null;
//     const match = estados.find(e => Number(e.id) === Number(currentEstadoId));

//     setEstadoId(match ? String(match.id) : "");
//     setFechaIngreso(toInputDate(ingresoActual.fecha_ingreso));
//     setFechaEgreso(toInputDate(ingresoActual.fecha_egreso));
//     setDiagnostico(ingresoActual.diagnostico || "");
//   }, [isOpen, ingresoActual, estados]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!ingresoActual?.id || !estado_id) return;

//     try {
//       await updateOrdenTrabajo(ingresoActual.id, {
//         estado_id:     Number(estado_id),
//         fecha_ingreso: fechaIngreso || null,
//         fecha_egreso:  fechaEgreso  || null,
//         diagnostico:   diagnostico  || null,
//       });

//       onSuccess?.("Orden de trabajo actualizada correctamente ✅");
//       onUpdated?.();
//       onClose();
//     } catch (error) {
//       console.error("Error actualizando orden de trabajo:", error);
//       onError?.("Error al actualizar la orden de trabajo ❌");
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//       <div className="bg-neutral-800 p-6 rounded-xl w-full max-w-sm shadow-lg text-neutral-100">
//         <h2 className="text-xl font-semibold mb-4">Actualizar Orden de Trabajo</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">

//           {/* Estado */}
//           <div>
//             <label className="block text-sm text-gray-300 mb-1">Estado</label>
//             <select
//               value={estado_id}
//               onChange={e => setEstadoId(e.target.value)}
//               className="w-full bg-neutral-700 text-white p-2 rounded disabled:opacity-60"
//               required
//               disabled={loadingEstados}
//             >
//               <option value="">
//                 {loadingEstados ? "Cargando estados..." : "Seleccioná un estado"}
//               </option>
//               {!loadingEstados && estados.map(est => (
//                 <option key={est.id} value={String(est.id)}>{est.nombre}</option>
//               ))}
//             </select>
//           </div>

//           {/* Fecha de ingreso */}
//           <div>
//             <label className="block text-sm text-gray-300 mb-1">Fecha de ingreso</label>
//             <input type="date" value={fechaIngreso}
//               onChange={e => setFechaIngreso(e.target.value)}
//               className="w-full bg-neutral-700 text-white p-2 rounded" />
//           </div>

//           {/* Fecha de egreso */}
//           <div>
//             <label className="block text-sm text-gray-300 mb-1">Fecha de egreso <span className="text-neutral-500">(opcional)</span></label>
//             <input type="date" value={fechaEgreso}
//               onChange={e => setFechaEgreso(e.target.value)}
//               className="w-full bg-neutral-700 text-white p-2 rounded" />
//           </div>

//           {/* Diagnóstico */}
//           <div>
//             <label className="block text-sm text-gray-300 mb-1">Diagnóstico <span className="text-neutral-500">(opcional)</span></label>
//             <textarea
//               value={diagnostico}
//               onChange={e => setDiagnostico(e.target.value)}
//               placeholder="Diagnóstico técnico..."
//               rows={3}
//               className="w-full bg-neutral-700 text-white p-2 rounded resize-none text-sm" />
//           </div>

//           {/* Botones */}
//           <div className="flex justify-end gap-3 mt-4">
//             <button type="button" onClick={onClose}
//               className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded">
//               Cancelar
//             </button>
//             <button type="submit" disabled={loadingEstados}
//               className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded disabled:opacity-60">
//               Guardar
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CambiarEstadoModal;



// src/components/Ingreso/CambiarEstadoModal.jsx
import { useEffect, useState } from "react";
import { updateOrdenTrabajo } from "../../api/OrdenTrabajoApi.js";
import { getEstadoByAmbito } from "../../api/EstadoApi.jsx";
import PatronInput from "../Equipo/PatronInput.jsx";

const toInputDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d)) return "";
  const y   = d.getUTCFullYear();
  const m   = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const CambiarEstadoModal = ({
  isOpen,
  onClose,
  ingresoActual,
  onSuccess,
  onError,
  onUpdated,
}) => {
  const [estados, setEstados]               = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(true);
  const [estado_id, setEstadoId]            = useState("");
  const [fechaIngreso, setFechaIngreso]     = useState("");
  const [fechaEgreso, setFechaEgreso]       = useState("");
  const [diagnostico, setDiagnostico]       = useState("");
  const [password, setPassword]             = useState("");
  const [patron, setPatron]                 = useState("");

  // Reset al abrir
  useEffect(() => {
    if (isOpen) {
      setEstadoId("");
      setFechaIngreso("");
      setFechaEgreso("");
      setDiagnostico("");
      setPassword("");
      setPatron("");
    }
  }, [isOpen]);

  // Cargar estados
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        setLoadingEstados(true);
        const lista = await getEstadoByAmbito("equipo");
        setEstados(Array.isArray(lista) ? lista : []);
      } catch (e) {
        console.error("Error cargando estados:", e);
        setEstados([]);
      } finally {
        setLoadingEstados(false);
      }
    })();
  }, [isOpen]);

  // Inicializar valores desde la OT actual
  useEffect(() => {
    if (!isOpen || !ingresoActual || estados.length === 0) return;

    const currentEstadoId = ingresoActual.estado_id ?? ingresoActual.estado ?? null;
    const match = estados.find(e => Number(e.id) === Number(currentEstadoId));

    setEstadoId(match ? String(match.id) : "");
    setFechaIngreso(toInputDate(ingresoActual.fecha_ingreso));
    setFechaEgreso(toInputDate(ingresoActual.fecha_egreso));
    setDiagnostico(ingresoActual.diagnostico || "");
    setPassword(ingresoActual.password || "");
    setPatron(ingresoActual.patron || "");
  }, [isOpen, ingresoActual, estados]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ingresoActual?.id || !estado_id) return;

    try {
      await updateOrdenTrabajo(ingresoActual.id, {
        estado_id:     Number(estado_id),
        fecha_ingreso: fechaIngreso ? `${fechaIngreso}T12:00:00` : null,
        fecha_egreso:  fechaEgreso  ? `${fechaEgreso}T12:00:00`  : null,
        diagnostico:   diagnostico  || null,
        password:      password     || null,
        patron:        patron       || null,
      });

      onSuccess?.("Orden de trabajo actualizada correctamente ✅");
      onUpdated?.();
      onClose();
    } catch (error) {
      console.error("Error actualizando orden de trabajo:", error);
      onError?.("Error al actualizar la orden de trabajo ❌");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-800 rounded-xl w-full max-w-sm shadow-lg text-neutral-100 max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-semibold">Actualizar Orden de Trabajo</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white text-xl leading-none">✕</button>
        </div>

        {/* Contenido */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-4" id="form-ot-update">

            {/* Estado */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Estado</label>
              <select value={estado_id} onChange={e => setEstadoId(e.target.value)}
                className="w-full bg-neutral-700 text-white p-2 rounded disabled:opacity-60"
                required disabled={loadingEstados}>
                <option value="">
                  {loadingEstados ? "Cargando estados..." : "Seleccioná un estado"}
                </option>
                {!loadingEstados && estados.map(est => (
                  <option key={est.id} value={String(est.id)}>{est.nombre}</option>
                ))}
              </select>
            </div>

            {/* Fecha de ingreso */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Fecha de ingreso</label>
              <input type="date" value={fechaIngreso}
                onChange={e => setFechaIngreso(e.target.value)}
                className="w-full bg-neutral-700 text-white p-2 rounded" />
            </div>

            {/* Fecha de egreso */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Fecha de egreso <span className="text-neutral-500">(opcional)</span>
              </label>
              <input type="date" value={fechaEgreso}
                onChange={e => setFechaEgreso(e.target.value)}
                className="w-full bg-neutral-700 text-white p-2 rounded" />
            </div>

            {/* Contraseña / PIN — acepta cualquier texto alfanumérico */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Contraseña / PIN <span className="text-neutral-500">(opcional)</span>
              </label>
              <input
                type="text"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Ej: abc123, 060871, miClave"
                className="w-full bg-neutral-700 text-white p-2 rounded text-sm"
              />
            </div>

            {/* Patrón */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Patrón de desbloqueo <span className="text-neutral-500">(opcional)</span>
              </label>
              <PatronInput
                value={patron}
                onChange={nuevoPatron => setPatron(nuevoPatron)}
              />
            </div>

            {/* Diagnóstico */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Diagnóstico <span className="text-neutral-500">(opcional)</span>
              </label>
              <textarea value={diagnostico} onChange={e => setDiagnostico(e.target.value)}
                placeholder="Diagnóstico técnico..."
                rows={3}
                className="w-full bg-neutral-700 text-white p-2 rounded resize-none text-sm" />
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded">
            Cancelar
          </button>
          <button type="submit" form="form-ot-update" disabled={loadingEstados}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded disabled:opacity-60">
            Guardar
          </button>
        </div>

      </div>
    </div>
  );
};

export default CambiarEstadoModal;