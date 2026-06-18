// // src/components/BuscadorComponent.jsx
// import { useEffect, useMemo, useState } from "react";
// import { getClientes } from "../../api/ClienteApi.jsx";
// import { X } from "lucide-react";

// const BuscadorComponent = ({ onBuscar }) => {
//   const [clientes, setClientes] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filteredClientes, setFilteredClientes] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);

//   // 🔹 Cargar clientes al montar el componente
//   useEffect(() => {
//     const cargarClientes = async () => {
//       try {
//         const data = await getClientes();
//         if (!Array.isArray(data) || data.length === 0) {
//           console.warn("No se encontraron clientes.");
//           setClientes([]);
//           return;
//         }
//         setClientes(Array.isArray(data) ? data : data?.data || []);
//       } catch (error) {
//         console.error("Error cargando clientes:", error);
//         setClientes([]);
//       }
//     };
//     cargarClientes();
//   }, []);

//   // Normaliza texto para evitar null/undefined y poder usar includes/toLowerCase sin romper
//   const normalize = (v) => String(v ?? "").trim().toLowerCase();

//   // 🔹 Filtrar clientes por nombre / apellido / celular
//   useEffect(() => {
//     const filtro = normalize(search);

//     if (!filtro) {
//       setFilteredClientes([]);
//       setShowDropdown(false);
//       onBuscar?.(null); // 🔹 Si se borra el texto → cargar todos los equipos
//       return;
//     }

//     const filtrados = (clientes || []).filter((cli) => {
//       const nombre = normalize(cli?.nombre);
//       const apellido = normalize(cli?.apellido);
//       const celular = normalize(cli?.celular);

//       // Busca por nombre, apellido, "nombre apellido", y celular (aunque sea null)
//       return (
//         nombre.includes(filtro) ||
//         apellido.includes(filtro) ||
//         `${nombre} ${apellido}`.includes(filtro) ||
//         celular.includes(filtro)
//       );
//     });

//     setFilteredClientes(filtrados);
//   }, [search, clientes]); // eslint-disable-line react-hooks/exhaustive-deps

//   const handleSelect = (cliente) => {
//     const nombre = String(cliente?.nombre ?? "").trim();
//     const apellido = String(cliente?.apellido ?? "").trim();
//     setSearch(`${nombre} ${apellido}`.trim());
//     setShowDropdown(false);
//     onBuscar?.(cliente?.id ?? null);
//   };

//   const handleClear = () => {
//     setSearch("");
//     setFilteredClientes([]);
//     setShowDropdown(false);
//     onBuscar?.(null);
//   };

//   return (
//     <div className="relative w-full max-w-lg">
//       <div className="relative w-full">
//         <input
//           type="text"
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setShowDropdown(true);
//           }}
//           placeholder="Buscar por nombre o celular del cliente..."
//           className="w-full bg-neutral-700 text-white p-2 rounded focus:outline-none focus:ring focus:ring-emerald-500 pr-10"
//         />

//         {/* 🔹 Botón para limpiar */}
//         {search && (
//           <button
//             type="button"
//             onClick={handleClear}
//             className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
//             aria-label="Limpiar búsqueda"
//             title="Limpiar"
//           >
//             <X size={18} />
//           </button>
//         )}
//       </div>

//       {/* Lista desplegable */}
//       {showDropdown && filteredClientes.length > 0 && (
//         <ul className="absolute w-full bg-neutral-800 border border-neutral-600 mt-1 rounded shadow-lg max-h-48 overflow-y-auto z-50">
//           {filteredClientes.map((cli) => {
//             const nombre = String(cli?.nombre ?? "").trim();
//             const apellido = String(cli?.apellido ?? "").trim();
//             const celular = cli?.celular ? String(cli.celular) : "Celular N/D";

//             return (
//               <li
//                 key={cli.id}
//                 className="px-3 py-2 hover:bg-neutral-700 cursor-pointer"
//                 onClick={() => handleSelect(cli)}
//               >
//                 {nombre} {apellido} — {celular}
//               </li>
//             );
//           })}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default BuscadorComponent;


// src/components/General/BuscadorComponent.jsx
import { useEffect, useMemo, useState } from "react";
import { getClientes } from "../../api/ClienteApi.jsx";
import { X } from "lucide-react";

/**
 * BuscadorComponent
 *
 * Modo 1 — búsqueda por CLIENTE (nombre, apellido, celular):
 *   Llama a onBuscar(clienteId) → EquipoPage filtra por cliente en el backend.
 *
 * Modo 2 — búsqueda por EQUIPO (marca, modelo, tipo):
 *   Llama a onBuscarEquipo(texto) → EquipoPage filtra localmente sobre la lista.
 *
 * Si se borra el texto → onBuscar(null) para recargar todos.
 */
