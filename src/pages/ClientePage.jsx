// // import { useEffect, useState } from "react";

// // import Swal from 'sweetalert2'
// // import {
// //   getClientes,
// //   createCliente,
// //   updateCliente,
// //   deleteCliente,
// // } from "../api/ClienteApi";
// // import ClienteModal from "../components/Cliente/ClienteModal.jsx";
// // import { Link, useNavigate } from "react-router-dom";


// // // import useAuth from "../hooks/UseAuth.jsx";

// // const ClientePage = () => {
// //   const [clientes, setClientes] = useState([]);
// //   const [filteredClientes, setFilteredClientes] = useState([]);
// //   const [search, setSearch] = useState("");
// //   const [loading, setLoading] = useState(true);
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
// //   const [presupuestos, setPresupuestos] = useState([]);
// //   const navigate = useNavigate();
  
// //   // const { user, logout } = useAuth();

// //   // 🔹 Obtener clientes al montar el componente
// //   useEffect(() => {
// //     cargarClientes();
// //   }, []);

// //   const cargarClientes = async () => {
// //     try {
// //       setLoading(true);
// //       const data = await getClientes();
// //       setClientes(data);
// //       setFilteredClientes(data);
// //     } catch (error) {
// //       console.error("Error cargando clientes:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // 🔹 Filtrado en tiempo real
// //   useEffect(() => {
// //     const query = search.toLowerCase();
// //     const filtered = clientes.filter(cli =>
// //       cli.nombre.toLowerCase().includes(query) ||
// //       cli.apellido.toLowerCase().includes(query) ||
// //       (cli.celular && cli.celular.includes(query))
// //     );
// //     setFilteredClientes(filtered);
// //   }, [search, clientes]);

// //   const handleAgregar = () => {
// //     setClienteSeleccionado(null); // nuevo cliente
// //     setIsOpen(true);
// //   };

// //   const handleModificar = (cliente) => {
// //     setClienteSeleccionado(cliente); // editar cliente
// //     setIsOpen(true);
// //   };

// //   const handleDeleteCliente = async (id) => {

// //     Swal.fire({
// //       title: "¿Estás seguro?",
// //       text: "No podrás deshacer esta acción.",
// //       icon: "warning",
// //       theme: "dark",
// //       showCancelButton: true,
// //       confirmButtonText: "Sí, eliminar",
// //       cancelButtonText: "Cancelar"
// //     }).then(async (result) => {
// //       if (result.isConfirmed) {
// //         try {
// //           await deleteCliente(id);
// //           cargarClientes();
// //         } catch (error) {
// //           console.error("Error eliminando cliente:", error);
// //           Swal.fire("Error", "No se pudo eliminar el cliente", "error");
// //         }
// //       }
// //     });
// //   };

// //   const handleSubmit = async (formData) => {
// //     try {
// //       if (clienteSeleccionado) {
// //         await updateCliente(clienteSeleccionado.id, formData);
// //       } else {
// //         await createCliente(formData);
       
// //       }
// //       cargarClientes();
// //     } catch (error) {
// //       console.error("Error guardando cliente:", error);
// //       Swal.fire("Error", "Ya existe el cliente", "error");
// //     }
// //   };

// //   //crear handle, para ver historial
// // const handleVerHistorial = (clienteId) => {
// //   navigate(`/historial/cliente/${clienteId}`);
// // };


// //   return (
// //     <div className="flex flex-col md:flex-row h-screen w-screen bg-neutral-900 text-white overflow-hidden">
// //       {/* 🔹 Columna izquierda 30% */}
// //       <div className="w-full md:w-[30%] border-b md:border-b-0 md:border-r border-neutral-700 p-6 flex flex-col items-start gap-4">
// //         <button
// //           onClick={() => navigate("/")}
// //           className="px-4 py-2 mb-6 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition"
// //         >
// //           ⬅️ Volver al Dashboard
// //         </button>

// //         <h2 className="text-2xl font-bold text-emerald-400">
// //           Gestión de Clientes
// //         </h2>

// //         <button
// //           onClick={handleAgregar}
// //           className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded font-semibold w-full"
// //         >
// //           + Agregar Cliente
// //         </button>
// //       </div>

// //       {/* 🔹 Columna derecha 70% */}
// //       <div className="w-full md:w-[70%] p-6 overflow-y-auto">
// //         <h3 className="text-xl font-semibold mb-4">Lista de Clientes</h3>

