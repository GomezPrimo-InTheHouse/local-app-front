


// import { useEffect, useState, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getHistorialEquipo, getHistorialCliente } from "../api/HistorialApi.jsx";
// import { getClienteById } from "../api/ClienteApi.jsx";
// import { ArrowLeft, User, Smartphone, Wrench, CalendarDays, BadgeCheck } from "lucide-react";

// export default function Historial() {
//   const { id, clienteId } = useParams(); // puede venir equipo_id o cliente_id
//   const navigate = useNavigate();

//   const [historial, setHistorial] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [cliente, setCliente] = useState(null);

//   // 🔹 Lógica de carga de historial (equipo o cliente)
//   useEffect(() => {
//     (async () => {
//       try {
//         let data;
//         if (clienteId) {
//           // Historial de CLIENTE
//           data = await getHistorialCliente(clienteId);
//           // si la API devuelve un array, lo normalizamos a { equipos: [...] }
//           if (Array.isArray(data)) data = { cliente_id: clienteId, equipos: data };
//         } else {
//           // Historial de EQUIPO
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

//   // 🔹 Cargar info del cliente
//   useEffect(() => {
//     (async () => {
//       try {
//         const cid = clienteId || historial?.cliente_id;
//         if (!cid) return;
//         const data = await getClienteById(cid);
//         setCliente(data);
//       } catch (error) {
//         console.error("Error obteniendo cliente:", error);
//       }
//     })();
//   }, [clienteId, historial]);

//   // 🔹 Derivados
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


//   // 🔻 INTERFAZ SIN CAMBIOS (idéntica a tu versión actual) 🔻
//   if (loading) {
//     return (
//       <div className="min-h-screen w-screen bg-neutral-900 text-white">
//         <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-900/80 backdrop-blur">
//           <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <User className="size-5" />
//               <h2 className="text-lg font-semibold">Cargando historial…</h2>
//             </div>
//             <button onClick={() => navigate(backHref)} className="btn btn-ghost">
//               <ArrowLeft className="size-4" /> Volver a Detalle
//             </button>
//           </div>
//         </header>
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
//           <p className="text-neutral-400 mb-4">Todavía no registraste ingresos ni presupuestos asociados.</p>
//           <button onClick={() => navigate(backHref)} className="btn btn-primary">
//             <ArrowLeft className="size-4" /> Volver a Detalle
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
//             <ArrowLeft className="size-4" /> Volver a Detalle
//           </button>
//         </div>
//       </header>

//       <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
//         {/* KPIs debajo del encabezado */}
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
//             <p className="mt-1 text-2xl font-semibold">{stats.sumTotal.toLocaleString("es-AR")}</p>
//           </div>
//           <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
//             <p className="text-xs text-neutral-400">Balance</p>
//             <p className="mt-1 text-2xl font-semibold">{(stats.sumTotal - stats.sumCosto).toLocaleString("es-AR")}</p>
//           </div>
//         </section>

//         {/* Sección equipos */}
//         {equipos.map((equipo) => (
//           <section key={equipo.equipo_id} className="rounded-2xl border border-white/10 bg-neutral-800/60 p-5 shadow-soft">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-white/10 pb-3 mb-4">
//               <div className="flex items-center gap-3">
//                 <div className="size-9 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
//                   <Smartphone className="size-5 text-brand-200" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold">Equipo #{equipo.equipo_id} — {equipo?.marca} {equipo?.modelo}</h3>
//                   <p className="text-sm text-neutral-400">Tipo: {equipo?.tipo} · Problema: {equipo?.problema}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2 text-xs text-neutral-300">
//                 <BadgeCheck className="size-4" /> {equipo?.ingresos?.length || 0} ingresos
//               </div>
//             </div>

//             <div className="space-y-4">
//               {(equipo.ingresos || []).map((ingreso) => (
//                 <article key={ingreso.ingreso_id} className="rounded-xl border border-white/10 bg-neutral-900/50 p-4">
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                     <div className="md:col-span-2">
//                       <div className="flex items-center gap-2 font-semibold">
//                         <Wrench className="size-4 text-white/70" /> Ingreso #{ingreso.ingreso_id}
//                       </div>
//                       <div className="mt-2 space-y-1 text-sm text-neutral-300">
//                         <div className="flex items-center gap-2"><CalendarDays className="size-4 text-white/50" /> Fecha ingreso: <span className="ml-1 font-medium text-white">{ingreso.fecha_ingreso}</span></div>
//                         <div className="flex items-center gap-2"><CalendarDays className="size-4 text-white/50" /> Fecha egreso: <span className="ml-1 font-medium text-white">{ingreso.fecha_egreso || "Aún no egresado"}</span></div>
//                       </div>
//                     </div>

