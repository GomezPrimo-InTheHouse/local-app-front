// // src/pages/EquipoPage.jsx
// import SidebarCard from "../components/Ui/SidebarCard.jsx";
// //dependencias
// import { useState, useEffect, useMemo } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";

// //api
// import {
//   getEquipos,
//   createEquipo,
//   updateEquipo,
//   deleteEquipo,
//   getEquiposByTipo,
//   getEquiposByClienteId,
// } from "../api/EquiposApi.jsx";
// import { getBalancesPresupuestos } from "../api/PresupuestoApi.jsx";
// import { getEstados } from "../api/EstadoApi.jsx";
// import { createIngreso } from "../api/IngresoApi"; // (lo mantenemos por si lo reactivás)
// import { enviarMensaje } from "../api/TwilioApi.jsx";
// import { getClienteById } from "../api/ClienteApi.jsx";

// //componentes
// import SidebarEquipos from "../components/Equipo/SidebarEquipos.jsx";
// import EquipoModal from "../components/Equipo/EquipoModal.jsx";
// import BuscadorComponent from "../components/General/BuscadorComponent.jsx";
// import AlertNotification from "../components/Alerta/AlertNotification.jsx";

// const EquipoPage = () => {
//   const [filtro, setFiltro] = useState("todos");
//   const [equipos, setEquipos] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [alert, setAlert] = useState({ message: "", type: "success" });
//   const [estados, setEstados] = useState([]);
//   const [balances, setBalances] = useState([]);
//   const [mostrarBalances, setMostrarBalances] = useState(false);

//   const navigate = useNavigate();

//   // ---------- Data Fetch ----------
//   const fetchEquipos = async () => {
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
//   };

//   useEffect(() => {
//     const fetchBalances = async () => {
//       try {
//         const res = await getBalancesPresupuestos();
//         setBalances(res.data || []);
//       } catch (error) {
//         console.error("Error al traer balances:", error);
//       }
//     };
//     fetchBalances();
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
//     const estado = estados.find((e) => e.id === id);
//     return estado ? estado.nombre : "Desconocido";
//   };

//   useEffect(() => {
//     fetchEquipos();
//   }, []);

//   // ---------- Acciones ----------
//   const handleAgregar = () => {
//     setEquipoSeleccionado(null);
//     setIsOpen(true);
//   };

//   const handleModificar = (equipo) => {
//     setEquipoSeleccionado(equipo);
//     setIsOpen(true);
//   };

//   const handleClose = () => {
//     setIsOpen(false);
//     setEquipoSeleccionado(null);
//   };

//   const handleDelete = async (id) => {
//     Swal.fire({
//       title: "Info!",
//       text: "¿Estás seguro de que deseas eliminar este equipo?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Sí, eliminar",
//       cancelButtonText: "Cancelar",
//       theme: "dark",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         await deleteEquipo(id);
//         await fetchEquipos();
//         setAlert({ message: "✅ Equipo eliminado correctamente", type: "success" });
//       } else {
//         setAlert({ message: "Operación cancelada", type: "info" });
//       }
//     });
//   };

//   const handleSubmit = async (formData) => {
//     const payload = {
//       tipo: String(formData.tipo || "").trim(),
//       marca: String(formData.marca || "").trim(),
//       modelo: String(formData.modelo || "").trim(),
//       password: formData.password ?? null,
//       problema: String(formData.problema || "").trim(),
//       cliente_id: Number(formData.cliente_id),
//       fecha_ingreso: formData.fecha_ingreso || null,
//       patron:
//         formData.patron && formData.patron.trim() !== "" ? formData.patron.trim() : null,
//       estado_id: Number(formData.estado_id),
//     };

//     try {
//       if (equipoSeleccionado) {
//         await updateEquipo(equipoSeleccionado.id, payload);
//         setAlert({ message: "✅ Equipo actualizado correctamente", type: "success" });
//       } else {
//         await createEquipo(payload);
//         setAlert({ message: "✅ Equipo creado correctamente", type: "success" });
//         // await EnviarNotificacionWhatsApp(payload.cliente_id, payload);
//       }
//       await fetchEquipos();
//     } catch (err) {
//       console.error("Error al guardar equipo:", err);
//       setAlert({ message: "❌ Error al guardar el equipo", type: "error" });
//     } finally {
//       handleClose();
//     }
//   };



//   const handleFiltro = async (tipo) => {
//     setFiltro(tipo);
//     setLoading(true);
//     try {
//       if (tipo === "todos") {
//         await fetchEquipos();
//       } else if (tipo === "otros") {
//         const todos = await getEquipos();
//         const filtrados = todos.filter(
//           (eq) =>
//             eq.tipo?.toLowerCase() !== "celular" &&
//             eq.tipo?.toLowerCase() !== "notebook" &&
//             eq.tipo?.toLowerCase() !== "pc"
//         );
//         setEquipos(filtrados);
//       } else {
//         const data = await getEquiposByTipo(tipo);
//         setEquipos(Array.isArray(data) ? data : []);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-dvh w-screen bg-neutral-900 text-white/95 overflow-hidden">
//       <div className="px-4 sm:px-6 lg:px-8">


//         {/* Grid: sidebar fijo (280–360px) + contenido */}
//         <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-0 md:gap-6 w-full">

//           {/* ------- LADO IZQUIERDO (SIDEBAR) ------- */}
//           <aside
//             className="
//             md:sticky md:top-4
//             md:h-[calc(100vh-2rem)]
//             overflow-y-auto
//             px-3 sm:px-4 py-4
//             border-b md:border-b-0 md:border-r border-white/10
//             [scrollbar-width:thin]
//             [&::-webkit-scrollbar]:w-2
//             [&::-webkit-scrollbar-thumb]:bg-white/10
//             bg-transparent
//           "
//           >
//             <div className="space-y-4">
//               {/* Botón principal */}
//               <button
//                 onClick={handleAgregar}
//                 className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-base font-semibold tracking-wide transition-all duration-200 shadow-xl shadow-emerald-900/50"
//               >
//                 ➕ Agregar Equipo
//               </button>

//               {/* Tarjeta de filtros/lista del sidebar con RESETS tipográficos y de layout */}
//               <div
//                 className="
//                 rounded-2xl border border-white/10 bg-neutral-800/70 p-4 sm:p-5 shadow-sm

//                 /* 🔧 Resets para que SidebarEquipos no rompa el layout */
//                 text-sm leading-6
//                 [&_*]:!max-w-none [&_*]:mx-0 [&_*]:text-left
//                 [&_h1]:text-base [&_h2]:text-base [&_h3]:text-sm
//                 [&_p]:text-sm [&_small]:text-xs

//                 /* Flex/Grid internos contenidos */
//                 [&_.flex]:items-stretch [&_.flex]:justify-start
//                 [&_.grid]:grid-cols-1 [&_.grid]:gap-2

