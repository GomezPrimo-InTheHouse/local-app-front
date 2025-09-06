import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHistorialEquipo } from "../api/HistorialApi.jsx";

export default function Historial() {
  const { id } = useParams(); // equipo_id desde la URL
  const navigate = useNavigate();
  const [historial, setHistorial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const data = await getHistorialEquipo(id);
        setHistorial(data);
      } catch (error) {
        console.error("Error obteniendo historial:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistorial();
  }, [id]);

  if (loading) return <p className="text-gray-400 p-4">Cargando historial...</p>;
  if (!historial || !historial.historial?.length)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-neutral-900 text-white p-6">
        <p className="text-gray-400">No hay historial para este equipo.</p>
        <button
          onClick={() => navigate(`/equipos/${id}`)}
          className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
        >
          Volver a Detalle
        </button>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen w-screen bg-neutral-900 text-white">
      {/* Header fijo arriba */}
      <div className="flex justify-between items-center p-6 border-b border-gray-700">
        <h2 className="text-xl font-semibold">
          Historial del Equipo #{historial.equipo_id}
        </h2>
        <button
          onClick={() => navigate(`/equipos/${id}`)}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
        >
          Volver a Detalle
        </button>
      </div>

      {/* Contenido con scroll */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {historial.historial.map((ingreso) => (
          <div
            key={ingreso.ingreso_id}
            className="bg-neutral-800 p-4 rounded-lg shadow w-full"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3">
              <div>
                <p className="font-semibold">
                  Ingreso ID: {ingreso.ingreso_id}
                </p>
                <p className="text-sm text-gray-400">
                  Fecha ingreso:{" "}
                  {new Date(ingreso.fecha_ingreso).toLocaleDateString("es-AR")}
                </p>
                <p className="text-sm text-gray-400">
                  Fecha egreso:{" "}
                  {ingreso.fecha_egreso
                    ? new Date(ingreso.fecha_egreso).toLocaleDateString("es-AR")
                    : "Aún no egresado"}
                </p>
                <p className="text-sm text-gray-300">
                  Estado:{" "}
                  <span className="font-medium text-emerald-400">
                    {ingreso.estado?.nombre}
                  </span>
                </p>
              </div>
            </div>

            {/* Presupuestos */}
            <div className="mt-3">
              <h4 className="text-md font-semibold mb-2">Presupuestos</h4>
              {ingreso.presupuestos.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay presupuestos.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 w-full">
                  {ingreso.presupuestos.map((p) => (
                    <div
                      key={p.presupuesto_id}
                      className="bg-neutral-700 p-3 rounded shadow-sm"
                    >
                      <p className="text-sm font-semibold">
                        Presupuesto #{p.presupuesto_id}
                      </p>
                      <p className="text-xs text-gray-400">
                        Fecha: {new Date(p.fecha).toLocaleDateString("es-AR")}
                      </p>
                      <p className="text-xs text-gray-400">Costo: ${p.costo}</p>
                      <p className="text-xs text-gray-400">Total: ${p.total}</p>
                      <p className="text-xs text-gray-400 italic">
                        {p.observaciones}
                      </p>
                      <p className="text-xs text-gray-300 mt-1">
                        Estado:{" "}
                        <span className="text-emerald-400">
                          {p.estado?.nombre}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
