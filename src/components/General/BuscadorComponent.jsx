// src/components/BuscadorComponent.jsx
import { useEffect, useState } from "react";
import { getClientes } from "../../api/ClienteApi.jsx";
import { X } from "lucide-react"; // 🔹 Icono para botón de limpiar (instala lucide-react si no lo tienes)
import { getEquipos } from "../../api/EquiposApi.jsx"; // Asegúrate de tener esta función en tu API

const BuscadorComponent = ({ onBuscar }) => {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [equipos, setEquipos] = useState(null);

   useEffect(() => {
    const cargarEquipos = async () => {
      try {
        // ❗ Actualiza esta llamada a tu API real de equipos
        const data = await getEquipos(); 
        
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("No se encontraron equipos.");
          setEquipos([]);
          return;
        }
        setEquipos(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error("Error cargando equipos:", error);
      }
    };
    cargarEquipos();
  }, []);
  
  // 🔹 Cargar clientes al montar el componente
  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const data = await getClientes();
        // Aseguramos que data tenga un elemento en el array al menos
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("No se encontraron equipos para este cliente");
            setClientes([]);
            return;
            }

        setClientes(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error("Error cargando clientes:", error);
      }
    };
    cargarClientes();
  }, []);

  // cargar equipos al montar el componente
 

  // 🔹 Filtrar clientes por nombre o celular
  useEffect(() => {
    const filtro = search.trim().toLowerCase();

    if (!filtro) {
      // 🔹 Si se borra el texto → cargar todos los equipos
      setFilteredClientes([]);
      onBuscar(null); 
      return;
    }

    const filtrados = clientes.filter(
      (cli) =>
        cli.nombre.toLowerCase().includes(filtro) ||
        cli.celular.toLowerCase().includes(filtro)
    );
    setFilteredClientes(filtrados);
  }, [search, clientes]);

  const handleSelect = (cliente) => {
    setSearch(`${cliente.nombre} ${cliente.apellido}`);
    setShowDropdown(false);
    onBuscar(cliente.id); // 🔹 Llamamos a la función del padre con el ID
  };

  const handleClear = () => {
    setSearch("");
    setFilteredClientes([]);
    setShowDropdown(false);
    onBuscar(null); // 🔹 Carga todos los equipos
  };

  return (
    <div className="mb-6 relative w-full max-w-lg">
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
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Lista desplegable */}
      {showDropdown && filteredClientes.length > 0 && (
        <ul className="absolute w-full bg-neutral-800 border border-neutral-600 mt-1 rounded shadow-lg max-h-48 overflow-y-auto z-50">
          {filteredClientes.map((cli) => (
            <li
              key={cli.id}
              className="px-3 py-2 hover:bg-neutral-700 cursor-pointer"
              onClick={() => handleSelect(cli)}
            >
              {cli.nombre} {cli.apellido} — {cli.celular}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BuscadorComponent;
src/components/BuscadorComponent.jsx