// //         {/* 🔹 Buscador */}
// //         <input
// //           type="text"
// //           placeholder="Buscar por nombre o celular..."
// //           value={search}
// //           onChange={(e) => setSearch(e.target.value)}
// //           className="mb-4 w-full md:w-1/2 bg-neutral-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
// //         />

// //         {loading ? (
// //           <p className="text-gray-400">Cargando clientes...</p>
// //         ) : !Array.isArray(filteredClientes) || filteredClientes.length === 0 ? (
// //           <p className="text-gray-400">No hay clientes que coincidan con la búsqueda.</p>
// //         ) : (
// //           <ol className="space-y-4 list-decimal list-inside">
// //             {filteredClientes.map((cli) => (
// //               <li
// //                 key={cli.id}
// //                 className="bg-neutral-800 p-4 rounded shadow flex justify-between items-center"
// //               >
// //                 <div>
// //                   <p className="font-semibold text-white">
// //                     {cli.nombre} {cli.apellido}
// //                   </p>
// //                   <p className="text-sm text-gray-400">
// //                     {cli.celular} | {cli.direccion}
// //                   </p>
// //                 </div>
// //                 <div className="flex gap-2">
// //                    <button
// //                     onClick={() => handleVerHistorial(cli.id)}
// //                     className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm font-medium"
// //                   >Ver Historial</button>
// //                   <button
// //                     onClick={() => handleModificar(cli)}
// //                     className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm font-medium"
// //                   >
// //                     Modificar
// //                   </button>
// //                   <button
// //                     onClick={() => handleDeleteCliente(cli.id)}
// //                     className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-medium"
// //                   >
// //                     Eliminar
// //                   </button>
// //                 </div>
// //               </li>
// //             ))}
// //           </ol>
// //         )}
// //       </div>

// //       {/* 🔹 Modal de cliente */}
// //       <ClienteModal
// //         isOpen={isOpen}
// //         onClose={() => setIsOpen(false)}
// //         onSubmit={handleSubmit}
// //         clienteSeleccionado={clienteSeleccionado}
// //       />
// //     </div>
// //   );
// // };

// // export default ClientePage;

// import { useEffect, useState } from "react";
// import Swal from "sweetalert2";
// import {
//   getClientes,
//   createCliente,
//   updateCliente,
//   deleteCliente,
// } from "../api/ClienteApi";
// import ClienteModal from "../components/Cliente/ClienteModal.jsx";
// import { Link, useNavigate } from "react-router-dom";

// const ClientePage = () => {
//   const [clientes, setClientes] = useState([]);
//   const [filteredClientes, setFilteredClientes] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [isOpen, setIsOpen] = useState(false);
//   const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
//   const [presupuestos, setPresupuestos] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     cargarClientes();
//   }, []);

//   const cargarClientes = async () => {
//     try {
//       setLoading(true);
//       const data = await getClientes();
//       setClientes(data);
//       setFilteredClientes(data);
//     } catch (error) {
//       console.error("Error cargando clientes:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔎 Filtrado en tiempo real (case-insensitive)
//   useEffect(() => {
//     const q = (search || "").toLowerCase().trim();
//     const filtered = (clientes || []).filter((cli) => {
//       const nombre = (cli?.nombre || "").toLowerCase();
//       const apellido = (cli?.apellido || "").toLowerCase();
//       const celular = (cli?.celular || "").toLowerCase();
//       return (
//         nombre.includes(q) ||
//         apellido.includes(q) ||
//         celular.includes(q)
//       );
//     });
//     setFilteredClientes(filtered);
//   }, [search, clientes]);

//   const handleAgregar = () => {
//     setClienteSeleccionado(null);
//     setIsOpen(true);
//   };

//   const handleModificar = (cliente) => {
//     setClienteSeleccionado(cliente);
//     setIsOpen(true);
//   };

//   const handleDeleteCliente = async (id) => {
//     Swal.fire({
//       title: "¿Estás seguro?",
//       text: "No podrás deshacer esta acción.",
//       icon: "warning",
//       theme: "dark",
//       showCancelButton: true,
//       confirmButtonText: "Sí, eliminar",
//       cancelButtonText: "Cancelar",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await deleteCliente(id);
//           cargarClientes();
//         } catch (error) {
//           console.error("Error eliminando cliente:", error);
//           Swal.fire("Error", "No se pudo eliminar el cliente", "error");
//         }
//       }
//     });
//   };

