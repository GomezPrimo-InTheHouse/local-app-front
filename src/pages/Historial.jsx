// import { useEffect, useState, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getHistorialEquipo, getHistorialCliente } from "../api/HistorialApi.jsx";
// import { getClienteById } from "../api/ClienteApi.jsx";
// import { ArrowLeft, User, Smartphone, Wrench, CalendarDays, BadgeCheck } from "lucide-react";

// // ✅ Helpers locales (para evitar errores)
// function fmtDate(dateString) {
//   if (!dateString) return "—";
//   const date = new Date(dateString);
//   return date.toLocaleDateString("es-AR", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// }

// function fmtMoney(value) {
//   if (value == null || isNaN(value)) return "$0";
//   return value.toLocaleString("es-AR", {
//     style: "currency",
//     currency: "ARS",
//     minimumFractionDigits: 0,
//   });
// }

// // Asigna clases según el estado
// function chipClasses(estado) {
//   const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
//   switch (estado?.toLowerCase()) {
//     case "pendiente":
//       return `${base} bg-yellow-500/20 text-yellow-300`;
//     case "finalizado":
//       return `${base} bg-green-500/20 text-green-300`;
//     case "cancelado":
//       return `${base} bg-red-500/20 text-red-300`;
//     default:
//       return `${base} bg-white/10 text-white/80`;
//   }
// }

// export default function Historial() {
//   const { id, clienteId } = useParams();
//   const navigate = useNavigate();

//   const [historial, setHistorial] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [cliente, setCliente] = useState(null);

//   const normalizeFromCliente = (raw, cid) => {
//     if (!raw) return null;
//     if (typeof raw === "object" && raw !== null && Array.isArray(raw.equipos)) return raw;
//     if (Array.isArray(raw)) return { cliente_id: cid, equipos: raw };
//     return { cliente_id: cid, equipos: raw?.equipos ?? [] };
//   };

//   useEffect(() => {
//     (async () => {
//       try {
//         let data;
//         if (clienteId) {
//           data = await getHistorialCliente(clienteId);
//           data = normalizeFromCliente(data, clienteId);
//         } else {
//           data = await getHistorialEquipo(id);
//         }
//         setHistorial(data);
//       } catch (error) {
//         console.error("Error obteniendo historial:", error);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id, clienteId]);

//   useEffect(() => {
//     (async () => {
//       const cid = clienteId || historial?.cliente_id;
//       if (!cid) return;
//       try {
//         const data = await getClienteById(cid);
//         setCliente(data);
//       } catch (error) {
//         console.error("Error obteniendo cliente:", error);
//       }
//     })();
//   }, [clienteId, historial]);

//   const equipos = historial?.equipos ?? [];

//   const tituloCliente = useMemo(() => {
//     if (!cliente) return "Cliente";
//     const nombre = [cliente?.nombre, cliente?.apellido].filter(Boolean).join(" ");
//     return `${nombre || "Cliente"} (ID: ${cliente?.id ?? "—"})`;
//   }, [cliente]);

//   const stats = useMemo(() => {
//     const equiposArr = equipos;
//     const equiposCount = equiposArr.length;
//     let ingresosCount = 0;
//     let presupuestosCount = 0;
//     let sumCosto = 0;
//     let sumTotal = 0;

//     for (const eq of equiposArr) {
//       for (const ing of (eq.ingresos || [])) {
//         ingresosCount++;
//         for (const p of (ing.presupuestos || [])) {
//           presupuestosCount++;
//           sumCosto += Number(p?.costo || 0);
//           sumTotal += Number(p?.total || 0);
//         }
//       }
//     }

//     return {
//       equiposCount,
//       ingresosCount,
//       presupuestosCount,
//       sumCosto,
//       sumTotal,
//       balance: sumTotal - sumCosto,
//     };
//   }, [equipos]);

//   const backHref = clienteId ? `/clientes` : `/equipos/${id}`;
//   const handleOpenEquipo = (equipoId) => navigate(`/equipos/${equipoId}`);

//   if (loading) {
//     return (
//       <div className="min-h-screen w-screen bg-neutral-900 text-white flex items-center justify-center">
//         <p className="text-neutral-400">Cargando historial...</p>
//       </div>
//     );
//   }

