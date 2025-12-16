

// export default VentasPage;

// import { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import VentasModal from "../components/Ventas/VentasModal.jsx";
// import VentasModalWebShop from "../components/Ventas/VentasModalWebShop.jsx";
// import BuscadorComponent from "../components/General/BuscadorComponent.jsx";
// import Swal from "sweetalert2";
// import "sweetalert2/dist/sweetalert2.css";
// import {
//   getVentas,
//   createVenta,
//   updateVenta,
//   deleteVenta,
// } from "../api/VentaApi.jsx";
// import { getProductos } from "../api/ProductoApi.jsx";

// // Iconos para UX (asumo que tienes una forma de importarlos o que Tailwind los maneja con clases)
// // Usaremos iconos placeholder para ilustrar. En un proyecto real serían íconos de Lucide, Heroicons, etc.
// const IconPlus = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className="h-5 w-5"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//     strokeWidth={2}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M12 4v16m8-8H4"
//     />
//   </svg>
// );
// const IconArrowLeft = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className="h-4 w-4"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//     strokeWidth={2}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M10 19l-7-7m0 0l7-7m-7 7h18"
//     />
//   </svg>
// );
// const IconTrash = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className="h-4 w-4"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//     strokeWidth={2}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//     />
//   </svg>
// );
// const IconEdit = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className="h-4 w-4"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//     strokeWidth={2}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L15.232 5.232z"
//     />
//   </svg>
// );
// const IconMoney = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className="h-5 w-5"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//     strokeWidth={2}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
//     />
//   </svg>
// );
// const IconUsers = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className="h-5 w-5"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//     strokeWidth={2}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M12 4.354l.067.07l.066-.07a2.5 2.5 0 013.536 3.536l-7.071 7.071a2.5 2.5 0 01-3.536 0l-7.071-7.071a2.5 2.5 0 013.536-3.536l.066.07.067-.07A2.5 2.5 0 0112 4.354z"
//     />
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M16 12a4 4 0 10-8 0 4 4 0 008 0z"
//     />
//   </svg>
// );

// const VentasPage = () => {
//   const navigate = useNavigate();
//   const [ventas, setVentas] = useState([]);
//   const [productos, setProductos] = useState([]);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingVenta, setEditingVenta] = useState(null);

//   // ✅ NUEVO: Modal WebShop (solo lectura)
//   const [modalWebOpen, setModalWebOpen] = useState(false);
//   const [selectedWebVenta, setSelectedWebVenta] = useState(null);

//   // NOTA UX: Asumo que BuscadorComponent ya gestiona su propia búsqueda y
//   // devuelve un ID de cliente para el filtro.
//   const [filtroClienteId, setFiltroClienteId] = useState(null);
//   const [filtroCanal, setFiltroCanal] = useState("todos");
//   const [loading, setLoading] = useState(true);

//   // --- Funciones de Lógica NO MODIFICADAS ---
//   const getVentaId = (venta) => venta?.id ?? venta?.venta_id ?? null;
//   const getClienteId = (venta) =>
//     venta?.cliente?.id ?? venta?.cliente_id ?? venta?.cliente ?? null;

//   const fetchData = async (canalValor = filtroCanal) => {
//     setLoading(true);
//     try {
//       const ventasResponse = await getVentas(canalValor);
//       const productosResponse = await getProductos();

//       const ventasData =
//         ventasResponse?.data ?? ventasResponse ?? ventasResponse?.ventas ?? [];
//       const productosData =
//         productosResponse?.data ??
//         productosResponse ??
//         productosResponse?.productos ??
//         [];

//       setVentas(Array.isArray(ventasData) ? ventasData : []);
//       setProductos(Array.isArray(productosData) ? productosData : []);
//     } catch (error) {
//       console.error("Error al obtener datos:", error);
//       setVentas([]);
//       setProductos([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filtroCanal]);

//   const handleGuardarVenta = async (ventaPayload) => {
//     const isWebPayload =
//       !!ventaPayload &&
//       typeof ventaPayload === "object" &&
//       !!ventaPayload.venta &&
//       Array.isArray(ventaPayload.detalles);

//     const ventaIdFromPayload = isWebPayload
//       ? (ventaPayload?.venta?.id ?? ventaPayload?.venta?.venta_id ?? null)
//       : (ventaPayload?.id ?? ventaPayload?.venta?.venta_id ?? null);

//     try {
//       let resp;

//       if (editingVenta || isWebPayload) {
//         const ventaId = editingVenta ? getVentaId(editingVenta) : ventaIdFromPayload;
//         if (!ventaId)
//           throw {
//             error: "No se pudo determinar el ID de la venta para actualizar.",
//           };

//         // ✅ IMPORTANTE: capturamos respuesta y la devolvemos
//         resp = await updateVenta(ventaId, ventaPayload);

//         // ✅ si es web_shop, actualizamos selectedWebVenta en memoria para reflejar en UI inmediato
//         if (isWebPayload) {
//           const updatedVenta =
//             resp?.data?.venta ?? resp?.venta ?? resp?.data?.data?.venta;

