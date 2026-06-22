// // src/pages/EquipoPage.jsx
// import { useState, useEffect, useMemo, useCallback } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";

// import { getEquipos, updateEquipo, deleteEquipo, getEquiposByTipo, getEquiposByClienteId } from "../api/EquiposApi.jsx";
// import { getBalancesPresupuestos } from "../api/PresupuestoApi.jsx";
// import { getEstados } from "../api/EstadoApi.jsx";

// import SidebarEquipos      from "../components/Equipo/SidebarEquipos.jsx";
// import BuscadorComponent   from "../components/General/BuscadorComponent.jsx";
// import AlertNotification   from "../components/Alerta/AlertNotification.jsx";
// import HistorialPagosModal from "../components/Pagos/HistorialPagosModal.jsx";
// import NuevaOrdenTrabajoModal from "../components/OrdenTrabajo/NuevaOrdenTrabajoModal.jsx";
// import EquipoModal         from "../components/Equipo/EquipoModal.jsx";

// // --- Iconos ---
// const IconMoney       = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);
// const IconHistory     = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
// const IconLaptop      = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9.75 21M12.75 21L12.75 17M12.75 17L12.75 21M9.75 17L6 21M18.75 21L15 17M18.75 17h.008v.008h-.008v-.008zM12 11V6a2 2 0 012-2h4a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2v-10a2 2 0 012-2h4z" /></svg>);
// const IconUser        = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
// const IconClock       = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
// const IconTrendingUp  = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>);
// const IconMapPin      = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
// const IconPhone       = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>);
// const IconAlertTriangle = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M6.832 20h10.336A2.973 2.973 0 0021 17.027V6.973A2.973 2.973 0 0017.168 4H6.832A2.973 2.973 0 003 6.973v10.054A2.973 2.973 0 006.832 20z" /></svg>);

// const EquipoPage = () => {
//   const [filtro, setFiltro]               = useState("todos");
//   const [equipos, setEquipos]             = useState([]);
//   const [loading, setLoading]             = useState(true);
//   const [alert, setAlert]                 = useState({ message: "", type: "success" });
//   const [estados, setEstados]             = useState([]);
//   const [balances, setBalances]           = useState([]);
//   const [mostrarBalances, setMostrarBalances] = useState(false);

//   // ── filtro local por equipo (marca/modelo/tipo) ──
//   const [filtroEquipo, setFiltroEquipo]   = useState("");

//   // ── modales ──
//   const [isNuevaOTOpen, setIsNuevaOTOpen]       = useState(false);
//   const [isEquipoModalOpen, setIsEquipoModalOpen] = useState(false);
//   const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
//   const [isHistorialOpen, setIsHistorialOpen]     = useState(false);
//   const [clienteHistorial, setClienteHistorial]   = useState({ id: null, nombre: "" });

//   const navigate = useNavigate();

//   const formatPrice = (price) =>
//     Number(price || 0).toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

//   const formatDateShort = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return "N/A";
//     return date.toLocaleDateString("es-AR", { year: "numeric", month: "2-digit", day: "2-digit" });
//   };

//   // ── fetch equipos ──
//   const fetchEquipos = useCallback(async () => {
//     setLoading(true);
//     try {
//       const data = await getEquipos();
//       setEquipos(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Error al obtener equipos:", err);
//       setEquipos([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await getBalancesPresupuestos();
//         setBalances(res.data || []);
//       } catch (error) { console.error("Error al traer balances:", error); }
//     })();
//   }, []);

//   const balanceByEquipoId = useMemo(() => {
//     const map = {};
//     for (const b of balances) map[b.equipo_id] = b;
//     return map;
//   }, [balances]);

//   const totalBalanceGeneral = useMemo(
//     () => balances.reduce((acc, b) => acc + (b?.balance_final ?? 0), 0),
//     [balances]
//   );

//   useEffect(() => {
//     (async () => {
//       const lista = await getEstados();
//       setEstados(lista);
//     })();
//   }, []);

//   const getNombreEstado = (id) => {
//     const estado = estados.find(e => e.id === id);
//     return estado ? estado.nombre : "Desconocido";
//   };