//   if (!historial || !equipos.length) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-neutral-900 text-white p-8">
//         <div className="text-center max-w-md">
//           <div className="mx-auto mb-4 size-12 rounded-2xl bg-white/5 flex items-center justify-center">
//             <Smartphone className="size-6 text-white/70" />
//           </div>
//           <h3 className="text-xl font-semibold mb-1">Sin historial para este cliente</h3>
//           <p className="text-neutral-400 mb-4">
//             Todavía no registraste ingresos ni presupuestos asociados.
//           </p>
//           <button onClick={() => navigate(backHref)} className="btn btn-primary">
//             <ArrowLeft className="size-4" /> Volver
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen w-screen bg-neutral-900 text-white">
//       <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-900/80 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60">
//         <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <User className="size-5" />
//             <h2 className="text-lg font-semibold">Historial de {tituloCliente}</h2>
//           </div>
//           <button onClick={() => navigate(backHref)} className="btn btn-ghost">
//             <ArrowLeft className="size-4" /> Volver
//           </button>
//         </div>
//       </header>

//       <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
//         {/* KPIs */}
//         <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//           <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
//             <p className="text-xs text-neutral-400">Equipos del cliente</p>
//             <p className="mt-1 text-2xl font-semibold">{stats.equiposCount}</p>
//           </div>
//           <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
//             <p className="text-xs text-neutral-400">Ingresos registrados</p>
//             <p className="mt-1 text-2xl font-semibold">{stats.ingresosCount}</p>
//           </div>
//           <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
//             <p className="text-xs text-neutral-400">Ingresos (ARS)</p>
//             <p className="mt-1 text-2xl font-semibold">{fmtMoney(stats.sumTotal)}</p>
//           </div>
//           <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
//             <p className="text-xs text-neutral-400">Balance</p>
//             <p className="mt-1 text-2xl font-semibold">{fmtMoney(stats.balance)}</p>
//           </div>
//         </section>

//         {equipos.map((equipo) => (
//           <section
//             key={equipo.equipo_id}
//             onClick={() => handleOpenEquipo(equipo.equipo_id)}
//             className="rounded-2xl border border-white/10 bg-neutral-800/60 p-5 shadow-soft cursor-pointer transition hover:bg-neutral-800 hover:border-white/20"
//           >
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-white/10 pb-3 mb-4">
//               <div className="flex items-center gap-3">
//                 <div className="size-9 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
//                   <Smartphone className="size-5 text-brand-200" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold">
//                     Equipo #{equipo.equipo_id} — {equipo?.marca} {equipo?.modelo}
//                   </h3>
//                   <p className="text-sm text-neutral-400">
//                     Tipo: {equipo?.tipo} · Problema: {equipo?.problema}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2 text-xs text-neutral-300">
//                 <BadgeCheck className="size-4" /> {equipo?.ingresos?.length || 0} ingresos
//               </div>
//             </div>

//             <div className="space-y-4">
//               {(equipo.ingresos || []).map((ingreso) => {
//                 const tienePresupuestos =
//                   Array.isArray(ingreso.presupuestos) && ingreso.presupuestos.length > 0;

//                 return (
//                   <article
//                     key={ingreso.ingreso_id}
//                     className={
//                       `rounded-xl border p-4 transition ` +
//                       (tienePresupuestos
//                         ? `border-white/10 bg-neutral-900/50`
//                         : `border-red-500/30 bg-red-500/10`)
//                     }
//                   >
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                       <div className="md:col-span-2">
//                         <div className="flex items-center gap-2 font-semibold">
//                           <Wrench className="size-4 text-white/70" /> Ingreso #{ingreso.ingreso_id}
//                         </div>
//                         <div className="mt-2 space-y-1 text-sm text-neutral-300">
//                           <div className="flex items-center gap-2">
//                             <CalendarDays className="size-4 text-white/50" /> Fecha ingreso:
//                             <span className="ml-1 font-medium text-white">
//                               {fmtDate(ingreso.fecha_ingreso)}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <CalendarDays className="size-4 text-white/50" /> Fecha egreso:
//                             <span className="ml-1 font-medium text-white">
//                               {ingreso.fecha_egreso
//                                 ? fmtDate(ingreso.fecha_egreso)
//                                 : "Aún no egresado"}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             Estado:
//                             <span className={chipClasses(ingreso?.estado?.nombre)}>
//                               {ingreso?.estado?.nombre || "—"}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="md:col-span-2">
//                         <h4 className="text-sm font-semibold mb-2">Presupuestos</h4>
//                         {!tienePresupuestos ? (
//                           <p className="text-sm text-red-200">No hay presupuestos.</p>
//                         ) : (
//                           <div className="grid gap-3 sm:grid-cols-2">
//                             {(ingreso.presupuestos || []).map((p) => (
//                               <div
//                                 key={p.presupuesto_id}
//                                 className="rounded-lg border border-white/10 bg-white/5 p-3"
//                               >
//                                 <div className="flex items-center justify-between">
//                                   <p className="text-sm font-semibold">
//                                     Presupuesto #{p.presupuesto_id}
//                                   </p>
//                                   <span className={chipClasses(p?.estado?.nombre)}>
//                                     {p?.estado?.nombre || "—"}
//                                   </span>
//                                 </div>
//                                 <div className="mt-1 text-xs text-neutral-300">
//                                   <p>Fecha: <span className="text-white">{fmtDate(p.fecha)}</span></p>
//                                   <p>Costo: <span className="text-white">{fmtMoney(p.costo)}</span></p>
//                                   <p>Total: <span className="text-white">{fmtMoney(p.total)}</span></p>
//                                   {p.observaciones && (
//                                     <p className="mt-1 italic text-neutral-400">{p.observaciones}</p>
//                                   )}
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </article>
//                 );
//               })}
//             </div>
//           </section>
//         ))}
//       </main>
//     </div>
//   );
// }