//           if (updatedVenta) {
//             setSelectedWebVenta((prev) => ({
//               ...(prev ?? {}),
//               ...updatedVenta,
//             }));
//           } else {
//             // fallback optimista mínimo
//             setSelectedWebVenta((prev) => ({
//               ...(prev ?? {}),
//               monto_abonado: ventaPayload?.venta?.monto_abonado,
//               saldo: ventaPayload?.venta?.saldo,
//               total: ventaPayload?.venta?.total,
//             }));
//           }
//         }

//         Swal.fire({
//           title: "¡Actualizada!",
//           text: isWebPayload
//             ? "El pago de la venta web fue actualizado correctamente."
//             : "La venta ha sido actualizada correctamente.",
//           icon: "success",
//           customClass: {
//             popup:
//               "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
//             title: "text-xl font-bold text-emerald-400",
//             htmlContainer: "text-gray-300",
//           },
//         });
//       } else {
//         resp = await createVenta(ventaPayload);

//         Swal.fire({
//           title: "¡Creada!",
//           text: "La venta ha sido creada correctamente.",
//           icon: "success",
//           customClass: {
//             popup:
//               "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
//             title: "text-xl font-bold text-emerald-400",
//             htmlContainer: "text-gray-300",
//           },
//         });
//       }

//       // ✅ seguí refrescando lista, pero ya reflejaste en el modal
//       await fetchData();

//       return resp; // 🔥 clave: ahora el modal puede await y actualizarse también
//     } catch (error) {
//       console.error("Error al guardar la venta:", error);

//       const backendMsg =
//         error?.response?.data?.error ||
//         error?.error ||
//         error?.message ||
//         "Hubo un problema al guardar la venta.";

//       Swal.fire({
//         title: "Error",
//         text: backendMsg,
//         icon: "error",
//         customClass: {
//           popup:
//             "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
//           title: "text-xl font-bold text-red-400",
//           htmlContainer: "text-gray-300",
//         },
//       });

//       throw error; // ✅ para que el modal pueda manejarlo si hace await
//     } finally {
//       // ✅ Cerrar modal local SIEMPRE
//       setModalOpen(false);
//       setEditingVenta(null);

//       // ❌ NO cierres el modal web acá.
//       // El modal web se cierra desde su onClose o si querés, desde el modal cuando termine ok.
//     }
//   };

//   const handleEditVenta = (venta) => {
//     if (venta?.canal === "web_shop") {
//       setSelectedWebVenta(venta);
//       setModalWebOpen(true);
//       return;
//     }

//     setEditingVenta(venta);
//     setModalOpen(true);
//   };

//   const handleDeleteVenta = (venta) => {
//     const ventaId = getVentaId(venta);
//     Swal.fire({
//       title: "¿Estás seguro?",
//       text: "¡No podrás revertir esta acción!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Sí, eliminar",
//       cancelButtonText: "Cancelar",
//       customClass: {
//         popup:
//           "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
//         title: "text-xl font-bold",
//         htmlContainer: "text-gray-300",
//         confirmButton: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
//         cancelButton: "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500",
//       },
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await deleteVenta(ventaId);
//           await fetchData();
//           Swal.fire({
//             title: "¡Eliminada!",
//             text: "La venta ha sido eliminada correctamente.",
//             icon: "success",
//             customClass: {
//               popup:
//                 "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
//               title: "text-xl font-bold text-emerald-400",
//               htmlContainer: "text-gray-300",
//             },
//           });
//         } catch (error) {
//           console.error("Error al eliminar la venta:", error);
//           Swal.fire({
//             title: "Error",
//             text: "Hubo un problema al eliminar la venta.",
//             icon: "error",
//             customClass: {
//               popup:
//                 "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
//               title: "text-xl font-bold text-red-400",
//               htmlContainer: "text-gray-300",
//             },
//           });
//         }
//       }
//     });
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "Fecha no disponible";
//     const formattedDate = new Date(dateString);
//     if (isNaN(formattedDate.getTime())) return "Fecha no válida"; // Corrección de validación
//     return formattedDate.toLocaleDateString("es-AR", {
//       year: "numeric",
//       month: "short", // Cambiado a corto para lista
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const formatPrice = (price) =>
//     Number(price || 0).toLocaleString("es-AR", {
//       minimumFractionDigits: 2, // Mejor UX para dinero
//       maximumFractionDigits: 2,
//     });

//   // --- Memos de Lógica NO MODIFICADOS ---
//   const ventasFiltradas = useMemo(() => {
//     if (!filtroClienteId) return ventas;
//     return ventas.filter(
//       (venta) => Number(getClienteId(venta)) === Number(filtroClienteId)
//     );
//   }, [ventas, filtroClienteId]);

//   const totalBalanceGeneral = useMemo(() => {
//     return ventas.reduce((acc, venta) => {
//       const totalVenta = parseFloat(venta.total) || 0;
//       const costoVenta = (venta.detalle_venta || []).reduce((costoAcc, det) => {
//         const cantidad = Number(det.cantidad) || 0;
//         const costoUnitario = det.producto ? Number(det.producto.costo) || 0 : 0;
//         return costoAcc + cantidad * costoUnitario;
//       }, 0);
//       const balanceVenta = totalVenta - costoVenta;
//       return acc + balanceVenta;
//     }, 0);
//   }, [ventas]);

//   const ventasAgrupadasPorMes = useMemo(() => {
//     const grupos = ventasFiltradas.reduce((grupos, venta) => {
//       const fechaStr = venta.fecha;
//       let key = "Sin fecha";

