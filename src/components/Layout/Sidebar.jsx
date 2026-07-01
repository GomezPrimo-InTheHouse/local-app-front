// src/components/Layout/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import ResumenSemana from "../Dashboard/ResumenSemana.jsx";

const NAV_ITEMS = [
  { to: "/clientes",                label: "Clientes",     emoji: "👥", color: "bg-rose-600 hover:bg-rose-700" },
  { to: "/equipos",                 label: "Equipos",      emoji: "💻", color: "bg-orange-500 hover:bg-orange-600" },
  { to: "/estadisticas-historicas", label: "Históricas",   emoji: "📈", color: "bg-indigo-600 hover:bg-indigo-700" },
  { to: "/ventas",                  label: "Ventas",       emoji: "🛒", color: "bg-green-600 hover:bg-green-700" },
  { to: "/productos",               label: "Productos",    emoji: "📦", color: "bg-emerald-600 hover:bg-emerald-700" },
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
        lg:h-[calc(100vh-5rem)]
        lg:sticky lg:top-20
        px-3 sm:px-4 py-3
        lg:px-5 lg:pt-8 lg:pb-6
        min-w-0
        overflow-x-auto lg:overflow-x-hidden
        overflow-y-hidden lg:overflow-y-auto
        [scrollbar-width:thin]
        [&::-webkit-scrollbar]:h-2 lg:[&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-thumb]:bg-white/10
      ">

        {/* ── MOBILE: barra horizontal ── */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {NAV_ITEMS.map(item => (
            <Link key={item.to} to={item.to}
              className={`
                shrink-0 h-9 inline-flex items-center justify-center gap-1.5
                rounded-xl px-3 text-sm font-semibold text-white transition-all
                ${item.color}
                ${isActive(item.to) ? "ring-2 ring-white/30" : ""}
              `}>
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
        <div className="hidden lg:flex lg:flex-col lg:gap-5">

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