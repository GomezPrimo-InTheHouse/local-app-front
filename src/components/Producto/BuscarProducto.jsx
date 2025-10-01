import { useEffect, useState } from "react";
import { buscarProductos } from "../../api/ProductoApi"; // asegúrate que está exportado
import { X } from "lucide-react";

const BuscarProducto = ({ onResultados }) => {
  const [search, setSearch] = useState("");
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // 🔎 Buscar en API cada vez que cambia search
  useEffect(() => {
    const fetchProductos = async () => {
      const query = search.trim();
      if (!query) {
        setFilteredProductos([]);
        onResultados(null); // devuelve null = mostrar todos
        return;
      }

      try {
        const data = await buscarProductos(query);
        setFilteredProductos(data || []);
        onResultados(data || []); // pasamos resultados al padre
      } catch (err) {
        console.error("Error en búsqueda:", err);
        setFilteredProductos([]);
      }
    };

    const timeout = setTimeout(() => {
      fetchProductos();
    }, 400); // pequeño debounce

    return () => clearTimeout(timeout);
  }, [search]);

  const handleClear = () => {
    setSearch("");
    setFilteredProductos([]);
    setShowDropdown(false);
    onResultados(null); // recargar todos
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
          placeholder="Buscar producto por nombre..."
          className="w-full bg-neutral-700 text-white p-2 rounded focus:outline-none focus:ring focus:ring-emerald-500 pr-10"
        />

        {/* Botón limpiar */}
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

      {/* Dropdown de coincidencias */}
      {showDropdown && filteredProductos.length > 0 && (
        <ul className="absolute w-full bg-neutral-800 border border-neutral-600 mt-1 rounded shadow-lg max-h-48 overflow-y-auto z-50">
          {filteredProductos.map((p) => (
            <li
              key={p.id}
              className="px-3 py-2 hover:bg-neutral-700 cursor-pointer"
              onClick={() => {
                setSearch(p.nombre);
                setShowDropdown(false);
                onResultados([p]); // mostramos solo este producto
              }}
            >
              {p.nombre} — {p.categoria} (${p.precio})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BuscarProducto;
