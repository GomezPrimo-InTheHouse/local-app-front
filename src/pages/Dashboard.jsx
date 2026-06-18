
// // src/pages/Dashboard.jsx
// import { useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { getResumenPorMes } from "../api/EstadisticasApi.jsx";
// import useAuth from "../hooks/UseAuth.jsx";
// import { useMemo, useState } from "react";

// // Componentes
// import DashboardView from "../components/Dashboard/DashboardView.jsx";
// import EstadisticasModal from "../components/General/EstadisticasModal";

// const Dashboard = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const navigate = useNavigate();
//   const { logout } = useAuth();

//   // Fecha actual fija para evitar re-renders
//   const { today, currentMonth, currentYear } = useMemo(() => {
//     const d = new Date();
//     return {
//       today: d,
//       currentMonth: d.getMonth() + 1,
//       currentYear: d.getFullYear(),
//     };
//   }, []);

//   const { data: resumenData, isLoading } = useQuery({
//     queryKey: ["resumenMes", currentMonth, currentYear],
//     queryFn: () => getResumenPorMes(currentMonth, currentYear),
//   });

//   // ✅ Transformación correcta (desde taller.detalle_por_equipo)
//   const deviceTypeData = useMemo(() => {
//     const detalle =
//       resumenData?.data?.taller?.detalle_por_equipo && Array.isArray(resumenData.data.taller.detalle_por_equipo)
//         ? resumenData.data.taller.detalle_por_equipo
//         : [];

//     if (detalle.length === 0) return [];

//     const counts = detalle.reduce((acc, e) => {
//       const tipo = String(e?.tipo ?? "N/D").toLowerCase();
//       acc[tipo] = (acc[tipo] || 0) + 1;
//       return acc;
//     }, {});

//     return Object.keys(counts).map((key) => ({
//       tipo: key.charAt(0).toUpperCase() + key.slice(1),
//       cantidad: counts[key],
//     }));
//   }, [resumenData]);

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate("/login", { replace: true });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <>
//       <DashboardView
//         resumenData={resumenData}
//         isLoading={isLoading}
//         deviceTypeData={deviceTypeData}
//         today={today}
//         currentYear={currentYear}
//         handleLogout={handleLogout}
//         handleOpenModal={() => setIsModalOpen(true)}
//       />

//       <EstadisticasModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSubmit={({ mes, anio }) => navigate(`/estadisticas?mes=${mes}&anio=${anio}`)}
//       />
//     </>
//   );
// };

// export default Dashboard;

// src/pages/Dashboard.jsx
import { useNavigate }  from "react-router-dom";
import { useQuery }     from "@tanstack/react-query";
import { getResumenPorMes } from "../api/EstadisticasApi.jsx";
import useAuth          from "../hooks/UseAuth.jsx";
import { useMemo, useState } from "react";

import DashboardView      from "../components/Dashboard/DashboardView.jsx";
import EstadisticasModal  from "../components/General/EstadisticasModal";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { today, currentMonth, currentYear } = useMemo(() => {
    const d = new Date();
    return { today: d, currentMonth: d.getMonth() + 1, currentYear: d.getFullYear() };
  }, []);

  const { data: resumenData, isLoading } = useQuery({
    queryKey: ["resumenMes", currentMonth, currentYear],
    queryFn:  () => getResumenPorMes(currentMonth, currentYear),
  });

  const deviceTypeData = useMemo(() => {
    const detalle = Array.isArray(resumenData?.data?.taller?.detalle_por_equipo)
      ? resumenData.data.taller.detalle_por_equipo
      : [];

    if (detalle.length === 0) return [];

    const counts = detalle.reduce((acc, e) => {
      const tipo = String(e?.tipo ?? "N/D").toLowerCase();
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(counts).map(key => ({
      tipo:     key.charAt(0).toUpperCase() + key.slice(1),
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
