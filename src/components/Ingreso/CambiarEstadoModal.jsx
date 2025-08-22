// src/components/ingresos/CambiarEstadoModal.jsx
import { useEffect, useState } from "react";
import { updateIngreso } from "../../api/IngresoApi";
import { getEstados } from "../../api/EstadoApi.jsx";

const toInputDate = (value) => {
  if (!value) return "";
  // Evitamos desfases por zona horaria
  const d = new Date(value);
  if (isNaN(d)) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const CambiarEstadoModal = ({
  isOpen,
  onClose,
  ingresoActual,     // { id, estado_id (o estado), fecha_ingreso, fecha_egreso, ... }
  onSuccess,         // alert global
  onError,           // alert global
  onUpdated          // refrescar datos (padre)
}) => {
  const [estados, setEstados] = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(true);

  const [estado_id, setEstadoId] = useState(""); // siempre como string para el <select>
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [fechaEgreso, setFechaEgreso] = useState("");

  // Reset limpio cada vez que se abre
  useEffect(() => {
    if (isOpen) {
      setEstadoId("");
      setFechaIngreso("");
      setFechaEgreso("");
    }
  }, [isOpen]);

  // 1) Cargar lista de estados cuando el modal se abre
  useEffect(() => {
    if (!isOpen) return;

    (async () => {
      try {
        setLoadingEstados(true);
        const lista = await getEstados();
        setEstados(Array.isArray(lista) ? lista : []);
      } catch (e) {
        console.error("Error cargando estados:", e);
        setEstados([]);
      } finally {
        setLoadingEstados(false);
      }
    })();
  }, [isOpen]);

  // 2) Inicializar valores del formulario **solo** cuando:
  //    - el modal está abierto
  //    - tenemos ingresoActual
  //    - y la lista de estados ya está cargada
  useEffect(() => {
    if (!isOpen || !ingresoActual || estados.length === 0) return;

    // Soporte para ambas formas: ingresoActual.estado_id (nuevo) o ingresoActual.estado (legado)
    const currentEstadoId =
      ingresoActual.estado_id ?? ingresoActual.estado ?? null;

    // Si el id actual existe en la lista de estados, lo seteamos
    const match = estados.find((e) => Number(e.id) === Number(currentEstadoId));
    setEstadoId(match ? String(match.id) : "");

    setFechaIngreso(toInputDate(ingresoActual.fecha_ingreso));
    setFechaEgreso(toInputDate(ingresoActual.fecha_egreso));
  }, [isOpen, ingresoActual, estados]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ingresoActual?.id || !estado_id) return;

    try {
      await updateIngreso(ingresoActual.id, {
        estado_id: Number(estado_id),
        fecha_ingreso: fechaIngreso || null,
        fecha_egreso: fechaEgreso || null,
      });

      onSuccess && onSuccess("Ingreso actualizado correctamente ✅");
      onUpdated && onUpdated();
      onClose();
    } catch (error) {
      console.error("Error actualizando ingreso:", error);
      onError && onError("Error al actualizar ingreso ❌");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-neutral-800 p-6 rounded-xl w-full max-w-sm shadow-lg text-neutral-100">
        <h2 className="text-xl font-semibold mb-4">Cambiar Estado del Ingreso</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Estado */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Estado</label>
            <select
              value={estado_id}
              onChange={(e) => setEstadoId(e.target.value)}
              className="w-full bg-neutral-700 text-white p-2 rounded disabled:opacity-60"
              required
              disabled={loadingEstados}
            >
              <option value="">
                {loadingEstados ? "Cargando estados..." : "Selecciona un estado"}
              </option>
              {!loadingEstados &&
                estados.map((est) => (
                  <option key={est.id} value={String(est.id)}>
                    {est.nombre}
                  </option>
                ))}
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
              disabled={loadingEstados}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded disabled:opacity-60"
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