//                     <div className="md:col-span-2">
//                       <h4 className="text-sm font-semibold mb-2">Presupuestos</h4>
//                       {(!ingreso.presupuestos || ingreso.presupuestos.length === 0) ? (
//                         <p className="text-sm text-neutral-400">No hay presupuestos.</p>
//                       ) : (
//                         <div className="grid gap-3 sm:grid-cols-2">
//                           {ingreso.presupuestos.map((p) => (
//                             <div key={p.presupuesto_id} className="rounded-lg border border-white/10 bg-white/5 p-3">
//                               <div className="flex items-center justify-between">
//                                 <p className="text-sm font-semibold">Presupuesto #{p.presupuesto_id}</p>
//                               </div>
//                               <div className="mt-1 text-xs text-neutral-300">
//                                 <p>Fecha: <span className="text-white">{p.fecha}</span></p>
//                                 <p>Costo: <span className="text-white">{p.costo}</span></p>
//                                 <p>Total: <span className="text-white">{p.total}</span></p>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </article>
//               ))}
//             </div>
//           </section>
//         ))}
//       </main>
//     </div>
//   );
// }


import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHistorialEquipo, getHistorialCliente } from "../api/HistorialApi.jsx";
import { getClienteById } from "../api/ClienteApi.jsx";
import { ArrowLeft, User, Smartphone, Wrench, CalendarDays, BadgeCheck } from "lucide-react";

// ✅ Helpers locales (para evitar errores)
function fmtDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function fmtMoney(value) {
  if (value == null || isNaN(value)) return "$0";
  return value.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  });
}

// Asigna clases según el estado
function chipClasses(estado) {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  switch (estado?.toLowerCase()) {
    case "pendiente":
      return `${base} bg-yellow-500/20 text-yellow-300`;
    case "finalizado":
      return `${base} bg-green-500/20 text-green-300`;
    case "cancelado":
      return `${base} bg-red-500/20 text-red-300`;
    default:
      return `${base} bg-white/10 text-white/80`;
  }
}

