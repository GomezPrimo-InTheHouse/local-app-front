
// import { useEffect, useState } from "react";
// import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
// import { getEquipoById } from "../api/EquiposApi.jsx";
// import { getPresupuestosByEquipo, deletePresupuesto } from "../api/PresupuestoApi.jsx";
// import { getEstados } from "../api/EstadoApi.jsx";
// import Swal from "sweetalert2";
// import PresupuestoModal from "../components/Presupuesto/PresupuestoModal.jsx";
// import CambiarEstadoModal from "../components/Ingreso/CambiarEstadoModal.jsx";
// import AlertNotification from "../components/Alerta/AlertNotification.jsx";

// const DetalleEquiposPage = () => {
//   const { id } = useParams();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [ingresoActual, setIngresoActual] = useState(null);

//   const [presupuestos, setPresupuestos] = useState([]);
//   const [estados, setEstados] = useState([]);

//   const [isEstadoModalOpen, setIsEstadoModalOpen] = useState(false);
//   const [modalAbierto, setModalAbierto] = useState(false);
//   const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState(null);
//   const [ingresoSeleccionado, setIngresoSeleccionado] = useState(null);

//   const location = useLocation();
//   const nuevoIngresoId = location.state?.nuevoIngresoId;
//   const navigate = useNavigate();

//   const [alertMessage, setAlertMessage] = useState("");
//   const [alertType, setAlertType] = useState("success");
//   const showAlert = (message, type = "success") => {
//     setAlertMessage(message);
//     setAlertType(type);
//     setTimeout(() => setAlertMessage(""), 2000);
//   };

//   // Helpers UI
//   const currency = (n) =>
//     (n ?? 0).toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 });

//   const estadoClase = (nombre) => {
//     const s = (nombre || "").toLowerCase();
//     if (s.includes("rechaz")) return "bg-red-500/15 text-red-300 border-red-400/20";
//     if (s.includes("entregado") || s.includes("cobrado")) return "bg-emerald-500/15 text-emerald-300 border-emerald-400/20";
//     if (s.includes("finaliz")) return "bg-sky-500/15 text-sky-300 border-sky-400/20";
//     if (s.includes("pend")) return "bg-amber-500/15 text-amber-300 border-amber-400/20";
//     return "bg-white/10 text-white/80 border-white/10";
//   };



//   useEffect(() => {
//     if (!nuevoIngresoId) return;
//     setIngresoActual((prev) => {
//       if (prev && prev.id === nuevoIngresoId) return prev;
//       return prev ? { ...prev, id: nuevoIngresoId } : { id: nuevoIngresoId };
//     });
//   }, [nuevoIngresoId]);

//   useEffect(() => {
//     (async () => {
//       const data = await getEstados();
//       setEstados(data);
//     })();
//   }, []);

//   const estadoIngresoNombre =
//     estados.find((e) => e.id === ingresoActual?.estado)?.nombre || "Sin estado definido";

//   const normalizePresupuestosResponse = (res) => {
//     if (!res) return [];
//     if (Array.isArray(res)) return res;
//     if (res.data && Array.isArray(res.data)) return res.data;
//     return [];
//   };

//   const fetchAll = async () => {
//     try {
//       setLoading(true);
//       const equipoResp = await getEquipoById(id);
//       setData(equipoResp);
//       const ingreso = equipoResp?.detalles?.ingreso ?? null;
//       setIngresoActual(ingreso);

//       const rawPres = await getPresupuestosByEquipo(id);
//       const lista = normalizePresupuestosResponse(rawPres);

//       const ordenados = [...lista].sort((a, b) => {
//         const A = new Date(a.fecha_presupuesto || a.fecha || 0).getTime();
//         const B = new Date(b.fecha_presupuesto || b.fecha || 0).getTime();
//         return B - A;
//       });

//       setPresupuestos(ordenados);
//     } catch (err) {
//       console.error("Error cargando detalle/presupuestos:", err);
//       showAlert("Error cargando datos del equipo", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAll();
//   }, [id]);

//   const handleEliminarPresupuesto = async (presupuestoId) => {
//     if (!presupuestoId) return;

