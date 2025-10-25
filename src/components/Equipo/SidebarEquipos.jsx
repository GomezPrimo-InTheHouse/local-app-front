import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SidebarEquipos = ({ filtro, handleFiltro, handleAgregar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const tipos = ["todos", "celular", "notebook", "PC", "otros"];
  const navigate = useNavigate();

  return (
    <div className="
      w-full 
      border-b md:border-b-0 md:border-r border-neutral-700 
      p-6 flex flex-col justify-between
      bg-neutral-900
    ">
      {/* 🔹 Bloque superior */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate("/")}
          className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-[11px] sm:text-sm"
        >
          ← Dashboard
        </button>

        <h2 className="text-2xl font-bold text-emerald-400">
          Gestión de Equipos
        </h2>



        {/* 🔹 Dropdown para mobile */}
        <div className="md:hidden relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded font-semibold"
          >
            {dropdownOpen ? "Cerrar Filtros ▲" : "Abrir Filtros ▼"}
          </button>

          {dropdownOpen && (
            <div className="absolute mt-2 w-full bg-neutral-800 rounded shadow-lg flex flex-col gap-2 z-50">
              {tipos.map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => {
                    handleFiltro(tipo);
                    setDropdownOpen(false);
                  }}
                  className={`px-4 py-2 text-left rounded font-semibold ${filtro === tipo
                      ? "bg-emerald-600 text-white"
                      : "hover:bg-neutral-600 text-gray-200"
                    }`}
                >
                  {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 🔹 Lista de filtros para escritorio */}
        <div className="hidden md:flex flex-col gap-2">
          {tipos.map((tipo) => (
            <button
              key={tipo}
              onClick={() => handleFiltro(tipo)}
              className={`px-4 py-2 rounded font-semibold transition ${filtro === tipo
                  ? "bg-emerald-600 text-white"
                  : "bg-neutral-700 hover:bg-neutral-600 text-gray-200"
                }`}
            >
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* 🔹 Botón inferior */}
      <div className="mt-6">
        <button
          onClick={handleAgregar}
          className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded font-semibold w-full transition"
        >
          + Agregar Equipo
        </button>
      </div>
    </div>
  );
};

export default SidebarEquipos;