//   const handleSubmit = async (formData) => {
//     try {
//       if (clienteSeleccionado) {
//         await updateCliente(clienteSeleccionado.id, formData);
//       } else {
//         await createCliente(formData);
//       }
//       cargarClientes();
//     } catch (error) {
//       console.error("Error guardando cliente:", error);
//       Swal.fire("Error", "Ya existe el cliente", "error");
//     }
//   };

//   // 📜 Ver historial del cliente
//   const handleVerHistorial = (clienteId) => {
//     navigate(`/historial/cliente/${clienteId}`);
//   };

//   return (
//     <div className="min-h-dvh w-screen bg-neutral-900 text-white/95">
//       {/* Contenedor */}
//       <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-0 md:gap-6 px-3 sm:px-4 py-4 sm:py-6">
//         {/* Panel lateral (acciones) */}
//         <aside className="w-full md:w-[32%] flex-shrink-0">
//           <div className="rounded-2xl border border-white/10 bg-neutral-800/60 p-4 sm:p-5">
//             <div className="flex items-center justify-between gap-2">
//               <h2 className="text-lg sm:text-xl font-semibold">Gestión de Clientes</h2>
//               <button
//                 onClick={() => navigate("/")}
//                 className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-[11px] sm:text-sm"
//               >
//                 ← Dashboard
//               </button>
//             </div>

//             <p className="mt-1 text-xs sm:text-sm text-neutral-300/90">
//               Creá, modificá y consultá clientes. Optimizado para móvil ✨
//             </p>

//             <button
//               onClick={handleAgregar}
//               className="mt-4 w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-[12px] sm:text-sm font-semibold"
//             >
//               + Agregar Cliente
//             </button>

//             {/* Buscador sticky en mobile/desktop dentro del panel derecho visualmente, pero acá también por accesibilidad */}
//             <div className="mt-4">
//               <label className="block text-[11px] sm:text-xs text-neutral-300/80 mb-1">
//                 Buscar cliente
//               </label>
//               <input
//                 type="text"
//                 inputMode="search"
//                 placeholder="Nombre, apellido o celular…"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-neutral-400"
//               />
//             </div>
//           </div>
//         </aside>

//         {/* Listado */}
//         <section className="w-full md:w-[68%]">
//           {/* Header del listado (sticky) */}
//           <div className="sticky top-0 z-10 -mx-3 sm:-mx-4 px-3 sm:px-4 py-3 backdrop-blur bg-neutral-900/85 border-b border-white/10">
//             <div className="flex items-center justify-between gap-2">
//               <h3 className="text-base sm:text-lg font-semibold">
//                 Lista de Clientes
//               </h3>
//               {/* Buscador duplicado en header: solo visible en md- para tenerlo “siempre a mano” en móvil */}
//               <div className="md:hidden w-1/2">
//                 <input
//                   type="text"
//                   inputMode="search"
//                   placeholder="Buscar…"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   className="w-full rounded-lg bg-white/5 border border-white/10 px-2.5 py-1.5 text-[12px] focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-neutral-400"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Contenido del listado */}
//           <div className="py-4">
//             {loading ? (
//               <p className="text-neutral-400 px-1">Cargando clientes…</p>
//             ) : !Array.isArray(filteredClientes) || filteredClientes.length === 0 ? (
//               <div className="rounded-xl border border-dashed border-white/15 p-6 text-center">
//                 <p className="text-neutral-300">No hay clientes que coincidan con la búsqueda.</p>
//                 <button
//                   onClick={handleAgregar}
//                   className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-sm font-semibold"
//                 >
//                   + Crear cliente
//                 </button>
//               </div>
//             ) : (
//               // Grid responsive de tarjetas
//               <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//                 {filteredClientes.map((cli) => (
//                   <li
//                     key={cli.id}
//                     className="rounded-xl border border-white/10 bg-neutral-800/50 hover:bg-neutral-800/70 hover:border-white/20 transition p-4 flex flex-col gap-3"
//                   >
//                     {/* Encabezado con iniciales */}
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="flex items-center gap-3 min-w-0">
//                         <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-200 font-semibold">
//                           {(cli?.nombre?.[0] || "C").toUpperCase()}
//                         </div>
//                         <div className="min-w-0">
//                           <p className="font-semibold truncate">
//                             {cli.nombre} {cli.apellido}
//                           </p>
//                           <p className="text-xs text-neutral-400 truncate">
//                             {cli.celular || "Sin teléfono"}
//                           </p>
//                         </div>
//                       </div>