//     Swal.fire({
//       title: "Eliminar Presupuesto",
//       text: "¿Estás seguro de que deseas eliminar este presupuesto?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Sí, eliminar",
//       cancelButtonText: "Cancelar",
//       theme: "dark",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await deletePresupuesto(presupuestoId);
//           setAlertMessage("✅ Presupuesto eliminado con éxito");
//           await refrescarPresupuestos();
//         } catch (error) {
//           console.error("Error al eliminar presupuesto:", error);
//           setAlertMessage("❌ Ocurrió un error al eliminar el presupuesto.");
//         }
//       }
//     });
//   };

//   const refrescarPresupuestos = async () => {
//     try {
//       const raw = await getPresupuestosByEquipo(id);
//       const lista = normalizePresupuestosResponse(raw);
//       setPresupuestos(
//         [...lista].sort(
//           (a, b) =>
//             new Date(b.fecha_presupuesto || b.fecha) - new Date(a.fecha_presupuesto || a.fecha)
//         )
//       );
//     } catch (err) {
//       console.error("Error refrescando presupuestos:", err);
//     }
//   };

//   const handleNuevoPresupuesto = () => {
//     if (!ingresoActual) {
//       showAlert("No existe ingreso activo para crear presupuesto", "error");
//       return;
//     }
//     setPresupuestoSeleccionado(null);
//     setIngresoSeleccionado({ id: ingresoActual.id });
//     setModalAbierto(true);
//   };

//   const handleEditarPresupuesto = (presupuesto) => {
//     setPresupuestoSeleccionado(presupuesto);
//     setIngresoSeleccionado({ id: presupuesto.ingreso_id });
//     setModalAbierto(true);
//   };

//   if (loading) return <p className="text-neutral-400 p-6">Cargando...</p>;
//   if (!data) return <p className="text-neutral-400 p-6">Equipo no encontrado.</p>;

//   const { equipo, cliente } = data;

//   const presupuestosValidos = Array.isArray(presupuestos)
//     ? presupuestos.filter((p) => p && (p.presupuesto_id || p.id))
//     : [];

//   const totalCostos = presupuestosValidos.reduce(
//     (acc, p) => acc + (p.costo_presupuesto ?? p.costo ?? 0),
//     0
//   );
//   const totalIngresos = presupuestosValidos.reduce(
//     (acc, p) => acc + (p.total_presupuesto ?? p.total ?? 0),
//     0
//   );
//   const totalFinal = totalIngresos - totalCostos;

//   return (
//     <div className="flex flex-col min-h-dvh w-screen bg-neutral-900 text-white/95">
//       {/* Alerta global */}
//       {alertMessage && (
//         <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
//           <AlertNotification message={alertMessage} type={alertType} />
//         </div>
//       )}

//       {/* Header sticky + breadcrumb + acciones */}
//       <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur bg-neutral-900/80">
//         <div className="max-w-6xl mx-auto px-2 sm:px-4 h-12 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
//           {/* Breadcrumb compacto con truncado en móvil */}
//           <nav className="flex-1 min-w-0 text-[11px] sm:text-sm text-neutral-300 truncate">
//             <Link to="/equipos" className="hover:text-white underline-offset-4 hover:underline">
//               Equipos
//             </Link>
//             <span className="mx-2 text-neutral-500">/</span>
//             <span className="text-white/90 truncate align-middle">Detalle #{equipo?.id ?? id}</span>
//           </nav>

//           {/* Acciones: compactas en móvil, normales en sm+; scroll horizontal si no entran */}
//           <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
//             <button
//               onClick={() => navigate(`/equipos/${equipo.id}/historial`)}
//               className="px-2 py-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-neutral-800/70 hover:bg-neutral-800 border border-white/10 text-[11px] sm:text-sm whitespace-nowrap"
//             >
//               Ver Historial
//             </button>

//             <button
//               onClick={() => {
//                 if (!ingresoActual) {
//                   showAlert("No hay ingreso para modificar", "error");
//                   return;
//                 }
//                 setIsEstadoModalOpen(true);
//               }}
//               className="px-2 py-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-sky-600 hover:bg-sky-700 text-[11px] sm:text-sm font-medium whitespace-nowrap"
//             >
//               Actualizar Ingreso
//             </button>

//             <button
//               onClick={handleNuevoPresupuesto}
//               className="px-2 py-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-emerald-600 hover:bg-emerald-700 text-[11px] sm:text-sm font-semibold whitespace-nowrap"
//             >
//               + Crear Presupuesto
//             </button>
//           </div>
//         </div>
//       </header>


