// // src/components/ingresos/CambiarEstadoModal.jsx
// import { useState } from "react";
// import { updateIngreso } from "../../api/IngresoApi"; // 🔹 Importa tu API

// const CambiarEstadoModal = ({
//   isOpen,
//   onClose,
//   ingresoId,           // 🔹 Necesitamos el id del ingreso para updateIngreso
//   estadoActual,
//   fechaEgresoActual,
//   fechaIngresoActual,
//   onSuccess,           // 🔹 Para mostrar alerta global
//   onError,             // 🔹 Para mostrar error
//   onUpdated            // 🔹 Para refrescar datos en el padre
// }) => {
//   const [estado, setEstado] = useState(estadoActual || "");
//   const [fechaIngreso, setFechaIngreso] = useState(
//     fechaIngresoActual ? fechaIngresoActual.slice(0, 10) : ""
//   );
//   const [fechaEgreso, setFechaEgreso] = useState(
//     fechaEgresoActual ? fechaEgresoActual.slice(0, 10) : ""
//   );

//   const estadosDisponibles = [
//     "En reparación",
//     "Presupuestado",
//     "No aceptado el presupuesto",
//     "Entregado",
//     "Cobrado",
//     "Cobrado con saldo",
//   ];

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!estado || !ingresoId) return;

//     try {
//       // ✅ Llamamos a la API centralizada para actualizar ingreso
//       await updateIngreso(ingresoId, {
//         estado,
//         fecha_ingreso: fechaIngreso || null,
//         fecha_egreso: fechaEgreso || null,
//       });

//       // ✅ Mostrar alerta global de éxito
//       onSuccess && onSuccess("Ingreso actualizado correctamente ✅");

//       // ✅ Refrescar datos en el padre
//       onUpdated && onUpdated();

//       // ✅ Cerrar modal
//       onClose();
//     } catch (error) {
//       console.error("Error actualizando ingreso:", error);
//       onError && onError("Error al actualizar ingreso ❌");
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//       <div className="bg-neutral-800 p-6 rounded-xl w-full max-w-sm shadow-lg text-neutral-100">
//         <h2 className="text-xl font-semibold mb-4">Cambiar Estado del Ingreso</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Estado */}
//           <select
//             value={estado}
//             onChange={(e) => setEstado(e.target.value)}
//             className="w-full bg-neutral-700 text-white p-2 rounded"
//             required
//           >
//             <option value="">Selecciona un estado</option>
//             {estadosDisponibles.map((est) => (
//               <option key={est} value={est}>{est}</option>
//             ))}
//           </select>

//           {/* Fecha de ingreso */}
//           <div>
//             <label className="block text-sm text-gray-300 mb-1">
//               Fecha de ingreso
//             </label>
//             <input
//               type="date"
//               value={fechaIngreso}
//               onChange={(e) => setFechaIngreso(e.target.value)}
//               className="w-full bg-neutral-700 text-white p-2 rounded"
//             />
//           </div>

//           {/* Fecha de egreso */}
//           <div>
//             <label className="block text-sm text-gray-300 mb-1">
//               Fecha de egreso (opcional)
//             </label>
//             <input
//               type="date"
//               value={fechaEgreso}
//               onChange={(e) => setFechaEgreso(e.target.value)}
//               className="w-full bg-neutral-700 text-white p-2 rounded"
//             />
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
//               Guardar
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CambiarEstadoModal;

import { useState, useEffect } from "react";
import { updateIngreso } from "../../api/IngresoApi";

const CambiarEstadoModal = ({
  isOpen,
  onClose,
  ingresoActual, // 🔹 ahora recibimos todo el objeto
  onSubmit,      // 🔹 función externa para manejar update
}) => {
  const [estado, setEstado] = useState("");
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [fechaEgreso, setFechaEgreso] = useState("");

  const estadosDisponibles = [
    "En reparación",
    "Presupuestado",
    "No aceptado el presupuesto",
    "Entregado",
    "Cobrado",
    "Cobrado con saldo",
  ];

  // 🔹 Inicializamos los campos cuando cambia ingresoActual
  useEffect(() => {
    if (ingresoActual) {
      setEstado(ingresoActual.estado || "");
      setFechaIngreso(ingresoActual.fecha_ingreso ? ingresoActual.fecha_ingreso.slice(0, 10) : "");
      setFechaEgreso(ingresoActual.fecha_egreso ? ingresoActual.fecha_egreso.slice(0, 10) : "");
    }
  }, [ingresoActual]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!estado || !ingresoActual?.id) return;

    try {
      // 🔹 Pasamos datos al padre para que maneje el update
      await onSubmit({
        id: ingresoActual.id,
        estado,
        fecha_ingreso: fechaIngreso || null,
        fecha_egreso: fechaEgreso || null,
      });
      onClose();
    } catch (error) {
      console.error("Error al actualizar ingreso:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-neutral-800 p-6 rounded-xl w-full max-w-sm shadow-lg text-neutral-100">
        <h2 className="text-xl font-semibold mb-4">Cambiar Estado del Ingreso</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Estado */}
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full bg-neutral-700 text-white p-2 rounded"
            required
          >
            <option value="">Selecciona un estado</option>
            {estadosDisponibles.map((est) => (
              <option key={est} value={est}>{est}</option>
            ))}
          </select>

          {/* Fecha de ingreso */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Fecha de ingreso
            </label>
            <input
              type="date"
              value={fechaIngreso}
              onChange={(e) => setFechaIngreso(e.target.value)}
              className="w-full bg-neutral-700 text-white p-2 rounded"
            />
          </div>

          {/* Fecha de egreso */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Fecha de egreso (opcional)
            </label>
            <input
              type="date"
              value={fechaEgreso}
              onChange={(e) => setFechaEgreso(e.target.value)}
              className="w-full bg-neutral-700 text-white p-2 rounded"
            />
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
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CambiarEstadoModal;

