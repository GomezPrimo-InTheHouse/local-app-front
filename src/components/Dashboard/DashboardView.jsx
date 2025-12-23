// // src/components/Dashboard/DashboardView.jsx
// import SidebarNav from "../Layout/Sidebar";
// import HeaderActions from "../General/Header";
// import IncomeCostChart from "../Chart/IncomeCostChart";
// import EquiposPieChart from "../Chart/EquiposPieChart";
// import KPICard from "../Dashboard/KPICard";
// import { Wallet, Wrench, ShoppingCart, TrendingUp } from "lucide-react";

// const safeNum = (n) => (Number.isFinite(Number(n)) ? Number(n) : 0);

// const DashboardView = ({
//   resumenData,
//   isLoading,
//   deviceTypeData,
//   today,
//   currentYear,
//   handleLogout,
//   handleOpenModal,
// }) => {
//   // ✅ Ahora el payload real está en resumenData.data
//   const stats = resumenData?.data ?? null;

//   const resumenGeneral = stats?.resumen_general ?? {
//     total_facturado: 0,
//     costo_total: 0,
//     balance_total: 0,
//   };

//   const detalleEquipos = Array.isArray(stats?.taller?.detalle_por_equipo)
//     ? stats.taller.detalle_por_equipo
//     : [];

//   // ✅ Ganancia taller: sumatoria de balance_final por equipo
//   const gananciaTaller = detalleEquipos.reduce(
//     (acc, e) => acc + safeNum(e?.balance_final),
//     0
//   );

//   const ventasRoot = stats?.ventasResumen?.data ?? null;
//   const totalGananciaVentas = safeNum(ventasRoot?.total_ganancia);

//   const porCanal = ventasRoot?.por_canal ?? {};
//   const gananciaWeb = safeNum(porCanal?.web_shop?.total_ganancia);
//   const rendimientoWeb = totalGananciaVentas > 0 ? (gananciaWeb / totalGananciaVentas) * 100 : 0;

//   return (
//     <div className="relative h-screen w-screen bg-[#0a0a0a] text-white overflow-hidden flex flex-col">
//       <HeaderActions handleLogout={handleLogout} handleProfile={() => {}} />

//       <div className="flex flex-1 pt-20 overflow-hidden">
//         <SidebarNav handleOpenModal={handleOpenModal} />

//         <main className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar">
//           {/* Header Section */}
//           <header className="mb-10">
//             <h1 className="text-4xl font-extrabold tracking-tight text-white">
//               Dashboard de Estadísticas
//             </h1>
//             <p className="text-neutral-500 mt-2 text-lg">
//               Resumen operativo de{" "}
//               <span className="text-neutral-200 capitalize">
//                 {today.toLocaleString("es-AR", { month: "long" })} {currentYear}
//               </span>
//             </p>
//           </header>

//           {/* KPI Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//             <KPICard
//               title="Balance General"
//               value={safeNum(resumenGeneral?.balance_total)}
//               icon={<Wallet className="text-emerald-400" />}
//               isCurrency
//               isLoading={isLoading}
//               variant="highlight"
//             />

//             <KPICard
//               title="Ganancia Taller"
//               value={gananciaTaller}
//               icon={<Wrench className="text-blue-400" />}
//               subtitle={`${safeNum(stats?.taller?.cantidad_equipos)} reparaciones`}
//               isCurrency
//               isLoading={isLoading}
//             />

//             <KPICard
//               title="Ganancia Ventas"
//               value={totalGananciaVentas}
//               icon={<ShoppingCart className="text-purple-400" />}
//               subtitle={`Ventas: $${safeNum(ventasRoot?.total_ventas).toLocaleString("es-AR")}`}
//               isCurrency
//               isLoading={isLoading}
//             />

//             <KPICard
//               title="Rendimiento Web"
//               value={`${rendimientoWeb.toFixed(1)}%`}
//               icon={<TrendingUp className="text-amber-400" />}
//               subtitle={`Web: $${gananciaWeb.toLocaleString("es-AR")}`}
//               isLoading={isLoading}
//             />
//           </div>

//           {/* Charts Section */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-3xl">
//               <h3 className="text-xl font-semibold mb-6 text-neutral-300">
//                 Flujo de Caja
//               </h3>
//               {/* ✅ ahora viene desde stats.resumen_general */}
//               <IncomeCostChart data={resumenGeneral} isLoading={isLoading} />
//             </div>