//       {/* Contenido */}
//       <main className="flex-1">
//         <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 space-y-6">
//           {/* Cabecera: info + balance */}
//           <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//             {/* Info del equipo y cliente */}
//             <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-neutral-800/50 p-4 sm:p-5">
//               <div className="flex flex-wrap items-start justify-between gap-3">
//                 <div>
//                   <h1 className="text-lg sm:text-xl font-semibold">
//                     {equipo?.tipo?.toUpperCase()} — {equipo?.marca} {equipo?.modelo}
//                   </h1>
//                   <p className="text-sm text-neutral-300/90">{equipo?.problema}</p>
//                 </div>
//                 <span
//                   className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] sm:text-xs ${estadoClase(
//                     estadoIngresoNombre
//                   )}`}
//                   title="Estado actual del ingreso"
//                 >
//                   <span className="h-2 w-2 rounded-full bg-current opacity-70"></span>
//                   {estadoIngresoNombre}
//                 </span>
//               </div>

//               {/* Fechas */}
//               <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm leading-5">
//                 <div className="rounded-xl border border-white/10 bg-white/5 p-3">
//                   <p className="text-neutral-300/80">Ingreso</p>
//                   <p className="font-medium">
//                     {ingresoActual?.fecha_ingreso
//                       ? new Date(ingresoActual.fecha_ingreso).toLocaleDateString("es-AR")
//                       : "Sin fecha"}
//                   </p>
//                 </div>
//                 <div className="rounded-xl border border-white/10 bg-white/5 p-3">
//                   <p className="text-neutral-300/80">Egreso</p>
//                   <p className="font-medium">
//                     {ingresoActual?.fecha_egreso
//                       ? new Date(ingresoActual.fecha_egreso).toLocaleDateString("es-AR")
//                       : "No definido"}
//                   </p>
//                 </div>
//               </div>

//               {/* Cliente: nombre, teléfono y dirección */}
//               <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm leading-5">
//                 <div className="rounded-xl border border-white/10 bg-white/5 p-3">
//                   <p className="text-neutral-300/80">Cliente</p>
//                   <p className="font-medium">
//                     {cliente?.nombre} {cliente?.apellido}
//                   </p>
//                   <p className="text-neutral-300/80 mt-1">
//                     Tel: <span className="font-medium">{cliente?.celular || "—"}</span>
//                   </p>
//                 </div>
//                 <div className="rounded-xl border border-white/10 bg-white/5 p-3">
//                   <p className="text-neutral-300/80">Dirección</p>
//                   <p className="font-medium">{cliente?.direccion || "—"}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Balance */}
//             {/* Balance */}
//             <aside className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-600 to-teal-500 p-4 sm:p-5 text-white shadow-soft">
//               <h3 className="text-xs sm:text-sm font-semibold opacity-90 mb-1 leading-5">
//                 Balance Total
//               </h3>

//               {/* Número principal:
//      - XS: 2.5rem (text-4xl)
//      - SM: 3.75rem (text-6xl)
//      - LG: 4.5rem (text-7xl)
//   */}
//               <p className="text-4xl sm:text-4xl lg:text-4xl font-extrabold tracking-tight">
//                 {currency(totalFinal)}
//               </p>

//               {/* Desglose:
//      - Números crecen con el viewport
//      - Tarjetas con más padding en pantallas grandes
//   */}
//               <div className="mt-4 grid grid-cols-2 gap-2">
//                 <div className="rounded-xl bg-black/15 p-2 sm:p-3">
//                   <p className="text-[11px] sm:text-xs opacity-80 leading-5">Ingresos</p>
//                   <p className="text-base sm:text-2xl lg:text-3xl font-bold">{currency(totalIngresos)}</p>
//                 </div>
//                 <div className="rounded-xl bg-black/15 p-2 sm:p-3">
//                   <p className="text-[11px] sm:text-xs opacity-80 leading-5">Costos</p>
//                   <p className="text-base sm:text-2xl lg:text-3xl font-bold">{currency(totalCostos)}</p>
//                 </div>
//               </div>
//             </aside>

//           </section>

