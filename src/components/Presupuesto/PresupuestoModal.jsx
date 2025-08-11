import { useState, useEffect } from "react";
import {
  createPresupuesto,
  updatePresupuesto,
} from "../../api/PresupuestoApi";

const PresupuestoModal = ({
  isOpen,
  onClose,
  ingresoSeleccionado,
  presupuesto, // si existe, es modo edición
  onPresupuestoGuardado,
}) => {
  const esEdicion = !!presupuesto;

  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0],
    costo: "",
    total: "",
    observaciones: "",
    estado: "pendiente",
  });

  useEffect(() => {
    if (isOpen) {
      if (esEdicion) {
        // Modo edición
        setFormData({
          fecha: presupuesto.fecha_presupuesto?.split("T")[0] || "",
          costo: presupuesto.costo_presupuesto || "",
          total: presupuesto.total_presupuesto || "",
          observaciones: presupuesto.observaciones_presupuesto || "",
          estado: presupuesto.estado_presupuesto || "pendiente",
        });
      } else {
        // Modo creación
        setFormData({
          fecha: new Date().toISOString().split("T")[0],
          costo: "",
          total: "",
          observaciones: "",
          estado: "pendiente",
        });
      }
    }
  }, [isOpen, presupuesto, esEdicion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // console.log('Datos', esEdicion, presupuesto, ingresoSeleccionado);
      if (esEdicion && presupuesto?.presupuesto_id) {
        await updatePresupuesto(presupuesto.presupuesto_id, {
          ingreso_id: presupuesto.ingreso_id,
          fecha: formData.fecha,
          costo: Number(formData.costo),
          total: Number(formData.total),
          observaciones: formData.observaciones,
          estado: formData.estado,
        });
      } else {
        // if (!ingresoSeleccionado?.id) {
        //   alert("No hay ingreso seleccionado.");
        //   return;
        // }

        await createPresupuesto({
          ingreso_id: ingresoSeleccionado.id,
          fecha: formData.fecha,
          costo: Number(formData.costo),
          total: Number(formData.total),
          observaciones: formData.observaciones,
          estado: formData.estado,
        });
      }

      if (onPresupuestoGuardado) onPresupuestoGuardado();
      onClose();
    } catch (error) {
      console.error("Error al guardar presupuesto:", error);
      alert("Ocurrió un error al guardar el presupuesto.");
    }
  };




  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-neutral-800 p-6 rounded-xl w-full max-w-lg shadow-lg text-neutral-100 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {esEdicion ? "Editar Presupuesto" : "Agregar Presupuesto"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Fecha */}
          <label className="block mb-2">Fecha</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="w-full bg-neutral-700 text-white p-2 rounded"
            required
          />

          {/* Costo */}
          {/* <label className="block mb-2">Costo de Materiales</label>
          <input
            type="number"
            name="costo"
            value={formData.costo}
            onChange={handleChange}
            placeholder="Costo de materiales"
            className="w-full bg-neutral-700 text-white p-2 rounded"
            required
          /> */}

          {/* Total */}
          {/* <label className="block mb-1">Total (incluye mano de obra)</label>
          <input
            type="number"
            name="total"
            value={formData.total}
            onChange={handleChange}
            placeholder="Total (incluye mano de obra)"
            className="w-full bg-neutral-700 text-white p-2 rounded"
            required
          /> */}
          {/* Costo */}
          <label className="block mb-2">Costo de Materiales</label>
          <input
            type="text" // 🔹 lo cambiamos a text para poder formatear con puntos
            name="costo"
            value={
              formData.costo
                ? formData.costo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                : ""
            }
            onChange={(e) => {
              // 🔹 Quitamos puntos o comas y guardamos como entero
              const rawValue = e.target.value.replace(/\./g, "").replace(/,/g, "");
              setFormData({
                ...formData,
                costo: rawValue === "" ? "" : parseInt(rawValue, 10),
              });
            }}
            placeholder="Costo de materiales"
            className="w-full bg-neutral-700 text-white p-2 rounded"
            required
          />



          {/* Total */}
          <label className="block mb-1">Total (incluye mano de obra)</label>
          <input
            type="text"
            name="total"
            value={
              formData.total
                ? formData.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                : ""
            }
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\./g, "").replace(/,/g, "");
              setFormData({
                ...formData,
                total: rawValue === "" ? "" : parseInt(rawValue, 10),
              });
            }}
            placeholder="Total (incluye mano de obra)"
            className="w-full bg-neutral-700 text-white p-2 rounded"
            required
          />


          {/* Observaciones */}
          <label className="block mb-1">Observaciones</label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            placeholder="Observaciones (opcional)"
            className="w-full bg-neutral-700 text-white p-2 rounded"
          />

          {/* Estado */}
          <label className="block mb-1">Estado</label>
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
          <div className="flex justify-end gap-3 mt-1">
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
              {esEdicion ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PresupuestoModal;