//                 /* Botones/links descendientes coherentes */
//                 [&_button]:w-full [&_button]:h-11 [&_button]:rounded-lg [&_button]:px-3 [&_button]:text-sm
//                 [&_button]:inline-flex [&_button]:items-center [&_button]:justify-start
//                 [&_a]:w-full [&_a]:h-11 [&_a]:rounded-lg [&_a]:px-3 [&_a]:text-sm
//                 [&_a]:inline-flex [&_a]:items-center [&_a]:justify-start

//                 /* Listas internas con separación */
//                 [&_li]:mb-2 [&_li:last-child]:mb-0
//               "
//               >
//                 <SidebarEquipos
//                   filtro={filtro}
//                   handleFiltro={handleFiltro}
//                   handleAgregar={handleAgregar}
//                 />
//               </div>

//               {/* Info/ayuda del panel */}
//               <div className="rounded-2xl border border-white/10 bg-neutral-800/40 p-4 sm:p-5">
//                 <p className="text-xs text-neutral-300/80 leading-5">
//                   Agrupamos por <b>mes de ingreso</b> y mostramos el <b>balance mensual</b>.
//                 </p>
//               </div>
//             </div>
//           </aside>

//           {/* ------- LADO DERECHO (MAIN) ------- */}
//           <main className="md:h-[100svh] md:overflow-y-auto">
//             {/* Header sticky del panel derecho */}
//             <div className="sticky top-0 z-10 px-3 sm:px-4 py-3 backdrop-blur bg-neutral-900/85 border-b border-white/10">
//               <div className="flex items-center justify-between gap-2">
//                 <h3 className="text-base sm:text-lg font-semibold">Lista de Equipos</h3>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => setMostrarBalances((v) => !v)}
//                     className="px-3 py-1.5 rounded-lg bg-neutral-800/70 hover:bg-neutral-800 border border-white/10 text-[12px] sm:text-sm"
//                     title={mostrarBalances ? "Mostrar montos" : "Ocultar montos"}
//                   >
//                     {mostrarBalances ? "Mostrar montos" : "Ocultar montos"}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Contenido del panel derecho */}
//             <div className="px-3 sm:px-4 py-4 space-y-4">
//               {/* Buscador + Balance global */}
//               <section className="rounded-2xl border border-white/10 bg-neutral-800/40 p-3 sm:p-4">
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
//                 <div className="lg:col-span-2">
//                   <BuscadorComponent
//                     onBuscar={async (clienteId) => {
//                       setLoading(true);
//                       try {
//                         if (!clienteId) {
//                           await fetchEquipos();
//                         } else {
//                           const data = await getEquiposByClienteId(clienteId);
//                           setEquipos(Array.isArray(data) ? data : []);
//                         }
//                       } finally {
//                         setLoading(false);
//                       }
//                     }}
//                   />
//                 </div>

//                 <div className="rounded-xl border border-white/10 bg-neutral-900/40 p-3 flex items-center justify-between">
//                   <span className="text-sm text-neutral-300">Balance global</span>
//                   <span className="text-xl font-semibold text-emerald-400">
//                     {mostrarBalances ? "******" : totalBalanceGeneral.toLocaleString("es-AR")}
//                   </span>
//                 </div>
//               </div>
//             </section>
              


//               {/* Listado por mes */}
//               <section className="rounded-2xl border border-white/10 bg-neutral-800/30 p-3 sm:p-4">
//                 {loading ? (
//                   <p className="text-neutral-400 px-1">Cargando equipos...</p>
//                 ) : !Array.isArray(equipos) || equipos.length === 0 ? (
//                   <div className="rounded-xl border border-dashed border-white/15 p-6 text-center bg-white/5">
//                     <p className="text-neutral-300">Aún no hay equipos cargados.</p>
//                   </div>
//                 ) : (
//                   Object.entries(
//                     equipos.reduce((grupos, eq) => {
//                       const fecha = eq.fecha_ingreso
//                         ? new Date(eq.fecha_ingreso + "T12:00:00")
//                         : null;
//                       const key = fecha
//                         ? `${fecha.toLocaleString("es-AR", { month: "long" })} ${fecha.getFullYear()}`
//                         : "Sin fecha";
//                       if (!grupos[key]) grupos[key] = [];
//                       grupos[key].push(eq);
//                       return grupos;
//                     }, {})
//                   ).map(([mes, equiposMes]) => {
//                     const totalMes = equiposMes.reduce(
//                       (acc, eq) => acc + (balanceByEquipoId[eq.id]?.balance_final ?? 0),
//                       0
//                     );

//                     return (
//                       <div key={mes} className="mb-6">
//                         <div className="border-b border-white/10 pb-2 mb-3">
//                           <h4 className="text-lg font-semibold text-neutral-200 capitalize">
//                             {mes}
//                           </h4>
//                         </div>

//                         <div className="mb-3">
//                           <div className="rounded-xl border border-white/10 bg-neutral-900/40 p-3 flex items-center justify-between">
//                             <span className="text-sm text-neutral-300">Balance del mes</span>
//                             <span className="text-lg font-semibold text-emerald-400">
//                               {mostrarBalances ? "******" : totalMes.toLocaleString("es-AR")}
//                             </span>
//                           </div>
//                         </div>

//                         <ol className="space-y-4 list-decimal list-inside">
//                           {equiposMes.map((eq) => {
//                             const fechaFormateada = eq.fecha_ingreso
//                               ? new Date(eq.fecha_ingreso + "T12:00:00").toLocaleDateString(
//                                 "es-AR",
//                                 { year: "numeric", month: "2-digit", day: "2-digit" }
//                               )
//                               : "Sin fecha";

//                             const monto = balanceByEquipoId[eq.id]?.balance_final ?? 0;

//                             return (
//                               <li
//                                 key={eq.id}

//                                 className="rounded-xl border border-white/10 bg-neutral-800/50 p-4 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-3 hover:bg-neutral-800/70 hover:border-white/20 transition"
//                               >
//                                 {/* Info principal */}
//                                 <div className="flex-1">
//                                   <p className="font-semibold text-white">
//                                     {eq.tipo?.toUpperCase()} - {eq.marca} {eq.modelo}
//                                   </p>
//                                   <p className="text-sm text-neutral-300">{eq.problema}</p>
//                                   <p className="text-sm text-neutral-300">
//                                     Estado: {getNombreEstado(eq.estado_id)}
//                                   </p>

//                                   {eq.tipo?.toLowerCase() === "celular" && eq.patron && (
//                                     <p className="text-sm text-neutral-400">Patrón: {eq.patron}</p>
//                                   )}
//                                   {eq.tipo?.toLowerCase() !== "consola" && eq.password && (
//                                     <p className="text-sm text-neutral-400">Password: {eq.password}</p>
//                                   )}

//                                   <p className="text-sm text-neutral-400">
//                                     Cliente: {eq.cliente_nombre} {eq.cliente_apellido}
//                                   </p>
//                                   <p className="text-sm text-neutral-500">Ingreso: {fechaFormateada}</p>
//                                 </div>