//           {/* Lista de presupuestos */}
//           <section className="rounded-2xl border border-white/10 bg-neutral-800/50 p-4 sm:p-5">
//             <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
//               <h3 className="text-lg font-semibold">Historial de presupuestos</h3>
//               <span className="text-xs text-neutral-300">
//                 {presupuestosValidos.length} registro{presupuestosValidos.length !== 1 ? "s" : ""}
//               </span>
//             </div>

//             {presupuestosValidos.length > 0 ? (
//               <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//                 {presupuestosValidos.map((p) => {
//                   const pid = p.presupuesto_id ?? p.id ?? `${p.ingreso_id}-${p.fecha_presupuesto}`;
//                   const fecha = new Date(p.fecha_presupuesto || p.fecha || "").toLocaleDateString("es-AR");
//                   const costo = p.costo_presupuesto ?? p.costo ?? 0;
//                   const total = p.total_presupuesto ?? p.total ?? 0;
//                   const observaciones = p.observaciones_presupuesto ?? p.observaciones;
//                   const estadoNombre = p.estado_presupuesto_nombre ?? p.estado ?? "Pendiente";

//                   return (
//                     <li
//                       key={pid}
//                       className="group rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 hover:border-white/20 transition"
//                     >
//                       <div className="flex items-start justify-between gap-3">
//                         <div>
//                           <p className="text-xs text-neutral-300/90 leading-5">Fecha</p>
//                           <p className="font-medium">{fecha}</p>
//                         </div>
//                         <span className={`px-2 py-1 rounded-full border text-[11px] ${estadoClase(estadoNombre)}`}>
//                           {estadoNombre}
//                         </span>
//                       </div>

//                       <div className="mt-3 grid grid-cols-2 gap-2">
//                         <div className="rounded-lg border border-white/10 bg-neutral-900/30 p-2">
//                           <p className="text-neutral-300/80 text-[11px] leading-5">Costo</p>
//                           <p className="text-base sm:text-lg font-semibold">{currency(costo)}</p>
//                         </div>
//                         <div className="rounded-lg border border-white/10 bg-neutral-900/30 p-2">
//                           <p className="text-neutral-300/80 text-[11px] leading-5">Total</p>
//                           <p className="text-base sm:text-lg font-semibold">{currency(total)}</p>
//                         </div>
//                       </div>

//                       {observaciones && (
//                         <p className="mt-3 text-xs text-neutral-300/90 italic line-clamp-3 leading-5">
//                           {observaciones}
//                         </p>
//                       )}

//                       <div className="mt-4 flex flex-wrap items-center gap-2">
//                         <button
//                           onClick={() => handleEditarPresupuesto(p)}
//                           className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-sm font-medium"
//                         >
//                           Modificar
//                         </button>
//                         <button
//                           onClick={() => handleEliminarPresupuesto(p.presupuesto_id)}
//                           className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-medium"
//                         >
//                           Eliminar
//                         </button>
//                       </div>
//                     </li>
//                   );
//                 })}
//               </ul>
//             ) : (
//               <div className="rounded-xl border border-dashed border-white/15 p-6 text-center">
//                 <p className="text-neutral-300">No hay presupuestos cargados.</p>
//                 <button
//                   onClick={handleNuevoPresupuesto}
//                   className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-sm font-semibold"
//                 >
//                   + Crear el primero
//                 </button>
//               </div>
//             )}
//           </section>
//         </div>
//       </main>

//       {/* Modales */}
//       <CambiarEstadoModal
//         isOpen={isEstadoModalOpen}
//         onClose={() => setIsEstadoModalOpen(false)}
//         ingresoActual={ingresoActual}
//         onSuccess={(m) => showAlert(m, "success")}
//         onError={(m) => showAlert(m, "error")}
//         onUpdated={fetchAll}
//       />

//       <PresupuestoModal
//         isOpen={modalAbierto}
//         onClose={() => setModalAbierto(false)}
//         ingresoSeleccionado={ingresoSeleccionado}
//         presupuesto={presupuestoSeleccionado}
//         esEdicion={!!presupuestoSeleccionado}
//         onPresupuestoGuardado={fetchAll}
//       />
//     </div>
//   );
// };

// export default DetalleEquiposPage;