// src/pages/HistorialClientePage.jsx
import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../api/Axios";

const API_BASE_URL = import.meta.env.VITE_API_URL_BACKEND;

const formatDate = (s) => {
  if (!s) return "—";
  const d = new Date(s);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("es-AR", {
    day: "2-digit", month: "2-digit", year: "numeric"
  });
};

const formatCurrency = (n) =>
  Number(n || 0).toLocaleString("es-AR", {
    style: "currency", currency: "ARS", maximumFractionDigits: 0
  });

const estadoBadge = (nombre) => {
  const s = (nombre || "").toLowerCase();
  if (s.includes("finaliz") || s.includes("entregad"))
    return "bg-emerald-600/20 text-emerald-400 border-emerald-700/30";
  if (s.includes("reparac") || s.includes("diagnos"))
    return "bg-blue-600/20 text-blue-400 border-blue-700/30";
  if (s.includes("reingres") || s.includes("ingresad"))
    return "bg-amber-600/20 text-amber-400 border-amber-700/30";
  if (s.includes("rechaz") || s.includes("abandon"))
    return "bg-red-600/20 text-red-400 border-red-700/30";
  return "bg-neutral-700/40 text-neutral-300 border-neutral-600/30";
};

const TIPO_ICONO = {
  celular: "📱", notebook: "💻", pc: "🖥️", consola: "🎮",
  tablet: "📟", impresora: "🖨️", joystick: "🕹️", reloj: "⌚", otro: "🔧",
};
const getIcono = (tipo) => TIPO_ICONO[tipo?.toLowerCase()] ?? "🔧";

// Presupuestos que NO suman a lo facturado: Pendiente(1), Rechazado(3), Baja(18)
const PRESUPUESTO_NO_FACTURADO = new Set([1, 3, 18]);
const cuentaComoFacturado = (p) =>
  !PRESUPUESTO_NO_FACTURADO.has(Number(p?.estado_presupuesto_id));

// Ventas que suman: Activa/saldada(19) y Pendiente de pago(26)
const VENTA_ACTIVA = new Set([19, 26]);

