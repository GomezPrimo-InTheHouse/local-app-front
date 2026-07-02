// src/pages/CelularesPage.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCelulares, createCelular, updateCelular, deleteCelular } from "../api/CelularApi.jsx";
import CelularModal from "../components/Celular/CelularModal.jsx";
import CelularFiltros from "../components/Celular/CelularFiltros.jsx";
import DolarWidget from "../components/Celular/DolarWidget.jsx";
import AlertNotification from "../components/Alerta/AlertNotification.jsx";

const FILTROS_INICIALES = { marca: "", ram_gb: "", almacenamiento_gb: "", gama: "", tipo_entrega: "" };

const ETIQUETAS_ENTREGA = {
  EN_STOCK_LOCAL: { label: "En stock", classes: "bg-emerald-600/20 text-emerald-400" },
  A_PEDIDO_24H: { label: "A pedido", classes: "bg-amber-600/20 text-amber-400" },
  SIN_STOCK_CONSULTAR: { label: "Sin stock", classes: "bg-gray-600/20 text-gray-300" },
};

const CelularesPage = () => {
  const navigate = useNavigate();

  const [celulares, setCelulares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [celularSeleccionado, setCelularSeleccionado] = useState(null);

  const [alert, setAlert] = useState({ message: "", type: "success", key: 0 });

  const fetchCelulares = useCallback(async () => {
    try {
      setLoading(true);
      const filtrosLimpios = Object.fromEntries(
        Object.entries(filtros).filter(([, v]) => v !== "")
      );
      const res = await getCelulares(filtrosLimpios);
      setCelulares(res?.data ?? []);
    } catch (error) {
      console.error("Error cargando celulares:", error);
      setAlert({ message: "Error al cargar el catálogo de celulares ❌", type: "error", key: Date.now() });
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    fetchCelulares();
  }, [fetchCelulares]);

  const actualizarFiltro = (campo, valor) => setFiltros((prev) => ({ ...prev, [campo]: valor }));
  const limpiarFiltros = () => setFiltros(FILTROS_INICIALES);

  const abrirModalCrear = () => {
    setCelularSeleccionado(null);
    setIsModalOpen(true);
  };

  const abrirModalEditar = (c) => {
    setCelularSeleccionado(c);
    setIsModalOpen(true);
  };

  const handleGuardar = async (payload) => {
    try {
      if (celularSeleccionado) {
        await updateCelular(celularSeleccionado.id, payload);
        setAlert({ message: "Equipo actualizado correctamente ✅", type: "success", key: Date.now() });
      } else {
        await createCelular(payload);
        setAlert({ message: "Equipo creado correctamente ✅", type: "success", key: Date.now() });
      }
      await fetchCelulares();
    } catch (err) {
      console.error(err);
      setAlert({ message: "Error al guardar el equipo ❌", type: "error", key: Date.now() });
      throw err; // el modal necesita el throw para no cerrarse en error
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este equipo?")) return;
    try {
      await deleteCelular(id);
      setAlert({ message: "Equipo eliminado ✅", type: "success", key: Date.now() });
      await fetchCelulares();
    } catch (err) {
      console.error(err);
      setAlert({ message: "No se pudo eliminar el equipo ❌", type: "error", key: Date.now() });
    }
  };

  const formatPesos = (val) =>
    (val ?? 0).toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-screen bg-neutral-900 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full lg:w-1/4 xl:w-1/5 bg-neutral-800 p-4 sm:p-6 flex-col justify-start shadow-xl z-10 lg:flex hidden">
        <button
          onClick={() => navigate("/")}
          className="px-4 mb-6 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition text-sm"
        >
          ⬅️ Volver al Dashboard
        </button>

        <button
          onClick={abrirModalCrear}
          className="w-full bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-md font-semibold"
        >
          + Agregar Equipo
        </button>

        <div className="mt-auto text-sm text-gray-400">
          <p className="font-medium">Catálogo de Celulares</p>
          <p className="text-xs">Costeo en USD, margen por equipo y disponibilidad automática.</p>
        </div>
      </aside>

      {/* Header mobile */}
      <header className="lg:hidden w-full bg-neutral-800 p-4 flex justify-between items-center shadow">
        <button onClick={() => navigate("/")} className="px-3 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition text-sm">
          ⬅️ Volver
        </button>
        <button onClick={abrirModalCrear} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm">
          + Agregar Equipo
        </button>
      </header>

      {/* Main */}
      <main className="w-full lg:w-[70%] p-4 sm:p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Catálogo de Celulares</h3>
        </div>

        {alert.message && (
          <AlertNotification
            key={alert.key}
            message={alert.message}
            type={alert.type}
            duration={2500}
            onClose={() => setAlert((prev) => ({ ...prev, message: "" }))}
          />
        )}

        <DolarWidget onCambio={fetchCelulares} />

        <CelularFiltros filtros={filtros} onCambiarFiltro={actualizarFiltro} onLimpiar={limpiarFiltros} />

        {loading ? (
          <p className="text-gray-400">Cargando catálogo...</p>
        ) : celulares.length === 0 ? (
          <p className="text-gray-400">No hay equipos que coincidan con los filtros.</p>
        ) : (
          <ul className="space-y-5">
            {celulares.map((c) => {
              const entrega = ETIQUETAS_ENTREGA[c.tipo_entrega] || ETIQUETAS_ENTREGA.SIN_STOCK_CONSULTAR;
              return (
                <li
                  key={c.id}
                  className="bg-neutral-800 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center p-5 gap-4 hover:bg-gray-700 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex gap-4 flex-1">
                    {c.foto_url && (
                      <img src={c.foto_url} alt={c.nombre} className="w-16 h-16 object-cover rounded-lg border border-gray-700 flex-shrink-0" />
                    )}
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 justify-between">
                        <p className="font-bold text-lg text-white tracking-wide">
                          {c.marca} — {c.nombre} {c.color && <span className="text-gray-400 text-sm">({c.color})</span>}
                        </p>
                        <span className={`text-xs font-semibold uppercase px-2 py-1 rounded-full mt-2 sm:mt-0 ${entrega.classes}`}>
                          {entrega.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-gray-400 text-sm">
                        <span>{c.ram_gb}GB RAM / {c.almacenamiento_gb}GB</span>
                        <span className="capitalize">Gama {c.gama}</span>
                        <span>Stock: <span className="font-mono text-teal-400">{c.stock ?? 0}</span></span>
                        <span>Costo: <span className="font-mono">US$ {Number(c.costo_usd ?? 0).toFixed(2)}</span></span>
                        <span>Margen: <span className="font-mono">{c.margen_porcentaje}%</span></span>
                        <span className="font-semibold text-fuchsia-400">{formatPesos(c.precio)}</span>
                        {c.subir_web && <span className="text-emerald-400">🌐 Publicado en web</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col gap-2 md:gap-3 self-end sm:self-center mt-3 md:mt-0">
                    <button
                      onClick={() => abrirModalEditar(c)}
                      className="px-4 py-2 rounded-lg font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 shadow"
                    >
                      Modificar
                    </button>
                    <button
                      onClick={() => handleEliminar(c.id)}
                      className="px-4 py-2 rounded-lg font-bold text-sm text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 shadow"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      <CelularModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setCelularSeleccionado(null); }}
        celular={celularSeleccionado}
        onSave={handleGuardar}
      />
    </div>
  );
};

export default CelularesPage;