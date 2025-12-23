// // src/pages/Dashboard.jsx
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import EstadisticasModal from "../components/General/EstadisticasModal";

// import { useQuery } from '@tanstack/react-query';
// import { getResumenPorMes } from '../api/EstadisticasApi.jsx'; // Asegúrate que la ruta sea correcta

// import useAuth from "../hooks/UseAuth.jsx";

// import SidebarNav from "../components/Layout/Sidebar.jsx";
// import HeaderActions from "../components/General/Header.jsx";
// import IncomeCostChart from '../components/Chart/IncomeCostChart.jsx';
// import EquiposPieChart from '../components/Chart/EquiposPieChart';

// const Dashboard = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const navigate = useNavigate();
//   const { logout } = useAuth();
//   const handleOpenModal = () => setIsModalOpen(true);
//   const handleCloseModal = () => setIsModalOpen(false);

//   const handleSubmitEstadisticas = ({ mes, anio }) => {
//     // Redirige a EstadisticasPage con query params
//     navigate(`/estadisticas?mes=${mes}&anio=${anio}`);
//   };
//   const handleLogout = async () => {
//     try {
//       await logout(); // llama a AuthService.logout() desde el contexto
//       navigate("/login", { replace: true }); // redirige al login
//     } catch (err) {
//       console.error("Error al cerrar sesión:", err);
//     }
//   };


//   const handleProfile = () => {
//     console.log('Ir al perfil');
//     // 👉 Aquí redirigís con useNavigate('/perfil')
//   };

//     // Obtenemos el mes y año actual
//   const today = new Date();
//   const currentMonth = today.getMonth() + 1; // getMonth() es 0-11, sumamos 1
//   const currentYear = today.getFullYear();

//   // 🚀 Usamos useQuery para obtener los datos de las estadísticas
//   const { data: resumenData, isLoading: isLoadingResumen } = useQuery({
//     queryKey: ['resumenMes', currentMonth, currentYear],
//     queryFn: () => getResumenPorMes(currentMonth, currentYear),
//   });

//   // Procesamos los datos para el gráfico de torta
//   const processDeviceDataForPieChart = (trabajos = []) => {
//     const deviceCounts = trabajos.reduce((acc, trabajo) => {
//       acc[trabajo.tipo] = (acc[trabajo.tipo] || 0) + 1;
//       return acc;
//     }, {});

//     return Object.keys(deviceCounts).map(key => ({
//       tipo: key.charAt(0).toUpperCase() + key.slice(1), // Capitalizamos el tipo
//       cantidad: deviceCounts[key],
//     }));
//   };

//   const deviceTypeData = resumenData ? processDeviceDataForPieChart(resumenData.trabajos_mes) : [];
//   console.log(resumenData);

//   return (
//    <div className="relative h-screen w-screen bg-neutral-900 text-white overflow-hidden">
      
//       {/* 1. Header flotante */}
//       <HeaderActions handleLogout={handleLogout} handleProfile={handleProfile} />

//       {/* 2. Contenedor del contenido principal (Sidebar + Contenido) */}
//       {/* 'pt-20' añade un padding arriba para que el contenido no quede debajo del header */}
//       <div className="flex flex-col md:flex-row h-full pt-20">
        
//         {/* Barra de Navegación Lateral */}
//         <SidebarNav handleOpenModal={handleOpenModal} />

//         {/* Área de Contenido Principal */}
//         <main className="w-full md:w-[70%] p-6 flex flex-col items-start gap-6 overflow-y-auto">
//           <h1 className="text-4xl font-bold text-neutral-200">Dashboard de Estadísticas</h1>
//           <p className="text-neutral-400 -mt-4">
//             Resumen del mes de {today.toLocaleString('es-AR', { month: 'long' })} {currentYear}
//           </p>

//           {/* Sección de Gráficos */}
//           <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
            
//             {/* Gráfico de Ingresos vs Costos */}
//             <IncomeCostChart 
//               data={resumenData?.resumen_general} 
//               isLoading={isLoadingResumen} 
//             />

//             {/* Gráfico de Tipos de Equipo */}
//             <EquiposPieChart 
//               data={deviceTypeData} 
//               isLoading={isLoadingResumen} 
//             />

//             {/* Puedes añadir más gráficos aquí usando los datos de `resumenData` */}

//           </div>
//         </main>

//       </div>
    






//       <EstadisticasModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         onSubmit={handleSubmitEstadisticas}
//       />
//     </div>

//   );
// };

// export default Dashboard;
// src/pages/Dashboard.jsx
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getResumenPorMes } from "../api/EstadisticasApi.jsx";
import useAuth from "../hooks/UseAuth.jsx";
import { useMemo, useState } from "react";

// Componentes
import DashboardView from "../components/Dashboard/DashboardView.jsx";
import EstadisticasModal from "../components/General/EstadisticasModal";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Fecha actual fija para evitar re-renders
  const { today, currentMonth, currentYear } = useMemo(() => {
    const d = new Date();
    return {
      today: d,
      currentMonth: d.getMonth() + 1,
      currentYear: d.getFullYear(),
    };
  }, []);

  const { data: resumenData, isLoading } = useQuery({
    queryKey: ["resumenMes", currentMonth, currentYear],
    queryFn: () => getResumenPorMes(currentMonth, currentYear),
  });

  // ✅ Transformación correcta (desde taller.detalle_por_equipo)
  const deviceTypeData = useMemo(() => {
    const detalle =
      resumenData?.data?.taller?.detalle_por_equipo && Array.isArray(resumenData.data.taller.detalle_por_equipo)
        ? resumenData.data.taller.detalle_por_equipo
        : [];

    if (detalle.length === 0) return [];

    const counts = detalle.reduce((acc, e) => {
      const tipo = String(e?.tipo ?? "N/D").toLowerCase();
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(counts).map((key) => ({
      tipo: key.charAt(0).toUpperCase() + key.slice(1),
      cantidad: counts[key],
    }));
  }, [resumenData]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <DashboardView
        resumenData={resumenData}
        isLoading={isLoading}
        deviceTypeData={deviceTypeData}
        today={today}
        currentYear={currentYear}
        handleLogout={handleLogout}
        handleOpenModal={() => setIsModalOpen(true)}
      />

      <EstadisticasModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={({ mes, anio }) => navigate(`/estadisticas?mes=${mes}&anio=${anio}`)}
      />
    </>
  );
};

export default Dashboard;
