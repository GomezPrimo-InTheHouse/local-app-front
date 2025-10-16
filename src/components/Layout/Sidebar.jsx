// src/components/layout/SidebarNav.jsx

import { Link } from 'react-router-dom';

const SidebarNav = ({ handleOpenModal }) => {
  const linkStyles = "text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center transform hover:-translate-y-1";

  return (
    // ✨ Contenedor que ocupa el 30% del ancho en desktop
    <aside className="w-full md:w-[30%] border-b md:border-b-0 md:border-r border-neutral-700 p-6 flex flex-col items-center justify-center">
      <div className="flex flex-col gap-5 w-full max-w-xs">
        <h2 className="text-2xl font-bold text-center mb-4 text-neutral-300">Navegación</h2>
        <Link to="/clientes" className={`${linkStyles} bg-red-600 hover:bg-red-700`}>
          Clientes
        </Link>
        <Link to="/equipos" className={`${linkStyles} bg-orange-500 hover:bg-orange-600`}>
          Equipos
        </Link>
        <button onClick={handleOpenModal} className={`${linkStyles} bg-blue-600 hover:bg-blue-700`}>
          Estadísticas
        </button>
        <Link to="/ventas" className={`${linkStyles} bg-green-600 hover:bg-green-700`}>
          Ventas
        </Link>
        <Link to="/productos" className={`${linkStyles} bg-emerald-600 hover:bg-emerald-700`}>
          Productos
        </Link>
      </div>
    </aside>
  );
}

export default SidebarNav;