// src/pages/DetalleEquiposPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { getEquipoById } from "../api/EquiposApi.jsx";
import {
  getPresupuestosByEquipo,
  deletePresupuesto,
  aprobarPresupuesto
} from "../api/PresupuestoApi.jsx";
import { getEstados } from "../api/EstadoApi.jsx";
import Swal from "sweetalert2";
import PresupuestoModal from "../components/Presupuesto/PresupuestoModal.jsx";
import CambiarEstadoModal from "../components/Ingreso/CambiarEstadoModal.jsx";
import AlertNotification from "../components/Alerta/AlertNotification.jsx";

const DetalleEquiposPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [ingresoActual, setIngresoActual] = useState(null);
  const [presupuestos, setPresupuestos] = useState([]);
  const [estados, setEstados] = useState([]);

  const [isEstadoModalOpen, setIsEstadoModalOpen] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [presupuestoSeleccionado, setPresupuestoSeleccionado] =
    useState(null);
  const [ingresoSeleccionado, setIngresoSeleccionado] = useState(null);

  const nuevoIngresoId = location.state?.nuevoIngresoId;

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const showAlert = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    // El propio AlertNotification ya tiene auto-cierre,
    // pero dejamos este timeout por compatibilidad con tu patrón actual.
    setTimeout(() => setAlertMessage(""), 2000);
  };
  // Helper seguro para formatear montos simples (sin símbolo $)
  const formatMoneySeguro = (valor) => {
    const n = Number(valor ?? 0);
    if (Number.isNaN(n)) return "0";
    return n.toLocaleString("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };


  // Helpers UI
  const currency = (n) =>
    (n ?? 0).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    });

  const estadoClase = (nombre) => {
    const s = (nombre || "").toLowerCase();
    if (s.includes("rechaz")) return "bg-red-500/15 text-red-300 border-red-400/20";
    if (s.includes("entregado") || s.includes("cobrado"))
      return "bg-emerald-500/15 text-emerald-300 border-emerald-400/20";
    if (s.includes("finaliz")) return "bg-sky-500/15 text-sky-300 border-sky-400/20";
    if (s.includes("pend")) return "bg-amber-500/15 text-amber-300 border-amber-400/20";
    return "bg-white/10 text-white/80 border-white/10";
  };

  // Si venís de crear un nuevo ingreso, actualizamos el ingresoActual.id
  useEffect(() => {
    if (!nuevoIngresoId) return;
    setIngresoActual((prev) => {
      if (prev && prev.id === nuevoIngresoId) return prev;
      return prev ? { ...prev, id: nuevoIngresoId } : { id: nuevoIngresoId };
    });
  }, [nuevoIngresoId]);

  // Cargar estados generales (para mostrar nombre de estado del ingreso)
  useEffect(() => {
    (async () => {
      try {
        const data = await getEstados();
        setEstados(data || []);
      } catch (e) {
        console.error("Error cargando estados:", e);
      }
    })();
  }, []);

  const estadoIngresoNombre =
    estados.find((e) => e.id === ingresoActual?.estado)?.nombre ||
    "Sin estado definido";

  const normalizePresupuestosResponse = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (res.data && Array.isArray(res.data)) return res.data;
    return [];
  };

  const fetchAll = async () => {
    try {
      setLoading(true);

      const equipoResp = await getEquipoById(id);
      setData(equipoResp);

      const ingreso = equipoResp?.detalles?.ingreso ?? null;
      setIngresoActual(ingreso);

      const rawPres = await getPresupuestosByEquipo(id);
      const lista = normalizePresupuestosResponse(rawPres);

      const ordenados = [...lista].sort((a, b) => {
        const A = new Date(a.fecha_presupuesto || a.fecha || 0).getTime();
        const B = new Date(b.fecha_presupuesto || b.fecha || 0).getTime();
        return B - A;
      });

      setPresupuestos(ordenados);
    } catch (err) {
      console.error("Error cargando detalle/presupuestos:", err);
      showAlert("Error cargando datos del equipo", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [id]);

  const refrescarPresupuestos = async () => {
    try {
      const raw = await getPresupuestosByEquipo(id);
      const lista = normalizePresupuestosResponse(raw);
      setPresupuestos(
        [...lista].sort(
          (a, b) =>
            new Date(b.fecha_presupuesto || b.fecha) -
            new Date(a.fecha_presupuesto || a.fecha)
        )
      );
    } catch (err) {
      console.error("Error refrescando presupuestos:", err);
    }
  };

  const handleEliminarPresupuesto = async (presupuestoId) => {
    if (!presupuestoId) return;

    Swal.fire({
      title: "Eliminar Presupuesto",
      text: "¿Estás seguro de que deseas eliminar este presupuesto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      theme: "dark",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        await deletePresupuesto(presupuestoId);
        showAlert("Presupuesto eliminado con éxito ✅", "success");
        await refrescarPresupuestos();
      } catch (error) {
        console.error("Error al eliminar presupuesto:", error);
        showAlert("Ocurrió un error al eliminar el presupuesto ❌", "error");
      }
    });
  };

  const handleNuevoPresupuesto = () => {
    if (!ingresoActual) {
      showAlert("No existe ingreso activo para crear presupuesto", "error");
      return;
    }
    setPresupuestoSeleccionado(null);
    setIngresoSeleccionado({ id: ingresoActual.id });
    setModalAbierto(true);
  };

  const handleEditarPresupuesto = (presupuesto) => {
    setPresupuestoSeleccionado(presupuesto);
    setIngresoSeleccionado({ id: presupuesto.ingreso_id });
    setModalAbierto(true);
  };
  const handleGenerarVenta = async (presupuesto) => {
    try {
      const presupuestoId = presupuesto.presupuesto_id ?? presupuesto.id;
      if (!presupuestoId) {
        showAlert("No se encontró el ID del presupuesto.", "error");
        return;
      }

      // Opcional: confirmar con SweetAlert
      const result = await Swal.fire({
        title: "Generar venta",
        text: "Se aprobará este presupuesto y se generará una venta asociada al cliente. ¿Deseás continuar?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, generar venta",
        cancelButtonText: "Cancelar",
        theme: "dark",
      });

      if (!result.isConfirmed) return;

      await aprobarPresupuesto(presupuestoId);

      showAlert("Venta generada y presupuesto aprobado ✅", "success");
      await fetchAll(); // recarga equipo + presupuestos y debería venir venta_id en la respuesta
    } catch (error) {
      console.error("Error al generar venta desde presupuesto:", error);
      showAlert("Error al generar venta desde el presupuesto ❌", "error");
    }
  };


  if (loading)
    return <p className="text-neutral-400 p-6">Cargando...</p>;

  if (!data)
    return <p className="text-neutral-400 p-6">Equipo no encontrado.</p>;

  const { equipo, cliente } = data;

  const presupuestosValidos = Array.isArray(presupuestos)
    ? presupuestos.filter((p) => p && (p.presupuesto_id || p.id))
    : [];

  const totalCostos = presupuestosValidos.reduce(
    (acc, p) => acc + (p.costo_presupuesto ?? p.costo ?? 0),
    0
  );
  const totalIngresos = presupuestosValidos.reduce(
    (acc, p) => acc + (p.total_presupuesto ?? p.total ?? 0),
    0
  );
  const totalFinal = totalIngresos - totalCostos;

  return (
    <div className="flex flex-col min-h-dvh w-screen bg-neutral-900 text-white/95">
      {/* Alerta global */}
      {alertMessage && (
        <AlertNotification message={alertMessage} type={alertType} />
      )}

      {/* Header sticky + breadcrumb + acciones */}
      <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur bg-neutral-900/80">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 h-12 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
          {/* Breadcrumb compacto con truncado en móvil */}
          <nav className="flex-1 min-w-0 text-[11px] sm:text-sm text-neutral-300 truncate">
            <Link
              to="/equipos"
              className="hover:text-white underline-offset-4 hover:underline"
            >
              Equipos
            </Link>
            <span className="mx-2 text-neutral-500">/</span>
            <span className="text-white/90 truncate align-middle">
              Detalle #{equipo?.id ?? id}
            </span>
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => navigate(`/equipos/${equipo.id}/historial`)}
              className="px-2 py-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-neutral-800/70 hover:bg-neutral-800 border border-white/10 text-[11px] sm:text-sm whitespace-nowrap"
            >
              Ver Historial
            </button>

            <button
              onClick={() => {
                if (!ingresoActual) {
                  showAlert("No hay ingreso para modificar", "error");
                  return;
                }
                setIsEstadoModalOpen(true);
              }}
              className="px-2 py-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-sky-600 hover:bg-sky-700 text-[11px] sm:text-sm font-medium whitespace-nowrap"
            >
              Actualizar Ingreso
            </button>

            <button
              onClick={handleNuevoPresupuesto}
              className="px-2 py-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-emerald-600 hover:bg-emerald-700 text-[11px] sm:text-sm font-semibold whitespace-nowrap"
            >
              + Crear Presupuesto
            </button>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 space-y-6">
          {/* Cabecera: info + balance */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Info del equipo y cliente */}
            <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-neutral-800/50 p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold">
                    {equipo?.tipo?.toUpperCase()} — {equipo?.marca}{" "}
                    {equipo?.modelo}
                  </h1>
                  <p className="text-sm text-neutral-300/90">
                    {equipo?.problema}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] sm:text-xs ${estadoClase(
                    estadoIngresoNombre
                  )}`}
                  title="Estado actual del ingreso"
                >
                  <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                  {estadoIngresoNombre}
                </span>
              </div>

              {/* Fechas */}
              <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm leading-5">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-neutral-300/80">Ingreso</p>
                  <p className="font-medium">
                    {ingresoActual?.fecha_ingreso
                      ? new Date(
                        ingresoActual.fecha_ingreso
                      ).toLocaleDateString("es-AR")
                      : "Sin fecha"}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-neutral-300/80">Egreso</p>
                  <p className="font-medium">
                    {ingresoActual?.fecha_egreso
                      ? new Date(
                        ingresoActual.fecha_egreso
                      ).toLocaleDateString("es-AR")
                      : "No definido"}
                  </p>
                </div>
              </div>

              {/* Cliente */}
              <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm leading-5">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-neutral-300/80">Cliente</p>
                  <p className="font-medium">
                    {cliente?.nombre} {cliente?.apellido}
                  </p>
                  <p className="text-neutral-300/80 mt-1">
                    Tel:{" "}
                    <span className="font-medium">
                      {cliente?.celular || "—"}
                    </span>
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-neutral-300/80">Dirección</p>
                  <p className="font-medium">
                    {cliente?.direccion || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Balance */}
            <aside className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-600 to-teal-500 p-4 sm:p-5 text-white shadow-soft">
              <h3 className="text-xs sm:text-sm font-semibold opacity-90 mb-1 leading-5">
                Balance Total
              </h3>

              <p className="text-4xl sm:text-4xl lg:text-4xl font-extrabold tracking-tight">
                {currency(totalFinal)}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-black/15 p-2 sm:p-3">
                  <p className="text-[11px] sm:text-xs opacity-80 leading-5">
                    Ingresos
                  </p>
                  <p className="text-base sm:text-2xl lg:text-3xl font-bold">
                    {currency(totalIngresos)}
                  </p>
                </div>
                <div className="rounded-xl bg-black/15 p-2 sm:p-3">
                  <p className="text-[11px] sm:text-xs opacity-80 leading-5">
                    Costos
                  </p>
                  <p className="text-base sm:text-2xl lg:text-3xl font-bold">
                    {currency(totalCostos)}
                  </p>
                </div>
              </div>
            </aside>
          </section>

          {/* Lista de presupuestos */}
          <section className="rounded-2xl border border-white/10 bg-neutral-800/50 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <h3 className="text-lg font-semibold">Historial de presupuestos</h3>
              <span className="text-xs text-neutral-300">
                {presupuestosValidos.length} registro
                {presupuestosValidos.length !== 1 ? "s" : ""}
              </span>
            </div>

            {presupuestosValidos.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {presupuestosValidos.map((p) => {
                  const pid =
                    p.presupuesto_id ?? p.id ?? `${p.ingreso_id}-${p.fecha_presupuesto}`;

                  const fechaRaw = p.fecha_presupuesto || p.fecha || null;
                  const fechaFmt = fechaRaw
                    ? new Date(fechaRaw).toLocaleDateString("es-AR")
                    : "Sin fecha";

                  const costo = p.costo_presupuesto ?? p.costo ?? 0;
                  const total = p.total_presupuesto ?? p.total ?? 0;
                  const observaciones =
                    p.observaciones_presupuesto ?? p.observaciones ?? "";

                  const estadoNombre =
                    p.estado_presupuesto_nombre ?? p.estado ?? "Pendiente";

                  const tieneVenta =
                    p.venta_id !== null && p.venta_id !== undefined;

                  // 🔹 Productos / detalles asociados al presupuesto
                  // ajustá a cómo venga del backend: p.detalles, p.productos, p.lineas, etc.
                  const lineas =
                    Array.isArray(p.detalles)
                      ? p.detalles
                      : Array.isArray(p.productos)
                        ? p.productos
                        : Array.isArray(p.lineas)
                          ? p.lineas
                          : [];

                  return (
                    <li
                      key={pid}
                      className="group rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 hover:border-white/20 transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs text-neutral-300/90 leading-5">Fecha</p>
                          <p className="font-medium">{fechaFmt}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full border text-[11px] ${estadoClase(
                            estadoNombre
                          )}`}
                        >
                          {estadoNombre}
                        </span>
                      </div>

                      {/* Costo / Total */}
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="rounded-lg border border-white/10 bg-neutral-900/30 p-2">
                          <p className="text-neutral-300/80 text-[11px] leading-5">
                            Costo (materiales)
                          </p>
                          <p className="text-base sm:text-lg font-semibold">
                            {currency(costo)}
                          </p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-neutral-900/30 p-2">
                          <p className="text-neutral-300/80 text-[11px] leading-5">
                            Total (cliente)
                          </p>
                          <p className="text-base sm:text-lg font-semibold">
                            {currency(total)}
                          </p>
                        </div>
                      </div>

                      {/* Info adicional de venta */}
                      {tieneVenta && (
                        <p className="mt-2 text-[11px] text-emerald-300 leading-5">
                          ✅ Venta generada (ID venta: {p.venta_id})
                        </p>
                      )}

                      {/* 🧩 Productos incluidos en el presupuesto */}
                      {lineas.length > 0 && (
                        <div className="mt-3">
                          <p className="text-[11px] text-neutral-300/90 mb-1">
                            Productos incluidos
                          </p>
                          <ul className="space-y-2 text-xs sm:text-sm">
                            {lineas.map((s, idx) => {
                              const cantidad = Number(s.cantidad ?? 0);
                              const precioUnitario =
                                Number(s.precio_unitario ?? s.precio ?? 0) || 0;
                              const subtotal =
                                Number(
                                  s.subtotal ??
                                  cantidad * precioUnitario
                                ) || 0;

                              return (
                                <li
                                  key={s.id ?? `${pid}-detalle-${idx}`}
                                  className="flex items-center justify-between gap-2 rounded-lg bg-neutral-800/80 px-2 py-1.5"
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">
                                      {s.nombre || "Producto sin nombre"}
                                    </p>
                                    <p className="text-neutral-300/80">
                                      {cantidad} unid. x $
                                      {formatMoneySeguro(precioUnitario)}{" "}
                                      ={" "}
                                      <span className="font-semibold">
                                        $
                                        {formatMoneySeguro(subtotal)}
                                      </span>
                                    </p>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {/* Observaciones */}
                      {observaciones && (
                        <p className="mt-3 text-xs text-neutral-300/90 italic line-clamp-3 leading-5">
                          {observaciones}
                        </p>
                      )}

                      {/* Acciones */}
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => handleEditarPresupuesto(p)}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-sm font-medium"
                        >
                          Modificar
                        </button>
                        <button
                          onClick={() =>
                            handleEliminarPresupuesto(p.presupuesto_id ?? p.id)
                          }
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="rounded-xl border border-dashed border-white/15 p-6 text-center">
                <p className="text-neutral-300">No hay presupuestos cargados.</p>
                <button
                  onClick={handleNuevoPresupuesto}
                  className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-sm font-semibold"
                >
                  + Crear el primero
                </button>
              </div>
            )}
          </section>


        </div>
      </main>

      {/* Modales */}
      <CambiarEstadoModal
        isOpen={isEstadoModalOpen}
        onClose={() => setIsEstadoModalOpen(false)}
        ingresoActual={ingresoActual}
        onSuccess={(m) => showAlert(m, "success")}
        onError={(m) => showAlert(m, "error")}
        onUpdated={fetchAll}
      />

      <PresupuestoModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        ingresoSeleccionado={ingresoSeleccionado}
        presupuesto={presupuestoSeleccionado}
        esEdicion={!!presupuestoSeleccionado}
        onPresupuestoGuardado={fetchAll}
        showAlert={showAlert}
        tipoEquipo={equipo?.tipo}   // 👈 NUEVO
      />

    </div>
  );
};

export default DetalleEquiposPage;