//                                 {/* Mini-card derecha */}
//                                 <div className="flex flex-col items-end gap-2">
//                                   <div className="rounded-lg border border-white/10 bg-neutral-900/40 px-3 py-2 flex items-center gap-2">
//                                     <span className="hidden sm:block text-xs text-neutral-300">
//                                       Balance
//                                     </span>
//                                     <span className="text-base md:text-lg font-semibold text-emerald-400">
//                                       {mostrarBalances ? "******" : monto.toLocaleString("es-AR")}
//                                     </span>
//                                   </div>

//                                   {/* Botones */}
//                                   <div className="flex gap-2">
//                                     <Link
//                                       to={`/equipos/${eq.id}`}
//                                       className="bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
//                                     >
//                                       Presupuestos
//                                     </Link>
//                                     <button
//                                       onClick={() => handleModificar(eq)}
//                                       className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm font-medium"
//                                     >
//                                       Modificar
//                                     </button>
//                                     <button
//                                       onClick={() => handleDelete(eq.id)}
//                                       className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-medium"
//                                     >
//                                       Eliminar
//                                     </button>
//                                   </div>
//                                 </div>
//                               </li>
//                             );
//                           })}
//                         </ol>
//                       </div>
//                     );
//                   })
//                 )}
//               </section>
//             </div>
//           </main>
//         </div>

//         {/* Modal */}
//         <EquipoModal
//           isOpen={isOpen}
//           onClose={handleClose}
//           onSubmit={handleSubmit}
//           equipoSeleccionado={equipoSeleccionado}
//         />

//         {/* Alertas */}
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

// import { useState, useEffect, useMemo } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";

// // Iconos (se mantienen)
// const IconMoney = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
//   </svg>
// );
// const IconLaptop = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9.75 21M12.75 21L12.75 17M12.75 17L12.75 21M9.75 17L6 21M18.75 21L15 17M18.75 17h.008v.008h-.008v-.008zM12 11V6a2 2 0 012-2h4a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2v-10a2 2 0 012-2h4z" />
//   </svg>
// );
// const IconUser = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//   </svg>
// );
// const IconClock = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );
// const IconKey = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M15 9V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v4m7 5V9m0 0a2 2 0 012 2v4a2 2 0 01-2 2H7a2 2 0 01-2-2v-4a2 2 0 012-2h8z" />
//   </svg>
// );
// const IconTrendingUp = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//   </svg>
// );
// const IconMapPin = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
// );
// const IconPhone = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
// );
// const IconAlertTriangle = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M6.832 20h10.336A2.973 2.973 0 0021 17.027V6.973A2.973 2.973 0 0017.168 4H6.832A2.973 2.973 0 003 6.973v10.054A2.973 2.973 0 006.832 20z" /> </svg>
// );


// //api
// import {
//   getEquipos,
//   createEquipo,
//   updateEquipo,
//   deleteEquipo,
//   getEquiposByTipo,
//   getEquiposByClienteId,
// } from "../api/EquiposApi.jsx";
// import { getBalancesPresupuestos } from "../api/PresupuestoApi.jsx";
// import { getEstados } from "../api/EstadoApi.jsx";
// // import { getClienteById } from "../api/ClienteApi.jsx"; // YA NO ES NECESARIO

// //componentes
// import SidebarEquipos from "../components/Equipo/SidebarEquipos.jsx";
// import EquipoModal from "../components/Equipo/EquipoModal.jsx";
// import BuscadorComponent from "../components/General/BuscadorComponent.jsx";
// import AlertNotification from "../components/Alerta/AlertNotification.jsx";


// const EquipoPage = () => {
//   const [filtro, setFiltro] = useState("todos");
//   const [equipos, setEquipos] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [alert, setAlert] = useState({ message: "", type: "success" });
//   const [estados, setEstados] = useState([]);
//   const [balances, setBalances] = useState([]);
//   const [mostrarBalances, setMostrarBalances] = useState(false);

//   const navigate = useNavigate();

//   // --- Helpers ---
//   const formatPrice = (price) =>
//     Number(price || 0).toLocaleString("es-AR", {
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     });
  
//   const formatDateShort = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString + "T12:00:00");
//     if (isNaN(date.getTime())) return "N/A";
//     return date.toLocaleDateString("es-AR", {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//     });
//   };

//   // ---------- Data Fetch (SIMPLIFICADO PARA CARGA RÁPIDA) ----------
//   const fetchEquipos = async () => {
//     setLoading(true);
//     try {
//       // ✅ SIMPLIFICACIÓN: getEquipos ahora devuelve los datos del cliente aplanados
//       const data = await getEquipos(); 
//       setEquipos(Array.isArray(data) ? data : []);
      
//     } catch (err) {
//       console.error("Error al obtener equipos:", err);
//       setEquipos([]);
//     } finally {
//       setLoading(false);
//     }
//   };
//   // ------------------------------------------------------------------

//   useEffect(() => {
//     const fetchBalances = async () => {
//       try {
//         const res = await getBalancesPresupuestos();
//         setBalances(res.data || []);
//       } catch (error) {
//         console.error("Error al traer balances:", error);
//       }
//     };
//     fetchBalances();
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
//     const estado = estados.find((e) => e.id === id);
//     return estado ? estado.nombre : "Desconocido";
//   };

//   useEffect(() => {
//     fetchEquipos();
//   }, []);

//   // ---------- Acciones (sin modificar) ----------
//   const handleAgregar = () => {
//     setEquipoSeleccionado(null);
//     setIsOpen(true);
//   };

//   const handleModificar = (equipo) => {
//     setEquipoSeleccionado(equipo);
//     setIsOpen(true);
//   };

//   const handleClose = () => {
//     setIsOpen(false);
//     setEquipoSeleccionado(null);
//   };

//   const handleDelete = async (id) => {
//     Swal.fire({
//       title: "Info!",
//       text: "¿Estás seguro de que deseas eliminar este equipo?",
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
//       } else {
//         setAlert({ message: "Operación cancelada", type: "info" });
//       }
//     });
//   };

//   const handleSubmit = async (formData) => {
//     const payload = {
//       tipo: String(formData.tipo || "").trim(),
//       marca: String(formData.marca || "").trim(),
//       modelo: String(formData.modelo || "").trim(),
//       password: formData.password ?? null,
//       problema: String(formData.problema || "").trim(),
//       cliente_id: Number(formData.cliente_id),
//       fecha_ingreso: formData.fecha_ingreso || null,
//       patron:
//         formData.patron && formData.patron.trim() !== "" ? formData.patron.trim() : null,
//       estado_id: Number(formData.estado_id),
//     };

//     try {
//       if (equipoSeleccionado) {
//         await updateEquipo(equipoSeleccionado.id, payload);
//         setAlert({ message: "✅ Equipo actualizado correctamente", type: "success" });
//       } else {
//         await createEquipo(payload);
//         setAlert({ message: "✅ Equipo creado correctamente", type: "success" });
//         // await EnviarNotificacionWhatsApp(payload.cliente_id, payload);
//       }
//       await fetchEquipos();
//     } catch (err) {
//       console.error("Error al guardar equipo:", err);
//       setAlert({ message: "❌ Error al guardar el equipo", type: "error" });
//     } finally {
//       handleClose();
//     }
//   };

//   const handleFiltro = async (tipo) => {
//     setFiltro(tipo);
//     setLoading(true);
//     try {
//       if (tipo === "todos") {
//         await fetchEquipos();
//       } else if (tipo === "otros") {
//         const todos = await getEquipos();
//         const filtrados = todos.filter(
//           (eq) =>
//             eq.tipo?.toLowerCase() !== "celular" &&
//             eq.tipo?.toLowerCase() !== "notebook" &&
//             eq.tipo?.toLowerCase() !== "pc"
//         );
//         setEquipos(filtrados);
//       } else {
//         const data = await getEquiposByTipo(tipo);
//         setEquipos(Array.isArray(data) ? data : []);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // LÓGICA DE AGRUPACIÓN Y BALANCE MENSUAL MEJORADA
//   const equiposAgrupadosPorMes = useMemo(() => {
//     // 1. Agrupar equipos y calcular métricas por mes
//     const grupos = equipos.reduce((acc, eq) => {
//       const fecha = eq.fecha_ingreso ? new Date(eq.fecha_ingreso + "T12:00:00") : null;
      
//       let key = "Sin fecha";
//       let sortKey = "9999-12"; // Para que "Sin fecha" vaya al final

//       if (fecha && !isNaN(fecha.getTime())) {
//         const year = fecha.getFullYear();
//         // Los meses de JS son 0-11. Sumamos 1 y usamos padStart para YYYY-MM
//         const month = String(fecha.getMonth() + 1).padStart(2, '0'); 
        
//         sortKey = `${year}-${month}`;
//         key = `${fecha.toLocaleString("es-AR", { month: "long" })} ${year}`;
//       }

//       // Obtener datos de balance si existen
//       const balanceData = balanceByEquipoId[eq.id];
//       const costoTotal = balanceData?.costo_total ?? 0;
//       const ventaTotal = balanceData?.total_total ?? 0;
//       const balanceNeto = balanceData?.balance_final ?? 0;

//       if (!acc[sortKey]) {
//         acc[sortKey] = {
//           label: key,
//           equipos: [],
//           totalCosto: 0,
//           totalVenta: 0,
//           totalBalance: 0,
//         };
//       }

//       acc[sortKey].equipos.push(eq);
//       acc[sortKey].totalCosto += costoTotal;
//       acc[sortKey].totalVenta += ventaTotal;
//       acc[sortKey].totalBalance += balanceNeto;

//       return acc;
//     }, {});

//     // 2. Ordenar por fecha (descendente)
//     return Object.entries(grupos).sort(([keyA], [keyB]) => {
//         // "9999-12" (Sin fecha) va al final
//         if (keyA === "9999-12") return 1; 
//         if (keyB === "9999-12") return -1;
//         // Ordena YYYY-MM (descendente, más reciente primero)
//         return keyB.localeCompare(keyA); 
//     });
//   }, [equipos, balanceByEquipoId]);


//   return (
//     <div className="min-h-dvh w-screen bg-neutral-900 text-white/95 overflow-hidden">
//       <div className="px-4 sm:px-6 lg:px-8">


//         {/* Grid: sidebar fijo (280–360px) + contenido */}
//         <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-0 md:gap-6 w-full">

//           {/* ------- LADO IZQUIERDO (SIDEBAR) ------- */}
//           <aside
//             className="
//             md:sticky md:top-4
//             md:h-[calc(100vh-2rem)]
//             overflow-y-auto
//             px-3 sm:px-4 py-4
//             border-b md:border-b-0 md:border-r border-white/10
//             [scrollbar-width:thin]
//             [&::-webkit-scrollbar]:w-2
//             [&::-webkit-scrollbar-thumb]:bg-white/10
//             bg-transparent
//           "
//           >
//             <div className="space-y-4">
//               {/* Botón principal */}
//               <button
//                 onClick={handleAgregar}
//                 className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-base font-semibold tracking-wide transition-all duration-200 shadow-xl shadow-emerald-900/50"
//               >
//                 ➕ Agregar Equipo
//               </button>

//               {/* Tarjeta de filtros/lista del sidebar con RESETS tipográficos y de layout */}
//               <div
//                 className="
//                 rounded-2xl border border-white/10 bg-neutral-800/70 p-4 sm:p-5 shadow-sm

//                 /* 🔧 Resets para que SidebarEquipos no rompa el layout */
//                 text-sm leading-6
//                 [&_*]:!max-w-none [&_*]:mx-0 [&_*]:text-left
//                 [&_h1]:text-base [&_h2]:text-base [&_h3]:text-sm
//                 [&_p]:text-sm [&_small]:text-xs

//                 /* Flex/Grid internos contenidos */
//                 [&_.flex]:items-stretch [&_.flex]:justify-start
//                 [&_.grid]:grid-cols-1 [&_.grid]:gap-2

//                 /* Botones/links descendientes coherentes */
//                 [&_button]:w-full [&_button]:h-11 [&_button]:rounded-lg [&_button]:px-3 [&_button]:text-sm
//                 [&_button]:inline-flex [&_button]:items-center [&_button]:justify-start
//                 [&_a]:w-full [&_a]:h-11 [&_a]:rounded-lg [&_a]:px-3 [&_a]:text-sm
//                 [&_a]:inline-flex [&_a]:items-center [&_a]:justify-start

//                 /* Listas internas con separación */
//                 [&_li]:mb-2 [&_li:last-child]:mb-0
//               "
//               >
//                 <SidebarEquipos
//                   filtro={filtro}
//                   handleFiltro={handleFiltro}
//                   handleAgregar={handleAgregar}
//                 />
//               </div>

//               {/* Info/ayuda del panel */}
//               <div className="rounded-2xl border border-white/10 bg-neutral-800/40 p-4 sm:p-5">
//                 <p className="text-xs text-neutral-300/80 leading-5">
//                   Agrupamos por <b>mes de ingreso</b> y mostramos el <b>balance mensual</b>.
//                 </p>
//               </div>
//             </div>
//           </aside>

//           {/* ------- LADO DERECHO (MAIN) ------- */}
//           <main className="md:h-[100svh] md:overflow-y-auto">
//             {/* Header sticky del panel derecho */}
//             <div className="sticky top-0 z-10 px-3 sm:px-4 py-3 backdrop-blur bg-neutral-900/85 border-b border-white/10">
//               <div className="flex items-center justify-between gap-2">
//                 <h3 className="text-base sm:text-lg font-semibold">Lista de Equipos</h3>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => setMostrarBalances((v) => !v)}
//                     className="px-3 py-1.5 rounded-lg bg-neutral-800/70 hover:bg-neutral-800 border border-white/10 text-[12px] sm:text-sm"
//                     title={mostrarBalances ? "Mostrar montos" : "Ocultar montos"}
//                   >
//                     {mostrarBalances ? "Ocultar montos" : "Mostrar montos"}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Contenido del panel derecho */}
//             <div className="px-3 sm:px-4 py-4 space-y-6">
//               {/* Buscador + Balance global */}
//               <section className="rounded-2xl border border-white/10 bg-neutral-800/40 p-3 sm:p-4">
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
//                   <div className="lg:col-span-2">
//                     <BuscadorComponent
//                       onBuscar={async (clienteId) => {
//                         setLoading(true);
//                         try {
//                           if (!clienteId) {
//                             await fetchEquipos();
//                           } else {
//                             // Asumo que getEquiposByClienteId también retorna los datos del cliente aplanados
//                             const data = await getEquiposByClienteId(clienteId); 
//                             setEquipos(Array.isArray(data) ? data : []);
//                           }
//                         } finally {
//                           setLoading(false);
//                         }
//                       }}
//                     />
//                   </div>

//                   {/* Card de Balance global */}
//                   <div className="rounded-xl border border-white/10 bg-neutral-900/40 p-3 flex items-center justify-between">
//                     <span className="text-sm text-neutral-300 flex items-center gap-2">
//                       <IconMoney className="w-4 h-4 text-purple-400" />
//                       Balance Neto GLOBAL
//                     </span>
//                     <span
//                       className={`text-xl font-semibold tracking-tight ${totalBalanceGeneral >= 0 ? "text-emerald-400" : "text-red-400"}`}
//                     >
//                       {mostrarBalances ? "******" : `$${formatPrice(totalBalanceGeneral)}`}
//                     </span>
//                   </div>
//                 </div>
//               </section>

//               {/* VISTA RÁPIDA DE BALANCE MENSUAL (Tabla tipo VentasPage) */}
//               {equiposAgrupadosPorMes.length > 0 && (
//                 <section className="pt-2">
//                   <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
//                     <IconTrendingUp className="h-5 w-5 text-emerald-400" />
//                     Balance de Ingresos por Mes
//                   </h2>

//                   <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto shadow-lg">
//                     <table className="min-w-full divide-y divide-neutral-800">
//                       <thead className="bg-neutral-800/80">
//                         <tr>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                             Mes
//                           </th>
//                           <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
//                             Venta Total
//                           </th>
//                           <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
//                             Costo Total
//                           </th>
//                           <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
//                             Balance Neto
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-neutral-800">
//                         {equiposAgrupadosPorMes.map(([key, data]) => (
//                           <tr key={key} className="hover:bg-neutral-800/50 transition duration-150">
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white capitalize">
//                               {data.label}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-300">
//                               {mostrarBalances ? "****" : `$${formatPrice(data.totalVenta)}`}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-300">
//                               {mostrarBalances ? "****" : `-$${formatPrice(data.totalCosto)}`}
//                             </td>
//                             <td
//                               className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
//                                 data.totalBalance >= 0 ? "text-emerald-400" : "text-red-400"
//                               }`}
//                             >
//                               {mostrarBalances ? "****" : `$${formatPrice(data.totalBalance)}`}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </section>
//               )}


//               {/* LISTADO DE EQUIPOS (Diseño de Cards) */}
//               <section className="py-4">
//                 {loading ? (
//                   <p className="text-neutral-400 px-1">Cargando equipos...</p>
//                 ) : equiposAgrupadosPorMes.length === 0 ? (
//                   <div className="rounded-xl border border-dashed border-white/15 p-6 text-center bg-white/5">
//                     <p className="text-neutral-300">Aún no hay equipos cargados.</p>
//                   </div>
//                 ) : (
//                   equiposAgrupadosPorMes.map(([, data]) => {
//                     const { label: mes, equipos: equiposMes } = data;

//                     return (
//                       <div key={mes} className="mb-8">
//                         {/* Encabezado de grupo (Mes) */}
//                         <div className="border-b border-white/10 pb-2 mb-6">
//                           <h4 className="text-2xl font-extrabold text-white capitalize">
//                             {mes}
//                           </h4>
//                           <p className="text-sm text-gray-500">{equiposMes.length} equipos ingresados.</p>
//                         </div>

//                         {/* Contenedor de Cards */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                           {equiposMes.map((eq) => {
//                             const balance = balanceByEquipoId[eq.id];
//                             const costoTotal = balance?.costo_total ?? 0;
//                             const ventaTotal = balance?.total_total ?? 0;
//                             const balanceNeto = balance?.balance_final ?? 0;
                            
//                             const estadoNombre = getNombreEstado(eq.estado_id);
                            
//                             // ✅ USANDO PROPIEDADES APLANADAS DEL BACKEND
//                             const clienteDireccion = eq.cliente_direccion || "Dirección N/D";
//                             const clienteTelefono = eq.cliente_celular || "Teléfono N/D";
//                             const clienteNombreCompleto = `${eq.cliente_nombre || 'Anónimo'} ${eq.cliente_apellido || ''}`;


//                             return (
//                               <div
//                                 key={eq.id}
//                                 className="bg-neutral-900 p-5 rounded-xl border border-neutral-800 shadow-xl hover:border-purple-600/50 hover:shadow-purple-900/20 transition duration-200 space-y-4 flex flex-col justify-between"
//                               >
                                
//                                 {/* 1. HEADER (Equipo & Estado) */}
//                                 <div className="flex justify-between items-start pb-2 border-b border-neutral-800/50">
//                                   <div>
//                                     <p className="text-lg font-extrabold text-purple-400 flex items-center gap-2">
//                                       <IconLaptop className="w-5 h-5" />
//                                       {eq.marca} {eq.modelo}
//                                     </p>
//                                     <p className="text-xs font-light text-neutral-400 uppercase">{eq.tipo} | ID: {eq.id}</p>
//                                   </div>
//                                   <span className={`px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ${
//                                     estadoNombre.includes('Finalizado') ? 'bg-emerald-600/20 text-emerald-400' : 
//                                     estadoNombre.includes('Pendiente') ? 'bg-yellow-600/20 text-yellow-400' : 
//                                     'bg-neutral-700/20 text-neutral-300'
//                                   }`}>
//                                     {estadoNombre}
//                                   </span>
//                                 </div>

//                                 {/* 2. DETALLES DEL EQUIPO */}
  
//                                 <div className="space-y-2">
//                                   {/* Problema: Texto más pequeño y con límite de líneas */}
//                                   <div className="flex items-start gap-2 text-sm">
//                                     <span className="text-red-400/80 mt-0.5 flex-shrink-0">
//                                       <IconAlertTriangle />
//                                     </span>
//                                     {/* Usamos una grid de una columna para manejar el título y el contenido */}
//                                     <div className="grid">
//                                         <span className="text-neutral-300 font-semibold leading-none">
//                                             Problema:
//                                         </span>
//                                         <span 
//                                             // Reducimos el texto del problema a `text-xs` y limitamos a 2 o 3 líneas
//                                             className="font-light text-neutral-400 text-xs leading-tight line-clamp-3"
//                                             title={eq.problema} // Añadimos el título para que el usuario pueda ver el texto completo al pasar el ratón
//                                         >
//                                             {eq.problema}
//                                         </span>
//                                     </div>
//                                   </div>

//                                   {/* Fecha y Contraseña/Patrón (Mantenemos el tamaño compacto) */}
//                                   <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-neutral-400 text-xs pt-1 border-t border-neutral-800/50">
//                                     <p className="flex items-center gap-2">
//                                       <IconClock className="w-3.5 h-3.5 text-neutral-500" /> 
//                                       Ingreso: <span className="font-medium text-white">{formatDateShort(eq.fecha_ingreso)}</span>
//                                     </p>
//                                     <p className="flex items-center gap-2">
//                                       <IconKey className="w-3.5 h-3.5 text-neutral-500" />
//                                       {eq.password ? 'Pass:' : 'Patrón:'} <span className="font-medium text-white">{eq.password || eq.patron || "N/A"}</span>
//                                     </p>
//                                   </div>
//                                 </div>

//                                 {/* 3. CLIENTE (Ajustado y Compacto) */}
//                                 <div className="pt-2 border-t border-neutral-800/50 space-y-1 text-sm">
//                                   <p className="text-neutral-300 font-medium flex items-center gap-2">
//                                       <IconUser className="w-4 h-4 text-white/70" />
//                                       {clienteNombreCompleto}
//                                   </p>
//                                   <p className="text-xs text-neutral-500 pl-6 flex items-center gap-2">
//                                       <IconMapPin />
//                                       {clienteDireccion}
//                                   </p>
//                                    <p className="text-xs text-neutral-500 pl-6 flex items-center gap-2">
//                                       <IconPhone />
//                                       {clienteTelefono}
//                                   </p>
//                                 </div>


//                                 {/* 4. BALANCES (Visualización Rápida COMPLETA) */}
//                                 <div className="pt-3 border-t border-neutral-800 space-y-1">
//                                     <div className="flex justify-between text-xs text-neutral-400">
//                                         <span>Total (a cobrar):</span>
//                                         <span className="font-semibold text-green-300">
//                                             {mostrarBalances ? "****" : `$${formatPrice(ventaTotal)}`}
//                                         </span>
//                                     </div>
//                                     <div className="flex justify-between text-xs text-neutral-400">
//                                         <span>Costo Estimado:</span>
//                                         <span className="font-semibold text-red-300">
//                                             {mostrarBalances ? "****" : `-$${formatPrice(costoTotal)}`}
//                                         </span>
//                                     </div>
//                                     <div className="flex justify-between text-sm font-semibold">
//                                         <span className="text-neutral-300">Balance Neto:</span>
//                                         <span className={balanceNeto >= 0 ? "text-emerald-400" : "text-red-400"}>
//                                             {mostrarBalances ? "****" : `$${formatPrice(balanceNeto)}`}
//                                         </span>
//                                     </div>
//                                 </div>


//                                 {/* 5. ACCIONES (Botones compactos) */}
//                                 <div className="flex justify-end gap-2 pt-4 border-t border-neutral-800">
//                                   <Link
//                                     to={`/equipos/${eq.id}`}
//                                     className="bg-neutral-700 hover:bg-neutral-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
//                                   >
//                                     Presupuestos
//                                   </Link>
//                                   <button
//                                     onClick={() => handleModificar(eq)}
//                                     className="bg-purple-600 hover:bg-purple-700 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
//                                   >
//                                     Modificar
//                                   </button>
//                                   <button
//                                     onClick={() => handleDelete(eq.id)}
//                                     className="bg-red-600 hover:bg-red-700 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
//                                   >
//                                     Eliminar
//                                   </button>
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

//         {/* Modal */}
//         <EquipoModal
//           isOpen={isOpen}
//           onClose={handleClose}
//           onSubmit={handleSubmit}
//           equipoSeleccionado={equipoSeleccionado}
//         />

//         {/* Alertas */}
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

import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Importaciones de API
import {
  getEquipos,
  createEquipo,
  updateEquipo,
  deleteEquipo,
  getEquiposByTipo,
  getEquiposByClienteId,
} from "../api/EquiposApi.jsx";
import { getBalancesPresupuestos } from "../api/PresupuestoApi.jsx";
import { getEstados } from "../api/EstadoApi.jsx";
// import { createIngreso } from "../api/IngresoApi"; // Mantenida como referencia
// import { enviarMensaje } from "../api/TwilioApi.jsx"; // Mantenida como referencia

// Importaciones de Componentes
import SidebarEquipos from "../components/Equipo/SidebarEquipos.jsx";
import EquipoModal from "../components/Equipo/EquipoModal.jsx";
import BuscadorComponent from "../components/General/BuscadorComponent.jsx";
import AlertNotification from "../components/Alerta/AlertNotification.jsx";
import HistorialPagosModal from "../components/Cliente/HistorialPagosModal.jsx"; // NUEVO MODAL DE PAGOS

// Iconos (Mantenidos)
const IconMoney = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const IconHistory = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);


