// src/components/BuscadorComponent.jsx
import { useEffect, useMemo, useState } from "react";
import { getClientes } from "../../api/ClienteApi.jsx";
import { X } from "lucide-react";

const BuscadorComponent = ({ onBuscar }) => {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // 🔹 Cargar clientes al montar el componente
  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const data = await getClientes();
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("No se encontraron clientes.");
          setClientes([]);
          return;
        }
        setClientes(Array.isArray(data) ? data : data?.data || []);
      } catch (error) {
        console.error("Error cargando clientes:", error);
        setClientes([]);
      }
    };
    cargarClientes();
  }, []);

  // Normaliza texto para evitar null/undefined y poder usar includes/toLowerCase sin romper
  const normalize = (v) => String(v ?? "").trim().toLowerCase();

  // 🔹 Filtrar clientes por nombre / apellido / celular
  useEffect(() => {
    const filtro = normalize(search);

    if (!filtro) {
      setFilteredClientes([]);
      setShowDropdown(false);
      onBuscar?.(null); // 🔹 Si se borra el texto → cargar todos los equipos
      return;
    }

    const filtrados = (clientes || []).filter((cli) => {
      const nombre = normalize(cli?.nombre);
      const apellido = normalize(cli?.apellido);
      const celular = normalize(cli?.celular);

      // Busca por nombre, apellido, "nombre apellido", y celular (aunque sea null)
      return (
        nombre.includes(filtro) ||
        apellido.includes(filtro) ||
        `${nombre} ${apellido}`.includes(filtro) ||
        celular.includes(filtro)
      );
    });

    setFilteredClientes(filtrados);
  }, [search, clientes]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = (cliente) => {
    const nombre = String(cliente?.nombre ?? "").trim();
    const apellido = String(cliente?.apellido ?? "").trim();
    setSearch(`${nombre} ${apellido}`.trim());
    setShowDropdown(false);
    onBuscar?.(cliente?.id ?? null);
  };

  const handleClear = () => {
    setSearch("");
    setFilteredClientes([]);
    setShowDropdown(false);
    onBuscar?.(null);
  };

  return (
    <div className="relative w-full max-w-lg">
      <div className="relative w-full">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
          }}
          placeholder="Buscar por nombre o celular del cliente..."
          className="w-full bg-neutral-700 text-white p-2 rounded focus:outline-none focus:ring focus:ring-emerald-500 pr-10"
        />

        {/* 🔹 Botón para limpiar */}
        {search && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            aria-label="Limpiar búsqueda"
            title="Limpiar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Lista desplegable */}
      {showDropdown && filteredClientes.length > 0 && (
        <ul className="absolute w-full bg-neutral-800 border border-neutral-600 mt-1 rounded shadow-lg max-h-48 overflow-y-auto z-50">
          {filteredClientes.map((cli) => {
            const nombre = String(cli?.nombre ?? "").trim();
            const apellido = String(cli?.apellido ?? "").trim();
            const celular = cli?.celular ? String(cli.celular) : "Celular N/D";

            return (
              <li
                key={cli.id}
                className="px-3 py-2 hover:bg-neutral-700 cursor-pointer"
                onClick={() => handleSelect(cli)}
              >
                {nombre} {apellido} — {celular}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default BuscadorComponent;
