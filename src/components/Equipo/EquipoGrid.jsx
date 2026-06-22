// src/components/Equipo/EquipoGrid.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import EquipoCard from "./EquipoCard.jsx";

const PAGE_SIZE = 20;

// Skeleton de carga para una card
const CardSkeleton = () => (
  <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 space-y-3 animate-pulse">
    <div className="flex justify-between items-start gap-2">
      <div className="space-y-1.5 flex-1">
        <div className="h-4 bg-neutral-700 rounded w-3/4" />
        <div className="h-3 bg-neutral-800 rounded w-1/2" />
      </div>
      <div className="h-5 w-20 bg-neutral-700 rounded-full" />
    </div>
    <div className="h-16 bg-neutral-800 rounded-lg" />
    <div className="space-y-1">
      <div className="h-3 bg-neutral-800 rounded w-2/3" />
      <div className="h-3 bg-neutral-800 rounded w-1/2" />
    </div>
    <div className="h-14 bg-neutral-800 rounded-lg" />
    <div className="grid grid-cols-2 gap-1.5">
      <div className="col-span-2 h-8 bg-neutral-800 rounded-lg" />
      <div className="h-7 bg-neutral-800 rounded-lg" />
      <div className="h-7 bg-neutral-800 rounded-lg" />
      <div className="h-7 bg-neutral-800 rounded-lg" />
      <div className="h-7 bg-neutral-800 rounded-lg" />
    </div>
  </div>
);

const EquipoGrid = ({
  equiposAgrupadosPorMes,
  balanceByEquipoId,
  getNombreEstado,
  mostrarBalances,
  filtroEquipo,
  loading,
  onHistorial,
  onModificar,
  onDelete,
  onNuevaOT,
  onLimpiarFiltro,
}) => {
  // Cuántos meses mostramos (scroll infinito a nivel de grupos)
  const [mesesVisibles, setMesesVisibles] = useState(3);
  const loaderRef = useRef(null);

  // Resetear cuando cambia la lista
  useEffect(() => {
    setMesesVisibles(3);
  }, [equiposAgrupadosPorMes.length, filtroEquipo]);

  // IntersectionObserver para cargar más grupos al llegar al final
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && mesesVisibles < equiposAgrupadosPorMes.length) {
        setMesesVisibles((prev) => Math.min(prev + 2, equiposAgrupadosPorMes.length));
      }
    },
    [mesesVisibles, equiposAgrupadosPorMes.length]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  // ── Estado: cargando ──
  if (loading) {
    return (
      <section className="py-4">
        <div className="border-b border-white/10 pb-2 mb-6">
          <div className="h-7 bg-neutral-800 rounded w-40 animate-pulse" />
          <div className="h-3 bg-neutral-800 rounded w-24 mt-2 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </section>
    );
  }

  // ── Estado: sin resultados ──
  if (equiposAgrupadosPorMes.length === 0) {
    return (
      <section className="py-4">
        <div className="rounded-xl border border-dashed border-white/15 p-10 text-center bg-white/5">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-neutral-300 text-lg font-medium">
            {filtroEquipo
              ? `No hay equipos que coincidan con "${filtroEquipo}"`
              : "Aún no hay equipos cargados."}
          </p>
          {filtroEquipo && (
            <button
              onClick={onLimpiarFiltro}
              className="mt-4 text-sm text-emerald-400 hover:underline"
            >
              Limpiar filtro
            </button>
          )}
        </div>
      </section>
    );
  }

  const gruposVisibles = equiposAgrupadosPorMes.slice(0, mesesVisibles);
  const hayMas        = mesesVisibles < equiposAgrupadosPorMes.length;

  return (
    <section className="py-4 space-y-10">
      {gruposVisibles.map(([, data]) => {
        const { label: mes, equipos: equiposMes } = data;

        return (
          <div key={mes}>
            {/* Encabezado de grupo */}
            <div className="border-b border-white/10 pb-2 mb-5 flex items-end justify-between gap-3">
              <div>
                <h4 className="text-xl font-extrabold text-white capitalize">{mes}</h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {equiposMes.length} equipo{equiposMes.length !== 1 ? "s" : ""}
                </p>
              </div>
              {/* Mini balance del mes */}
              <div className="text-right text-xs text-neutral-500 hidden sm:block">
                <span className="text-green-400 font-medium">
                  ${Number(data.totalVenta || 0).toLocaleString("es-AR")}
                </span>
                {" / "}
                <span className={data.totalBalance >= 0 ? "text-emerald-400" : "text-red-400"}>
                  bal ${Number(data.totalBalance || 0).toLocaleString("es-AR")}
                </span>
              </div>
            </div>

            {/* Grid de cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {equiposMes.map((eq) => (
                <EquipoCard
                  key={eq.id}
                  eq={eq}
                  balance={balanceByEquipoId[eq.id]}
                  estadoNombre={getNombreEstado(eq.estado_id)}
                  mostrarBalances={mostrarBalances}
                  onHistorial={onHistorial}
                  onModificar={onModificar}
                  onDelete={onDelete}
                  onNuevaOT={onNuevaOT}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Trigger de scroll infinito */}
      <div ref={loaderRef} className="flex justify-center py-4">
        {hayMas ? (
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <div className="h-4 w-4 border-2 border-neutral-600 border-t-emerald-500 rounded-full animate-spin" />
            Cargando más equipos...
          </div>
        ) : (
          equiposAgrupadosPorMes.length > 3 && (
            <p className="text-xs text-neutral-600">
              {equiposAgrupadosPorMes.reduce((acc, [, d]) => acc + d.equipos.length, 0)} equipos en total
            </p>
          )
        )}
      </div>
    </section>
  );
};

export default EquipoGrid;