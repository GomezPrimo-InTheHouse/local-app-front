

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