//       if (typeof fechaStr === "string") {
//         const [soloFecha] = fechaStr.split("T");
//         const partes = soloFecha?.split("-");
//         if (partes && partes.length === 3) {
//           const [yearStr, monthStr] = partes;
//           const yearNum = Number(yearStr);
//           const monthNum = Number(monthStr);
//           if (!isNaN(yearNum) && !isNaN(monthNum)) {
//             const fechaObj = new Date(yearNum, monthNum - 1, 1); // 1 es el día
//             if (!isNaN(fechaObj.getTime())) {
//               const mesNombre = fechaObj.toLocaleString("es-AR", {
//                 month: "long",
//               });
//               key = `${mesNombre} ${yearNum}`;
//             }
//           }
//         }
//       }

//       if (!grupos[key]) grupos[key] = [];
//       grupos[key].push(venta);
//       return grupos;
//     }, {});

//     // Ordenar por Año y Mes (descendente)
//     return Object.entries(grupos).sort(([keyA], [keyB]) => {
//       const getSortableDate = (key) => {
//         const parts = key.split(" ");
//         const year = Number(parts[1]);
//         const monthName = parts[0];
//         const monthIndex = new Date(Date.parse(monthName + " 1, 2020")).getMonth(); // Truco para obtener el índice del mes

//         return year * 100 + monthIndex;
//       };

//       if (keyA === "Sin fecha") return 1; // Mover al final
//       if (keyB === "Sin fecha") return -1; // Mover al final

//       return getSortableDate(keyB) - getSortableDate(keyA); // Descendente
//     });
//   }, [ventasFiltradas]);
//   // --- FIN Funciones de Lógica NO MODIFICADAS ---

//   return (
//     // ✅ Layout de dashboard moderno: sidebar y main content. Se eliminó 'w-screen' para que
//     // el overflow sea gestionado por el main, y 'min-h-screen' para que crezca con el contenido.
//     <div className="flex bg-neutral-950 text-white min-h-screen">
//       {/* Sidebar (Desktop) */}
//       <aside className="hidden lg:flex w-64 xl:w-72 bg-neutral-900 p-6 flex-col shadow-2xl z-20 border-r border-neutral-800 space-y-6">
//         <h2 className="text-2xl font-extrabold text-purple-400">Ventas Admin</h2>
//         <button
//           onClick={() => navigate("/")}
//           // ✅ Botón secundario con intención clara
//           className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700/70 rounded-lg transition text-sm font-medium text-gray-300 border border-neutral-700"
//         >
//           <IconArrowLeft />
//           Volver al Dashboard
//         </button>

//         {/* ✅ Botón primario con intención clara */}
//         <button
//           onClick={() => {
//             setModalOpen(true);
//             setEditingVenta(null);
//           }}
//           className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold shadow-lg shadow-purple-900/40 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-neutral-900"
//         >
//           <IconPlus />
//           Nueva Venta (Local)
//         </button>
//       </aside>

//       {/* Main Content Area */}
//       <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
//         {/* Header móvil y Desktop Title */}
//         <header className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
//           <h1 className="text-3xl font-extrabold text-white">
//             Gestión de Ventas
//           </h1>
//           {/* Header móvil actions */}
//           <div className="lg:hidden flex gap-3">
//             <button
//               onClick={() => navigate("/")}
//               className="flex items-center gap-1 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm text-gray-300 border border-neutral-700"
//             >
//               <IconArrowLeft />
//               Dashboard
//             </button>
//             <button
//               onClick={() => {
//                 setModalOpen(true);
//                 setEditingVenta(null);
//               }}
//               className="flex items-center gap-1 px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-semibold"
//             >
//               <IconPlus />
//               Nueva Venta
//             </button>
//           </div>
//         </header>

//         {/* Bloque de Controles (Filtros y Búsqueda) */}
//         <div className="space-y-6">
//           <BuscadorComponent onBuscar={setFiltroClienteId} />

//           {/* Filtro por canal (Chips mejorados) */}
//           <div className="flex flex-wrap gap-2 items-center">
//             <span className="text-sm font-medium text-gray-400 mr-2">
//               Canal:
//             </span>
//             {[
//               { value: "todos", label: "Todas" },
//               { value: "local", label: "Local" },
//               { value: "web_shop", label: "Web (Shop)" },
//             ].map((op) => (
//               <button
//                 key={op.value}
//                 onClick={() => setFiltroCanal(op.value)}
//                 // ✅ Chips de filtro con estado activo/inactivo claro
//                 className={`px-4 py-2 rounded-full text-sm font-medium transition duration-150 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-950 ${
//                   filtroCanal === op.value
//                     ? "bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-900/30 focus:ring-purple-400"
//                     : "bg-neutral-800 border-neutral-700 text-gray-300 hover:bg-neutral-700 focus:ring-neutral-600"
//                 }`}
//               >
//                 {op.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Card de Balance Neto */}
//         <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg transition duration-200">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <span className="p-3 bg-purple-600/20 rounded-full text-purple-400">
//                 <IconMoney />
//               </span>
//               <span className="text-sm font-medium text-gray-300">
//                 Balance Neto (Ventas - Costos)
//               </span>
//             </div>
//             <span className="text-2xl font-bold text-emerald-400 tracking-tight">
//               ${formatPrice(totalBalanceGeneral)}
//             </span>
//           </div>
//         </div>

