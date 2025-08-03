// src/components/equipos/CargaPresupuestoModal.jsx
import { useState } from "react";
import { createPresupuesto } from "../api/PresupuestoApi.jsx";

const CargaPresupuestoModal = ({ isOpen, onClose, equipoSeleccionado, onSuccess }) => {
  const [formData, setFormData] = useState({
    fecha: "",
    total: "",
    observaciones: "",
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen || !equipoSeleccionado) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fecha || !formData.total) {
      alert("La fecha y el total son obligatorios");
      return;
    }

    try {
      setLoading(true);

      // 🔹 Enviamos los datos al backend
      await createPresupuesto({
        fecha: formData.fecha,
        total: parseFloat(formData.total),
        observaciones: formData.observaciones,
        cliente_id: equipoSeleccionado.cliente_id,
        equipo_id: equipoSeleccionado.id,
      });

      if (onSuccess) onSuccess(); // Para refrescar la lista si hace falta
      onClose(); // Cerrar modal
    } catch (error) {
      console.error("Error creando presupuesto:", error);
      alert("Error creando presupuesto. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-neutral-800 p-6 rounded-xl w-full max-w-md shadow-lg text-neutral-100 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          Cargar Presupuesto para {equipoSeleccionado.marca} {equipoSeleccionado.modelo}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Fecha</label>
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
            <label className="block mb-1 text-sm text-gray-300">Total</label>
            <input
              type="number"
              name="total"
              placeholder="Ej: 25000"
              value={formData.total}
              onChange={handleChange}
              className="w-full bg-neutral-700 text-white p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Observaciones</label>
            <textarea
              name="observaciones"
              placeholder="Detalle del presupuesto..."
              value={formData.observaciones}
              onChange={handleChange}
              className="w-full bg-neutral-700 text-white p-2 rounded"
            />
          </div>

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
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded"
            >
              {loading ? "Guardando..." : "Guardar Presupuesto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CargaPresupuestoModal;
