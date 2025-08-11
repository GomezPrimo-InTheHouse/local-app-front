// // src/components/EditarPresupuestoModal.jsx
// import { useState, useEffect } from "react";
// import { updatePresupuesto } from "../../api/PresupuestoApi.jsx";

// const EditarPresupuestoModal = ({ 
//   isOpen, 
//   onClose, 
//   presupuesto, 
//   onPresupuestoActualizado,
//   onError
// }) => {
//   const [formData, setFormData] = useState({
//     fecha: "",
//     costo: "",
//     total: "",
//     observaciones: ""
//   });

//   useEffect(() => {
//     if (presupuesto) {
//       setFormData({
//         fecha: presupuesto.fecha_presupuesto?.slice(0,10) || "",
//         costo: presupuesto.costo_presupuesto || "",
//         total: presupuesto.total_presupuesto || "",
//         observaciones: presupuesto.observaciones || ""
//       });
//     }
//   }, [presupuesto]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await updatePresupuesto(presupuesto.presupuesto_id, {
//         ingreso_id: presupuesto.ingreso_id,
//         fecha: formData.fecha,
//         costo: Number(formData.costo),
//         total: Number(formData.total),
//         observaciones: formData.observaciones,
//       });

//       onPresupuestoActualizado?.(); // El padre muestra la alerta
//     } catch (error) {
//       console.error("❌ Error actualizando presupuesto:", error);
//       onError?.("Error al actualizar el presupuesto");
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//       <div className="bg-neutral-800 p-6 rounded-xl w-full max-w-lg shadow-lg text-neutral-100 max-h-[80vh] overflow-y-auto">
//         <h2 className="text-xl font-semibold mb-4">Modificar Presupuesto</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="date"
//             name="fecha"
//             value={formData.fecha}
//             onChange={handleChange}
//             className="w-full bg-neutral-700 text-white p-2 rounded"
//             required
//           />

//           <input
//             type="number"
//             name="costo"
//             value={formData.costo}
//             onChange={handleChange}
//             placeholder="Costo de materiales"
//             className="w-full bg-neutral-700 text-white p-2 rounded"
//             required
//           />

//           <input
//             type="number"
//             name="total"
//             value={formData.total}
//             onChange={handleChange}
//             placeholder="Total (incluye mano de obra)"
//             className="w-full bg-neutral-700 text-white p-2 rounded"
//             required
//           />

//           <textarea
//             name="observaciones"
//             value={formData.observaciones}
//             onChange={handleChange}
//             placeholder="Observaciones (opcional)"
//             className="w-full bg-neutral-700 text-white p-2 rounded"
//           />

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
//               Guardar
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditarPresupuestoModal;

import { useState, useEffect } from "react";
import { updatePresupuesto } from "../../api/PresupuestoApi.jsx";

const EditarPresupuestoModal = ({
  isOpen,
  onClose,
  presupuesto,
  onPresupuestoActualizado,
  onError,
}) => {
  const [costo, setCosto] = useState("");
  const [total, setTotal] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [estado, setEstado] = useState("pendiente"); // 🔹 Nuevo
  const [fecha, setFecha] = useState("");
  
  useEffect(() => {
    if (presupuesto) {
      setFecha(presupuesto.fecha_presupuesto?.slice(0, 10) || "");
      setCosto(presupuesto.costo_presupuesto || "");
      setTotal(presupuesto.total_presupuesto || "");
      setObservaciones(presupuesto.observaciones_presupuesto || "");
      setEstado(presupuesto.estado_presupuesto || "pendiente"); // 🔹 Nuevo
    }
  }, [presupuesto]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!presupuesto) return;

    try {
      await updatePresupuesto(presupuesto.presupuesto_id, {
        fecha: fecha,
        costo,
        total,
        observaciones,
        estado: estado, // 🔹 Nuevo
      });

      if (onPresupuestoActualizado) onPresupuestoActualizado();
    } catch (error) {
      console.error("Error editando presupuesto:", error);
      if (onError) onError("Error al actualizar presupuesto");
    }
  };

  

  if (!isOpen || !presupuesto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-neutral-800 p-6 rounded-xl w-full max-w-sm shadow-lg text-neutral-100">
        <h2 className="text-xl font-semibold mb-4">Editar Presupuesto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Fecha */}
          <input
            type="date"
            name="fecha"
            value={fecha}
            onChange={(e)=> setFecha(e.target.value)}
            className="w-full bg-neutral-700 text-white p-2 rounded"
            required
          />

          <input
            type="number"
            value={costo}
            onChange={(e) => setCosto(e.target.value)}
            className="w-full bg-neutral-700 text-white p-2 rounded"
            required
          />
          <input
            type="number"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            className="w-full bg-neutral-700 text-white p-2 rounded"
            required
          />
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full bg-neutral-700 text-white p-2 rounded"
          />

          {/* 🔹 Nuevo select para estado */}
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full bg-neutral-700 text-white p-2 rounded"
          >
            <option value="pendiente">Pendiente</option>
            <option value="aprobado">Aprobado</option>
            <option value="no aprobado">No Aprobado</option>
          </select>

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
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarPresupuestoModal;

