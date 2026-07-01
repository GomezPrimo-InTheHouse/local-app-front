

// import { Link } from "react-router-dom";

// const btnBaseDesktop =
//   "w-full h-12 inline-flex items-center justify-start gap-3 " +
//   "rounded-xl px-4 text-base font-semibold text-white " +
//   "shadow-lg hover:shadow-xl transition-all duration-200 " +
//   "whitespace-nowrap truncate";

// const btnBaseMobile =
//   "shrink-0 h-10 inline-flex items-center justify-center gap-2 " +
//   "rounded-xl px-3 text-sm font-semibold text-white " +
//   "shadow-md hover:shadow-lg transition-all duration-200 " +
//   "whitespace-nowrap";

// const SidebarNav = ({ handleOpenModal }) => {
//   return (
//     <aside
//       className="
//         w-full lg:w-[30%] xl:w-[28%]
//         lg:max-w-[420px]
//         flex-shrink-0
//         border-b lg:border-b-0 lg:border-r border-white/10
//         bg-[#0a0a0a]
//         sticky top-0 z-40 lg:static
//       "
//     >
//       <div
//         className="
//           lg:h-[calc(100vh-5rem)]
//           lg:sticky lg:top-20
//           px-3 sm:px-4 py-3 lg:py-4
//           min-w-0
//           overflow-x-auto lg:overflow-x-hidden
//           overflow-y-hidden lg:overflow-y-auto
//           [scrollbar-width:thin]
//           [&::-webkit-scrollbar]:h-2
//           lg:[&::-webkit-scrollbar]:w-2
//           [&::-webkit-scrollbar-thumb]:bg-white/10
//         "
//       >
//         {/* =========================
//             MOBILE: Barra superior
//            ========================= */}
//         <div className="lg:hidden mb-4 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Link to="/clientes" className={`${btnBaseMobile} bg-rose-600 hover:bg-rose-700`}>
//               👥 <span className="hidden xs:inline">Clientes</span>
//             </Link>

//             <Link to="/equipos" className={`${btnBaseMobile} bg-orange-500 hover:bg-orange-600`}>
//               💻 <span className="hidden xs:inline">Equipos</span>
//             </Link>

//             <button
//               onClick={handleOpenModal}
//               className={`${btnBaseMobile} bg-blue-600 hover:bg-blue-700`}
//             >
//               📊 <span className="hidden xs:inline">Estadísticas</span>
//             </button>

//             <Link
//               to="/estadisticas-historicas"
//               className={`${btnBaseMobile} bg-indigo-600 hover:bg-indigo-700`}
//             >
//               📈 <span className="hidden xs:inline">Históricas</span>
//             </Link>

//             <Link to="/ventas" className={`${btnBaseMobile} bg-green-600 hover:bg-green-700`}>
//               🛒 <span className="hidden xs:inline">Ventas</span>
//             </Link>

//             <Link to="/productos" className={`${btnBaseMobile} bg-emerald-600 hover:bg-emerald-700`}>
//               📦 <span className="hidden xs:inline">Productos</span>
//             </Link>
//           </div>
//         </div>

//         {/* =========================
//             DESKTOP: Sidebar normal
//            ========================= */}
//         <div className="hidden lg:block">
//           {/* Tarjeta de Navegación principal */}
//           <div className="rounded-2xl border border-white/10 bg-neutral-800/70 p-4 sm:p-5 shadow-sm">
//             <div className="flex items-center justify-between">
//               <h2 className="text-xl font-bold text-neutral-100">Navegación</h2>
//             </div>

//             <p className="mt-1 text-sm text-neutral-300/90">
//               Accesos a módulos principales.
//             </p>

//             <div className="mt-5 space-y-3">
//               <Link
//                 to="/clientes"
//                 className={`${btnBaseDesktop} bg-rose-600 hover:bg-rose-700`}
//               >
//                 👥 Clientes
//               </Link>

//               <Link
//                 to="/equipos"
//                 className={`${btnBaseDesktop} bg-orange-500 hover:bg-orange-600`}
//               >
//                 💻 Equipos
//               </Link>

//               <button
//                 onClick={handleOpenModal}
//                 className={`${btnBaseDesktop} bg-blue-600 hover:bg-blue-700 text-left`}
//               >
//                 📊 Estadísticas
//               </button>

//               <Link
//                 to="/estadisticas-historicas"
//                 className={`${btnBaseDesktop} bg-indigo-600 hover:bg-indigo-700 text-left`}
//               >
//                 📈 Históricas
//               </Link>