//         {/* Contenido principal: Loading, No Data, o Lista de Ventas */}
//         <div className="pt-4">
//           {loading ? (
//             // ✅ Estado de Loading
//             <div className="flex flex-col items-center justify-center p-10 bg-neutral-900 border border-neutral-800 rounded-xl">
//               <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-3"></div>
//               <p className="text-lg text-purple-300 font-medium">
//                 Cargando ventas...
//               </p>
//               <p className="text-sm text-gray-500">
//                 Obteniendo datos del servidor.
//               </p>
//             </div>
//           ) : ventasFiltradas.length === 0 ? (
//             // ✅ Estado de No Data
//             <div className="flex flex-col items-center justify-center p-10 bg-neutral-900 border border-neutral-800 rounded-xl">
//               <IconUsers className="w-10 h-10 text-gray-600 mb-3" />
//               <p className="text-lg text-gray-400 font-medium">
//                 No hay ventas registradas.
//               </p>
//               <p className="text-sm text-gray-500">
//                 Intenta cambiar el filtro o agrega una nueva venta.
//               </p>
//             </div>
//           ) : (
//             // ✅ Lista de Ventas agrupadas
//             <div className="space-y-10">
//               {ventasAgrupadasPorMes.map(([mes, ventasMes]) => (
//                 <section key={mes}>
//                   <div className="pb-3 border-b border-neutral-800 mb-6">
//                     <h2 className="text-xl font-extrabold text-white capitalize">
//                       {mes}
//                     </h2>
//                     <p className="text-sm text-gray-500">
//                       {ventasMes.length} ventas registradas este mes.
//                     </p>
//                   </div>

//                   <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
//                     {ventasMes.map((venta, vIndex) => {
//                       const ventaKey =
//                         getVentaId(venta) ?? `${mes}-${vIndex}`;

//                       const saldoPendiente = Number(venta.saldo) > 0;
//                       const clienteNombre =
//                         venta.cliente?.nombre ||
//                         venta.cliente_nombre ||
//                         "Cliente Anónimo";
//                       const canalLabel =
//                         venta.canal === "web_shop" ? "WEB" : "LOCAL";

//                       // ✅ Card de Venta: Listado mejorado
//                       return (
//                         <div
//                           key={ventaKey}
//                           className="group bg-neutral-900 p-5 rounded-xl border border-neutral-800 shadow-xl hover:border-purple-600/50 hover:shadow-purple-900/20 transition duration-200 space-y-4 flex flex-col justify-between"
//                         >
//                           {/* Top Info */}
//                           <div className="flex justify-between items-start">
//                             <div className="space-y-1">
//                               {/* Cliente */}
//                               <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
//                                 Cliente:{" "}
//                                 <span className="text-white truncate max-w-[150px]">
//                                   {clienteNombre}{" "}
//                                   {venta.cliente?.apellido || ""}
//                                 </span>
//                               </p>

//                               {/* Total y Canal */}
//                               <div className="flex items-center gap-3">
//                                 <span className="text-2xl font-extrabold text-purple-400 tracking-tight">
//                                   ${formatPrice(venta.total)}
//                                 </span>
//                                 {/* ✅ Badge canal */}
//                                 <span
//                                   className={`ml-1 text-xs px-2 py-1 rounded-full font-semibold ${
//                                     venta.canal === "web_shop"
//                                       ? "bg-emerald-600/20 text-emerald-400"
//                                       : "bg-gray-600/20 text-gray-300"
//                                   }`}
//                                 >
//                                   {canalLabel}
//                                 </span>
//                               </div>
//                             </div>

//                             {/* ✅ Badge de Estado de Saldo (Feedback Visual) */}
//                             <div
//                               className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
//                                 saldoPendiente
//                                   ? "bg-red-600/20 text-red-400 border border-red-600/50"
//                                   : "bg-green-600/20 text-green-400 border border-green-600/50"
//                               }`}
//                             >
//                               {saldoPendiente ? "PENDIENTE" : "SALDADA"}
//                             </div>
//                           </div>

//                           {/* Detalles Financieros y Fecha */}
//                           <div className="grid grid-cols-2 gap-2 text-sm border-t border-neutral-800 pt-3">
//                             <p className="text-gray-500">Fecha:</p>
//                             <p className="text-right text-gray-300 font-light">
//                               {formatDate(venta.fecha)}
//                             </p>

//                             <p className="text-gray-500">Abonado:</p>
//                             <p className="text-right text-white font-medium">
//                               ${formatPrice(venta.monto_abonado)}
//                             </p>

//                             <p className="text-gray-500">Saldo:</p>
//                             <p
//                               className={`text-right font-bold ${
//                                 saldoPendiente ? "text-red-400" : "text-green-400"
//                               }`}
//                             >
//                               ${formatPrice(venta.saldo)}
//                             </p>
//                           </div>

//                           {/* Acciones */}
//                           <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
//                             {/* ✅ Botón de edición: Primario/Call-to-Action si tiene saldo pendiente o es web_shop */}
//                             <button
//                               onClick={() => handleEditVenta(venta)}
//                               className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 ${
//                                 saldoPendiente || venta.canal === "web_shop"
//                                   ? "bg-purple-600 hover:bg-purple-500 text-white focus:ring-purple-400"
//                                   : "bg-neutral-800 hover:bg-neutral-700 text-gray-300 focus:ring-neutral-600 border border-neutral-700"
//                               }`}
//                             >
//                               <IconEdit />
//                               {venta.canal === "web_shop"
//                                 ? "Ver Detalles/Pagar"
//                                 : "Editar"}
//                             </button>

//                             {/* ✅ Botón de peligro: Secundaria, clara intención */}
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleDeleteVenta(venta);
//                               }}
//                               className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold bg-red-600/20 hover:bg-red-600/40 text-red-400 transition duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-neutral-900"
//                             >
//                               <IconTrash />
//                               Eliminar
//                             </button>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </section>
//               ))}
//             </div>
//           )}
//         </div>
//       </main>

//       {/* ✅ Modal local (editable) - Sin cambios en lógica */}
//       {modalOpen && (
//         <VentasModal
//           onClose={() => {
//             setModalOpen(false);
//             setEditingVenta(null);
//           }}
//           onGuardar={handleGuardarVenta}
//           initialData={editingVenta}
//           productos={productos}
//         />
//       )}

//       {/* ✅ Modal web_shop (solo lectura) - Sin cambios en lógica */}
//       <VentasModalWebShop
//         open={modalWebOpen}
//         venta={selectedWebVenta}
//         onGuardar={handleGuardarVenta}
//         onClose={() => {
//           setModalWebOpen(false);
//           setSelectedWebVenta(null);
//         }}
//       />
//     </div>
//   );
// };

// export default VentasPage;


import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import VentasModal from "../components/Ventas/VentasModal.jsx";
import VentasModalWebShop from "../components/Ventas/VentasModalWebShop.jsx";
import BuscadorComponent from "../components/General/BuscadorComponent.jsx";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import {
  getVentas,
  createVenta,
  updateVenta,
  deleteVenta,
} from "../api/VentaApi.jsx";
import { getProductos } from "../api/ProductoApi.jsx";

// Iconos para UX (asumo que tienes una forma de importarlos o que Tailwind los maneja con clases)
const IconPlus = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4v16m8-8H4"
    />
  </svg>
);
const IconArrowLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);
const IconTrash = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);
const IconEdit = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L15.232 5.232z"
    />
  </svg>
);
const IconMoney = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);
const IconUsers = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.354l.067.07l.066-.07a2.5 2.5 0 013.536 3.536l-7.071 7.071a2.5 2.5 0 01-3.536 0l-7.071-7.071a2.5 2.5 0 013.536-3.536l.066.07.067-.07A2.5 2.5 0 0112 4.354z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 12a4 4 0 10-8 0 4 4 0 008 0z"
    />
  </svg>
);

const VentasPage = () => {
  const navigate = useNavigate();
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingVenta, setEditingVenta] = useState(null);

  // ✅ NUEVO: Modal WebShop (solo lectura)
  const [modalWebOpen, setModalWebOpen] = useState(false);
  const [selectedWebVenta, setSelectedWebVenta] = useState(null);

  const [filtroClienteId, setFiltroClienteId] = useState(null);
  const [filtroCanal, setFiltroCanal] = useState("todos");
  const [loading, setLoading] = useState(true);

  // --- Funciones de Lógica NO MODIFICADAS ---
  const getVentaId = (venta) => venta?.id ?? venta?.venta_id ?? null;
  const getClienteId = (venta) =>
    venta?.cliente?.id ?? venta?.cliente_id ?? venta?.cliente ?? null;

  const fetchData = async (canalValor = filtroCanal) => {
    setLoading(true);
    try {
      const ventasResponse = await getVentas(canalValor);
      const productosResponse = await getProductos();

      const ventasData =
        ventasResponse?.data ?? ventasResponse ?? ventasResponse?.ventas ?? [];
      const productosData =
        productosResponse?.data ??
        productosResponse ??
        productosResponse?.productos ??
        [];

      setVentas(Array.isArray(ventasData) ? ventasData : []);
      setProductos(Array.isArray(productosData) ? productosData : []);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setVentas([]);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroCanal]);

  const handleGuardarVenta = async (ventaPayload) => {
    const isWebPayload =
      !!ventaPayload &&
      typeof ventaPayload === "object" &&
      !!ventaPayload.venta &&
      Array.isArray(ventaPayload.detalles);

    const ventaIdFromPayload = isWebPayload
      ? (ventaPayload?.venta?.id ?? ventaPayload?.venta?.venta_id ?? null)
      : (ventaPayload?.id ?? ventaPayload?.venta?.venta_id ?? null);

    try {
      let resp;

      if (editingVenta || isWebPayload) {
        const ventaId = editingVenta ? getVentaId(editingVenta) : ventaIdFromPayload;
        if (!ventaId)
          throw {
            error: "No se pudo determinar el ID de la venta para actualizar.",
          };

        // ✅ IMPORTANTE: capturamos respuesta y la devolvemos
        resp = await updateVenta(ventaId, ventaPayload);

        // ✅ si es web_shop, actualizamos selectedWebVenta en memoria para reflejar en UI inmediato
        if (isWebPayload) {
          const updatedVenta =
            resp?.data?.venta ?? resp?.venta ?? resp?.data?.data?.venta;

          if (updatedVenta) {
            setSelectedWebVenta((prev) => ({
              ...(prev ?? {}),
              ...updatedVenta,
            }));
          } else {
            // fallback optimista mínimo
            setSelectedWebVenta((prev) => ({
              ...(prev ?? {}),
              monto_abonado: ventaPayload?.venta?.monto_abonado,
              saldo: ventaPayload?.venta?.saldo,
              total: ventaPayload?.venta?.total,
            }));
          }
        }

        Swal.fire({
          title: "¡Actualizada!",
          text: isWebPayload
            ? "El pago de la venta web fue actualizado correctamente."
            : "La venta ha sido actualizada correctamente.",
          icon: "success",
          customClass: {
            popup:
              "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
            title: "text-xl font-bold text-emerald-400",
            htmlContainer: "text-gray-300",
          },
        });
      } else {
        resp = await createVenta(ventaPayload);

        Swal.fire({
          title: "¡Creada!",
          text: "La venta ha sido creada correctamente.",
          icon: "success",
          customClass: {
            popup:
              "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
            title: "text-xl font-bold text-emerald-400",
            htmlContainer: "text-gray-300",
          },
        });
      }

      // ✅ seguí refrescando lista, pero ya reflejaste en el modal
      await fetchData();

      return resp; // 🔥 clave: ahora el modal puede await y actualizarse también
    } catch (error) {
      console.error("Error al guardar la venta:", error);

      const backendMsg =
        error?.response?.data?.error ||
        error?.error ||
        error?.message ||
        "Hubo un problema al guardar la venta.";

      Swal.fire({
        title: "Error",
        text: backendMsg,
        icon: "error",
        customClass: {
          popup:
            "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
          title: "text-xl font-bold text-red-400",
          htmlContainer: "text-gray-300",
        },
      });

      throw error; // ✅ para que el modal pueda manejarlo si hace await
    } finally {
      // ✅ Cerrar modal local SIEMPRE
      setModalOpen(false);
      setEditingVenta(null);

      // ❌ NO cierres el modal web acá.
    }
  };

  const handleEditVenta = (venta) => {
    if (venta?.canal === "web_shop") {
      setSelectedWebVenta(venta);
      setModalWebOpen(true);
      return;
    }

    setEditingVenta(venta);
    setModalOpen(true);
  };

  const handleDeleteVenta = (venta) => {
    const ventaId = getVentaId(venta);
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup:
          "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
        title: "text-xl font-bold",
        htmlContainer: "text-gray-300",
        confirmButton: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
        cancelButton: "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteVenta(ventaId);
          await fetchData();
          Swal.fire({
            title: "¡Eliminada!",
            text: "La venta ha sido eliminada correctamente.",
            icon: "success",
            customClass: {
              popup:
                "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
              title: "text-xl font-bold text-emerald-400",
              htmlContainer: "text-gray-300",
            },
          });
        } catch (error) {
          console.error("Error al eliminar la venta:", error);
          Swal.fire({
            title: "Error",
            text: "Hubo un problema al eliminar la venta.",
            icon: "error",
            customClass: {
              popup:
                "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
              title: "text-xl font-bold text-red-400",
              htmlContainer: "text-gray-300",
            },
          });
        }
      }
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    const formattedDate = new Date(dateString);
    if (isNaN(formattedDate.getTime())) return "Fecha no válida";
    return formattedDate.toLocaleDateString("es-AR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // --- Memos de Lógica NO MODIFICADOS (Ajustado ventasAgrupadasPorMes) ---
  const ventasFiltradas = useMemo(() => {
    if (!filtroClienteId) return ventas;
    return ventas.filter(
      (venta) => Number(getClienteId(venta)) === Number(filtroClienteId)
    );
  }, [ventas, filtroClienteId]);

  const totalBalanceGeneral = useMemo(() => {
    return ventas.reduce((acc, venta) => {
      const totalVenta = parseFloat(venta.total) || 0;
      const costoVenta = (venta.detalle_venta || []).reduce((costoAcc, det) => {
        const cantidad = Number(det.cantidad) || 0;
        const productoInfo = productos.find((p) => p.id === det.producto_id); // Buscar info del producto
        const costoUnitario = productoInfo ? Number(productoInfo.costo) || 0 : 0;
        return costoAcc + cantidad * costoUnitario;
      }, 0);
      const balanceVenta = totalVenta - costoVenta;
      return acc + balanceVenta;
    }, 0);
  }, [ventas, productos]); // Agregamos 'productos' como dependencia

  /**
   * ✅ MEJORA: ventasAgrupadasPorMes ahora calcula y retorna el Balance Mensual
   * junto con el array de ventas.
   */
  const ventasAgrupadasPorMes = useMemo(() => {
    const grupos = ventasFiltradas.reduce((grupos, venta) => {
      const fechaStr = venta.fecha;
      let key = "Sin fecha";
      let balanceVenta = 0;

      // 1. Cálculo de Balance para la Venta (igual a totalBalanceGeneral)
      const totalVenta = parseFloat(venta.total) || 0;
      const costoVenta = (venta.detalle_venta || []).reduce((costoAcc, det) => {
        const cantidad = Number(det.cantidad) || 0;
        // Importante: encontrar el costo del producto para la resta
        const productoInfo = productos.find((p) => p.id === det.producto_id);
        const costoUnitario = productoInfo ? Number(productoInfo.costo) || 0 : 0;
        return costoAcc + cantidad * costoUnitario;
      }, 0);
      balanceVenta = totalVenta - costoVenta;

      // 2. Lógica de Agrupación
      if (typeof fechaStr === "string") {
        const [soloFecha] = fechaStr.split("T");
        const partes = soloFecha?.split("-");
        if (partes && partes.length === 3) {
          const [yearStr, monthStr] = partes;
          const yearNum = Number(yearStr);
          const monthNum = Number(monthStr);
          if (!isNaN(yearNum) && !isNaN(monthNum)) {
            const fechaObj = new Date(yearNum, monthNum - 1, 1);
            if (!isNaN(fechaObj.getTime())) {
              const mesNombre = fechaObj.toLocaleString("es-AR", {
                month: "long",
              });
              key = `${mesNombre} ${yearNum}`;
            }
          }
        }
      }

      if (!grupos[key]) grupos[key] = { ventas: [], balance: 0 };
      grupos[key].ventas.push(venta);
      // Acumular balance en el grupo
      grupos[key].balance += balanceVenta; 
      
      return grupos;
    }, {});

    // Ordenar por Año y Mes (descendente)
    return Object.entries(grupos).sort(([keyA], [keyB]) => {
      const getSortableDate = (key) => {
        const parts = key.split(" ");
        const year = Number(parts[1]);
        // Parsea el nombre del mes para obtener su índice
        const monthIndex = new Date(Date.parse(parts[0] + " 1, 2020")).getMonth(); 

        return year * 100 + monthIndex;
      };

      if (keyA === "Sin fecha") return 1;
      if (keyB === "Sin fecha") return -1;

      return getSortableDate(keyB) - getSortableDate(keyA);
    });
  }, [ventasFiltradas, productos]); // Dependencia de productos es CRUCIAL para el cálculo del costo
  // --- FIN Memos de Lógica ---

  return (
    <div className="flex bg-neutral-950 text-white min-h-screen">
      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex w-64 xl:w-72 bg-neutral-900 p-6 flex-col shadow-2xl z-20 border-r border-neutral-800 space-y-6">
        <h2 className="text-2xl font-extrabold text-purple-400">Ventas Admin</h2>
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700/70 rounded-lg transition text-sm font-medium text-gray-300 border border-neutral-700"
        >
          <IconArrowLeft />
          Volver al Dashboard
        </button>

        <button
          onClick={() => {
            setModalOpen(true);
            setEditingVenta(null);
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold shadow-lg shadow-purple-900/40 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-neutral-900"
        >
          <IconPlus />
          Nueva Venta (Local)
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
        {/* Header móvil y Desktop Title */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h1 className="text-3xl font-extrabold text-white">
            Gestión de Ventas
          </h1>
          {/* Header móvil actions */}
          <div className="lg:hidden flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm text-gray-300 border border-neutral-700"
            >
              <IconArrowLeft />
              Dashboard
            </button>
            <button
              onClick={() => {
                setModalOpen(true);
                setEditingVenta(null);
              }}
              className="flex items-center gap-1 px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-semibold"
            >
              <IconPlus />
              Nueva Venta
            </button>
          </div>
        </header>

        {/* Bloque de Controles (Filtros y Búsqueda) */}
        <div className="space-y-6">
          <BuscadorComponent onBuscar={setFiltroClienteId} />

          {/* Filtro por canal (Chips mejorados) */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-400 mr-2">
              Canal:
            </span>
            {[
              { value: "todos", label: "Todas" },
              { value: "local", label: "Local" },
              { value: "web_shop", label: "Web (Shop)" },
            ].map((op) => (
              <button
                key={op.value}
                onClick={() => setFiltroCanal(op.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition duration-150 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-950 ${
                  filtroCanal === op.value
                    ? "bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-900/30 focus:ring-purple-400"
                    : "bg-neutral-800 border-neutral-700 text-gray-300 hover:bg-neutral-700 focus:ring-neutral-600"
                }`}
              >
                {op.label}
              </button>
            ))}
          </div>
        </div>

        {/* Card de Balance Neto General */}
        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg transition duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-3 bg-purple-600/20 rounded-full text-purple-400">
                <IconMoney />
              </span>
              <span className="text-sm font-medium text-gray-300">
                Balance Neto TOTAL (Ventas - Costos)
              </span>
            </div>
            <span className="text-2xl font-bold text-emerald-400 tracking-tight">
              ${formatPrice(totalBalanceGeneral)}
            </span>
          </div>
        </div>

        {/* Contenido principal: Loading, No Data, o Lista de Ventas */}
        <div className="pt-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-10 bg-neutral-900 border border-neutral-800 rounded-xl">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-lg text-purple-300 font-medium">
                Cargando ventas...
              </p>
              <p className="text-sm text-gray-500">
                Obteniendo datos del servidor.
              </p>
            </div>
          ) : ventasFiltradas.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 bg-neutral-900 border border-neutral-800 rounded-xl">
              <IconUsers className="w-10 h-10 text-gray-600 mb-3" />
              <p className="text-lg text-gray-400 font-medium">
                No hay ventas registradas.
              </p>
              <p className="text-sm text-gray-500">
                Intenta cambiar el filtro o agrega una nueva venta.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {ventasAgrupadasPorMes.map(([mes, data]) => {
                const { ventas: ventasMes, balance: balanceMes } = data; // ✅ Desestructura las ventas y el balance mensual

                return (
                  <section key={mes}>
                    {/* ✅ Encabezado de grupo con Balance Mensual */}
                    <div className="pb-3 border-b border-neutral-800 mb-6 flex justify-between items-end">
                      <div>
                        <h2 className="text-xl font-extrabold text-white capitalize">
                          {mes}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {ventasMes.length} ventas registradas este mes.
                        </p>
                      </div>

                      {/* Balance Mensual destacado */}
                      <div className="text-right flex flex-col items-end">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Balance Mensual
                        </p>
                        <span
                          className={`text-2xl font-extrabold tracking-tight ${
                            balanceMes >= 0 ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          ${formatPrice(balanceMes)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                      {ventasMes.map((venta, vIndex) => {
                        const ventaKey =
                          getVentaId(venta) ?? `${mes}-${vIndex}`;

                        const saldoPendiente = Number(venta.saldo) > 0;
                        const clienteNombre =
                          venta.cliente?.nombre ||
                          venta.cliente_nombre ||
                          "Cliente Anónimo";
                        const canalLabel =
                          venta.canal === "web_shop" ? "WEB" : "LOCAL";

                        return (
                          <div
                            key={ventaKey}
                            className="group bg-neutral-900 p-5 rounded-xl border border-neutral-800 shadow-xl hover:border-purple-600/50 hover:shadow-purple-900/20 transition duration-200 space-y-4 flex flex-col justify-between"
                          >
                            {/* Top Info */}
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                {/* Cliente */}
                                <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
                                  Cliente:{" "}
                                  <span className="text-white truncate max-w-[150px]">
                                    {clienteNombre}{" "}
                                    {venta.cliente?.apellido || ""}
                                  </span>
                                </p>

                                {/* Total y Canal */}
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl font-extrabold text-purple-400 tracking-tight">
                                    ${formatPrice(venta.total)}
                                  </span>
                                  {/* ✅ Badge canal */}
                                  <span
                                    className={`ml-1 text-xs px-2 py-1 rounded-full font-semibold ${
                                      venta.canal === "web_shop"
                                        ? "bg-emerald-600/20 text-emerald-400"
                                        : "bg-gray-600/20 text-gray-300"
                                    }`}
                                  >
                                    {canalLabel}
                                  </span>
                                </div>
                              </div>

                              {/* ✅ Badge de Estado de Saldo (Feedback Visual) */}
                              <div
                                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                                  saldoPendiente
                                    ? "bg-red-600/20 text-red-400 border border-red-600/50"
                                    : "bg-green-600/20 text-green-400 border border-green-600/50"
                                }`}
                              >
                                {saldoPendiente ? "PENDIENTE" : "SALDADA"}
                              </div>
                            </div>

                            {/* Detalles Financieros y Fecha */}
                            <div className="grid grid-cols-2 gap-2 text-sm border-t border-neutral-800 pt-3">
                              <p className="text-gray-500">Fecha:</p>
                              <p className="text-right text-gray-300 font-light">
                                {formatDate(venta.fecha)}
                              </p>

                              <p className="text-gray-500">Abonado:</p>
                              <p className="text-right text-white font-medium">
                                ${formatPrice(venta.monto_abonado)}
                              </p>

                              <p className="text-gray-500">Saldo:</p>
                              <p
                                className={`text-right font-bold ${
                                  saldoPendiente
                                    ? "text-red-400"
                                    : "text-green-400"
                                }`}
                              >
                                ${formatPrice(venta.saldo)}
                              </p>
                            </div>

                            {/* Acciones */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                              <button
                                onClick={() => handleEditVenta(venta)}
                                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 ${
                                  saldoPendiente || venta.canal === "web_shop"
                                    ? "bg-purple-600 hover:bg-purple-500 text-white focus:ring-purple-400"
                                    : "bg-neutral-800 hover:bg-neutral-700 text-gray-300 focus:ring-neutral-600 border border-neutral-700"
                                }`}
                              >
                                <IconEdit />
                                {venta.canal === "web_shop"
                                  ? "Ver Detalles/Pagar"
                                  : "Editar"}
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteVenta(venta);
                                }}
                                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold bg-red-600/20 hover:bg-red-600/40 text-red-400 transition duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-neutral-900"
                              >
                                <IconTrash />
                                Eliminar
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ✅ Modal local (editable) */}
      {modalOpen && (
        <VentasModal
          onClose={() => {
            setModalOpen(false);
            setEditingVenta(null);
          }}
          onGuardar={handleGuardarVenta}
          initialData={editingVenta}
          productos={productos}
        />
      )}

      {/* ✅ Modal web_shop (solo lectura) */}
      <VentasModalWebShop
        open={modalWebOpen}
        venta={selectedWebVenta}
        onGuardar={handleGuardarVenta}
        onClose={() => {
          setModalWebOpen(false);
          setSelectedWebVenta(null);
        }}
      />
    </div>
  );
};

export default VentasPage;