const EquipoPage = () => {
  const [filtro, setFiltro] = useState("todos");
  const [equipos, setEquipos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: "", type: "success" });
  const [estados, setEstados] = useState([]);
  const [balances, setBalances] = useState([]);
  const [mostrarBalances, setMostrarBalances] = useState(false);
  
  // --- ESTADOS PARA EL MODAL DE PAGOS ---
  const [isHistorialOpen, setIsHistorialOpen] = useState(false);
  const [clienteHistorial, setClienteHistorial] = useState({ id: null, nombre: "" });


  const navigate = useNavigate();

  // --- HELPERS ---
  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  
  const formatDateShort = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString + "T12:00:00");
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };
  // ---------------

  // ---------- Data Fetch ----------
  const fetchEquipos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEquipos();
      setEquipos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener equipos:", err);
      setEquipos([]);
    } finally {
      setLoading(false);
    }
  }, []); // Dependencias vacías

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const res = await getBalancesPresupuestos();
        setBalances(res.data || []);
      } catch (error) {
        console.error("Error al traer balances:", error);
      }
    };
    fetchBalances();
  }, []);

  const balanceByEquipoId = useMemo(() => {
    const map = {};
    for (const b of balances) map[b.equipo_id] = b;
    return map;
  }, [balances]);

  const totalBalanceGeneral = useMemo(
    () => balances.reduce((acc, b) => acc + (b?.balance_final ?? 0), 0),
    [balances]
  );

  useEffect(() => {
    (async () => {
      const lista = await getEstados();
      setEstados(lista);
    })();
  }, []);

  const getNombreEstado = (id) => {
    const estado = estados.find((e) => e.id === id);
    return estado ? estado.nombre : "Desconocido";
  };

  useEffect(() => {
    fetchEquipos();
  }, [fetchEquipos]);

  // ---------- Manejo de Modales y Pagos ----------
  
  const handleAbrirHistorial = (clienteId, nombreCompleto) => {
    setClienteHistorial({ id: clienteId, nombre: nombreCompleto });
    setIsHistorialOpen(true);
  };

  const handleCerrarHistorial = () => {
    setIsHistorialOpen(false);
    setClienteHistorial({ id: null, nombre: "" });
    // Opcional: Refrescar balances y equipos al cerrar el modal por si hubo pagos.
    fetchEquipos();
  };

  const handleAgregar = () => {
    setEquipoSeleccionado(null);
    setIsOpen(true);
  };

  const handleModificar = (equipo) => {
    setEquipoSeleccionado(equipo);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEquipoSeleccionado(null);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Info!",
      text: "¿Estás seguro de que deseas eliminar este equipo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
        title: "text-xl font-bold",
        htmlContainer: "text-gray-300",
        confirmButton: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
        cancelButton: "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteEquipo(id);
        await fetchEquipos();
        setAlert({ message: "✅ Equipo eliminado correctamente", type: "success" });
      } else {
        setAlert({ message: "Operación cancelada", type: "info" });
      }
    });
  };

  const handleSubmit = async (formData) => {
    const payload = {
      tipo: String(formData.tipo || "").trim(),
      marca: String(formData.marca || "").trim(),
      modelo: String(formData.modelo || "").trim(),
      password: formData.password ?? null,
      problema: String(formData.problema || "").trim(),
      cliente_id: Number(formData.cliente_id),
      fecha_ingreso: formData.fecha_ingreso || null,
      patron:
        formData.patron && formData.patron.trim() !== "" ? formData.patron.trim() : null,
      estado_id: Number(formData.estado_id),
    };

    try {
      if (equipoSeleccionado) {
        await updateEquipo(equipoSeleccionado.id, payload);
        setAlert({ message: "✅ Equipo actualizado correctamente", type: "success" });
      } else {
        await createEquipo(payload);
        setAlert({ message: "✅ Equipo creado correctamente", type: "success" });
      }
      await fetchEquipos();
    } catch (err) {
      console.error("Error al guardar equipo:", err);
      setAlert({ message: "❌ Error al guardar el equipo", type: "error" });
    } finally {
      handleClose();
    }
  };


  const handleFiltro = async (tipo) => {
    setFiltro(tipo);
    setLoading(true);
    try {
      if (tipo === "todos") {
        await fetchEquipos();
      } else if (tipo === "otros") {
        const todos = await getEquipos();
        const filtrados = todos.filter(
          (eq) =>
            eq.tipo?.toLowerCase() !== "celular" &&
            eq.tipo?.toLowerCase() !== "notebook" &&
            eq.tipo?.toLowerCase() !== "pc"
        );
        setEquipos(filtrados);
      } else {
        const data = await getEquiposByTipo(tipo);
        setEquipos(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoading(false);
    }
  };

  // LÓGICA DE AGRUPACIÓN Y BALANCE MENSUAL MEJORADA
  const equiposAgrupadosPorMes = useMemo(() => {
    const grupos = equipos.reduce((acc, eq) => {
      const fecha = eq.fecha_ingreso ? new Date(eq.fecha_ingreso + "T12:00:00") : null;
      
      let key = "Sin fecha";
      let sortKey = "9999-12"; 

      if (fecha && !isNaN(fecha.getTime())) {
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0'); 
        
        sortKey = `${year}-${month}`;
        key = `${fecha.toLocaleString("es-AR", { month: "long" })} ${year}`;
      }

      const balanceData = balanceByEquipoId[eq.id];
      const costoTotal = balanceData?.costo_total ?? 0;
      const ventaTotal = balanceData?.total_total ?? 0;
      const balanceNeto = balanceData?.balance_final ?? 0;

      if (!acc[sortKey]) {
        acc[sortKey] = {
          label: key,
          equipos: [],
          totalCosto: 0,
          totalVenta: 0,
          totalBalance: 0,
        };
      }

      acc[sortKey].equipos.push(eq);
      acc[sortKey].totalCosto += costoTotal;
      acc[sortKey].totalVenta += ventaTotal;
      acc[sortKey].totalBalance += balanceNeto;

      return acc;
    }, {});

    return Object.entries(grupos).sort(([keyA], [keyB]) => {
        if (keyA === "9999-12") return 1; 
        if (keyB === "9999-12") return -1;
        return keyB.localeCompare(keyA); 
    });
  }, [equipos, balanceByEquipoId]);


  return (
    <div className="min-h-dvh w-screen bg-neutral-900 text-white/95 overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8">


        {/* Grid: sidebar fijo (280–360px) + contenido */}
        <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-0 md:gap-6 w-full">

          {/* ------- LADO IZQUIERDO (SIDEBAR) ------- */}
          <aside
            className="
            md:sticky md:top-4
            md:h-[calc(100vh-2rem)]
            overflow-y-auto
            px-3 sm:px-4 py-4
            border-b md:border-b-0 md:border-r border-white/10
            [scrollbar-width:thin]
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-thumb]:bg-white/10
            bg-transparent
          "
          >
            <div className="space-y-4">
              {/* Botón principal */}
              <button
                onClick={handleAgregar}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-base font-semibold tracking-wide transition-all duration-200 shadow-xl shadow-emerald-900/50"
              >
                ➕ Agregar Equipo
              </button>

              {/* Tarjeta de filtros/lista del sidebar con RESETS tipográficos y de layout */}
              <div
                className="
                rounded-2xl border border-white/10 bg-neutral-800/70 p-4 sm:p-5 shadow-sm

                /* 🔧 Resets para que SidebarEquipos no rompa el layout */
                text-sm leading-6
                [&_*]:!max-w-none [&_*]:mx-0 [&_*]:text-left
                [&_h1]:text-base [&_h2]:text-base [&_h3]:text-sm
                [&_p]:text-sm [&_small]:text-xs

                /* Flex/Grid internos contenidos */
                [&_.flex]:items-stretch [&_.flex]:justify-start
                [&_.grid]:grid-cols-1 [&_.grid]:gap-2

                /* Botones/links descendientes coherentes */
                [&_button]:w-full [&_button]:h-11 [&_button]:rounded-lg [&_button]:px-3 [&_button]:text-sm
                [&_button]:inline-flex [&_button]:items-center [&_button]:justify-start
                [&_a]:w-full [&_a]:h-11 [&_a]:rounded-lg [&_a]:px-3 [&_a]:text-sm
                [&_a]:inline-flex [&_a]:items-center [&_a]:justify-start

                /* Listas internas con separación */
                [&_li]:mb-2 [&_li:last-child]:mb-0
              "
              >
                <SidebarEquipos
                  filtro={filtro}
                  handleFiltro={handleFiltro}
                  handleAgregar={handleAgregar}
                />
              </div>

              {/* Info/ayuda del panel */}
              <div className="rounded-2xl border border-white/10 bg-neutral-800/40 p-4 sm:p-5">
                <p className="text-xs text-neutral-300/80 leading-5">
                  Agrupamos por <b>mes de ingreso</b> y mostramos el <b>balance mensual</b>.
                </p>
              </div>
            </div>
          </aside>

          {/* ------- LADO DERECHO (MAIN) ------- */}
          <main className="md:h-[100svh] md:overflow-y-auto">
            {/* Header sticky del panel derecho */}
            <div className="sticky top-0 z-10 px-3 sm:px-4 py-3 backdrop-blur bg-neutral-900/85 border-b border-white/10">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base sm:text-lg font-semibold">Lista de Equipos</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMostrarBalances((v) => !v)}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800/70 hover:bg-neutral-800 border border-white/10 text-[12px] sm:text-sm"
                    title={mostrarBalances ? "Ocultar montos" : "Mostrar montos"}
                  >
                    {mostrarBalances ? "Ocultar montos" : "Mostrar montos"}
                  </button>
                </div>
              </div>
            </div>

            {/* Contenido del panel derecho */}
            <div className="px-3 sm:px-4 py-4 space-y-4">
              {/* Buscador + Balance global */}
              <section className="rounded-2xl border border-white/10 bg-neutral-800/40 p-3 sm:p-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div className="lg:col-span-2">
                  <BuscadorComponent
                    onBuscar={async (clienteId) => {
                      setLoading(true);
                      try {
                        if (!clienteId) {
                          await fetchEquipos();
                        } else {
                          const data = await getEquiposByClienteId(clienteId);
                          setEquipos(Array.isArray(data) ? data : []);
                        }
                      } finally {
                        setLoading(false);
                      }
                    }}
                  />
                </div>

                <div className="rounded-xl border border-white/10 bg-neutral-900/40 p-3 flex items-center justify-between">
                  <span className="text-sm text-neutral-300">Balance global</span>
                  <span className="text-xl font-semibold text-emerald-400">
                    {mostrarBalances ? "******" : formatPrice(totalBalanceGeneral)}
                  </span>
                </div>
              </div>
            </section>
              


              {/* Listado por mes */}
              <section className="rounded-2xl border border-white/10 bg-neutral-800/30 p-3 sm:p-4">
                {loading ? (
                  <p className="text-neutral-400 px-1">Cargando equipos...</p>
                ) : !Array.isArray(equipos) || equipos.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/15 p-6 text-center bg-white/5">
                    <p className="text-neutral-300">Aún no hay equipos cargados.</p>
                  </div>
                ) : (
                  equiposAgrupadosPorMes.map(([mes, grupo]) => {
                    const totalMes = grupo.totalBalance;

                    return (
                      <div key={mes} className="mb-6">
                        <div className="border-b border-white/10 pb-2 mb-3">
                          <h4 className="text-lg font-semibold text-neutral-200 capitalize">
                            {grupo.label}
                          </h4>
                        </div>

                        <div className="mb-3">
                          <div className="rounded-xl border border-white/10 bg-neutral-900/40 p-3 flex items-center justify-between">
                            <span className="text-sm text-neutral-300">Balance del mes</span>
                            <span className="text-lg font-semibold text-emerald-400">
                              {mostrarBalances ? "******" : formatPrice(totalMes)}
                            </span>
                          </div>
                        </div>

                        <ol className="space-y-4 list-decimal list-inside">
                          {grupo.equipos.map((eq) => {
                            const fechaFormateada = formatDateShort(eq.fecha_ingreso);
                            const monto = balanceByEquipoId[eq.id]?.balance_final ?? 0;
                            const clienteNombreCompleto = `${eq.cliente_nombre || ''} ${eq.cliente_apellido || ''}`.trim();

                            return (
                              <li
                                key={eq.id}

                                className="rounded-xl border border-white/10 bg-neutral-800/50 p-4 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-3 hover:bg-neutral-800/70 hover:border-white/20 transition"
                              >
                                {/* Info principal */}
                                <div className="flex-1">
                                  <p className="font-semibold text-white">
                                    {eq.tipo?.toUpperCase()} - {eq.marca} {eq.modelo}
                                  </p>
                                  <p className="text-sm text-neutral-300">{eq.problema}</p>
                                  <p className="text-sm text-neutral-300">
                                    Estado: {getNombreEstado(eq.estado_id)}
                                  </p>

                                  {eq.tipo?.toLowerCase() === "celular" && eq.patron && (
                                    <p className="text-sm text-neutral-400">Patrón: {eq.patron}</p>
                                  )}
                                  {eq.tipo?.toLowerCase() !== "consola" && eq.password && (
                                    <p className="text-sm text-neutral-400">Password: {eq.password}</p>
                                  )}

                                  <p className="text-sm text-neutral-400">
                                    Cliente: {clienteNombreCompleto}
                                  </p>
                                  <p className="text-sm text-neutral-500">Ingreso: {fechaFormateada}</p>
                                </div>

                                {/* Mini-card derecha */}
                                <div className="flex flex-col items-end gap-2">
                                  <div className="rounded-lg border border-white/10 bg-neutral-900/40 px-3 py-2 flex items-center gap-2">
                                    <span className="hidden sm:block text-xs text-neutral-300">
                                      Balance
                                    </span>
                                    <span className="text-base md:text-lg font-semibold text-emerald-400">
                                      {mostrarBalances ? "******" : formatPrice(monto)}
                                    </span>
                                  </div>

                                  {/* Botones */}
                                  <div className="flex gap-2">
                                    
                                    {/* BOTÓN DE HISTORIAL CLIENTE */}
                                    {eq.cliente_id && (
                                      <button
                                        onClick={() => handleAbrirHistorial(eq.cliente_id, clienteNombreCompleto)}
                                        className="bg-purple-600/50 hover:bg-purple-700/70 text-purple-300 px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1"
                                        title="Ver historial de equipos y pagos del cliente"
                                      >
                                        <IconHistory /> Historial
                                      </button>
                                    )}

                                    <Link
                                      to={`/equipos/${eq.id}`}
                                      className="bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                                    >
                                      Presupuestos
                                    </Link>
                                    <button
                                      onClick={() => handleModificar(eq)}
                                      className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm font-medium"
                                    >
                                      Modificar
                                    </button>
                                    <button
                                      onClick={() => handleDelete(eq.id)}
                                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-medium"
                                    >
                                      Eliminar
                                    </button>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ol>
                      </div>
                    );
                  })
                )}
              </section>
            </div>
          </main>
        </div>

        {/* Modal de Creación/Modificación de Equipo */}
        <EquipoModal
          isOpen={isOpen}
          onClose={handleClose}
          onSubmit={handleSubmit}
          equipoSeleccionado={equipoSeleccionado}
        />

        {/* Modal de Historial de Pagos del Cliente */}
        <HistorialPagosModal
          isOpen={isHistorialOpen}
          onClose={handleCerrarHistorial}
          clienteId={clienteHistorial.id}
          clienteNombre={clienteHistorial.nombre}
        />

        {/* Alertas */}
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