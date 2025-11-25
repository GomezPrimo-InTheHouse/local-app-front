import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getResumenPorMes } from "../api/EstadisticasApi";

import { getResumenVentasPorMes } from "../api/EstadisticasApi"; // <-- Importa también esta

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import { FaMoneyBillWave, FaChartBar, FaUserFriends, FaLaptop, FaTools } from 'react-icons/fa';

const COLORS = ["#6A0DAD", "#FF5733", "#33FF57", "#3399FF", "#FFC300"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-xl text-sm text-gray-800">
        <p className="font-bold">{data.name}</p>
        <p className="text-sm">Valor: <span className="font-semibold" style={{ color: data.color }}>{data.value.toLocaleString()}</span></p>
      </div>
    );
  }
  return null;
};

const CustomTooltipBalance = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-xl text-sm text-gray-800">
        <p className="font-bold">{data.payload.name}</p>
        <p className="text-sm">Balance: <span className="font-semibold" style={{ color: data.color }}>${data.value.toLocaleString()}</span></p>
      </div>
    );
  }
  return null;
};

const EstadisticasPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mes, anio } = location.state || {};

  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ventasResumen, setVentasResumen] = useState(null);

  // useEffect(() => {
  //   if (!mes || !anio) return;

  //   const fetchData = async () => {
  //     try {
  //       const [resumenData, ventasData] = await Promise.all([
  //         getResumenPorMes(mes, anio),
  //         getResumenVentasPorMes(mes, anio)
  //       ]);
  //       setResumen(resumenData);
  //       setVentasResumen(ventasData);
  //     } catch (error) {
  //       console.error("Error cargando estadísticas:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [mes, anio]);

  // useEffect(() => {
  //   if (!mes || !anio) return;

  //   const fetchData = async () => {
  //     try {
  //       const data = await getResumenPorMes(mes, anio);
  //       console.log('(resumen-mes) getResumenPorMes: ', data)
  //       setResumen(data);
  //     } catch (error) {
  //       console.error("Error cargando estadísticas:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [mes, anio]);

  // Datos de ventas
  
  useEffect(() => {
  if (!mes || !anio) return;

  const fetchData = async () => {
    try {
      const [resumenData, ventasData] = await Promise.all([
        getResumenPorMes(mes, anio),
        getResumenVentasPorMes(mes, anio)
      ]);
      setResumen(resumenData);
      setVentasResumen(ventasData);
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [mes, anio]);

  const totalVentas = ventasResumen?.data?.total_ventas || 0;
  const totalCostos = ventasResumen?.data?.total_costos || 0;
  const totalGanancia = ventasResumen?.data?.total_ganancia || 0;


  const clientesQueMasGastaron = ventasResumen?.data?.ventas.reduce((acc, venta) => {
    const existente = acc.find(c => c.cliente_id === venta.cliente_id);
    if (existente) {
      existente.total += venta.total;
    } else {
      acc.push({
        cliente_id: venta.cliente_id,
        nombre: venta.nombre_cliente,
        total: venta.total
      });
    }
    return acc;
  }, []).sort((a, b) => b.total - a.total).slice(0, 5) || [];

  const productosMasVendidos = ventasResumen?.data?.ventas.flatMap(v => v.productos)
    .reduce((acc, prod) => {
      const existente = acc.find(p => p.producto_id === prod.producto_id);
      if (existente) {
        existente.cantidad += prod.cantidad;
      } else {
        acc.push({
          producto_id: prod.producto_id,
          nombre: prod.nombre_producto,
          cantidad: prod.cantidad
        });
      }
      return acc;
    }, []).sort((a, b) => b.cantidad - a.cantidad).slice(0, 5) || [];


  if (!mes || !anio) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900 text-white p-4">
        <div className="text-center p-8 bg-neutral-800 rounded-2xl shadow-lg">
          <p className="text-xl font-semibold text-red-400 mb-4">
            ⚠️ No se seleccionó mes/año.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-purple-700 hover:bg-purple-800 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900 text-white">
        <div className="animate-pulse flex flex-col items-center">
          <FaChartBar className="text-purple-500 text-5xl mb-4" />
          <p className="text-lg font-medium">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (!resumen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900 text-white p-4">
        <div className="text-center p-8 bg-neutral-800 rounded-2xl shadow-lg">
          <p className="text-lg font-medium text-red-400 mb-4">
            No se pudieron cargar los datos.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-purple-700 hover:bg-purple-800 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Datos para gráficos
  const resumenData = [
    { name: "Facturación", value: resumen.resumen_general.total_facturado },
    { name: "Costos", value: resumen.resumen_general.costo_total },
    { name: "Balance", value: resumen.resumen_general.balance_total },
  ];

  const trabajosData = resumen.trabajos_mes.map((t) => ({
    name: `${t.cliente_nombre} ${t.cliente_apellido}`,
    balance: Number(t.balance_final),
  }));

  const clientesData = resumen.clientes_frecuentes.map((c) => ({
    name: `${c.nombre} ${c.apellido}`,
    value: Number(c.equipos_ingresados),
  }));

  const reparacionesData = resumen.reparaciones_comunes.map((r) => ({
    name: r.problema,
    value: Number(r.cantidad),
  }));

  const equiposData = resumen.equipos_comunes.map((e) => ({
    name: `${e.marca} ${e.modelo}`,
    value: Number(e.cantidad),
  }));

  // return (
  //   <div className="flex flex-col md:flex-row h-screen w-screen bg-neutral-900 text-white overflow-hidden">
  //     {/* Columna Izquierda (20%) - Fija */}
  //     <div className="w-full md:w-[20%] border-b md:border-b-0 md:border-r border-neutral-700 p-6 flex flex-col items-start gap-4">
  //       <h1 className="text-3xl font-extrabold mb-2 text-gray-100">
  //         📊 Estadísticas
  //       </h1>
  //       <p className="text-lg font-bold text-purple-400 mb-8">
  //         {mes} / {anio}
  //       </p>
  //       <button
  //         onClick={() => navigate("/")}
  //         className="flex items-center mt-auto px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-semibold transition-colors shadow-lg"
  //       >
  //         <span className="mr-2 text-sm">⬅️</span> Volver al Dashboard
  //       </button>
  //     </div>

  //     {/* Contenido Principal (80%) - Con scroll */}


     

  //     <div className="flex-1 p-8 overflow-y-auto">

  //        {/* ==================== SECCIÓN DE SERVICIO TECNICO ==================== */}
         
  //       {/* Resumen General (KPIs) */}
  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 w-full">
  //         <div className="bg-neutral-800 rounded-3xl p-6 shadow-xl">
  //           <h2 className="text-lg font-semibold text-purple-400 mb-2">Facturación Total</h2>
  //           <p className="text-3xl font-extrabold">
  //             ${resumen.resumen_general.total_facturado.toLocaleString()}
  //           </p>
  //         </div>
  //         <div className="bg-neutral-800 rounded-3xl p-6 shadow-xl">
  //           <h2 className="text-lg font-semibold text-red-400 mb-2">Costos Totales</h2>
  //           <p className="text-3xl font-extrabold">
  //             ${resumen.resumen_general.costo_total.toLocaleString()}
  //           </p>
  //         </div>
  //         <div className="bg-neutral-800 rounded-3xl p-6 shadow-xl">
  //           <h2 className="text-lg font-semibold text-green-400 mb-2">Balance Total</h2>
  //           <p className="text-3xl font-extrabold">
  //             ${resumen.resumen_general.balance_total.toLocaleString()}
  //           </p>
  //         </div>
  //       </div>

  //       {/* Contenedor de Gráficos */}
  //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
  //         {/* Fila superior de gráficos */}
  //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-2">
  //           <div className="bg-neutral-800 p-6 rounded-3xl shadow-xl flex flex-col h-full">
  //             <h2 className="text-lg font-bold mb-4 flex items-center">
  //               <FaMoneyBillWave className="text-purple-400 mr-2" />
  //               Desglose Financiero
  //             </h2>
  //             <ResponsiveContainer width="100%" height={300}>
  //               <PieChart>
  //                 <Pie
  //                   data={resumenData}
  //                   cx="50%"
  //                   cy="50%"
  //                   outerRadius={100}
  //                   fill="#8884d8"
  //                   dataKey="value"
  //                   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
  //                   labelLine={false}
  //                 >
  //                   {resumenData.map((_, i) => (
  //                     <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
  //                   ))}
  //                 </Pie>
  //                 <Tooltip content={<CustomTooltip />} />
  //                 <Legend verticalAlign="bottom" height={36} iconType="circle" />
  //               </PieChart>
  //             </ResponsiveContainer>
  //           </div>
  //           <div className="bg-neutral-800 p-6 rounded-3xl shadow-xl flex flex-col h-full">
  //             <h2 className="text-lg font-bold mb-4 flex items-center">
  //               <FaChartBar className="text-green-400 mr-2" />
  //               Balance por Cliente
  //             </h2>
  //             <ResponsiveContainer width="100%" height={300}>
  //               <BarChart data={trabajosData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
  //                 <CartesianGrid strokeDasharray="3 3" stroke="#444" />
  //                 <XAxis dataKey="name" tick={{ fill: '#bbb', fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
  //                 <YAxis tick={{ fill: '#bbb' }} />
  //                 <Tooltip content={<CustomTooltipBalance />} />
  //                 <Bar dataKey="balance" fill="#33FF57" barSize={40} />
  //               </BarChart>
  //             </ResponsiveContainer>
  //           </div>
  //         </div>

  //         {/* Fila inferior de gráficos */}
  //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-2">
  //           <div className="bg-neutral-800 p-6 rounded-3xl shadow-xl flex flex-col h-full">
  //             <h2 className="text-lg font-bold mb-4 flex items-center">
  //               <FaUserFriends className="text-blue-400 mr-2" />
  //               Clientes Frecuentes
  //             </h2>
  //             <ResponsiveContainer width="100%" height={300}>
  //               <BarChart data={clientesData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
  //                 <CartesianGrid strokeDasharray="3 3" stroke="#444" />
  //                 <XAxis type="number" tick={{ fill: '#bbb' }} />
  //                 <YAxis dataKey="name" type="category" tick={{ fill: '#bbb', fontSize: 12 }} width={120} />
  //                 <Tooltip content={<CustomTooltip />} />
  //                 <Bar dataKey="value" name="Equipos Ingresados" fill="#3399FF" />
  //               </BarChart>
  //             </ResponsiveContainer>
  //           </div>
  //           <div className="bg-neutral-800 p-6 rounded-3xl shadow-xl flex flex-col h-full">
  //             <h2 className="text-lg font-bold mb-4 flex items-center">
  //               <FaTools className="text-orange-400 mr-2" />
  //               Reparaciones Comunes
  //             </h2>
  //             <ResponsiveContainer width="100%" height={300}>
  //               <BarChart data={reparacionesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
  //                 <CartesianGrid strokeDasharray="3 3" stroke="#444" />
  //                 <XAxis dataKey="name" tick={{ fill: '#bbb', fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
  //                 <YAxis tick={{ fill: '#bbb' }} />
  //                 <Tooltip content={<CustomTooltip />} />
  //                 <Bar dataKey="value" fill="#FF5733" barSize={40} />
  //               </BarChart>
  //             </ResponsiveContainer>
  //           </div>
  //         </div>

  //         {/* Gráfico de Equipos Más Ingresados - Fila única */}
  //         <div className="bg-neutral-800 p-6 rounded-3xl shadow-xl col-span-1 lg:col-span-2 flex flex-col h-full">
  //           <h2 className="text-lg font-bold mb-4 flex items-center">
  //             <FaLaptop className="text-cyan-400 mr-2" />
  //             Equipos Más Ingresados
  //           </h2>
  //           <ResponsiveContainer width="100%" height={300}>
  //             <BarChart data={equiposData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
  //               <CartesianGrid strokeDasharray="3 3" stroke="#444" />
  //               <XAxis dataKey="name" tick={{ fill: '#bbb', fontSize: 12 }} />
  //               <YAxis tick={{ fill: '#bbb' }} />
  //               <Tooltip content={<CustomTooltip />} />
  //               <Legend verticalAlign="bottom" height={36} iconType="circle" />
  //               <Bar dataKey="value" fill="#3399FF" barSize={40} />
  //             </BarChart>
  //           </ResponsiveContainer>
  //         </div>

        

  //       </div>


  //         {/* ==================== SECCIÓN DE VENTAS ==================== */}
  //         <div className="mt-12">
  //           <h2 className="text-2xl font-extrabold mb-6 text-purple-400">🛒 Ventas del Mes</h2>

  //           {/* KPIs de Ventas */}
           
  //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 w-full">
  //             <div className="bg-neutral-800 rounded-3xl p-6 shadow-xl">
  //               <h2 className="text-lg font-semibold text-green-400 mb-2">Total Ventas</h2>
  //               <p className="text-3xl font-extrabold">
  //                 ${totalVentas.toLocaleString()}
  //               </p>
  //             </div>
  //             <div className="bg-neutral-800 rounded-3xl p-6 shadow-xl">
  //               <h2 className="text-lg font-semibold text-blue-400 mb-2">Top Clientes</h2>
  //               <p className="text-sm text-gray-300">
  //                 {clientesQueMasGastaron.map(c => (
  //                   <div key={c.cliente_id} className="flex justify-between">
  //                     <span>{c.nombre}</span>
  //                     <span className="font-semibold text-green-400">${c.total.toLocaleString()}</span>
  //                   </div>
  //                 ))}
  //               </p>
  //             </div>
  //             <div className="bg-neutral-800 rounded-3xl p-6 shadow-xl">
  //               <h2 className="text-lg font-semibold text-orange-400 mb-2">Productos Más Vendidos</h2>
  //               <p className="text-sm text-gray-300">
  //                 {productosMasVendidos.map(p => (
  //                   <div key={p.producto_id} className="flex justify-between">
  //                     <span>{p.nombre}</span>
  //                     <span className="font-semibold text-purple-400">{p.cantidad} u.</span>
  //                   </div>
  //                 ))}
  //               </p>
  //             </div>
  //           </div>

  //           {/* Gráficos de Ventas */}
  //           <div className="grid grid-cols-1 md:grid-cols-2  gap-6 mb-8 w-full">
  //             <div className="bg-neutral-800 p-6 rounded-3xl shadow-xl flex flex-col h-full">
  //               <h2 className="text-lg font-bold mb-4 text-green-400">Clientes que más gastaron</h2>
  //               <ResponsiveContainer width="100%" height={300}>
  //                 <BarChart data={clientesQueMasGastaron} layout="vertical">
  //                   <CartesianGrid strokeDasharray="3 3" stroke="#444" />
  //                   <XAxis type="number" tick={{ fill: '#bbb' }} />
  //                   <YAxis dataKey="nombre" type="category" tick={{ fill: '#bbb', fontSize: 12 }} width={120} />
  //                   <Tooltip content={<CustomTooltip />} />
  //                   <Bar dataKey="total" fill="#33FF57" barSize={30} />
  //                 </BarChart>
  //               </ResponsiveContainer>
  //             </div>

  //             <div className="bg-neutral-800 p-6 rounded-3xl shadow-xl flex flex-col h-full">
  //               <h2 className="text-lg font-bold mb-4 text-orange-400">Productos más vendidos</h2>
  //               <ResponsiveContainer width="100%" height={300}>
  //                 <BarChart data={productosMasVendidos} layout="vertical">
  //                   <CartesianGrid strokeDasharray="3 3" stroke="#444" />
  //                   <XAxis type="number" tick={{ fill: '#bbb' }} />
  //                   <YAxis dataKey="nombre" type="category" tick={{ fill: '#bbb', fontSize: 12 }} width={120} />
  //                   <Tooltip content={<CustomTooltip />} />
  //                   <Bar dataKey="cantidad" fill="#FFC300" barSize={30} />
  //                 </BarChart>
  //               </ResponsiveContainer>
  //             </div>
  //           </div>
  //         </div>
  //     </div>
  //   </div>
  // );

  return (
  <div className="flex flex-col md:flex-row h-screen w-screen bg-neutral-900 text-white overflow-hidden">
    {/* Columna Izquierda (Sidebar) */}
    <div className="w-full md:w-[20%] border-b md:border-b-0 md:border-r border-neutral-700 p-6 flex flex-col gap-4 md:h-screen md:sticky md:top-0 bg-neutral-900/95 backdrop-blur">
      <div>
        <h1 className="text-3xl font-extrabold mb-2 text-gray-100">
          📊 Estadísticas
        </h1>
        <p className="text-sm text-gray-400 mb-1">Resumen mensual</p>
        <p className="text-lg font-bold text-purple-400">
          {mes} / {anio}
        </p>
      </div>

      <div className="mt-6 space-y-3 text-sm text-gray-300">
        <p className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-purple-400" />
          <span>Servicio técnico + Ventas</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
          <span>Facturación, costos y balance</span>
        </p>
      </div>

      <button
        onClick={() => navigate("/")}
        className="flex items-center mt-auto px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-semibold transition-colors shadow-lg text-sm"
      >
        <span className="mr-2 text-base">⬅️</span> Volver al Dashboard
      </button>
    </div>

    {/* Contenido Principal */}
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-12 pb-10">
        {/* ==================== SECCIÓN SERVICIO TÉCNICO ==================== */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-purple-300">
                🛠 Resumen Servicio Técnico
              </h2>
              <p className="text-sm text-gray-400">
                Facturación, costos y balance general del mes.
              </p>
            </div>
          </div>

          {/* KPIs Servicio Técnico */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
            <div className="bg-neutral-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">
                Facturación Total
              </h3>
              <p className="text-3xl font-extrabold">
                ${resumen.resumen_general.total_facturado.toLocaleString("es-AR")}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Incluye todos los trabajos facturados en el mes.
              </p>
            </div>

            <div className="bg-neutral-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <h3 className="text-lg font-semibold text-red-400 mb-2">
                Costos Totales
              </h3>
              <p className="text-3xl font-extrabold">
                ${resumen.resumen_general.costo_total.toLocaleString("es-AR")}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Suma de repuestos, insumos y costos asociados.
              </p>
            </div>

            <div className="bg-neutral-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <h3 className="text-lg font-semibold text-green-400 mb-2">
                Balance Total
              </h3>
              <p className={`text-3xl font-extrabold ${resumen.resumen_general.balance_total >= 0 ? "text-green-300" : "text-red-300"}`}>
                ${resumen.resumen_general.balance_total.toLocaleString("es-AR")}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Facturación - Costos. Resultado global del mes.
              </p>
            </div>
          </div>

          {/* Gráficos Servicio Técnico */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Fila superior de gráficos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-2">
              {/* Desglose financiero */}
              <div className="bg-neutral-800 p-6 rounded-3xl shadow-xl flex flex-col h-full">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <FaMoneyBillWave className="text-purple-400 mr-2" />
                  Desglose Financiero
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={resumenData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {resumenData.map((_, i) => (
                        <Cell
                          key={`cell-${i}`}
                          fill={COLORS[i % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Balance por cliente */}
              <div className="bg-neutral-800 p-6 rounded-3xl shadow-xl flex flex-col h-full">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <FaChartBar className="text-green-400 mr-2" />
                  Balance por Cliente
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={trabajosData}
                    margin={{ top: 5, right: 30, left: 10, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#bbb", fontSize: 11 }}
                      angle={-35}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fill: "#bbb" }} />
                    <Tooltip content={<CustomTooltipBalance />} />
                    <Bar dataKey="balance" fill="#33FF57" barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Fila inferior de gráficos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-2">
              {/* Clientes frecuentes */}
              <div className="bg-neutral-800 p-6 rounded-3xl shadow-xl flex flex-col h-full">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <FaUserFriends className="text-blue-400 mr-2" />
                  Clientes Frecuentes
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={clientesData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis type="number" tick={{ fill: "#bbb" }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fill: "#bbb", fontSize: 12 }}
                      width={120}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="value"
                      name="Equipos Ingresados"
                      fill="#3399FF"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Reparaciones comunes */}
              <div className="bg-neutral-800 p-6 rounded-3xl shadow-xl flex flex-col h-full">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <FaTools className="text-orange-400 mr-2" />
                  Reparaciones Comunes
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={reparacionesData}
                    margin={{ top: 5, right: 30, left: 10, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#bbb", fontSize: 11 }}
                      angle={-35}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fill: "#bbb" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#FF5733" barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Equipos más ingresados */}
            <div className="bg-neutral-800 p-6 rounded-3xl shadow-xl col-span-1 lg:col-span-2 flex flex-col h-full">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <FaLaptop className="text-cyan-400 mr-2" />
                Equipos Más Ingresados
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={equiposData}
                  margin={{ top: 5, right: 30, left: 10, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#bbb", fontSize: 11 }}
                    angle={-15}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis tick={{ fill: "#bbb" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />
                  <Bar dataKey="value" fill="#3399FF" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* ==================== SECCIÓN DE VENTAS ==================== */}
        <section className="border-t border-neutral-700 pt-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-purple-400">
                🛒 Ventas del Mes
              </h2>
              <p className="text-sm text-gray-400">
                Ventas, costos y margen de los productos vendidos.
              </p>
            </div>
          </div>

          {/* KPIs de Ventas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 w-full">
            {/* Total Ventas */}
            <div className="bg-neutral-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <h3 className="text-lg font-semibold text-green-400 mb-2">
                Total Ventas
              </h3>
              <p className="text-3xl font-extrabold">
                ${totalVentas.toLocaleString("es-AR")}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Importe bruto facturado en ventas.
              </p>
            </div>

            {/* Costos */}
            <div className="bg-neutral-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <h3 className="text-lg font-semibold text-red-400 mb-2">
                Costos de Productos
              </h3>
              <p className="text-3xl font-extrabold">
                ${totalCostos.toLocaleString("es-AR")}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Suma del costo de todos los productos vendidos.
              </p>
            </div>

            {/* Ganancia */}
            <div className="bg-neutral-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">
                Ganancia Neta
              </h3>
              <p
                className={`text-3xl font-extrabold ${
                  totalGanancia >= 0 ? "text-cyan-300" : "text-red-300"
                }`}
              >
                ${totalGanancia.toLocaleString("es-AR")}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Ventas - Costos. Margen del mes en productos.
              </p>
            </div>

            {/* Resumen rápido */}
            <div className="bg-neutral-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <h3 className="text-lg font-semibold text-orange-300 mb-2">
                Resumen rápido
              </h3>
              <div className="text-xs text-gray-300 space-y-2">
                <div>
                  <span className="font-semibold text-gray-100">
                    Top cliente:{" "}
                  </span>
                  {clientesQueMasGastaron[0]
                    ? `${clientesQueMasGastaron[0].nombre} ($${clientesQueMasGastaron[0].total.toLocaleString(
                        "es-AR"
                      )})`
                    : "Sin ventas"}
                </div>
                <div>
                  <span className="font-semibold text-gray-100">
                    Producto más vendido:{" "}
                  </span>
                  {productosMasVendidos[0]
                    ? `${productosMasVendidos[0].nombre} (${productosMasVendidos[0].cantidad} u.)`
                    : "Sin ventas"}
                </div>
              </div>
            </div>
          </div>

          {/* Listados resumidos de clientes / productos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-neutral-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-blue-400 mb-3">
                Top Clientes
              </h3>
              <div className="space-y-2 text-sm text-gray-300">
                {clientesQueMasGastaron.length === 0 && (
                  <p className="text-gray-500">Sin ventas registradas.</p>
                )}
                {clientesQueMasGastaron.map((c) => (
                  <div
                    key={c.cliente_id}
                    className="flex justify-between items-center border-b border-neutral-700/60 pb-1 last:border-0"
                  >
                    <span className="truncate mr-2">{c.nombre}</span>
                    <span className="font-semibold text-green-400">
                      ${c.total.toLocaleString("es-AR")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-orange-400 mb-3">
                Productos Más Vendidos
              </h3>
              <div className="space-y-2 text-sm text-gray-300">
                {productosMasVendidos.length === 0 && (
                  <p className="text-gray-500">Sin ventas registradas.</p>
                )}
                {productosMasVendidos.map((p) => (
                  <div
                    key={p.producto_id}
                    className="flex justify-between items-center border-b border-neutral-700/60 pb-1 last:border-0"
                  >
                    <span className="truncate mr-2">{p.nombre}</span>
                    <span className="font-semibold text-purple-400">
                      {p.cantidad} u.
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gráficos de Ventas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 w-full">
            <div className="bg-neutral-800 p-6 rounded-3xl shadow-xl flex flex-col h-full">
              <h3 className="text-lg font-bold mb-4 text-green-400">
                Clientes que más gastaron
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={clientesQueMasGastaron} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis type="number" tick={{ fill: "#bbb" }} />
                  <YAxis
                    dataKey="nombre"
                    type="category"
                    tick={{ fill: "#bbb", fontSize: 12 }}
                    width={120}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total" fill="#33FF57" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-neutral-800 p-6 rounded-3xl shadow-xl flex flex-col h-full">
              <h3 className="text-lg font-bold mb-4 text-orange-400">
                Productos más vendidos
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productosMasVendidos} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis type="number" tick={{ fill: "#bbb" }} />
                  <YAxis
                    dataKey="nombre"
                    type="category"
                    tick={{ fill: "#bbb", fontSize: 12 }}
                    width={120}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="cantidad" fill="#FFC300" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
);

};

export default EstadisticasPage;