//   useEffect(() => { fetchEquipos(); }, [fetchEquipos]);

//   // ── handlers modales ──
//   const handleAbrirHistorial = (clienteId, nombreCompleto) => {
//     setClienteHistorial({ id: clienteId, nombre: nombreCompleto });
//     setIsHistorialOpen(true);
//   };

//   const handleCerrarHistorial = () => {
//     setIsHistorialOpen(false);
//     setClienteHistorial({ id: null, nombre: "" });
//     fetchEquipos();
//   };

//   const handleAgregar = () => setIsNuevaOTOpen(true);

//   const handleModificar = (equipo) => {
//     setEquipoSeleccionado(equipo);
//     setIsEquipoModalOpen(true);
//   };

//   const handleDelete = async (id) => {
//     Swal.fire({
//       title: "¿Eliminar equipo?",
//       text: "Esta acción dará de baja el equipo y sus órdenes asociadas.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Sí, eliminar",
//       cancelButtonText: "Cancelar",
//       customClass: {
//         popup: "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
//         title: "text-xl font-bold",
//         htmlContainer: "text-gray-300",
//         confirmButton: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
//         cancelButton: "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500",
//       },
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         await deleteEquipo(id);
//         await fetchEquipos();
//         setAlert({ message: "✅ Equipo eliminado correctamente", type: "success" });
//       }
//     });
//   };

//   const handleSubmitEquipo = async (formData) => {
//     const payload = {
//       tipo:       String(formData.tipo  || "").trim(),
//       marca:      String(formData.marca || "").trim(),
//       modelo:     String(formData.modelo || "").trim(),
//       imei:       formData.imei || null,
//       cliente_id: Number(formData.cliente_id),
//       estado_id:  Number(formData.estado_id),
//     };
//     try {
//       await updateEquipo(equipoSeleccionado.id, payload);
//       setAlert({ message: "✅ Equipo actualizado correctamente", type: "success" });
//       await fetchEquipos();
//     } catch (err) {
//       console.error("Error al actualizar equipo:", err);
//       setAlert({ message: "❌ Error al actualizar el equipo", type: "error" });
//     } finally {
//       setIsEquipoModalOpen(false);
//       setEquipoSeleccionado(null);
//     }
//   };

//   const handleFiltro = async (tipo) => {
//     setFiltro(tipo);
//     setFiltroEquipo(""); // limpiar filtro local al cambiar tipo
//     setLoading(true);
//     try {
//       if (tipo === "todos") {
//         await fetchEquipos();
//       } else if (tipo === "otros") {
//         const todos = await getEquipos();
//         setEquipos(todos.filter(eq =>
//           eq.tipo?.toLowerCase() !== "celular" &&
//           eq.tipo?.toLowerCase() !== "notebook" &&
//           eq.tipo?.toLowerCase() !== "pc"
//         ));
//       } else {
//         const data = await getEquiposByTipo(tipo);
//         setEquipos(Array.isArray(data) ? data : []);
//       }
//     } finally { setLoading(false); }
//   };

//   // ── filtro local por marca/modelo/tipo ──
//   const equiposFiltrados = useMemo(() => {
//     if (!filtroEquipo.trim()) return equipos;
//     const q = filtroEquipo.toLowerCase();
//     return equipos.filter(eq =>
//       eq.marca?.toLowerCase().includes(q)  ||
//       eq.modelo?.toLowerCase().includes(q) ||
//       eq.tipo?.toLowerCase().includes(q)
//     );
//   }, [equipos, filtroEquipo]);

//   // ── agrupación por mes usando equiposFiltrados ──
//   const equiposAgrupadosPorMes = useMemo(() => {
//     const grupos = equiposFiltrados.reduce((acc, eq) => {
//       const fecha = eq.fecha_ingreso ? new Date(eq.fecha_ingreso) : null;

//       let key = "Sin fecha", sortKey = "9999-12";
//       if (fecha && !isNaN(fecha.getTime())) {
//         const year  = fecha.getFullYear();
//         const month = String(fecha.getMonth() + 1).padStart(2, "0");
//         sortKey = `${year}-${month}`;
//         key = `${fecha.toLocaleString("es-AR", { month: "long" })} ${year}`;
//       }