//               <Link
//                 to="/ventas"
//                 className={`${btnBaseDesktop} bg-green-600 hover:bg-green-700`}
//               >
//                 🛒 Ventas
//               </Link>

//               <Link
//                 to="/productos"
//                 className={`${btnBaseDesktop} bg-emerald-600 hover:bg-emerald-700`}
//               >
//                 📦 Productos
//               </Link>
//             </div>
//           </div>

//           {/* Info/ayuda del panel */}
//           <div className="mt-4 rounded-2xl border border-white/10 bg-neutral-800/40 p-4 sm:p-5">
//             <p className="text-xs text-neutral-300/80 leading-5"></p>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// };

// export default SidebarNav;

// src/components/Layout/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import ResumenSemana from "../Dashboard/ResumenSemana.jsx";

const NAV_ITEMS = [
  { to: "/clientes",              label: "Clientes",     emoji: "👥", color: "bg-rose-600 hover:bg-rose-700" },
  { to: "/equipos",               label: "Equipos",      emoji: "💻", color: "bg-orange-500 hover:bg-orange-600" },
  { to: "/estadisticas-historicas", label: "Históricas", emoji: "📈", color: "bg-indigo-600 hover:bg-indigo-700" },
  { to: "/ventas",                label: "Ventas",       emoji: "🛒", color: "bg-green-600 hover:bg-green-700" },
  { to: "/productos",             label: "Productos",    emoji: "📦", color: "bg-emerald-600 hover:bg-emerald-700" },
];

const SidebarNav = ({ handleOpenModal }) => {
  const location = useLocation();

  const isActive = (to) => location.pathname.startsWith(to);

  return (
    <aside className="
      w-full lg:w-[30%] xl:w-[28%] lg:max-w-[420px]
      flex-shrink-0
      border-b lg:border-b-0 lg:border-r border-white/10
      bg-[#0a0a0a]
      sticky top-0 z-40 lg:static
    ">
      <div className="
        lg:h-[calc(100vh-5rem)] lg:sticky lg:top-20
        px-3 sm:px-4 py-3 lg:py-4
        min-w-0
        overflow-x-auto lg:overflow-x-hidden
        overflow-y-hidden lg:overflow-y-auto
        [scrollbar-width:thin]
        [&::-webkit-scrollbar]:h-2 lg:[&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-thumb]:bg-white/10
      ">

        {/* ── MOBILE: barra horizontal ── */}
        <div className="lg:hidden mb-3 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {NAV_ITEMS.map(item => (
            <Link key={item.to} to={item.to}
              className={`shrink-0 h-9 inline-flex items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-white transition-all ${item.color} ${isActive(item.to) ? "ring-2 ring-white/30" : ""}`}>
              {item.emoji}
              <span className="hidden xs:inline">{item.label}</span>
            </Link>
          ))}
          <button onClick={handleOpenModal}
            className="shrink-0 h-9 inline-flex items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all">
            📊 <span className="hidden xs:inline">Estadísticas</span>
          </button>
        </div>

        {/* ── DESKTOP: sidebar completo ── */}
        <div className="hidden lg:flex lg:flex-col lg:gap-4">

          {/* Navegación */}
          <div className="rounded-2xl border border-white/10 bg-neutral-800/70 p-4 shadow-sm">
            <p className="text-[11px] tracking-widest text-neutral-500 uppercase mb-3">Módulos</p>
            <div className="space-y-2">
              {NAV_ITEMS.map(item => {
                const active = isActive(item.to);
                return (
                  <Link key={item.to} to={item.to}
                    className={`
                      w-full h-11 inline-flex items-center gap-3 rounded-xl px-4
                      text-sm font-semibold text-white transition-all duration-150
                      ${item.color}
                      ${active ? "ring-2 ring-white/20 brightness-110" : "opacity-90 hover:opacity-100"}
                    `}>
                    <span className="text-base">{item.emoji}</span>
                    <span className="truncate">{item.label}</span>
                    {active && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/70 flex-shrink-0" />
                    )}
                  </Link>
                );
              })}

              {/* Botón estadísticas */}
              <button onClick={handleOpenModal}
                className="w-full h-11 inline-flex items-center gap-3 rounded-xl px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 opacity-90 hover:opacity-100 transition-all duration-150">
                <span className="text-base">📊</span>
                <span className="truncate">Estadísticas</span>
              </button>
            </div>
          </div>

          {/* Resumen semanal */}
          <ResumenSemana />

        </div>
      </div>
    </aside>
  );
};

export default SidebarNav;