//                       {/* Acciones compactas (se expanden en sm+) */}
//                       <div className="flex items-center gap-1 sm:gap-2">
//                         <button
//                           onClick={() => handleModificar(cli)}
//                           className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-[11px] sm:text-sm font-medium"
//                           title="Modificar"
//                         >
//                           Modificar
//                         </button>
//                         <button
//                           onClick={() => handleDeleteCliente(cli.id)}
//                           className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-[11px] sm:text-sm font-medium"
//                           title="Eliminar"
//                         >
//                           Eliminar
//                         </button>
//                       </div>
//                     </div>

//                     {/* Dirección y acciones de navegación */}
//                     <div className="rounded-lg border border-white/10 bg-white/5 p-3">
//                       <p className="text-[11px] text-neutral-400">Dirección</p>
//                       <p className="text-sm font-medium break-words">
//                         {cli.direccion || "—"}
//                       </p>
//                     </div>

//                     <div className="flex items-center justify-between gap-2">
//                       <button
//                         onClick={() => handleVerHistorial(cli.id)}
//                         className="flex-1 px-3 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-[12px] sm:text-sm font-semibold"
//                       >
//                         Ver Historial
//                       </button>

//                       {/* Link opcional al detalle del cliente si lo tenés en el router (comentado por si no existe) */}
//                       {/* <Link
//                         to={`/clientes/${cli.id}`}
//                         className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-[12px] sm:text-sm"
//                       >
//                         Ver Detalle
//                       </Link> */}
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </section>
//       </div>

//       {/* Modal de cliente */}
//       <ClienteModal
//         isOpen={isOpen}
//         onClose={() => setIsOpen(false)}
//         onSubmit={handleSubmit}
//         clienteSeleccionado={clienteSeleccionado}
//       />
//     </div>
//   );
// };

// export default ClientePage;

import { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../api/ClienteApi";
import { getHistorialCliente } from "../api/HistorialApi.jsx";
import ClienteModal from "../components/Cliente/ClienteModal.jsx";
import { useNavigate } from "react-router-dom";

const ClientePage = () => {
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // mini balances por cliente { [id]: { ingresos, costos, total, balance } }
  const [balances, setBalances] = useState({});
  const [loadingBalances, setLoadingBalances] = useState(false);

  const navigate = useNavigate();

  // ---- Helpers ----
  const currency = (n) =>
    (n ?? 0).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    });

  const computeResumenHistorial = (raw) => {
    // La API puede devolver { equipos: [...] } o un array de equipos
    const equipos = Array.isArray(raw?.equipos)
      ? raw.equipos
      : Array.isArray(raw)
      ? raw
      : [];

    let sumCosto = 0;
    let sumTotal = 0;

    for (const eq of equipos) {
      const ingresos = eq?.ingresos || [];
      for (const ing of ingresos) {
        const presupuestos = ing?.presupuestos || [];
        for (const p of presupuestos) {
          const costo = Number(p?.costo_presupuesto ?? p?.costo ?? 0);
          const total = Number(p?.total_presupuesto ?? p?.total ?? 0);
          sumCosto += costo;
          sumTotal += total;
        }
      }
    }
    return {
      ingresos: sumTotal,
      costos: sumCosto,
      balance: sumTotal - sumCosto,
    };
  };

  // ---- Carga de clientes ----
  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const data = await getClientes();
      setClientes(data || []);
      setFilteredClientes(data || []);
    } catch (error) {
      console.error("Error cargando clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---- Filtrado tiempo real ----
  useEffect(() => {
    const q = (search || "").toLowerCase().trim();
    const filtered = (clientes || []).filter((cli) => {
      const nombre = (cli?.nombre || "").toLowerCase();
      const apellido = (cli?.apellido || "").toLowerCase();
      const celular = (cli?.celular || "").toLowerCase();
      return nombre.includes(q) || apellido.includes(q) || celular.includes(q);
    });
    setFilteredClientes(filtered);
  }, [search, clientes]);

  // ---- Cargar balances por cliente (tras cargar/filtrar) ----
  useEffect(() => {
    // Para evitar llamar para cada tecla del buscador, calculamos balances
    // sobre TODOS los clientes cargados (no solo filtrados). Si ya existe, no recalculamos.
    const fetchBalances = async () => {
      if (!Array.isArray(clientes) || clientes.length === 0) return;
      setLoadingBalances(true);
      const next = { ...balances };

      // ids que aún no tienen balance
      const idsToFetch = clientes
        .map((c) => c?.id)
        .filter((id) => id != null && next[id] == null);

      try {
        await Promise.all(
          idsToFetch.map(async (id) => {
            try {
              const hist = await getHistorialCliente(id);
              next[id] = computeResumenHistorial(hist);
            } catch (e) {
              console.error("Error historial cliente", id, e);
              next[id] = { ingresos: 0, costos: 0, balance: 0 };
            }
          })
        );
        setBalances(next);
      } finally {
        setLoadingBalances(false);
      }
    };
    fetchBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientes]);

  // ---- Acciones CRUD ----
  const handleAgregar = () => {
    setClienteSeleccionado(null);
    setIsOpen(true);
  };

  const handleModificar = (cliente) => {
    setClienteSeleccionado(cliente);
    setIsOpen(true);
  };

  const handleDeleteCliente = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás deshacer esta acción.",
      icon: "warning",
      theme: "dark",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCliente(id);
          // limpiamos balance en memoria
          setBalances((prev) => {
            const n = { ...prev };
            delete n[id];
            return n;
          });
          cargarClientes();
        } catch (error) {
          console.error("Error eliminando cliente:", error);
          Swal.fire("Error", "No se pudo eliminar el cliente", "error");
        }
      }
    });
  };

  const handleSubmit = async (formData) => {
    try {
      if (clienteSeleccionado) {
        await updateCliente(clienteSeleccionado.id, formData);
      } else {
        await createCliente(formData);
      }
      cargarClientes();
    } catch (error) {
      console.error("Error guardando cliente:", error);
      Swal.fire("Error", "Ya existe el cliente", "error");
    }
  };

  const handleVerHistorial = (clienteId) => {
    navigate(`/historial/cliente/${clienteId}`);
  };

  // ---- UI helpers ----
  const balanceChipClass = (value) => {
    if (value > 0) return "bg-emerald-500/15 text-emerald-200 border-emerald-400/20";
    if (value < 0) return "bg-rose-500/15 text-rose-200 border-rose-400/20";
    return "bg-amber-500/15 text-amber-200 border-amber-400/20";
    // podés cambiar por tu paleta
  };

  return (
    // Contenedor general, fondos atenuados por sección
    <div className="min-h-dvh w-screen bg-neutral-900 text-white/95 overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8">

      
      {/* Grid 30/70, solo scrollea el lado derecho en desktop */}
      <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-0 md:gap-6 w-full">
        {/* Lateral (30%) fijo/sticky y con su propio scroll si hiciera falta */}
        <aside className="bg-neutral-900 md:bg-transparent md:sticky md:top-0 md:h-screen md:overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 border-b md:border-b-0 md:border-r border-white/10">
          {/* Sección Acción principal */}
          <div className="rounded-2xl border border-white/10 bg-neutral-800/60 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg sm:text-xl font-semibold">Gestión de Clientes</h2>
              <button
                onClick={() => navigate("/")}
                className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-[11px] sm:text-sm"
              >
                ← Dashboard
              </button>
            </div>

            

            <button
              onClick={handleAgregar}
              className="mt-4 w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-[12px] sm:text-sm font-semibold"
            >
              + Agregar Cliente
            </button>
          </div>

          {/* Sección Filtros / Búsqueda (fondo ligeramente distinto para seccionar) */}
          <div className="mt-4 rounded-2xl border border-white/10 bg-neutral-800/40 p-4 sm:p-5">
            <label className="block text-[11px] sm:text-xs text-neutral-300/80 mb-1">
              Buscar cliente
            </label>
            <input
              type="text"
              inputMode="search"
              placeholder="Nombre, apellido o celular…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-neutral-400"
            />

            {/* Leyenda balances */}
            <div className="mt-3 text-[11px] text-neutral-300/80">
              {loadingBalances
                ? "Calculando balances…"
                : "Mini balance: neto (Total − Costos)."}
            </div>
          </div>
        </aside>

        {/* Derecha (70%) — scrollea solo este panel en desktop */}
        <section className="md:h-screen md:overflow-y-auto">
          {/* Encabezado del listado sticky con color de fondo sutil distinto */}
          <div className="sticky top-0 z-10 px-3 sm:px-4 py-3 backdrop-blur bg-neutral-900/85 border-b border-white/10">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
              <h3 className="text-base sm:text-lg font-semibold">Lista de Clientes</h3>
              {/* Buscador duplicado solo para mobile (accesible al scrollear) */}
              <div className="md:hidden w-1/2">
                <input
                  type="text"
                  inputMode="search"
                  placeholder="Buscar…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-2.5 py-1.5 text-[12px] focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-neutral-400"
                />
              </div>
            </div>
          </div>

          {/* Contenido (fondos alternados/atenuados para secciones) */}
          <div className="px-3 sm:px-4 py-4 space-y-4">
            {/* Bloque listado */}
            <div className="rounded-2xl border border-white/10 bg-neutral-800/40 p-3 sm:p-4">
              {loading ? (
                <p className="text-neutral-400 px-1">Cargando clientes…</p>
              ) : !Array.isArray(filteredClientes) || filteredClientes.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/15 p-6 text-center bg-white/5">
                  <p className="text-neutral-300">No hay clientes que coincidan con la búsqueda.</p>
                  <button
                    onClick={handleAgregar}
                    className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-sm font-semibold"
                  >
                    + Crear cliente
                  </button>
                </div>
              ) : (
                <>
                  {/* MOBILE: Cards */}
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:hidden">
                    {filteredClientes.map((cli) => {
                      const bal = balances[cli.id];
                      const chip = balanceChipClass(bal?.balance ?? 0);

                      return (
                        <li
                          key={cli.id}
                          onClick={handleModificar}
                          className="rounded-xl border border-white/10 bg-neutral-800/50 hover:bg-neutral-800/70 hover:border-white/20 transition p-4 flex flex-col gap-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-200 font-semibold">
                                {(cli?.nombre?.[0] || "C").toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold truncate">
                                  {cli.nombre} {cli.apellido}
                                </p>
                                <p className="text-xs text-neutral-400 truncate">
                                  {cli.celular || "Sin teléfono"}
                                </p>
                              </div>
                            </div>

                            {/* Mini balance */}
                            <span className={`px-2 py-1 rounded-full border text-[11px] ${chip}`} title="Balance neto">
                              {currency(bal?.balance ?? 0)}
                            </span>
                          </div>

                          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                            <p className="text-[11px] text-neutral-400">Dirección</p>
                            <p className="text-sm font-medium break-words">{cli.direccion || "—"}</p>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <button
                              onClick={() => handleVerHistorial(cli.id)}
                              className="flex-1 px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-[12px] sm:text-sm font-semibold"
                            >
                              Ver Historial
                            </button>
                            <div className="hidden sm:flex items-center gap-2">
                              <button
                                onClick={() => handleModificar(cli)}
                                className="px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-[12px] sm:text-sm font-medium"
                              >
                                Modificar
                              </button>
                              <button
                                onClick={() => handleDeleteCliente(cli.id)}
                                className="px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-700 text-[12px] sm:text-sm font-medium"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {/* DESKTOP: Lista clásica (30%/70% mantenido por el grid padre) */}
                  <ol className="hidden md:block space-y-3 list-decimal list-inside">
                    {filteredClientes.map((cli) => {
                      const bal = balances[cli.id];
                      const chip = balanceChipClass(bal?.balance ?? 0);

                      return (
                        <li
                          key={cli.id}
                          onClick={handleModificar}
                          className="rounded-xl border border-white/10 bg-neutral-800/30 hover:bg-neutral-800/50 transition p-4 flex justify-between items-center"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold text-white truncate">
                              {cli.nombre} {cli.apellido}
                            </p>
                            <p className="text-sm text-gray-400 truncate">
                              {cli.celular} | {cli.direccion}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Mini balance en desktop */}
                            <span className={`px-2 py-1 rounded-full border text-[12px] ${chip}`} title="Balance neto">
                              {currency(bal?.balance ?? 0)}
                            </span>

                            <button
                              onClick={() => handleVerHistorial(cli.id)}
                              className="bg-teal-600 hover:bg-teal-700 px-3 py-1.5 rounded text-sm font-medium"
                            >
                              Ver Historial
                            </button>
                            <button
                              onClick={() => handleModificar(cli)}
                              className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded text-sm font-medium"
                            >
                              Modificar
                            </button>
                            <button
                              onClick={() => handleDeleteCliente(cli.id)}
                              className="bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded text-sm font-medium"
                            >
                              Eliminar
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </>
              )}
            </div>

            {/* Sección informativa/ayuda (otro fondo para separar) */}
            <div className="rounded-2xl border border-white/10 bg-neutral-800/30 p-4">
              <p className="text-xs text-neutral-300/80">
                Tip: el mini balance es el <b>neto</b> de cada cliente (Total − Costos) calculado a partir del historial de equipos e ingresos.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Modal */}
      <ClienteModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        clienteSeleccionado={clienteSeleccionado}
      />
      </div>
    </div>
  );
};

export default ClientePage;