export default function Historial() {
  const { id, clienteId } = useParams();
  const navigate = useNavigate();

  const [historial, setHistorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cliente, setCliente] = useState(null);

  const normalizeFromCliente = (raw, cid) => {
    if (!raw) return null;
    if (typeof raw === "object" && raw !== null && Array.isArray(raw.equipos)) return raw;
    if (Array.isArray(raw)) return { cliente_id: cid, equipos: raw };
    return { cliente_id: cid, equipos: raw?.equipos ?? [] };
  };

  useEffect(() => {
    (async () => {
      try {
        let data;
        if (clienteId) {
          data = await getHistorialCliente(clienteId);
          data = normalizeFromCliente(data, clienteId);
        } else {
          data = await getHistorialEquipo(id);
        }
        setHistorial(data);
      } catch (error) {
        console.error("Error obteniendo historial:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, clienteId]);

  useEffect(() => {
    (async () => {
      const cid = clienteId || historial?.cliente_id;
      if (!cid) return;
      try {
        const data = await getClienteById(cid);
        setCliente(data);
      } catch (error) {
        console.error("Error obteniendo cliente:", error);
      }
    })();
  }, [clienteId, historial]);

  const equipos = historial?.equipos ?? [];

  const tituloCliente = useMemo(() => {
    if (!cliente) return "Cliente";
    const nombre = [cliente?.nombre, cliente?.apellido].filter(Boolean).join(" ");
    return `${nombre || "Cliente"} (ID: ${cliente?.id ?? "—"})`;
  }, [cliente]);

  const stats = useMemo(() => {
    const equiposArr = equipos;
    const equiposCount = equiposArr.length;
    let ingresosCount = 0;
    let presupuestosCount = 0;
    let sumCosto = 0;
    let sumTotal = 0;

    for (const eq of equiposArr) {
      for (const ing of (eq.ingresos || [])) {
        ingresosCount++;
        for (const p of (ing.presupuestos || [])) {
          presupuestosCount++;
          sumCosto += Number(p?.costo || 0);
          sumTotal += Number(p?.total || 0);
        }
      }
    }

    return {
      equiposCount,
      ingresosCount,
      presupuestosCount,
      sumCosto,
      sumTotal,
      balance: sumTotal - sumCosto,
    };
  }, [equipos]);

  const backHref = clienteId ? `/clientes` : `/equipos/${id}`;
  const handleOpenEquipo = (equipoId) => navigate(`/equipos/${equipoId}`);

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-neutral-900 text-white flex items-center justify-center">
        <p className="text-neutral-400">Cargando historial...</p>
      </div>
    );
  }

  if (!historial || !equipos.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-neutral-900 text-white p-8">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-4 size-12 rounded-2xl bg-white/5 flex items-center justify-center">
            <Smartphone className="size-6 text-white/70" />
          </div>
          <h3 className="text-xl font-semibold mb-1">Sin historial para este cliente</h3>
          <p className="text-neutral-400 mb-4">
            Todavía no registraste ingresos ni presupuestos asociados.
          </p>
          <button onClick={() => navigate(backHref)} className="btn btn-primary">
            <ArrowLeft className="size-4" /> Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-neutral-900 text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-900/80 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="size-5" />
            <h2 className="text-lg font-semibold">Historial de {tituloCliente}</h2>
          </div>
          <button onClick={() => navigate(backHref)} className="btn btn-ghost">
            <ArrowLeft className="size-4" /> Volver
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-neutral-400">Equipos del cliente</p>
            <p className="mt-1 text-2xl font-semibold">{stats.equiposCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-neutral-400">Ingresos registrados</p>
            <p className="mt-1 text-2xl font-semibold">{stats.ingresosCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-neutral-400">Ingresos (ARS)</p>
            <p className="mt-1 text-2xl font-semibold">{fmtMoney(stats.sumTotal)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-neutral-400">Balance</p>
            <p className="mt-1 text-2xl font-semibold">{fmtMoney(stats.balance)}</p>
          </div>
        </section>

        {equipos.map((equipo) => (
          <section
            key={equipo.equipo_id}
            onClick={() => handleOpenEquipo(equipo.equipo_id)}
            className="rounded-2xl border border-white/10 bg-neutral-800/60 p-5 shadow-soft cursor-pointer transition hover:bg-neutral-800 hover:border-white/20"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
                  <Smartphone className="size-5 text-brand-200" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    Equipo #{equipo.equipo_id} — {equipo?.marca} {equipo?.modelo}
                  </h3>
                  <p className="text-sm text-neutral-400">
                    Tipo: {equipo?.tipo} · Problema: {equipo?.problema}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <BadgeCheck className="size-4" /> {equipo?.ingresos?.length || 0} ingresos
              </div>
            </div>

            <div className="space-y-4">
              {(equipo.ingresos || []).map((ingreso) => {
                const tienePresupuestos =
                  Array.isArray(ingreso.presupuestos) && ingreso.presupuestos.length > 0;

                return (
                  <article
                    key={ingreso.ingreso_id}
                    className={
                      `rounded-xl border p-4 transition ` +
                      (tienePresupuestos
                        ? `border-white/10 bg-neutral-900/50`
                        : `border-red-500/30 bg-red-500/10`)
                    }
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-2 font-semibold">
                          <Wrench className="size-4 text-white/70" /> Ingreso #{ingreso.ingreso_id}
                        </div>
                        <div className="mt-2 space-y-1 text-sm text-neutral-300">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="size-4 text-white/50" /> Fecha ingreso:
                            <span className="ml-1 font-medium text-white">
                              {fmtDate(ingreso.fecha_ingreso)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarDays className="size-4 text-white/50" /> Fecha egreso:
                            <span className="ml-1 font-medium text-white">
                              {ingreso.fecha_egreso
                                ? fmtDate(ingreso.fecha_egreso)
                                : "Aún no egresado"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            Estado:
                            <span className={chipClasses(ingreso?.estado?.nombre)}>
                              {ingreso?.estado?.nombre || "—"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <h4 className="text-sm font-semibold mb-2">Presupuestos</h4>
                        {!tienePresupuestos ? (
                          <p className="text-sm text-red-200">No hay presupuestos.</p>
                        ) : (
                          <div className="grid gap-3 sm:grid-cols-2">
                            {(ingreso.presupuestos || []).map((p) => (
                              <div
                                key={p.presupuesto_id}
                                className="rounded-lg border border-white/10 bg-white/5 p-3"
                              >
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-semibold">
                                    Presupuesto #{p.presupuesto_id}
                                  </p>
                                  <span className={chipClasses(p?.estado?.nombre)}>
                                    {p?.estado?.nombre || "—"}
                                  </span>
                                </div>
                                <div className="mt-1 text-xs text-neutral-300">
                                  <p>Fecha: <span className="text-white">{fmtDate(p.fecha)}</span></p>
                                  <p>Costo: <span className="text-white">{fmtMoney(p.costo)}</span></p>
                                  <p>Total: <span className="text-white">{fmtMoney(p.total)}</span></p>
                                  {p.observaciones && (
                                    <p className="mt-1 italic text-neutral-400">{p.observaciones}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

