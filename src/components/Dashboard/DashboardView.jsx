// src/components/Dashboard/DashboardView.jsx
import SidebarNav from "../Layout/Sidebar";
import HeaderActions from "../General/Header";
import IncomeCostChart from '../Chart/IncomeCostChart';
import EquiposPieChart from '../Chart/EquiposPieChart';
import KPICard from "./KPICard"; // Te recomiendo crear este pequeño componente
import { Wallet, Wrench, ShoppingCart, TrendingUp } from 'lucide-react';

const DashboardView = ({ resumenData, isLoading, deviceTypeData, today, currentYear, handleLogout, handleOpenModal }) => {
  
  const stats = resumenData?.data; // Basado en tu JSON de endpoint

  return (
    <div className="relative h-screen w-screen bg-[#0a0a0a] text-white overflow-hidden flex flex-col">
      <HeaderActions handleLogout={handleLogout} handleProfile={() => {}} />

      <div className="flex flex-1 pt-20 overflow-hidden">
        <SidebarNav handleOpenModal={handleOpenModal} />

        <main className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar">
          {/* Header Section */}
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              Dashboard de Estadísticas
            </h1>
            <p className="text-neutral-500 mt-2 text-lg">
              Resumen operativo de <span className="text-neutral-200 capitalize">
                {today.toLocaleString('es-AR', { month: 'long' })} {currentYear}
              </span>
            </p>
          </header>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <KPICard 
              title="Balance General" 
              value={stats?.balance_total_general} 
              icon={<Wallet className="text-emerald-400" />}
              isCurrency isLoading={isLoading}
              variant="highlight"
            />
            <KPICard 
              title="Ganancia Taller" 
              value={stats?.taller?.ganancia_neta} 
              icon={<Wrench className="text-blue-400" />}
              subtitle={`${stats?.taller?.cantidad_equipos} reparaciones`}
              isCurrency isLoading={isLoading}
            />
            <KPICard 
              title="Ventas Totales" 
              value={stats?.ventas?.ganancia_total_ventas} 
              icon={<ShoppingCart className="text-purple-400" />}
              isCurrency isLoading={isLoading}
            />
            <KPICard 
              title="Rendimiento Web" 
              value={`${((stats?.ventas?.ganancia_web / stats?.ventas?.ganancia_total_ventas) * 100 || 0).toFixed(1)}%`}
              icon={<TrendingUp className="text-amber-400" />}
              subtitle={`Web: $${stats?.ventas?.ganancia_web?.toLocaleString()}`}
              isLoading={isLoading}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-3xl">
               <h3 className="text-xl font-semibold mb-6 text-neutral-300">Flujo de Caja</h3>
               <IncomeCostChart data={resumenData?.resumen_general} isLoading={isLoading} />
            </div>
            <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-3xl">
               <h3 className="text-xl font-semibold mb-6 text-neutral-300">Tipos de Equipos</h3>
               <EquiposPieChart data={deviceTypeData} isLoading={isLoading} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardView;