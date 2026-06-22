// src/components/Equipo/EquipoCard.jsx
import { Link } from "react-router-dom";

// ── Helpers visuales ──────────────────────────────────────────
const TIPO_ICONO = {
  celular:    "📱",
  notebook:   "💻",
  pc:         "🖥️",
  consola:    "🎮",
  tablet:     "📟",
  impresora:  "🖨️",
  joystick:   "🕹️",
  reloj:      "⌚",
  otro:       "🔧",
};

const getIconoTipo = (tipo) => TIPO_ICONO[tipo?.toLowerCase()] ?? "🔧";

const getEstadoStyles = (nombre) => {
  const s = (nombre || "").toLowerCase();
  if (s.includes("finaliz"))
    return {
      border:  "border-emerald-700/60",
      badge:   "bg-emerald-600/20 text-emerald-400",
      glow:    "hover:shadow-emerald-900/30",
    };
  if (s.includes("reparac") || s.includes("diagnos"))
    return {
      border:  "border-blue-700/60",
      badge:   "bg-blue-600/20 text-blue-400",
      glow:    "hover:shadow-blue-900/30",
    };
  if (s.includes("reingres") || s.includes("ingresad"))
    return {
      border:  "border-amber-700/60",
      badge:   "bg-amber-600/20 text-amber-400",
      glow:    "hover:shadow-amber-900/30",
    };
  if (s.includes("entregad") || s.includes("cobrad"))
    return {
      border:  "border-purple-700/60",
      badge:   "bg-purple-600/20 text-purple-400",
      glow:    "hover:shadow-purple-900/30",
    };
  if (s.includes("rechaz") || s.includes("abandon"))
    return {
      border:  "border-red-700/60",
      badge:   "bg-red-600/20 text-red-400",
      glow:    "hover:shadow-red-900/30",
    };
  return {
    border:  "border-neutral-700/60",
    badge:   "bg-neutral-700/40 text-neutral-300",
    glow:    "hover:shadow-purple-900/20",
  };
};

const formatPrice = (p) =>
  Number(p || 0).toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const formatDateShort = (s) => {
  if (!s) return "N/A";
  const d = new Date(s);
  return isNaN(d.getTime())
    ? "N/A"
    : d.toLocaleDateString("es-AR", {
        year: "numeric", month: "2-digit", day: "2-digit",
      });
};

// ── Íconos SVG ───────────────────────────────────────────────
const IconHistory  = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const IconUser     = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
const IconClock    = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const IconMapPin   = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const IconPhone    = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>);
const IconAlert    = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M6.832 20h10.336A2.973 2.973 0 0021 17.027V6.973A2.973 2.973 0 0017.168 4H6.832A2.973 2.973 0 003 6.973v10.054A2.973 2.973 0 006.832 20z" /></svg>);
const IconKey      = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>);
const IconPlus     = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>);

// ── Componente principal ──────────────────────────────────────
const EquipoCard = ({
  eq,
  balance,
  estadoNombre,
  mostrarBalances,
  onHistorial,
  onModificar,
  onDelete,
  onNuevaOT,       // (eq) => void — abre modal con equipo pre-seleccionado
}) => {
  const styles      = getEstadoStyles(estadoNombre);
  const clienteNombre = `${eq.cliente_nombre || "Anónimo"} ${eq.cliente_apellido || ""}`.trim();
  const costoTotal  = balance?.costo_total   ?? 0;
  const ventaTotal  = balance?.total_total   ?? 0;
  const balanceNeto = balance?.balance_final ?? 0;

  const sinPresupuesto = eq.tiene_orden && ventaTotal === 0;
  const credencial     = eq.ultima_password || eq.ultimo_patron;
  const tipoCredencial = eq.ultima_password ? "Pass" : "Patrón";

  return (
    <div className={`
      bg-neutral-900 p-4 rounded-xl border shadow-lg
      hover:shadow-xl transition-all duration-200
      flex flex-col justify-between gap-3
      ${styles.border} ${styles.glow}
    `}>

      {/* ── HEADER ── */}
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xl leading-none">{getIconoTipo(eq.tipo)}</span>
            <p className="text-base font-bold text-white truncate">
              {eq.marca} {eq.modelo}
            </p>
          </div>
          <p className="text-[11px] text-neutral-500 uppercase tracking-wide">
            {eq.tipo} · ID {eq.id}
            {eq.imei && <span className="ml-1">· IMEI {eq.imei}</span>}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full whitespace-nowrap ${styles.badge}`}>
            {estadoNombre}
          </span>
          {sinPresupuesto && (
            <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 whitespace-nowrap">
              Sin presupuesto
            </span>
          )}
        </div>
      </div>

      {/* ── FALLA + CREDENCIAL ── */}
      <div className="space-y-1.5 bg-neutral-800/40 rounded-lg p-2.5">
        <div className="flex items-start gap-1.5">
          <span className="text-red-400/70 flex-shrink-0 mt-0.5"><IconAlert /></span>
          <div className="min-w-0">
            <span className="text-[11px] text-neutral-400 font-medium block">Última falla</span>
            <span className="text-xs text-neutral-300 line-clamp-2">
              {eq.ultima_falla || "Sin registro"}
            </span>
          </div>
        </div>

        {credencial && (
          <div className="flex items-center gap-1.5 pt-1 border-t border-neutral-700/50">
            <span className="text-amber-400/70 flex-shrink-0"><IconKey /></span>
            <span className="text-[11px] text-neutral-400">{tipoCredencial}:</span>
            <span className="text-[11px] font-mono text-amber-300">{credencial}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 pt-1 border-t border-neutral-700/50">
          <span className="text-neutral-500"><IconClock /></span>
          <span className="text-[11px] text-neutral-400">
            Ingreso: <span className="text-white font-medium">{formatDateShort(eq.fecha_ingreso)}</span>
          </span>
        </div>
      </div>

      {/* ── CLIENTE ── */}
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-neutral-200 flex items-center gap-1.5">
          <IconUser /> {clienteNombre}
        </p>
        <p className="text-xs text-neutral-500 pl-5 flex items-center gap-1.5">
          <IconMapPin /> {eq.cliente_direccion || "—"}
        </p>
        <p className="text-xs text-neutral-500 pl-5 flex items-center gap-1.5">
          <IconPhone /> {eq.cliente_celular || "—"}
        </p>
      </div>

      {/* ── BALANCE ── */}
      <div className="rounded-lg bg-neutral-800/50 px-3 py-2 space-y-1">
        <div className="flex justify-between text-xs text-neutral-400">
          <span>Total:</span>
          <span className="font-semibold text-green-300">
            {mostrarBalances ? "****" : `$${formatPrice(ventaTotal)}`}
          </span>
        </div>
        <div className="flex justify-between text-xs text-neutral-400">
          <span>Costo:</span>
          <span className="font-semibold text-red-300">
            {mostrarBalances ? "****" : `-$${formatPrice(costoTotal)}`}
          </span>
        </div>
        <div className="flex justify-between text-sm font-bold border-t border-neutral-700 pt-1 mt-1">
          <span className="text-neutral-300">Balance:</span>
          <span className={balanceNeto >= 0 ? "text-emerald-400" : "text-red-400"}>
            {mostrarBalances ? "****" : `$${formatPrice(balanceNeto)}`}
          </span>
        </div>
      </div>

      {/* ── ACCIONES ── */}
      <div className="grid grid-cols-2 gap-1.5">
        {/* Fila 1 */}
        <button
          onClick={() => onNuevaOT(eq)}
          className="col-span-2 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-emerald-700/30 hover:bg-emerald-700/50 text-emerald-300 text-xs font-semibold transition-colors border border-emerald-700/30"
        >
          <IconPlus /> Nueva OT
        </button>

        {/* Fila 2 */}
        {eq.cliente_id && (
          <button
            onClick={() => onHistorial(eq.cliente_id, clienteNombre)}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-xs transition-colors"
          >
            <IconHistory /> Historial
          </button>
        )}
        <Link
          to={`/equipos/${eq.id}`}
          className="flex items-center justify-center px-2 py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white text-xs transition-colors"
        >
          Detalle
        </Link>

        {/* Fila 3 */}
        <button
          onClick={() => onModificar(eq)}
          className="flex items-center justify-center px-2 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs transition-colors"
        >
          Modificar
        </button>
        <button
          onClick={() => onDelete(eq.id)}
          className="flex items-center justify-center px-2 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-xs font-medium transition-colors"
        >
          Eliminar
        </button>
      </div>

    </div>
  );
};

export default EquipoCard;