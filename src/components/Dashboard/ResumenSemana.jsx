// src/components/Dashboard/ResumenSemana.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../config/supabase.js";

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

const ResumenSemana = () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data: result, error: err } = await supabase
          .rpc("get_resumen_semana");
        if (err) throw err;
        setData(result);
      } catch (e) {
        console.error("Error cargando resumen semanal:", e);
        setError("No se pudo cargar el resumen.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const equipos   = safeNum(data?.equipos_ingresados);
  const ordenes   = safeNum(data?.ordenes_creadas);
  const facturado = safeNum(data?.total_facturado);
  const costo     = safeNum(data?.costo_total);
  const balance   = safeNum(data?.balance);

  const balancePositivo = balance >= 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-800/70 p-4 space-y-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] tracking-widest text-neutral-500 uppercase">
            Últimos 7 días
          </p>
          <h3 className="text-sm font-semibold text-white">Resumen Semanal</h3>
        </div>
        <span className="text-xl">📅</span>
      </div>

      <div className="h-px bg-neutral-700/50" />

      {error ? (
        <p className="text-xs text-red-400">{error}</p>
      ) : (
        <div className="space-y-2.5">

          {/* Equipos ingresados */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">📱</span>
              <span className="text-xs text-neutral-400">Equipos ingresados</span>
            </div>
            {loading ? (
              <Skeleton className="h-4 w-8" />
            ) : (
              <span className="text-sm font-bold text-white">{equipos}</span>
            )}
          </div>

          {/* Órdenes creadas */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">📋</span>
              <span className="text-xs text-neutral-400">Órdenes de trabajo</span>
            </div>
            {loading ? (
              <Skeleton className="h-4 w-8" />
            ) : (
              <span className="text-sm font-bold text-white">{ordenes}</span>
            )}
          </div>

          <div className="h-px bg-neutral-700/50" />

          {/* Total facturado */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">💰</span>
              <span className="text-xs text-neutral-400">Facturado</span>
            </div>
            {loading ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <span className="text-sm font-semibold text-green-300">
                {formatCurrency(facturado)}
              </span>
            )}
          </div>

          {/* Costo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🔧</span>
              <span className="text-xs text-neutral-400">Costo materiales</span>
            </div>
            {loading ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <span className="text-sm font-semibold text-red-300">
                -{formatCurrency(costo)}
              </span>
            )}
          </div>

          <div className="h-px bg-neutral-700/50" />

          {/* Balance */}
          <div className={`flex items-center justify-between rounded-xl px-3 py-2 ${
            balancePositivo
              ? "bg-emerald-900/30 border border-emerald-700/30"
              : "bg-red-900/30 border border-red-700/30"
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-base">{balancePositivo ? "📈" : "📉"}</span>
              <span className="text-xs font-semibold text-neutral-300">Balance neto</span>
            </div>
            {loading ? (
              <Skeleton className="h-5 w-24" />
            ) : (
              <span className={`text-base font-bold ${balancePositivo ? "text-emerald-400" : "text-red-400"}`}>
                {formatCurrency(balance)}
              </span>
            )}
          </div>

        </div>
      )}

      {/* Footer */}
      {!loading && !error && (
        <p className="text-[10px] text-neutral-600 text-center pt-1">
          Actualizado al {new Date().toLocaleDateString("es-AR")}
        </p>
      )}
    </div>
  );
};

export default ResumenSemana;