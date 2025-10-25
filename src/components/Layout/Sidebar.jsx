// src/components/layout/SidebarNav.jsx
import { Link } from "react-router-dom";
// import SidebarCard from "../ui/SidebarCard"; // Opcional, si lo creaste

// Definición de estilo base para los botones de navegación
const btnBase =
  "w-full h-12 inline-flex items-center justify-start gap-3 " +
  "rounded-xl px-4 text-base font-semibold text-white " +
  "shadow-lg hover:shadow-xl transition-all duration-200 " +
  "whitespace-nowrap truncate";

const SidebarNav = ({ handleOpenModal }) => {
  return (
    <aside
      className="
        flex flex-col gap-4
        md:sticky md:top-4
        h-full md:h-[calc(100vh-2rem)]
        overflow-y-auto
        px-3 sm:px-4 py-4
        min-w-0
        border-b md:border-b-0 md:border-r border-white/10
        /* Estilo del scrollbar */
        [scrollbar-width:thin]
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-thumb]:bg-white/10
      "
    >
      {/* Tarjeta de Navegación principal */}
      <div className="rounded-2xl border border-white/10 bg-neutral-800/70 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-100">
            Navegación
          </h2>
         
        </div>

        <p className="mt-1 text-sm text-neutral-300/90">
          Accesos a módulos principales.
        </p>

        <div className="mt-5 space-y-3">
          <Link to="/clientes" className={`${btnBase} bg-rose-600 hover:bg-rose-700`}>
            👥 Clientes
          </Link>

          <Link to="/equipos" className={`${btnBase} bg-orange-500 hover:bg-orange-600`}>
            💻 Equipos
          </Link>

          <button
            onClick={handleOpenModal}
            className={`${btnBase} bg-blue-600 hover:bg-blue-700 text-left`}
          >
            📊 Estadísticas
          </button>

          <Link to="/ventas" className={`${btnBase} bg-green-600 hover:bg-green-700`}>
            🛒 Ventas
          </Link>

          <Link to="/productos" className={`${btnBase} bg-emerald-600 hover:bg-emerald-700`}>
            📦 Productos
          </Link>
        </div>
      </div>

      {/* Info/ayuda del panel */}
      <div className="rounded-2xl border border-white/10 bg-neutral-800/40 p-4 sm:p-5">
        <p className="text-xs text-neutral-300/80 leading-5">
          
        </p>
      </div>
    </aside>
  );
};

export default SidebarNav;