
import { useState, useEffect } from "react";
import { updateIngreso } from "../../api/IngresoApi";
import { getEstados } from "../../api/EstadoApi.jsx";

const CambiarEstadoModal = ({
  isOpen,
  onClose,
  ingresoActual, // recibo todo el objeto
  onSubmit,      
}) => {
  const [estado_id, setEstado] = useState("");
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [fechaEgreso, setFechaEgreso] = useState("");
  const [estados, setEstados] = useState([]);

  useEffect(() => {
    const fetchEstados = async () => {
      const lista = await getEstados();
      setEstados(lista);
    };
    fetchEstados();
  }, []);


  const estadosDisponibles = estados.map((est) => est.nombre);
   

  // 🔹 Inicializamos los campos cuando cambia ingresoActual
  useEffect(() => {
    if (ingresoActual) {
      setEstado(ingresoActual.estado_id || "");
      setFechaIngreso(ingresoActual.fecha_ingreso ? ingresoActual.fecha_ingreso.slice(0, 10) : "");
      setFechaEgreso(ingresoActual.fecha_egreso ? ingresoActual.fecha_egreso.slice(0, 10) : "");
    }
  }, [ingresoActual]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!estado_id || !ingresoActual?.id) return;

    try {
      // 🔹 Pasamos datos al padre para que maneje el update
      await onSubmit({
        id: ingresoActual.id,
        estado_id,
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
          {/* Estado (estado_id) */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Estado</label>
            <select
              name="estado_id"
              value={estado_id}
             
              className="w-full bg-neutral-700 text-white p-2 rounded"
              required
            >
              <option value="">Selecciona un estado</option>
              {estados.length === 0 ? (
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