//       const balanceData = balanceByEquipoId[eq.id];
//       if (!acc[sortKey]) acc[sortKey] = { label: key, equipos: [], totalCosto: 0, totalVenta: 0, totalBalance: 0 };
//       acc[sortKey].equipos.push(eq);
//       acc[sortKey].totalCosto   += balanceData?.costo_total   ?? 0;
//       acc[sortKey].totalVenta   += balanceData?.total_total   ?? 0;
//       acc[sortKey].totalBalance += balanceData?.balance_final ?? 0;
//       return acc;
//     }, {});

//     return Object.entries(grupos).sort(([keyA], [keyB]) => {
//       if (keyA === "9999-12") return 1;
//       if (keyB === "9999-12") return -1;
//       return keyB.localeCompare(keyA);
//     });
//   }, [equiposFiltrados, balanceByEquipoId]);

//   return (
//     <div className="min-h-dvh w-screen bg-neutral-900 text-white/95 overflow-hidden">
//       <div className="px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-0 md:gap-6 w-full">

//           {/* SIDEBAR */}
//           <aside className="md:sticky md:top-4 md:h-[calc(100vh-2rem)] overflow-y-auto px-3 sm:px-4 py-4 border-b md:border-b-0 md:border-r border-white/10 [scrollbar-width:thin] bg-transparent">
//             <div className="space-y-4">
//               <button onClick={handleAgregar}
//                 className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-base font-semibold tracking-wide transition-all duration-200 shadow-xl shadow-emerald-900/50">
//                 ➕ Nueva Orden de Trabajo
//               </button>

//               <div className="rounded-2xl border border-white/10 bg-neutral-800/70 p-4 sm:p-5 shadow-sm text-sm leading-6 [&_*]:!max-w-none [&_*]:mx-0 [&_*]:text-left [&_h1]:text-base [&_h2]:text-base [&_h3]:text-sm [&_p]:text-sm [&_small]:text-xs [&_.flex]:items-stretch [&_.flex]:justify-start [&_.grid]:grid-cols-1 [&_.grid]:gap-2 [&_button]:w-full [&_button]:h-11 [&_button]:rounded-lg [&_button]:px-3 [&_button]:text-sm [&_button]:inline-flex [&_button]:items-center [&_button]:justify-start [&_a]:w-full [&_a]:h-11 [&_a]:rounded-lg [&_a]:px-3 [&_a]:text-sm [&_a]:inline-flex [&_a]:items-center [&_a]:justify-start [&_li]:mb-2 [&_li:last-child]:mb-0">
//                 <SidebarEquipos filtro={filtro} handleFiltro={handleFiltro} handleAgregar={handleAgregar} />
//               </div>

//               <div className="rounded-2xl border border-white/10 bg-neutral-800/40 p-4 sm:p-5">
//                 <p className="text-xs text-neutral-300/80 leading-5">
//                   Agrupamos por <b>mes de ingreso</b> y mostramos el <b>balance mensual</b>.
//                 </p>
//               </div>
//             </div>
//           </aside>

//           {/* MAIN */}
//           <main className="md:h-[100svh] md:overflow-y-auto">
//             <div className="sticky top-0 z-10 px-3 sm:px-4 py-3 backdrop-blur bg-neutral-900/85 border-b border-white/10">
//               <div className="flex items-center justify-between gap-2">
//                 <h3 className="text-base sm:text-lg font-semibold">Lista de Equipos</h3>
//                 <div className="flex items-center gap-2">
//                   {filtroEquipo && (
//                     <span className="text-xs text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded-lg">
//                       Filtrando: "{filtroEquipo}" · {equiposFiltrados.length} resultados
//                     </span>
//                   )}
//                   <button onClick={() => setMostrarBalances(v => !v)}
//                     className="px-3 py-1.5 rounded-lg bg-neutral-800/70 hover:bg-neutral-800 border border-white/10 text-[12px] sm:text-sm">
//                     {mostrarBalances ? "Ocultar montos" : "Mostrar montos"}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="px-3 sm:px-4 py-4 space-y-6">

//               {/* Buscador + Balance global */}
//               <section className="rounded-2xl border border-white/10 bg-neutral-800/40 p-3 sm:p-4">
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
//                   <div className="lg:col-span-2">
//                     <BuscadorComponent
//                       onBuscar={async (clienteId) => {
//                         setLoading(true);
//                         setFiltroEquipo(""); // limpiar filtro equipo al buscar por cliente
//                         try {
//                           if (!clienteId) { await fetchEquipos(); }
//                           else {
//                             const data = await getEquiposByClienteId(clienteId);
//                             setEquipos(Array.isArray(data) ? data : []);
//                           }
//                         } finally { setLoading(false); }
//                       }}
//                       onBuscarEquipo={(texto) => setFiltroEquipo(texto)}
//                     />
//                   </div>
//                   <div className="rounded-xl border border-white/10 bg-neutral-900/40 p-3 flex items-center justify-between">
//                     <span className="text-sm text-neutral-300 flex items-center gap-2"><IconMoney /> Balance GLOBAL</span>
//                     <span className={`text-xl font-semibold ${totalBalanceGeneral >= 0 ? "text-emerald-400" : "text-red-400"}`}>
//                       {mostrarBalances ? "******" : `$${formatPrice(totalBalanceGeneral)}`}
//                     </span>
//                   </div>
//                 </div>
//               </section>

//               {/* Balance por mes */}
//               {equiposAgrupadosPorMes.length > 0 && (
//                 <section className="pt-2">
//                   <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
//                     <IconTrendingUp /> Balance de Ingresos por Mes
//                   </h2>
//                   <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto shadow-lg">
//                     <table className="min-w-full divide-y divide-neutral-800">
//                       <thead className="bg-neutral-800/80">
//                         <tr>
//                           {["Mes", "Venta Total", "Costo Total", "Balance Neto"].map(h => (
//                             <th key={h} className={`px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider ${h === "Mes" ? "text-left" : "text-right"}`}>{h}</th>
//                           ))}
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-neutral-800">
//                         {equiposAgrupadosPorMes.map(([key, data]) => (
//                           <tr key={key} className="hover:bg-neutral-800/50 transition duration-150">
//                             <td className="px-6 py-4 text-sm font-medium text-white capitalize">{data.label}</td>
//                             <td className="px-6 py-4 text-sm text-right text-green-300">{mostrarBalances ? "****" : `$${formatPrice(data.totalVenta)}`}</td>
//                             <td className="px-6 py-4 text-sm text-right text-red-300">{mostrarBalances ? "****" : `-$${formatPrice(data.totalCosto)}`}</td>
//                             <td className={`px-6 py-4 text-sm font-semibold text-right ${data.totalBalance >= 0 ? "text-emerald-400" : "text-red-400"}`}>
//                               {mostrarBalances ? "****" : `$${formatPrice(data.totalBalance)}`}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </section>
//               )}

//               {/* Lista de equipos */}
//               <section className="py-4">
//                 {loading ? (
//                   <p className="text-neutral-400 px-1">Cargando equipos...</p>
//                 ) : equiposAgrupadosPorMes.length === 0 ? (
//                   <div className="rounded-xl border border-dashed border-white/15 p-8 text-center bg-white/5">
//                     <p className="text-neutral-300 text-lg">
//                       {filtroEquipo ? `No hay equipos que coincidan con "${filtroEquipo}"` : "Aún no hay equipos cargados."}
//                     </p>
//                     {filtroEquipo && (
//                       <button onClick={() => setFiltroEquipo("")}
//                         className="mt-3 text-sm text-emerald-400 hover:underline">
//                         Limpiar filtro
//                       </button>
//                     )}
//                   </div>
//                 ) : (
//                   equiposAgrupadosPorMes.map(([, data]) => {
//                     const { label: mes, equipos: equiposMes } = data;
//                     return (
//                       <div key={mes} className="mb-8">
//                         <div className="border-b border-white/10 pb-2 mb-6">
//                           <h4 className="text-2xl font-extrabold text-white capitalize">{mes}</h4>
//                           <p className="text-sm text-gray-500">{equiposMes.length} equipo{equiposMes.length !== 1 ? "s" : ""} ingresado{equiposMes.length !== 1 ? "s" : ""}.</p>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                           {equiposMes.map(eq => {
//                             const balance       = balanceByEquipoId[eq.id];
//                             const costoTotal    = balance?.costo_total   ?? 0;
//                             const ventaTotal    = balance?.total_total   ?? 0;
//                             const balanceNeto   = balance?.balance_final ?? 0;
//                             const estadoNombre  = getNombreEstado(eq.estado_id);
//                             const clienteNombre = `${eq.cliente_nombre || "Anónimo"} ${eq.cliente_apellido || ""}`.trim();

//                             return (
//                               <div key={eq.id} className="bg-neutral-900 p-5 rounded-xl border border-neutral-800 shadow-xl hover:border-purple-600/50 hover:shadow-purple-900/20 transition duration-200 space-y-4 flex flex-col justify-between">

//                                 {/* Header equipo */}
//                                 <div className="flex justify-between items-start pb-2 border-b border-neutral-800/50">
//                                   <div>
//                                     <p className="text-lg font-extrabold text-purple-400 flex items-center gap-2">
//                                       <IconLaptop /> {eq.marca} {eq.modelo}
//                                     </p>
//                                     <p className="text-xs font-light text-neutral-400 uppercase">{eq.tipo} | ID: {eq.id}</p>
//                                     {eq.imei && <p className="text-xs text-neutral-500 mt-0.5">IMEI: {eq.imei}</p>}
//                                   </div>
//                                   <span className={`px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ${
//                                     estadoNombre.includes("Finalizado") ? "bg-emerald-600/20 text-emerald-400" :
//                                     estadoNombre.includes("Pendiente")  ? "bg-yellow-600/20 text-yellow-400" :
//                                     "bg-neutral-700/20 text-neutral-300"
//                                   }`}>
//                                     {estadoNombre}
//                                   </span>
//                                 </div>

//                                 {/* Última falla */}
//                                 <div className="space-y-2">
//                                   <div className="flex items-start gap-2 text-sm">
//                                     <span className="text-red-400/80 mt-0.5 flex-shrink-0"><IconAlertTriangle /></span>
//                                     <div>
//                                       <span className="text-neutral-300 font-semibold text-xs leading-none block">Última falla:</span>
//                                       <span className="font-light text-neutral-400 text-xs leading-tight line-clamp-3">
//                                         {eq.ultima_falla || "Sin registro"}
//                                       </span>
//                                     </div>
//                                   </div>
//                                   <div className="text-neutral-400 text-xs pt-1 border-t border-neutral-800/50 flex items-center gap-2">
//                                     <IconClock /> Ingreso: <span className="font-medium text-white">{formatDateShort(eq.fecha_ingreso)}</span>
//                                   </div>
//                                 </div>

//                                 {/* Cliente */}
//                                 <div className="pt-2 border-t border-neutral-800/50 space-y-1 text-sm">
//                                   <p className="text-neutral-300 font-medium flex items-center gap-2"><IconUser /> {clienteNombre}</p>
//                                   <p className="text-xs text-neutral-500 pl-6 flex items-center gap-2"><IconMapPin />{eq.cliente_direccion || "—"}</p>
//                                   <p className="text-xs text-neutral-500 pl-6 flex items-center gap-2"><IconPhone />{eq.cliente_celular || "—"}</p>
//                                 </div>

//                                 {/* Balances */}
//                                 <div className="pt-3 border-t border-neutral-800 space-y-1">
//                                   <div className="flex justify-between text-xs text-neutral-400">
//                                     <span>Total:</span>
//                                     <span className="font-semibold text-green-300">{mostrarBalances ? "****" : `$${formatPrice(ventaTotal)}`}</span>
//                                   </div>
//                                   <div className="flex justify-between text-xs text-neutral-400">
//                                     <span>Costo:</span>
//                                     <span className="font-semibold text-red-300">{mostrarBalances ? "****" : `-$${formatPrice(costoTotal)}`}</span>
//                                   </div>
//                                   <div className="flex justify-between text-sm font-semibold">
//                                     <span className="text-neutral-300">Balance:</span>
//                                     <span className={balanceNeto >= 0 ? "text-emerald-400" : "text-red-400"}>
//                                       {mostrarBalances ? "****" : `$${formatPrice(balanceNeto)}`}
//                                     </span>
//                                   </div>
//                                 </div>

//                                 {/* Acciones */}
//                                 <div className="pt-4 border-t border-neutral-800">
//                                   <div className="flex gap-2 justify-end md:grid md:grid-cols-4">
//                                     {eq.cliente_id && (
//                                       <button onClick={() => handleAbrirHistorial(eq.cliente_id, clienteNombre)}
//                                         className="bg-purple-600/50 hover:bg-purple-700/70 text-purple-300 w-full px-2 py-1 rounded-lg text-xs transition-colors flex items-center justify-center gap-1">
//                                         <IconHistory /> Historial
//                                       </button>
//                                     )}
//                                     <Link to={`/equipos/${eq.id}`}
//                                       className="bg-neutral-700 hover:bg-neutral-600 text-white w-full px-2 py-1 rounded-lg text-xs transition-colors text-center flex items-center justify-center">
//                                       Detalle
//                                     </Link>
//                                     <button onClick={() => handleModificar(eq)}
//                                       className="bg-indigo-600 hover:bg-indigo-700 text-white w-full px-2 py-1 rounded-lg text-xs">
//                                       Modificar
//                                     </button>
//                                     <button onClick={() => handleDelete(eq.id)}
//                                       className="bg-red-600 hover:bg-red-700 text-white w-full px-2 py-1 rounded-lg text-xs font-medium">
//                                       Eliminar
//                                     </button>
//                                   </div>
//                                 </div>

//                               </div>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     );
//                   })
//                 )}
//               </section>
//             </div>
//           </main>
//         </div>

//         {/* Modales */}
//         <NuevaOrdenTrabajoModal
//           isOpen={isNuevaOTOpen}
//           onClose={() => setIsNuevaOTOpen(false)}
//           onSuccess={(msg) => { setAlert({ message: msg, type: "success" }); fetchEquipos(); }}
//         />

//         <EquipoModal
//           isOpen={isEquipoModalOpen}
//           onClose={() => { setIsEquipoModalOpen(false); setEquipoSeleccionado(null); }}
//           onSubmit={handleSubmitEquipo}
//           equipoSeleccionado={equipoSeleccionado}
//         />

//         <HistorialPagosModal
//           isOpen={isHistorialOpen}
//           onClose={handleCerrarHistorial}
//           clienteId={clienteHistorial.id}
//           clienteNombre={clienteHistorial.nombre}
//         />

//         {alert.message && (
//           <AlertNotification
//             message={alert.message}
//             type={alert.type}
//             duration={4000}
//             onClose={() => setAlert({ message: "", type: "success" })}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default EquipoPage;

// src/pages/EquipoPage.jsx
import { useState, useCallback } from "react";

import { useEquipos }          from "../hooks/UseEquipos.jsx";
import SidebarEquipos          from "../components/Equipo/SidebarEquipos.jsx";
import BuscadorComponent       from "../components/General/BuscadorComponent.jsx";
import AlertNotification       from "../components/Alerta/AlertNotification.jsx";
import HistorialPagosModal     from "../components/Pagos/HistorialPagosModal.jsx";
import NuevaOrdenTrabajoModal  from "../components/OrdenTrabajo/NuevaOrdenTrabajoModal.jsx";
import EquipoModal             from "../components/Equipo/EquipoModal.jsx";
import EquipoBalanceTable      from "../components/Equipo/EquipoBalanceTable.jsx";
import EquipoGrid              from "../components/Equipo/EquipoGrid.jsx";

