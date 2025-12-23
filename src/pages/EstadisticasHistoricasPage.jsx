// src/pages/EstadisticasHistoricasPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDatosHistoricos } from "../api/EstadisticasApi.jsx";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import { FaChartLine, FaArrowLeft } from "react-icons/fa";

const safeNum = (n) => (Number.isFinite(Number(n)) ? Number(n) : 0);

const normalizeText = (s) =>
  String(s ?? "")
    .replace(/\s+/g, " ")
    .trim();

// "12/2025" -> Date(2025-12-01) para ordenar
const parsePeriodoToDate = (periodo) => {
  const p = normalizeText(periodo);
  const [mm, yyyy] = p.split("/");
  const m = safeNum(mm);
  const y = safeNum(yyyy);
  if (!m || !y) return new Date(0);
  return new Date(y, m - 1, 1);
};

const formatMoney = (n) => `$${safeNum(n).toLocaleString("es-AR")}`;

const TooltipBox = ({ active, payload, label, isCurrency = true }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white text-gray-800 p-3 rounded-xl shadow-xl border border-gray-200 text-sm">
      <p className="font-bold mb-1">{label}</p>
      <div className="space-y-1">
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center justify-between gap-4">
            <span className="font-medium" style={{ color: p.color }}>
              {p.name}
            </span>
            <span className="font-semibold">
              {isCurrency ? formatMoney(p.value) : String(p.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const EstadisticasHistoricasPage = () => {
  const navigate = useNavigate();

  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const resp = await getDatosHistoricos();
        setRes(resp);
      } catch (e) {
        console.error("Error cargando histórico:", e);
        setRes(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorico();
  }, []);

  // ✅ tu payload real: res.data.historico
  const historico = useMemo(() => {
    const arr = Array.isArray(res?.data?.historico) ? res.data.historico : [];
    return arr
      .filter(Boolean)
      .map((m) => ({
        periodo: normalizeText(m?.periodo) || "N/D",
        resumen_general: m?.resumen_general ?? {},
        taller: m?.taller ?? {},
        ventasRoot: m?.ventasResumen?.data ?? {}, // ✅ tu JSON: ventasResumen.data
      }))
      .sort((a, b) => parsePeriodoToDate(a.periodo) - parsePeriodoToDate(b.periodo));
  }, [res]);

  // ====== SERIES: FINANZAS ======
  const serieFinanciera = useMemo(() => {
    return historico.map((m) => ({
      periodo: m.periodo,
      facturacion: safeNum(m?.resumen_general?.total_facturado),
      costos: safeNum(m?.resumen_general?.costo_total),
      balance: safeNum(m?.resumen_general?.balance_total),
    }));
  }, [historico]);

  // ====== SERIES: TALLER (ganancia = sum balance_final) ======
  const serieTaller = useMemo(() => {
    return historico.map((m) => {
      const detalle = Array.isArray(m?.taller?.detalle_por_equipo)
        ? m.taller.detalle_por_equipo
        : [];
      const gananciaTaller = detalle.reduce((acc, e) => acc + safeNum(e?.balance_final), 0);

      return {
        periodo: m.periodo,
        equipos: safeNum(m?.taller?.cantidad_equipos),
        ganancia_taller: gananciaTaller,
      };
    });
  }, [historico]);

  // ====== SERIES: VENTAS (TOTAL + POR CANAL) ======
  const serieVentas = useMemo(() => {
    return historico.map((m) => {
      const vr = m?.ventasRoot ?? {};
      const porCanal = vr?.por_canal ?? {};
      return {
        periodo: m.periodo,
        ventas_total: safeNum(vr?.total_ventas),
        costos_total: safeNum(vr?.total_costos),
        ganancia_total: safeNum(vr?.total_ganancia),
        ventas_local: safeNum(porCanal?.local?.total_ventas),
        ventas_web: safeNum(porCanal?.web_shop?.total_ventas),
        ganancia_local: safeNum(porCanal?.local?.total_ganancia),
        ganancia_web: safeNum(porCanal?.web_shop?.total_ganancia),
      };
    });
  }, [historico]);

  // ====== KPIs ======
  const kpis = useMemo(() => {
    if (!historico.length) {
      return {
        totalFacturacion: 0,
        totalCostos: 0,
        totalBalance: 0,
        promedioBalance: 0,
        mejorMesBalance: null,
        mejorMesVentas: null,
      };
    }

    const totalFacturacion = serieFinanciera.reduce((a, x) => a + safeNum(x.facturacion), 0);
    const totalCostos = serieFinanciera.reduce((a, x) => a + safeNum(x.costos), 0);
    const totalBalance = serieFinanciera.reduce((a, x) => a + safeNum(x.balance), 0);
    const promedioBalance = totalBalance / serieFinanciera.length;

    const mejorMesBalance = [...serieFinanciera].sort((a, b) => safeNum(b.balance) - safeNum(a.balance))[0];
    const mejorMesVentas = [...serieVentas].sort((a, b) => safeNum(b.ventas_total) - safeNum(a.ventas_total))[0];

    return {
      totalFacturacion,
      totalCostos,
      totalBalance,
      promedioBalance,
      mejorMesBalance,
      mejorMesVentas,
    };
  }, [historico, serieFinanciera, serieVentas]);

  // ====== UI estados ======
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <FaChartLine className="text-4xl text-purple-400" />
          <p className="text-sm text-gray-300">Cargando histórico...</p>
        </div>
      </div>
    );
  }

  if (!historico.length) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-neutral-800 border border-neutral-700 rounded-2xl p-6 text-center">
          <p className="text-lg font-semibold text-red-300 mb-4">
            No hay datos históricos disponibles.
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-xl font-semibold"
          >
            <FaArrowLeft /> Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ====== Render ======
  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              📈 Histórico del Negocio
            </h1>
            <p className="text-sm sm:text-base text-gray-400 mt-2">
              Evolución mensual (finanzas, taller y ventas).
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 px-4 py-2 rounded-xl font-semibold"
          >
            <FaArrowLeft /> Volver
          </button>
        </header>

        {/* KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-5">
            <p className="text-xs text-gray-400">Total Facturado</p>
            <p className="text-2xl font-extrabold mt-2">{formatMoney(kpis.totalFacturacion)}</p>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-5">
            <p className="text-xs text-gray-400">Total Costos</p>
            <p className="text-2xl font-extrabold mt-2">{formatMoney(kpis.totalCostos)}</p>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-5">
            <p className="text-xs text-gray-400">Balance Total</p>
            <p className="text-2xl font-extrabold mt-2">{formatMoney(kpis.totalBalance)}</p>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-5">
            <p className="text-xs text-gray-400">Promedio Balance / Mes</p>
            <p className="text-2xl font-extrabold mt-2">{formatMoney(kpis.promedioBalance)}</p>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-5">
            <p className="text-xs text-gray-400">Mejor Mes (Balance)</p>
            <p className="text-lg font-bold mt-2">{kpis.mejorMesBalance?.periodo || "—"}</p>
            <p className="text-sm text-emerald-300 font-semibold">
              {formatMoney(kpis.mejorMesBalance?.balance)}
            </p>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-5">
            <p className="text-xs text-gray-400">Mejor Mes (Ventas)</p>
            <p className="text-lg font-bold mt-2">{kpis.mejorMesVentas?.periodo || "—"}</p>
            <p className="text-sm text-purple-300 font-semibold">
              {formatMoney(kpis.mejorMesVentas?.ventas_total)}
            </p>
          </div>
        </section>

        {/* Finanzas */}
        <section className="bg-neutral-800/60 border border-neutral-700 rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <h2 className="text-lg sm:text-xl font-extrabold flex items-center gap-2">
              <FaChartLine className="text-purple-300" />
              Evolución financiera
            </h2>
            <p className="text-xs text-gray-400">Facturación / Costos / Balance</p>
          </div>

          <div className="w-full h-[320px] sm:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={serieFinanciera} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="periodo" tick={{ fill: "#bbb", fontSize: 12 }} />
                <YAxis tick={{ fill: "#bbb", fontSize: 12 }} />
                <Tooltip content={<TooltipBox />} />
                <Legend />
                <Line type="monotone" dataKey="facturacion" name="Facturación" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="costos" name="Costos" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="balance" name="Balance" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Taller + Ventas */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Taller */}
          <div className="bg-neutral-800/60 border border-neutral-700 rounded-3xl p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-extrabold mb-4">
              Taller (ganancia y equipos)
            </h2>

            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serieTaller} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="periodo" tick={{ fill: "#bbb", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#bbb", fontSize: 12 }} />
                  <Tooltip content={<TooltipBox />} />
                  <Legend />
                  <Bar dataKey="ganancia_taller" name="Ganancia Taller" />
                  <Bar dataKey="equipos" name="Equipos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ventas por canal */}
          <div className="bg-neutral-800/60 border border-neutral-700 rounded-3xl p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-extrabold mb-4">
              Ventas por canal (Local vs Web)
            </h2>

            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serieVentas} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="periodo" tick={{ fill: "#bbb", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#bbb", fontSize: 12 }} />
                  <Tooltip content={<TooltipBox />} />
                  <Legend />
                  <Bar dataKey="ventas_local" name="Ventas Local" stackId="a" />
                  <Bar dataKey="ventas_web" name="Ventas Web Shop" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Ganancia ventas */}
        <section className="bg-neutral-800/60 border border-neutral-700 rounded-3xl p-5 sm:p-6">
          <h2 className="text-lg sm:text-xl font-extrabold mb-4">
            Ganancia de ventas (total vs web vs local)
          </h2>

          <div className="w-full h-[320px] sm:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={serieVentas} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="periodo" tick={{ fill: "#bbb", fontSize: 12 }} />
                <YAxis tick={{ fill: "#bbb", fontSize: 12 }} />
                <Tooltip content={<TooltipBox />} />
                <Legend />
                <Line type="monotone" dataKey="ganancia_total" name="Ganancia Total" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="ganancia_local" name="Ganancia Local" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="ganancia_web" name="Ganancia Web" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EstadisticasHistoricasPage;
