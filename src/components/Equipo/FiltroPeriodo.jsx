// src/components/Equipo/FiltroPeriodo.jsx
// Filtro por período (fecha de ingreso de la última OT): atajos rápidos,
// un mes puntual o un rango desde/hasta.

const ATAJOS = [
  { id: "todos",      label: "Todos" },
  { id: "este_mes",   label: "Este mes" },
  { id: "mes_ant",    label: "Mes anterior" },
  { id: "ult_3",      label: "Últimos 3 meses" },
  { id: "este_anio",  label: "Este año" },
  { id: "mes",        label: "Elegir mes" },
  { id: "rango",      label: "Rango" },
];

const FiltroPeriodo = ({ periodo, setPeriodo, rango, cantidad }) => {
  const set = (cambios) => setPeriodo((p) => ({ ...p, ...cambios }));

  const chip = (activo) =>
    `px-3 py-1.5 rounded-lg text-xs border transition-colors ${
      activo
        ? "border-emerald-500 bg-emerald-600/20 text-emerald-200"
        : "border-white/10 bg-neutral-800/70 text-neutral-300 hover:bg-neutral-800"
    }`;

  const input = "bg-neutral-900 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white [color-scheme:dark]";

  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-800/40 p-3 sm:p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-neutral-200">📅 Período de ingreso</h4>
        {periodo.modo !== "todos" && (
          <span className="text-xs text-emerald-300">
            {rango?.etiqueta} · {cantidad} equipo{cantidad === 1 ? "" : "s"}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {ATAJOS.map((a) => (
          <button key={a.id} type="button" onClick={() => set({ modo: a.id })} className={chip(periodo.modo === a.id)}>
            {a.label}
          </button>
        ))}
      </div>

      {periodo.modo === "mes" && (
        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-400">Mes</label>
          <input type="month" value={periodo.mes} onChange={(e) => set({ mes: e.target.value })} className={input} />
        </div>
      )}

      {periodo.modo === "rango" && (
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-neutral-400">Desde</label>
          <input type="date" value={periodo.desde} onChange={(e) => set({ desde: e.target.value })} className={input} />
          <label className="text-xs text-neutral-400">Hasta</label>
          <input type="date" value={periodo.hasta} onChange={(e) => set({ hasta: e.target.value })} className={input} />
          {(periodo.desde || periodo.hasta) && (
            <button type="button" onClick={() => set({ desde: "", hasta: "" })}
              className="bg-transparent p-0 border-0 text-xs text-neutral-400 hover:text-white">
              Limpiar
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default FiltroPeriodo;