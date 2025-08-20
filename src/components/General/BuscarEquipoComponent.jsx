import { useState, useEffect } from "react";
import { getEquiposByClienteId } from "../../api/EquipoApi";
import EquipoModal from "../Modales/EquipoModal";

const BuscarEquipo = () => {
  const [search, setSearch] = useState("");
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

  // 🔹 Búsqueda dinámica
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim()) {
        setLoading(true);
        getEquiposByClienteId(search)
          .then((res) => setEquipos(res || []))
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      } else {
        setEquipos([]);
      }
    }, 500); // medio segundo de delay

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // 🔹 Abrir modal
  const handleAbrirModal = (equipo) => {
    setEquipoSeleccionado(equipo || null);
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar equipos por cliente_id"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-neutral-700 text-white p-2 rounded w-full"
      />

      {/* Loading */}
      {loading && <p className="text-gray-400">Buscando...</p>}

      {/* Resultados */}
      {!loading && equipos.length > 0 && (
        <ul className="bg-neutral-800 rounded p-2 divide-y divide-neutral-700">
          {equipos.map((eq) => (
            <li
              key={eq.id}
              onClick={() => handleAbrirModal(eq)}
              className="p-2 hover:bg-neutral-700 cursor-pointer rounded"
            >
              <strong>{eq.tipo}</strong> - {eq.marca} {eq.modelo}  
              <br />
              <span className="text-sm text-gray-400">
                Cliente: {eq.cliente_nombre} {eq.cliente_apellido}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Sin resultados */}
      {!loading && search.trim() && equipos.length === 0 && (
        <div className="flex flex-col items-center gap-2 p-4">
          <p className="text-gray-400">No se encontraron equipos.</p>
          <button
            onClick={() => handleAbrirModal(null)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Agregar nuevo equipo
          </button>
        </div>
      )}

      {/* Modal */}
      <EquipoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        equipoSeleccionado={equipoSeleccionado}
        onSubmit={(data) => {
          console.log("Equipo guardado:", data);
          setModalOpen(false);
        }}
      />
    </div>
  );
};

export default BuscarEquipo;
