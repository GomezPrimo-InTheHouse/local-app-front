// src/components/Dashboard/ResumenVentasSemana.jsx
// Resumen de ventas del LOCAL de los últimos 7 días (mismo formato que ResumenSemana)
import { useEffect, useState } from "react";
import axios from "../../api/Axios";

const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;

const safeNum = (n) => (Number.isFinite(Number(n)) ? Number(n) : 0);

const formatCurrency = (n) =>
  safeNum(n).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-neutral-700/60 rounded ${className}`} />
);

const Fila = ({ icono, label, loading, children, skeleton = "h-4 w-8" }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="text-base">{icono}</span>
      <span className="text-xs text-neutral-400">{label}</span>
    </div>
    {loading ? <Skeleton className={skeleton} /> : children}
  </div>
);

const ResumenVentasSemana = () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/estadisticas/resumen-ventas-semana`);
        setData(res.data?.data ?? res.data);
      } catch (e) {
        console.error("Error cargando resumen semanal de ventas:", e);
        setError("No se pudo cargar el resumen de ventas.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const ventas     = safeNum(data?.ventas_realizadas);
  const unidades   = safeNum(data?.unidades_vendidas);
  const facturado  = safeNum(data?.total_facturado);
  const descuentos = safeNum(data?.descuentos);
  const costo      = safeNum(data?.costo_total);
  const balance    = safeNum(data?.balance);
  const cobrado    = safeNum(data?.cobrado);
  const saldo      = safeNum(data?.saldo_pendiente);
  const balancePositivo = balance >= 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-800/70 p-4 space-y-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] tracking-widest text-neutral-500 uppercase">
            Últimos 7 días
          </p>
          <h3 className="text-sm font-semibold text-white">Ventas del Local</h3>
        </div>
        <span className="text-xl">🛒</span>
      </div>

      <div className="h-px bg-neutral-700/50" />

      {error ? (
        <p className="text-xs text-red-400">{error}</p>
      ) : (
        <div className="space-y-2.5">

          <Fila icono="🧾" label="Ventas realizadas" loading={loading}>
            <span className="text-sm font-bold text-white">{ventas}</span>
          </Fila>

          <Fila icono="📦" label="Unidades vendidas" loading={loading}>
            <span className="text-sm font-bold text-white">{unidades}</span>
          </Fila>

          <div className="h-px bg-neutral-700/50" />

          <Fila icono="💰" label="Facturado" loading={loading} skeleton="h-4 w-20">
            <span className="text-sm font-semibold text-green-300">{formatCurrency(facturado)}</span>
          </Fila>

          {descuentos > 0 && (
            <Fila icono="🏷️" label="Descuentos otorgados" loading={loading} skeleton="h-4 w-20">
              <span className="text-sm font-semibold text-amber-300">{formatCurrency(descuentos)}</span>
            </Fila>
          )}

          <Fila icono="📉" label="Costo mercadería" loading={loading} skeleton="h-4 w-20">
            <span className="text-sm font-semibold text-red-300">-{formatCurrency(costo)}</span>
          </Fila>

          <div className="h-px bg-neutral-700/50" />

          <Fila icono="💵" label="Cobrado en la semana" loading={loading} skeleton="h-4 w-20">
            <span className="text-sm font-semibold text-sky-300">{formatCurrency(cobrado)}</span>
          </Fila>

          <Fila icono="⏳" label="Saldo pendiente" loading={loading} skeleton="h-4 w-20">
            <span className={`text-sm font-semibold ${saldo > 0 ? "text-red-300" : "text-neutral-400"}`}>
              {formatCurrency(saldo)}
            </span>
          </Fila>

          <div className="h-px bg-neutral-700/50" />

          {/* Balance */}
          <div className={`flex items-center justify-between rounded-xl px-3 py-2 ${
            balancePositivo
              ? "bg-emerald-900/30 border border-emerald-700/30"
              : "bg-red-900/30 border border-red-700/30"
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-base">{balancePositivo ? "📈" : "📉"}</span>
              <span className="text-xs font-semibold text-neutral-300">Ganancia neta</span>
            </div>
            {loading ? <Skeleton className="h-5 w-24" /> : (
              <span className={`text-base font-bold ${balancePositivo ? "text-emerald-400" : "text-red-400"}`}>
                {formatCurrency(balance)}
              </span>
            )}
          </div>

        </div>
      )}

      {!loading && !error && (
        <p className="text-[10px] text-neutral-600 text-center pt-1">
          Actualizado al {new Date().toLocaleDateString("es-AR")}
        </p>
      )}
    </div>
  );
};

export default ResumenVentasSemana;