const formatPrice = (p) =>
  Number(p || 0).toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const IconMoney = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const EquipoPage = () => {
  // ── toda la lógica de datos viene del hook ──
  const {
    loading,
    balanceByEquipoId,
    totalBalanceGeneral,
    equiposAgrupadosPorMes,
    filtro,
    filtroEquipo,
    setFiltroEquipo,
    alert,
    setAlert,
    getNombreEstado,
    refrescar,
    handleFiltro,
    buscarPorCliente,
    handleDelete,
    handleSubmitEquipo,
  } = useEquipos();

  // ── estado local de UI (solo modales y toggles) ──
  const [mostrarBalances, setMostrarBalances] = useState(false);

  // Modal Nueva OT
  const [isNuevaOTOpen, setIsNuevaOTOpen]           = useState(false);
  const [equipoPreseleccionado, setEquipoPreseleccionado] = useState(null);

  // Modal Modificar Equipo
  const [isEquipoModalOpen, setIsEquipoModalOpen]   = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

  // Modal Historial
  const [isHistorialOpen, setIsHistorialOpen]       = useState(false);
  const [clienteHistorial, setClienteHistorial]     = useState({ id: null, nombre: "" });

  // ── handlers de modales ──
  const handleAgregar = useCallback(() => {
    setEquipoPreseleccionado(null);
    setIsNuevaOTOpen(true);
  }, []);

  // Nueva OT desde la card (equipo ya seleccionado)
  const handleNuevaOTDesdeCard = useCallback((eq) => {
    setEquipoPreseleccionado(eq);
    setIsNuevaOTOpen(true);
  }, []);

  const handleModificar = useCallback((eq) => {
    setEquipoSeleccionado(eq);
    setIsEquipoModalOpen(true);
  }, []);

  const handleCerrarEquipoModal = useCallback(() => {
    setIsEquipoModalOpen(false);
    setEquipoSeleccionado(null);
  }, []);

  const handleAbrirHistorial = useCallback((clienteId, nombre) => {
    setClienteHistorial({ id: clienteId, nombre });
    setIsHistorialOpen(true);
  }, []);

  const handleCerrarHistorial = useCallback(() => {
    setIsHistorialOpen(false);
    setClienteHistorial({ id: null, nombre: "" });
    refrescar();
  }, [refrescar]);

  const handleSubmitEquipoModal = useCallback(async (formData) => {
    if (!equipoSeleccionado) return;
    const ok = await handleSubmitEquipo(equipoSeleccionado.id, formData);
    if (ok) handleCerrarEquipoModal();
  }, [equipoSeleccionado, handleSubmitEquipo, handleCerrarEquipoModal]);

  return (
    <div className="min-h-dvh w-screen bg-neutral-900 text-white/95 overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-0 md:gap-6 w-full">

          {/* ── SIDEBAR ── */}
          <aside className="
            md:sticky md:top-4 md:h-[calc(100vh-2rem)]
            overflow-y-auto px-3 sm:px-4 py-4
            border-b md:border-b-0 md:border-r border-white/10
            [scrollbar-width:thin] bg-transparent
          ">
            <div className="space-y-4">
              <button
                onClick={handleAgregar}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-base font-semibold tracking-wide transition-all duration-200 shadow-xl shadow-emerald-900/50"
              >
                ➕ Nueva Orden de Trabajo
              </button>

              <div className="rounded-2xl border border-white/10 bg-neutral-800/70 p-4 sm:p-5 shadow-sm text-sm leading-6
                [&_*]:!max-w-none [&_*]:mx-0 [&_*]:text-left
                [&_h1]:text-base [&_h2]:text-base [&_h3]:text-sm [&_p]:text-sm [&_small]:text-xs
                [&_.flex]:items-stretch [&_.flex]:justify-start
                [&_.grid]:grid-cols-1 [&_.grid]:gap-2
                [&_button]:w-full [&_button]:h-11 [&_button]:rounded-lg [&_button]:px-3 [&_button]:text-sm
                [&_button]:inline-flex [&_button]:items-center [&_button]:justify-start
                [&_a]:w-full [&_a]:h-11 [&_a]:rounded-lg [&_a]:px-3 [&_a]:text-sm
                [&_a]:inline-flex [&_a]:items-center [&_a]:justify-start
                [&_li]:mb-2 [&_li:last-child]:mb-0">
                <SidebarEquipos
                  filtro={filtro}
                  handleFiltro={handleFiltro}
                  handleAgregar={handleAgregar}
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-neutral-800/40 p-4">
                <p className="text-xs text-neutral-400 leading-5">
                  Agrupamos por <b className="text-neutral-300">mes de ingreso</b> de la última OT.
                  Se refresca automáticamente cada 5 min.
                </p>
              </div>
            </div>
          </aside>

          {/* ── MAIN ── */}
          <main className="md:h-[100svh] md:overflow-y-auto">

            {/* Header sticky */}
            <div className="sticky top-0 z-10 px-3 sm:px-4 py-3 backdrop-blur bg-neutral-900/90 border-b border-white/10">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base sm:text-lg font-semibold">
                  Lista de Equipos
                </h3>
                <div className="flex items-center gap-2">
                  {filtroEquipo && (
                    <span className="text-xs text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded-lg">
                      "{filtroEquipo}"
                    </span>
                  )}
                  <button
                    onClick={() => setMostrarBalances(v => !v)}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800/70 hover:bg-neutral-800 border border-white/10 text-xs sm:text-sm transition-colors"
                  >
                    {mostrarBalances ? "👁 Mostrar" : "🙈 Ocultar"}
                  </button>
                </div>
              </div>
            </div>

            <div className="px-3 sm:px-4 py-4 space-y-6">

              {/* Buscador + Balance global */}
              <section className="rounded-2xl border border-white/10 bg-neutral-800/40 p-3 sm:p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <div className="lg:col-span-2">
                    <BuscadorComponent
                      onBuscar={buscarPorCliente}
                      onBuscarEquipo={setFiltroEquipo}
                    />
                  </div>
                  <div className="rounded-xl border border-white/10 bg-neutral-900/40 p-3 flex items-center justify-between">
                    <span className="text-sm text-neutral-300 flex items-center gap-2">
                      <IconMoney /> Balance GLOBAL
                    </span>
                    <span className={`text-xl font-semibold ${totalBalanceGeneral >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {mostrarBalances ? "******" : `$${formatPrice(totalBalanceGeneral)}`}
                    </span>
                  </div>
                </div>
              </section>

              {/* Tabla de balance por mes */}
              <EquipoBalanceTable
                equiposAgrupadosPorMes={equiposAgrupadosPorMes}
                mostrarBalances={mostrarBalances}
              />

              {/* Grid de equipos con scroll infinito */}
              <EquipoGrid
                equiposAgrupadosPorMes={equiposAgrupadosPorMes}
                balanceByEquipoId={balanceByEquipoId}
                getNombreEstado={getNombreEstado}
                mostrarBalances={mostrarBalances}
                filtroEquipo={filtroEquipo}
                loading={loading}
                onHistorial={handleAbrirHistorial}
                onModificar={handleModificar}
                onDelete={handleDelete}
                onNuevaOT={handleNuevaOTDesdeCard}
                onLimpiarFiltro={() => setFiltroEquipo("")}
              />

            </div>
          </main>
        </div>

        {/* ── MODALES ── */}
        <NuevaOrdenTrabajoModal
          isOpen={isNuevaOTOpen}
          onClose={() => { setIsNuevaOTOpen(false); setEquipoPreseleccionado(null); }}
          equipoPreseleccionado={equipoPreseleccionado}
          onSuccess={(msg) => {
            setAlert({ message: msg, type: "success" });
            refrescar();
          }}
        />

        <EquipoModal
          isOpen={isEquipoModalOpen}
          onClose={handleCerrarEquipoModal}
          onSubmit={handleSubmitEquipoModal}
          equipoSeleccionado={equipoSeleccionado}
        />

        <HistorialPagosModal
          isOpen={isHistorialOpen}
          onClose={handleCerrarHistorial}
          clienteId={clienteHistorial.id}
          clienteNombre={clienteHistorial.nombre}
        />

        {alert.message && (
          <AlertNotification
            message={alert.message}
            type={alert.type}
            duration={4000}
            onClose={() => setAlert({ message: "", type: "success" })}
          />
        )}
      </div>
    </div>
  );
};

export default EquipoPage;