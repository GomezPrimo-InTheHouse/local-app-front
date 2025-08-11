import { useState, useEffect } from "react";
import { createPresupuesto } from "../../api/PresupuestoApi";

const CargaPresupuestoModal = ({
  isOpen,
  onClose,
  ingresoSeleccionado,
  onPresupuestoCreado,
}) => {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0], // Fecha actual por defecto
    costo: "",
    total: "",
    observaciones: "",
    estado: "pendiente", // 🔹 Nuevo estado
  });

  // 🔹 Reset form cuando el modal se abre/cierra
  useEffect(() => {
    if (isOpen) {
      setFormData({
        fecha: new Date().toISOString().split("T")[0],
        costo: "",
        total: "",
        observaciones: "",
        estado: "pendiente",
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ingresoSeleccionado?.id)
      return alert("No hay ingreso seleccionado para este presupuesto.");

    try {
      await createPresupuesto({
        ingreso_id: ingresoSeleccionado.id,
        fecha: formData.fecha,
        costo: Number(formData.costo),
        total: Number(formData.total),
        observaciones: formData.observaciones || "",
        estado: formData.estado, // 🔹 Nuevo
      });

      if (onPresupuestoCreado) onPresupuestoCreado();
      onClose(); // 🔹 Cerramos modal
    } catch (error) {
      console.error("Error creando presupuesto:", error);
      alert("Ocurrió un error al crear el presupuesto.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-neutral-800 p-6 rounded-xl w-full max-w-lg shadow-lg text-neutral-100 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Agregar Presupuesto</h2>
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
          <input
            type="number"
            name="costo"
            value={formData.costo}
            onChange={handleChange}
            placeholder="Costo de materiales"
            className="w-full bg-neutral-700 text-white p-2 rounded"
            required
          />

          {/* Total */}
          <input
            type="number"
            name="total"
            value={formData.total}
            onChange={handleChange}
            placeholder="Total (incluye mano de obra)"
            className="w-full bg-neutral-700 text-white p-2 rounded"
            required
          />

          {/* Observaciones */}
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            placeholder="Observaciones (opcional)"
            className="w-full bg-neutral-700 text-white p-2 rounded"
          />

          {/* 🔹 Estado del presupuesto */}
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full bg-neutral-700 text-white p-2 rounded"
          >
            <option value="pendiente">Pendiente</option>
            <option value="aprobado">Aprobado</option>
            <option value="no aprobado">No Aprobado</option>
          </select>

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

export default CargaPresupuestoModal;
