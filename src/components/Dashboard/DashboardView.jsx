// src/components/Dashboard/DashboardView.jsx
import SidebarNav      from "../Layout/Sidebar";
import HeaderActions   from "../General/Header";
import IncomeCostChart from "../Chart/IncomeCostChart";
import EquiposPieChart from "../Chart/EquiposPieChart";
import KPICard         from "../Dashboard/KPICard";
import ResumenSemana   from "../Dashboard/ResumenSemana.jsx";
import { Wallet, Wrench, ShoppingCart, TrendingUp } from "lucide-react";

const safeNum = (n) => (Number.isFinite(Number(n)) ? Number(n) : 0);

const DashboardView = ({
  resumenData,
  isLoading,
  deviceTypeData,
  today,
  currentYear,
  handleLogout,
  handleOpenModal,
}) => {
  const stats          = resumenData?.data ?? null;
  const resumenGeneral = stats?.resumen_general ?? { total_facturado: 0, costo_total: 0, balance_total: 0 };
  const detalleEquipos = Array.isArray(stats?.taller?.detalle_por_equipo) ? stats.taller.detalle_por_equipo : [];
  const gananciaTaller = detalleEquipos.reduce((acc, e) => acc + safeNum(e?.balance_final), 0);

  const ventasRoot          = stats?.ventasResumen?.data ?? null;
  const totalGananciaVentas = safeNum(ventasRoot?.total_ganancia);
  const porCanal            = ventasRoot?.por_canal ?? {};
  const gananciaWeb         = safeNum(porCanal?.web_shop?.total_ganancia);
  const rendimientoWeb      = totalGananciaVentas > 0 ? (gananciaWeb / totalGananciaVentas) * 100 : 0;

  const mesNombre = today.toLocaleString("es-AR", { month: "long" });

  return (
    <div className="relative h-screen w-screen bg-[#0a0a0a] text-white overflow-hidden flex flex-col">
      <HeaderActions handleLogout={handleLogout} handleProfile={() => {}} />

      <div className="flex flex-1 pt-20 overflow-hidden flex-col lg:flex-row">
        <SidebarNav handleOpenModal={handleOpenModal} />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 min-w-0 custom-scrollbar">

          {/* ── Header ── */}
          <header className="mb-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs tracking-widest text-neutral-500 uppercase mb-1">
                  Resumen operativo
                </p>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white capitalize">
                  {mesNombre} {currentYear}
                </h1>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-900/20 border border-emerald-800/30 px-3 py-1.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                En línea
              </span>
            </div>
            <div className="mt-4 h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
          </header>

          {/* ── KPI Grid ── */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-6 min-w-0">
            <KPICard
              title="Balance General"
              value={safeNum(resumenGeneral?.balance_total)}
              icon={<Wallet className="h-4 w-4 text-emerald-400" />}
              isCurrency
              isLoading={isLoading}
              variant="highlight"
            />
            <KPICard
              title="Ganancia Taller"
              value={gananciaTaller}
              icon={<Wrench className="h-4 w-4 text-blue-400" />}
              subtitle={`${safeNum(stats?.taller?.cantidad_equipos)} reparaciones`}
              isCurrency
              isLoading={isLoading}
            />
            <KPICard
              title="Ganancia Ventas"
              value={totalGananciaVentas}
              icon={<ShoppingCart className="h-4 w-4 text-purple-400" />}
              subtitle={`Total: $${safeNum(ventasRoot?.total_ventas).toLocaleString("es-AR")}`}
              isCurrency
              isLoading={isLoading}
            />
            <KPICard
              title="Rendimiento Web"
              value={`${rendimientoWeb.toFixed(1)}%`}
              icon={<TrendingUp className="h-4 w-4 text-amber-400" />}
              subtitle={`Web: $${gananciaWeb.toLocaleString("es-AR")}`}
              isLoading={isLoading}
            />
          </div>

          {/* ── Resumen Semanal (solo mobile — en desktop va en el sidebar) ── */}
          <div className="lg:hidden mb-6">
            <ResumenSemana />
          </div>

          {/* ── Charts ── */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 min-w-0">
            <div className="bg-neutral-900/40 border border-neutral-800 p-4 sm:p-5 rounded-2xl min-w-0">
              <p className="text-xs tracking-widest text-neutral-500 uppercase mb-1">Análisis</p>
              <h3 className="text-base font-semibold text-neutral-200 mb-4">Flujo de Caja</h3>
              <IncomeCostChart data={resumenGeneral} isLoading={isLoading} />
            </div>
            <div className="bg-neutral-900/40 border border-neutral-800 p-4 sm:p-5 rounded-2xl min-w-0">
              <p className="text-xs tracking-widest text-neutral-500 uppercase mb-1">Distribución</p>
              <h3 className="text-base font-semibold text-neutral-200 mb-4">Tipos de Equipos</h3>
              <EquiposPieChart data={deviceTypeData} isLoading={isLoading} />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default DashboardView;