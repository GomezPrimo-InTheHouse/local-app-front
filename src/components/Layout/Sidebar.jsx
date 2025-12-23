// // src/components/layout/SidebarNav.jsx
// import { Link } from "react-router-dom";
// // import SidebarCard from "../ui/SidebarCard"; // Opcional, si lo creaste

// // Definición de estilo base para los botones de navegación
// const btnBase =
//   "w-full h-12 inline-flex items-center justify-start gap-3 " +
//   "rounded-xl px-4 text-base font-semibold text-white " +
//   "shadow-lg hover:shadow-xl transition-all duration-200 " +
//   "whitespace-nowrap truncate";

// const SidebarNav = ({ handleOpenModal }) => {
//   return (
//     <aside
//       className="
//         flex flex-col gap-4
//         md:sticky md:top-4
//         h-full md:h-[calc(100vh-2rem)]
//         overflow-y-auto
//         px-3 sm:px-4 py-4
//         min-w-0
//         border-b md:border-b-0 md:border-r border-white/10
//         /* Estilo del scrollbar */
//         [scrollbar-width:thin]
//         [&::-webkit-scrollbar]:w-2
//         [&::-webkit-scrollbar-thumb]:bg-white/10
//       "
//     >
//       {/* Tarjeta de Navegación principal */}
//       <div className="rounded-2xl border border-white/10 bg-neutral-800/70 p-4 sm:p-5 shadow-sm">
//         <div className="flex items-center justify-between">
//           <h2 className="text-xl font-bold text-neutral-100">
//             Navegación
//           </h2>
         
//         </div>

//         <p className="mt-1 text-sm text-neutral-300/90">
//           Accesos a módulos principales.
//         </p>

//         <div className="mt-5 space-y-3">
//           <Link to="/clientes" className={`${btnBase} bg-rose-600 hover:bg-rose-700`}>
//             👥 Clientes
//           </Link>

//           <Link to="/equipos" className={`${btnBase} bg-orange-500 hover:bg-orange-600`}>
//             💻 Equipos
//           </Link>

//           <button
//             onClick={handleOpenModal}
//             className={`${btnBase} bg-blue-600 hover:bg-blue-700 text-left`}
//           >
//             📊 Estadísticas
//           </button>

//           <Link to="/ventas" className={`${btnBase} bg-green-600 hover:bg-green-700`}>
//             🛒 Ventas
//           </Link>

//           <Link to="/productos" className={`${btnBase} bg-emerald-600 hover:bg-emerald-700`}>
//             📦 Productos
//           </Link>
//         </div>
//       </div>

//       {/* Info/ayuda del panel */}
//       <div className="rounded-2xl border border-white/10 bg-neutral-800/40 p-4 sm:p-5">
//         <p className="text-xs text-neutral-300/80 leading-5">
          
//         </p>
//       </div>
//     </aside>
//   );
// };

// export default SidebarNav;

// src/components/layout/SidebarNav.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Monitor, BarChart3, ShoppingBag, Box, ChevronRight } from "lucide-react";

const NavItem = ({ to, icon: Icon, label, colorClass, active }) => (
  <Link
    to={to}
    className={`
      group flex items-center justify-between w-full p-4 rounded-2xl transition-all duration-300
      ${active 
        ? 'bg-white/10 border-white/10 shadow-lg' 
        : 'hover:bg-white/5 border-transparent hover:border-white/5'}
      border
    `}
  >
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-xl ${colorClass} bg-opacity-10 text-opacity-90`}>
        <Icon size={20} />
      </div>
      <span className={`font-medium ${active ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-200'}`}>
        {label}
      </span>
    </div>
    <ChevronRight size={16} className={`transition-transform ${active ? 'opacity-100 rotate-90' : 'opacity-0 group-hover:opacity-50'}`} />
  </Link>
);

const SidebarNav = ({ handleOpenModal }) => {
  return (
    <aside className="w-[30%] hidden lg:flex flex-col gap-6 p-6 border-r border-white/5 bg-[#0a0a0a]/50 backdrop-blur-md">
      <div className="px-2 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-black">S</div>
          <h2 className="text-xl font-bold tracking-tight text-white">Sistema POS</h2>
        </div>
        <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">Administración</p>
      </div>

      <nav className="space-y-2">
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" colorClass="bg-blue-500 text-blue-500" active />
        <NavItem to="/clientes" icon={Users} label="Clientes" colorClass="bg-rose-500 text-rose-500" />
        <NavItem to="/equipos" icon={Monitor} label="Equipos" colorClass="bg-orange-500 text-orange-500" />
        <NavItem to="/ventas" icon={ShoppingBag} label="Ventas" colorClass="bg-green-500 text-green-500" />
        <NavItem to="/productos" icon={Box} label="Productos" colorClass="bg-emerald-500 text-emerald-500" />
      </nav>

      <div className="mt-auto p-5 rounded-3xl bg-gradient-to-br from-neutral-900 to-black border border-white/5 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-sm font-bold text-white mb-2">Reportes Pro</h3>
          <p className="text-xs text-neutral-400 mb-4">Accede a métricas avanzadas y exportación de datos.</p>
          <button 
            onClick={handleOpenModal}
            className="w-full py-2.5 bg-white text-black text-xs font-bold rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
          >
            <BarChart3 size={14} />
            Ver Estadísticas
          </button>
        </div>
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-500/10 blur-2xl rounded-full" />
      </div>
      </aside>
  );
};

export default SidebarNav;