const HistorialClientePage = () => {
  // Esta página se usa en /historial/cliente/:clienteId y en /equipos/:id/historial
  const { clienteId: clienteIdParam, id: equipoIdParam } = useParams();
  const [rows, setRows]       = useState([]);
  const [ventas, setVentas]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [equipoFiltro, setEquipoFiltro] = useState("todos");

  useEffect(() => {
    if (!clienteIdParam && !equipoIdParam) {
      setLoading(false);
      setError("No se indicó cliente ni equipo.");
      return;
    }
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const url = clienteIdParam
          ? `${API_BASE_URL}/historial/cliente/${clienteIdParam}`
          : `${API_BASE_URL}/historial/equipo/${equipoIdParam}`;
        const { data } = await axios.get(url);
        const filas = Array.isArray(data) ? data : [];
        setRows(filas);

        // Desde un equipo: arrancar filtrado en ese equipo
        if (equipoIdParam) setEquipoFiltro(String(equipoIdParam));

        const cid = clienteIdParam ?? filas[0]?.cliente_id;
        if (cid) {
          try {
            const { data: vs } = await axios.get(
              `${API_BASE_URL}/historial/cliente/${cid}/ventas`
            );
            setVentas(Array.isArray(vs) ? vs : []);
          } catch (e) {
            console.error("Error cargando ventas del cliente:", e);
            setVentas([]);
          }
        }
      } catch (e) {
        console.error("Error cargando historial:", e);
        setError("No se pudo cargar el historial del cliente.");
      } finally {
        setLoading(false);
      }
    })();
  }, [clienteIdParam, equipoIdParam]);

  const backHref  = equipoIdParam ? `/equipos/${equipoIdParam}` : "/clientes";
  const backLabel = equipoIdParam ? "← Volver al equipo" : "← Volver a clientes";

  // Agrupar rows por equipo
  const equipos = useMemo(() => {
    const map = {};
    for (const row of rows) {
      const key = row.equipo_id;
      if (!map[key]) {
        map[key] = {
          equipo_id:  row.equipo_id,
          tipo:       row.tipo,
          marca:      row.marca,
          modelo:     row.modelo,
          ordenes:    {},
        };
      }
      // Agrupar por orden_trabajo_id
      if (row.orden_trabajo_id) {
        const otKey = row.orden_trabajo_id;
        if (!map[key].ordenes[otKey]) {
          map[key].ordenes[otKey] = {
            orden_trabajo_id:      row.orden_trabajo_id,
            falla_reportada:       row.falla_reportada,
            fecha_ingreso:         row.fecha_ingreso,
            fecha_egreso:          row.fecha_egreso,
            estado_ingreso_id:     row.estado_ingreso_id,
            estado_ingreso_nombre: row.estado_ingreso_nombre,
            presupuestos: [],
          };
        }
        if (row.presupuesto_id) {
          // Evitar duplicados de presupuesto
          const yaExiste = map[key].ordenes[otKey].presupuestos
            .some(p => p.presupuesto_id === row.presupuesto_id);
          if (!yaExiste) {
            map[key].ordenes[otKey].presupuestos.push({
              presupuesto_id:           row.presupuesto_id,
              fecha_presupuesto:        row.fecha_presupuesto,
              costo:                    row.costo,
              total:                    row.total,
              observaciones:            row.observaciones,
              estado_presupuesto_id:    row.estado_presupuesto_id,
              estado_presupuesto_nombre: row.estado_presupuesto_nombre,
            });
          }
        }
      }
    }
    return Object.values(map).map(eq => ({
      ...eq,
      ordenes: Object.values(eq.ordenes)
        .sort((a, b) => new Date(b.fecha_ingreso) - new Date(a.fecha_ingreso)),
    }));
  }, [rows]);

  const equiposUnicos = useMemo(() =>
    [{ equipo_id: "todos", marca: "Todos", modelo: "" }, ...equipos],
    [equipos]
  );

  const equiposMostrados = useMemo(() =>
    equipoFiltro === "todos"
      ? equipos
      : equipos.filter(e => String(e.equipo_id) === String(equipoFiltro)),
    [equipos, equipoFiltro]
  );

  const ventasActivas = useMemo(
    () => ventas.filter((v) => VENTA_ACTIVA.has(Number(v.estado_id))),
    [ventas]
  );

  // Totales generales: reparaciones facturables + ventas activas
  const totales = useMemo(() => {
    let repTotal = 0, repCosto = 0;
    for (const eq of equipos) {
      for (const ot of eq.ordenes) {
        for (const p of ot.presupuestos) {
          if (!cuentaComoFacturado(p)) continue;
          repTotal += Number(p.total  || 0);
          repCosto += Number(p.costo  || 0);
        }
      }
    }
    let venTotal = 0, venCosto = 0, venSaldo = 0;
    for (const v of ventasActivas) {
      venTotal += Number(v.total || 0);
      venSaldo += Number(v.saldo || 0);
      for (const d of v.detalle_venta || []) {
        venCosto += Number(d.cantidad || 0) * Number(d.producto?.costo || 0);
      }
    }
    const totalFacturado = repTotal + venTotal;
    const totalCosto = repCosto + venCosto;
    return {
      totalFacturado, totalCosto, balance: totalFacturado - totalCosto,
      repTotal, venTotal, venSaldo,
    };
  }, [equipos, ventasActivas]);

  if (loading) return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
      <div className="flex items-center gap-3 text-neutral-400">
        <div className="h-5 w-5 border-2 border-neutral-600 border-t-emerald-500 rounded-full animate-spin" />
        Cargando historial...
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
      <div className="text-center space-y-3">
        <p className="text-red-400 text-lg">{error}</p>
        <Link to={backHref} className="text-emerald-400 hover:underline text-sm">
          {backLabel}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-900 text-white/95">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link to={backHref} className="text-xs text-neutral-500 hover:text-white transition-colors">
              {backLabel}
            </Link>
            <h1 className="text-2xl font-bold text-white mt-1">Historial del Cliente</h1>
            <p className="text-sm text-neutral-400 mt-0.5">
              {equipos.length} equipo{equipos.length !== 1 ? "s" : ""} ·{" "}
              {equipos.reduce((acc, e) => acc + e.ordenes.length, 0)} ingreso{equipos.reduce((acc, e) => acc + e.ordenes.length, 0) !== 1 ? "s" : ""} ·{" "}
              {ventasActivas.length} venta{ventasActivas.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Resumen de totales */}
        {(equipos.length > 0 || ventasActivas.length > 0) && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-neutral-800/60 border border-white/10 rounded-xl p-3 text-center">
              <p className="text-xs text-neutral-400 mb-1">Facturado</p>
              <p className="text-base font-bold text-green-300">{formatCurrency(totales.totalFacturado)}</p>
              <p className="text-[10px] text-neutral-500 mt-0.5">
                Taller {formatCurrency(totales.repTotal)} · Ventas {formatCurrency(totales.venTotal)}
              </p>
            </div>
            <div className="bg-neutral-800/60 border border-white/10 rounded-xl p-3 text-center">
              <p className="text-xs text-neutral-400 mb-1">Costo</p>
              <p className="text-base font-bold text-red-300">{formatCurrency(totales.totalCosto)}</p>
            </div>
            <div className={`border rounded-xl p-3 text-center ${
              totales.balance >= 0
                ? "bg-emerald-900/20 border-emerald-700/30"
                : "bg-red-900/20 border-red-700/30"
            }`}>
              <p className="text-xs text-neutral-400 mb-1">Balance</p>
              <p className={`text-base font-bold ${totales.balance >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {formatCurrency(totales.balance)}
              </p>
            </div>
          </div>
        )}

        {/* Filtro por equipo */}
        {equipos.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {equiposUnicos.map(eq => (
              <button key={eq.equipo_id}
                onClick={() => setEquipoFiltro(String(eq.equipo_id))}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  String(equipoFiltro) === String(eq.equipo_id)
                    ? "bg-emerald-600 text-white"
                    : "bg-neutral-800 text-neutral-400 hover:text-white"
                }`}>
                {eq.equipo_id === "todos" ? "Todos" : `${getIcono(eq.tipo)} ${eq.marca} ${eq.modelo}`}
              </button>
            ))}
          </div>
        )}

        {/* Sin datos */}
        {equipos.length === 0 && ventas.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/15 p-10 text-center">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-neutral-300 text-lg">Este cliente no tiene historial registrado.</p>
          </div>
        )}

        {/* Lista de equipos */}
        <div className="space-y-6">
          {equiposMostrados.map(eq => (
            <div key={eq.equipo_id} className="bg-neutral-800/40 border border-white/10 rounded-2xl overflow-hidden">

              {/* Header del equipo */}
              <div className="flex items-center justify-between gap-3 px-4 py-3 bg-neutral-800/60 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getIcono(eq.tipo)}</span>
                  <div>
                    <p className="font-semibold text-white">{eq.marca} {eq.modelo}</p>
                    <p className="text-xs text-neutral-500 uppercase">{eq.tipo} · ID {eq.equipo_id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">{eq.ordenes.length} ingreso{eq.ordenes.length !== 1 ? "s" : ""}</span>
                  <Link to={`/equipos/${eq.equipo_id}`}
                    className="px-2 py-1 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-xs text-white transition-colors">
                    Ver detalle
                  </Link>
                </div>
              </div>

              {/* Órdenes de trabajo */}
              <div className="divide-y divide-white/5">
                {eq.ordenes.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-neutral-500">Sin órdenes de trabajo registradas.</p>
                ) : (
                  eq.ordenes.map(ot => {
                    const facturables = ot.presupuestos.filter(cuentaComoFacturado);
                    const totalOT = facturables.reduce((acc, p) => acc + Number(p.total || 0), 0);
                    const costoOT = facturables.reduce((acc, p) => acc + Number(p.costo || 0), 0);

                    return (
                      <div key={ot.orden_trabajo_id} className="px-4 py-4 space-y-3">
                        {/* Info OT */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full border ${estadoBadge(ot.estado_ingreso_nombre)}`}>
                                {ot.estado_ingreso_nombre || "Sin estado"}
                              </span>
                              <span className="text-xs text-neutral-500">
                                OT #{ot.orden_trabajo_id}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-white mt-1 line-clamp-2">
                              {ot.falla_reportada || "Sin falla registrada"}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
                              <span>Ingreso: <span className="text-neutral-300">{formatDate(ot.fecha_ingreso)}</span></span>
                              {ot.fecha_egreso && (
                                <span>Egreso: <span className="text-neutral-300">{formatDate(ot.fecha_egreso)}</span></span>
                              )}
                            </div>
                          </div>

                          {/* Balance de la OT */}
                          {ot.presupuestos.length > 0 && (
                            <div className="text-right flex-shrink-0">
                              <p className="text-xs text-neutral-500">Balance OT</p>
                              <p className={`text-sm font-bold ${(totalOT - costoOT) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                {formatCurrency(totalOT - costoOT)}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Presupuestos */}
                        {ot.presupuestos.length > 0 && (
                          <div className="ml-2 space-y-2">
                            {ot.presupuestos.map(p => (
                              <div key={p.presupuesto_id}
                                className="bg-neutral-900/50 border border-white/5 rounded-lg px-3 py-2.5 flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${estadoBadge(p.estado_presupuesto_nombre)}`}>
                                      {p.estado_presupuesto_nombre || "Sin estado"}
                                    </span>
                                    <span className="text-xs text-neutral-500">
                                      {formatDate(p.fecha_presupuesto)}
                                    </span>
                                  </div>
                                  {p.observaciones && (
                                    <p className="text-xs text-neutral-400 mt-1 line-clamp-1">{p.observaciones}</p>
                                  )}
                                </div>
                                <div className="text-right flex-shrink-0 space-y-0.5">
                                  <p className="text-xs text-neutral-500">
                                    Costo: <span className="text-red-300">{formatCurrency(p.costo)}</span>
                                  </p>
                                  <p className="text-sm font-semibold text-green-300">
                                    {formatCurrency(p.total)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {ot.presupuestos.length === 0 && (
                          <p className="text-xs text-neutral-600 ml-2">Sin presupuestos registrados.</p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Ventas del cliente */}
        {ventas.length > 0 && equipoFiltro === "todos" && (
          <div className="bg-neutral-800/40 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-4 py-3 bg-neutral-800/60 border-b border-white/10">
              <p className="font-semibold text-white">🛒 Ventas</p>
              {totales.venSaldo > 0 && (
                <span className="text-xs text-red-300">Saldo pendiente: {formatCurrency(totales.venSaldo)}</span>
              )}
            </div>
            <div className="divide-y divide-white/5">
              {ventas.map((v) => {
                const anulada = !VENTA_ACTIVA.has(Number(v.estado_id));
                return (
                  <div key={v.id} className={`px-4 py-3 ${anulada ? "opacity-50" : ""}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className="text-neutral-500">Venta #{v.id}</span>
                          <span className="text-neutral-400">{formatDate(v.fecha)}</span>
                          <span className="px-2 py-0.5 rounded-full bg-neutral-700/60 text-neutral-300">
                            {v.canal === "web_shop" ? "Web" : "Local"}
                          </span>
                          {anulada && (
                            <span className="px-2 py-0.5 rounded-full bg-red-600/20 text-red-300">
                              {v.estado?.nombre || "Anulada"}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-300 mt-1 line-clamp-2">
                          {(v.detalle_venta || [])
                            .map((d) => `${d.cantidad}× ${d.producto?.nombre ?? "Producto"}`)
                            .join(" · ") || "Sin productos"}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-green-300">{formatCurrency(v.total)}</p>
                        {Number(v.descuento) > 0 && (
                          <p className="text-[11px] text-amber-300">desc. {formatCurrency(v.descuento)}</p>
                        )}
                        {Number(v.saldo) > 0 && !anulada && (
                          <p className="text-[11px] text-red-300">saldo {formatCurrency(v.saldo)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default HistorialClientePage;