//             <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-3xl">
//               <h3 className="text-xl font-semibold mb-6 text-neutral-300">
//                 Tipos de Equipos
//               </h3>
//               <EquiposPieChart data={deviceTypeData} isLoading={isLoading} />
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardView;
// src/components/Dashboard/DashboardView.jsx
import SidebarNav from "../layout/SidebarNav";
import HeaderActions from "../General/Header";
import IncomeCostChart from "../Chart/IncomeCostChart";
import EquiposPieChart from "../Chart/EquiposPieChart";
import KPICard from "../Dashboard/KPICard";
import { Wallet, Wrench, ShoppingCart, TrendingUp } from "lucide-react";

const DashboardView = ({
  resumenData,
  isLoading,
  deviceTypeData,
  today,
  currentYear,
  handleLogout,
  handleOpenModal,
}) => {
  // Lógica de datos (se mantiene igual...)
  const stats = resumenData?.data ?? null;
  // ... (tus cálculos de safeNum, gananciaTaller, etc.)

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col">
      {/* Header fijo arriba */}
      <HeaderActions handleLogout={handleLogout} handleProfile={() => {}} />

      <div className="flex flex-1 overflow-hidden pt-16">
        {/* SIDEBAR - 30% */}
        <SidebarNav handleOpenModal={handleOpenModal} />

        {/* MAIN CONTENT - 70% */}
        <main className="w-full lg:w-[70%] h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar p-6 lg:p-12">
          
          {/* Bienvenida y Título */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-emerald-500 text-sm font-bold tracking-[0.2em] uppercase">Panel de Control</span>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter mt-1">
                Dashboard <span className="text-neutral-500">Global</span>
              </h1>
            </div>
            <div className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-2xl text-sm font-medium text-neutral-400">
              📅 {today.toLocaleString("es-AR", { month: "long", year: "numeric" })}
            </div>
          </div>

          {/* KPI Grid - Ahora 2x2 para aprovechar mejor el ancho del 70% */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <KPICard
              title="Balance General"
              value={safeNum(resumenGeneral?.balance_total)}
              icon={<Wallet />}
              isCurrency
              isLoading={isLoading}
              variant="highlight"
            />
            <KPICard
              title="Ganancia Taller"
              value={gananciaTaller}
              icon={<Wrench />}
              subtitle={`${safeNum(stats?.taller?.cantidad_equipos)} reparaciones finalizadas`}
              isCurrency
              isLoading={isLoading}
            />
            <KPICard
              title="Ganancia Ventas"
              value={totalGananciaVentas}
              icon={<ShoppingCart />}
              subtitle={`Volumen: $${safeNum(ventasRoot?.total_ventas).toLocaleString("es-AR")}`}
              isCurrency
              isLoading={isLoading}
            />
            <KPICard
              title="Rendimiento Web"
              value={`${rendimientoWeb.toFixed(1)}%`}
              icon={<TrendingUp />}
              subtitle={`Meta mensual: $${gananciaWeb.toLocaleString("es-AR")}`}
              isLoading={isLoading}
            />
          </div>

          {/* Charts Section - Gráficos en tarjetas más grandes */}
          <div className="grid grid-cols-1 gap-8 mb-12">
             <div className="bg-neutral-900/30 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold">Flujo de Caja Mensual</h3>
                  <div className="flex gap-2">
                    <span className="flex items-center gap-2 text-xs text-emerald-400"><div className="h-2 w-2 rounded-full bg-emerald-400"/> Ingresos</span>
                    <span className="flex items-center gap-2 text-xs text-rose-400"><div className="h-2 w-2 rounded-full bg-rose-400"/> Gastos</span>
                  </div>
                </div>
                <IncomeCostChart data={resumenGeneral} isLoading={isLoading} />
             </div>

             <div className="bg-neutral-900/30 border border-white/5 p-8 rounded-[2.5rem]">
                <h3 className="text-xl font-bold mb-8">Distribución por Equipos</h3>
                <div className="h-[300px]">
                  <EquiposPieChart data={deviceTypeData} isLoading={isLoading} />
                </div>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
};