const BuscadorComponent = ({ onBuscar, onBuscarEquipo }) => {
  const [clientes, setClientes]               = useState([]);
  const [search, setSearch]                   = useState("");
  const [modo, setModo]                       = useState("cliente"); // 'cliente' | 'equipo'
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [showDropdown, setShowDropdown]       = useState(false);

  // Cargar clientes al montar
  useEffect(() => {
    (async () => {
      try {
        const data = await getClientes();
        setClientes(Array.isArray(data) ? data : data?.data || []);
      } catch (error) {
        console.error("Error cargando clientes:", error);
        setClientes([]);
      }
    })();
  }, []);

  const normalize = (v) => String(v ?? "").trim().toLowerCase();

  // Filtrar clientes cuando modo = 'cliente'
  useEffect(() => {
    const filtro = normalize(search);

    if (!filtro) {
      setFilteredClientes([]);
      setShowDropdown(false);
      onBuscar?.(null);
      onBuscarEquipo?.("");
      return;
    }

    if (modo === "cliente") {
      const filtrados = clientes.filter(cli =>
        normalize(cli?.nombre).includes(filtro) ||
        normalize(cli?.apellido).includes(filtro) ||
        `${normalize(cli?.nombre)} ${normalize(cli?.apellido)}`.includes(filtro) ||
        normalize(cli?.celular).includes(filtro)
      );
      setFilteredClientes(filtrados);
      setShowDropdown(filtrados.length > 0);
    } else {
      // Modo equipo: filtrado local en EquipoPage via callback
      setFilteredClientes([]);
      setShowDropdown(false);
      onBuscarEquipo?.(filtro);
    }
  }, [search, clientes, modo]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = (cliente) => {
    setSearch(`${String(cliente?.nombre ?? "")} ${String(cliente?.apellido ?? "")}`.trim());
    setShowDropdown(false);
    onBuscar?.(cliente?.id ?? null);
  };

  const handleClear = () => {
    setSearch("");
    setFilteredClientes([]);
    setShowDropdown(false);
    onBuscar?.(null);
    onBuscarEquipo?.("");
  };

  const handleModoChange = (nuevoModo) => {
    setModo(nuevoModo);
    setSearch("");
    setFilteredClientes([]);
    setShowDropdown(false);
    onBuscar?.(null);
    onBuscarEquipo?.("");
  };

  return (
    <div className="space-y-2 w-full">

      {/* Toggle modo */}
      <div className="flex gap-1 bg-neutral-800 rounded-lg p-1 w-fit">
        <button
          type="button"
          onClick={() => handleModoChange("cliente")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            modo === "cliente"
              ? "bg-emerald-600 text-white"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          👤 Por cliente
        </button>
        <button
          type="button"
          onClick={() => handleModoChange("equipo")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            modo === "equipo"
              ? "bg-emerald-600 text-white"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          📱 Por equipo
        </button>
      </div>

      {/* Input de búsqueda */}
      <div className="relative w-full">
        <input
          type="text"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            if (modo === "cliente") setShowDropdown(true);
          }}
          onFocus={() => { if (modo === "cliente" && filteredClientes.length > 0) setShowDropdown(true); }}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          placeholder={
            modo === "cliente"
              ? "Buscar por nombre, apellido o celular..."
              : "Buscar por marca, modelo o tipo..."
          }
          className="w-full bg-neutral-700 text-white p-2.5 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-10"
        />
        {search && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <X size={16} />
          </button>
        )}

        {/* Dropdown clientes */}
        {showDropdown && filteredClientes.length > 0 && modo === "cliente" && (
          <ul className="absolute w-full bg-neutral-800 border border-neutral-600 mt-1 rounded-lg shadow-xl max-h-48 overflow-y-auto z-50">
            {filteredClientes.map(cli => (
              <li
                key={cli.id}
                onMouseDown={() => handleSelect(cli)}
                className="px-3 py-2.5 hover:bg-neutral-700 cursor-pointer text-sm"
              >
                <span className="font-medium">{cli.nombre} {cli.apellido}</span>
                <span className="text-neutral-400 text-xs ml-2">{cli.celular || "Sin teléfono"}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Hint */}
      {search && modo === "equipo" && (
        <p className="text-xs text-neutral-500">
          Filtrando equipos por <span className="text-emerald-400">"{search}"</span> en marca, modelo y tipo.
        </p>
      )}
    </div>
  );
};

export default BuscadorComponent;