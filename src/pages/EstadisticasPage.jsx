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

  useEffect(() => {
    if (!mes || !anio) return;

    const fetchData = async () => {
      try {
        const data = await getResumenPorMes(mes, anio);
        console.log('(resumen-mes) getResumenPorMes: ', data)
        setResumen(data);
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mes, anio]);

  // Datos de ventas
  const totalVentas = ventasResumen?.data?.total_ventas || 0;

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

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-neutral-900 text-white overflow-hidden">
      {/* Columna Izquierda (20%) - Fija */}
      <div className="w-full md:w-[20%] border-b md:border-b-0 md:border-r border-neutral-700 p-6 flex flex-col items-start gap-4">
        <h1 className="text-3xl font-extrabold mb-2 text-gray-100">
          📊 Estadísticas
        </h1>
        <p className="text-lg font-bold text-purple-400 mb-8">
          {mes} / {anio}
        </p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center mt-auto px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-semibold transition-colors shadow-lg"
        >
          <span className="mr-2 text-sm">⬅️</span> Volver al Dashboard
        </button>
      </div>

      {/* Contenido Principal (80%) - Con scroll */}


     

      <div className="flex-1 p-8 overflow-y-auto">

         {/* ==================== SECCIÓN DE SERVICIO TECNICO ==================== */}
         
        {/* Resumen General (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 w-full">
          <div className="bg-neutral-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-purple-400 mb-2">Facturación Total</h2>
            <p className="text-3xl font-extrabold">
              ${resumen.resumen_general.total_facturado.toLocaleString()}
            </p>
          </div>
          <div className="bg-neutral-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-red-400 mb-2">Costos Totales</h2>
            <p className="text-3xl font-extrabold">
              ${resumen.resumen_general.costo_total.toLocaleString()}
            </p>
          </div>
          <div className="bg-neutral-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-green-400 mb-2">Balance Total</h2>
            <p className="text-3xl font-extrabold">
              ${resumen.resumen_general.balance_total.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Contenedor de Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {/* Fila superior de gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-2">
            <div className="bg-neutral-800 p-6 rounded-3xl shadow-xl flex flex-col h-full">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <FaMoneyBillWave className="text-purple-400 mr-2" />
                Desglose Financiero
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={resumenData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {resumenData.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-neutral-800 p-6 rounded-3xl shadow-xl flex flex-col h-full">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <FaChartBar className="text-green-400 mr-2" />
                Balance por Cliente
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trabajosData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" tick={{ fill: '#bbb', fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                  <YAxis tick={{ fill: '#bbb' }} />
                  <Tooltip content={<CustomTooltipBalance />} />
                  <Bar dataKey="balance" fill="#33FF57" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fila inferior de gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-2">
            <div className="bg-neutral-800 p-6 rounded-3xl shadow-xl flex flex-col h-full">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <FaUserFriends className="text-blue-400 mr-2" />
                Clientes Frecuentes
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={clientesData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis type="number" tick={{ fill: '#bbb' }} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#bbb', fontSize: 12 }} width={120} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Equipos Ingresados" fill="#3399FF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-neutral-800 p-6 rounded-3xl shadow-xl flex flex-col h-full">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <FaTools className="text-orange-400 mr-2" />
                Reparaciones Comunes
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reparacionesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" tick={{ fill: '#bbb', fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                  <YAxis tick={{ fill: '#bbb' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#FF5733" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de Equipos Más Ingresados - Fila única */}
          <div className="bg-neutral-800 p-6 rounded-3xl shadow-xl col-span-1 lg:col-span-2 flex flex-col h-full">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <FaLaptop className="text-cyan-400 mr-2" />
              Equipos Más Ingresados
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={equiposData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" tick={{ fill: '#bbb', fontSize: 12 }} />
                <YAxis tick={{ fill: '#bbb' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                <Bar dataKey="value" fill="#3399FF" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        

        </div>


          {/* ==================== SECCIÓN DE VENTAS ==================== */}
          <div className="mt-12">
            <h2 className="text-2xl font-extrabold mb-6 text-purple-400">🛒 Ventas del Mes</h2>

            {/* KPIs de Ventas */}
           
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 w-full">
              <div className="bg-neutral-800 rounded-3xl p-6 shadow-xl">
                <h2 className="text-lg font-semibold text-green-400 mb-2">Total Ventas</h2>
                <p className="text-3xl font-extrabold">
                  ${totalVentas.toLocaleString()}
                </p>
              </div>
              <div className="bg-neutral-800 rounded-3xl p-6 shadow-xl">
                <h2 className="text-lg font-semibold text-blue-400 mb-2">Top Clientes</h2>
                <p className="text-sm text-gray-300">
                  {clientesQueMasGastaron.map(c => (
                    <div key={c.cliente_id} className="flex justify-between">
                      <span>{c.nombre}</span>
                      <span className="font-semibold text-green-400">${c.total.toLocaleString()}</span>
                    </div>
                  ))}
                </p>
              </div>
              <div className="bg-neutral-800 rounded-3xl p-6 shadow-xl">
                <h2 className="text-lg font-semibold text-orange-400 mb-2">Productos Más Vendidos</h2>
                <p className="text-sm text-gray-300">
                  {productosMasVendidos.map(p => (
                    <div key={p.producto_id} className="flex justify-between">
                      <span>{p.nombre}</span>
                      <span className="font-semibold text-purple-400">{p.cantidad} u.</span>
                    </div>
                  ))}
                </p>
              </div>
            </div>

            {/* Gráficos de Ventas */}
            <div className="grid grid-cols-1 md:grid-cols-2  gap-6 mb-8 w-full">
              <div className="bg-neutral-800 p-6 rounded-3xl shadow-xl flex flex-col h-full">
                <h2 className="text-lg font-bold mb-4 text-green-400">Clientes que más gastaron</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={clientesQueMasGastaron} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis type="number" tick={{ fill: '#bbb' }} />
                    <YAxis dataKey="nombre" type="category" tick={{ fill: '#bbb', fontSize: 12 }} width={120} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="total" fill="#33FF57" barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-neutral-800 p-6 rounded-3xl shadow-xl flex flex-col h-full">
                <h2 className="text-lg font-bold mb-4 text-orange-400">Productos más vendidos</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productosMasVendidos} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis type="number" tick={{ fill: '#bbb' }} />
                    <YAxis dataKey="nombre" type="category" tick={{ fill: '#bbb', fontSize: 12 }} width={120} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="cantidad" fill="#FFC300" barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default EstadisticasPage;