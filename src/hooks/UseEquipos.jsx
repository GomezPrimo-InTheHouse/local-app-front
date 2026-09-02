// // src/hooks/useEquipos.js
// import { useState, useEffect, useMemo, useCallback, useRef } from "react";
// import {
//   getEquipos,
//   updateEquipo,
//   deleteEquipo,
//   getEquiposByTipo,
//   getEquiposByClienteId,
// } from "../api/EquiposApi.jsx";
// import { getBalancesPresupuestos } from "../api/PresupuestoApi.jsx";
// import { getEstados } from "../api/EstadoApi.jsx";
// import Swal from "sweetalert2";

// const AUTO_REFRESH_MS = 5 * 60 * 1000; // 5 minutos

// export const useEquipos = () => {
//   const [equipos, setEquipos]           = useState([]);
//   const [loading, setLoading]           = useState(true);
//   const [balances, setBalances]         = useState([]);
//   const [estados, setEstados]           = useState([]);
//   const [filtro, setFiltro]             = useState("todos");
//   const [filtroEquipo, setFiltroEquipo] = useState("");
//   const [alert, setAlert]               = useState({ message: "", type: "success" });

//   const autoRefreshRef = useRef(null);

//   // ── fetch equipos ──
//   const fetchEquipos = useCallback(async (silent = false) => {
//     if (!silent) setLoading(true);
//     try {
//       const data = await getEquipos();
//       setEquipos(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Error al obtener equipos:", err);
//       if (!silent) setEquipos([]);
//     } finally {
//       if (!silent) setLoading(false);
//     }
//   }, []);

//   // ── fetch balances ──
//   const fetchBalances = useCallback(async () => {
//     try {
//       const res = await getBalancesPresupuestos();
//       setBalances(res.data || []);
//     } catch (err) {
//       console.error("Error al traer balances:", err);
//     }
//   }, []);

//   // ── fetch estados ──
//   useEffect(() => {
//     (async () => {
//       try {
//         const lista = await getEstados();
//         setEstados(lista || []);
//       } catch (err) {
//         console.error("Error al traer estados:", err);
//       }
//     })();
//   }, []);

//   // ── carga inicial ──
//   useEffect(() => {
//     fetchEquipos();
//     fetchBalances();
//   }, [fetchEquipos, fetchBalances]);

//   // ── auto-refresh silencioso cada 5 minutos ──
//   useEffect(() => {
//     autoRefreshRef.current = setInterval(() => {
//       fetchEquipos(true);
//       fetchBalances();
//     }, AUTO_REFRESH_MS);
//     return () => clearInterval(autoRefreshRef.current);
//   }, [fetchEquipos, fetchBalances]);

//   // ── refrescar todo (público) ──
//   const refrescar = useCallback(async () => {
//     await Promise.all([fetchEquipos(), fetchBalances()]);
//   }, [fetchEquipos, fetchBalances]);

//   // ── helpers ──
//   const getNombreEstado = useCallback(
//     (id) => estados.find(e => e.id === id)?.nombre ?? "Desconocido",
//     [estados]
//   );

//   // ── mapa de balances por equipo ──
//   const balanceByEquipoId = useMemo(() => {
//     const map = {};
//     for (const b of balances) map[b.equipo_id] = b;
//     return map;
//   }, [balances]);

//   const totalBalanceGeneral = useMemo(
//     () => balances.reduce((acc, b) => acc + (b?.balance_final ?? 0), 0),
//     [balances]
//   );

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

//   // ── agrupación por mes ──
//   const equiposAgrupadosPorMes = useMemo(() => {
//     const grupos = equiposFiltrados.reduce((acc, eq) => {
//       const fecha = eq.fecha_ingreso
//   ? new Date(eq.fecha_ingreso.toString().replace(" ", "T") + "Z")
//   : null;
//       let key = "Sin fecha", sortKey = "9999-12";
//       if (fecha && !isNaN(fecha.getTime())) {
//         const year  = fecha.getFullYear();
//         const month = String(fecha.getMonth() + 1).padStart(2, "0");
//         sortKey = `${year}-${month}`;
//         key = `${fecha.toLocaleString("es-AR", { month: "long" })} ${year}`;
//       }
//       const b = balanceByEquipoId[eq.id];
//       if (!acc[sortKey]) acc[sortKey] = {
//         label: key, equipos: [],
//         totalCosto: 0, totalVenta: 0, totalBalance: 0,
//       };
//       acc[sortKey].equipos.push(eq);
//       acc[sortKey].totalCosto   += b?.costo_total   ?? 0;
//       acc[sortKey].totalVenta   += b?.total_total   ?? 0;
//       acc[sortKey].totalBalance += b?.balance_final ?? 0;
//       return acc;
//     }, {});

//     return Object.entries(grupos).sort(([a], [b]) => {
//       if (a === "9999-12") return 1;
//       if (b === "9999-12") return -1;
//       return b.localeCompare(a);
//     });
//   }, [equiposFiltrados, balanceByEquipoId]);

//   // ── handleFiltro (sidebar) ──
//   const handleFiltro = useCallback(async (tipo) => {
//     setFiltro(tipo);
//     setFiltroEquipo("");
//     setLoading(true);
//     try {
//       if (tipo === "todos") {
//         await fetchEquipos();
//       } else if (tipo === "otros") {
//         const todos = await getEquipos();
//         setEquipos(todos.filter(eq =>
//           !["celular", "notebook", "pc"].includes(eq.tipo?.toLowerCase())
//         ));
//       } else {
//         const data = await getEquiposByTipo(tipo);
//         setEquipos(Array.isArray(data) ? data : []);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [fetchEquipos]);

//   // ── buscar por cliente ──
//   const buscarPorCliente = useCallback(async (clienteId) => {
//     setLoading(true);
//     setFiltroEquipo("");
//     try {
//       if (!clienteId) {
//         await fetchEquipos();
//       } else {
//         const data = await getEquiposByClienteId(clienteId);
//         setEquipos(Array.isArray(data) ? data : []);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [fetchEquipos]);

//   // ── eliminar equipo ──
//   const handleDelete = useCallback(async (id) => {
//     const result = await Swal.fire({
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
//         confirmButton: "bg-red-600 hover:bg-red-700",
//         cancelButton: "bg-gray-600 hover:bg-gray-700",
//       },
//     });
//     if (result.isConfirmed) {
//       await deleteEquipo(id);
//       await refrescar();
//       setAlert({ message: "✅ Equipo eliminado correctamente", type: "success" });
//     }
//   }, [refrescar]);

//   // ── actualizar equipo ──
//   const handleSubmitEquipo = useCallback(async (equipoId, formData) => {
//     const payload = {
//       tipo:       String(formData.tipo   || "").trim(),
//       marca:      String(formData.marca  || "").trim(),
//       modelo:     String(formData.modelo || "").trim(),
//       imei:       formData.imei       || null,
//       cliente_id: Number(formData.cliente_id),
//       estado_id:  Number(formData.estado_id),
//     };
//     try {
//       await updateEquipo(equipoId, payload);
//       setAlert({ message: "✅ Equipo actualizado correctamente", type: "success" });
//       await refrescar();
//       return true;
//     } catch (err) {
//       console.error("Error al actualizar equipo:", err);
//       setAlert({ message: "❌ Error al actualizar el equipo", type: "error" });
//       return false;
//     }
//   }, [refrescar]);

//   return {
//     // datos
//     equipos,
//     loading,
//     balanceByEquipoId,
//     totalBalanceGeneral,
//     equiposFiltrados,
//     equiposAgrupadosPorMes,
//     // estado UI
//     filtro,
//     filtroEquipo,
//     setFiltroEquipo,
//     alert,
//     setAlert,
//     // helpers
//     getNombreEstado,
//     // acciones
//     refrescar,
//     fetchEquipos,
//     handleFiltro,
//     buscarPorCliente,
//     handleDelete,
//     handleSubmitEquipo,
//   };
// };

// src/hooks/useEquipos.js
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  getEquipos,
  updateEquipo,
  deleteEquipo,
  getEquiposByTipo,
  getEquiposByClienteId,
} from "../api/EquiposApi.jsx";
import { getBalancesPresupuestos } from "../api/PresupuestoApi.jsx";
import { getEstados } from "../api/EstadoApi.jsx";
import Swal from "sweetalert2";

const AUTO_REFRESH_MS = 5 * 60 * 1000;

export const useEquipos = () => {
  const [equipos, setEquipos]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [balances, setBalances]         = useState([]);
  const [estados, setEstados]           = useState([]);
  const [filtro, setFiltro]             = useState("todos");
  const [filtroEquipo, setFiltroEquipo] = useState("");
  const [alert, setAlert]               = useState({ message: "", type: "success" });

  const autoRefreshRef = useRef(null);

  const fetchEquipos = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await getEquipos();
      setEquipos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener equipos:", err);
      if (!silent) setEquipos([]);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  const fetchBalances = useCallback(async () => {
    try {
      const res = await getBalancesPresupuestos();
      setBalances(res.data || []);
    } catch (err) {
      console.error("Error al traer balances:", err);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const lista = await getEstados();
        setEstados(lista || []);
      } catch (err) {
        console.error("Error al traer estados:", err);
      }
    })();
  }, []);

  useEffect(() => {
    fetchEquipos();
    fetchBalances();
  }, [fetchEquipos, fetchBalances]);

  useEffect(() => {
    autoRefreshRef.current = setInterval(() => {
      fetchEquipos(true);
      fetchBalances();
    }, AUTO_REFRESH_MS);
    return () => clearInterval(autoRefreshRef.current);
  }, [fetchEquipos, fetchBalances]);

  const refrescar = useCallback(async () => {
    await Promise.all([fetchEquipos(), fetchBalances()]);
  }, [fetchEquipos, fetchBalances]);

  const getNombreEstado = useCallback(
    (id) => estados.find(e => e.id === id)?.nombre ?? "Desconocido",
    [estados]
  );

  const balanceByEquipoId = useMemo(() => {
    const map = {};
    for (const b of balances) map[b.equipo_id] = b;
    return map;
  }, [balances]);

  const totalBalanceGeneral = useMemo(
    () => balances.reduce((acc, b) => acc + (b?.balance_final ?? 0), 0),
    [balances]
  );

  const equiposFiltrados = useMemo(() => {
    if (!filtroEquipo.trim()) return equipos;
    const q = filtroEquipo.toLowerCase();
    return equipos.filter(eq =>
      eq.marca?.toLowerCase().includes(q)  ||
      eq.modelo?.toLowerCase().includes(q) ||
      eq.tipo?.toLowerCase().includes(q)
    );
  }, [equipos, filtroEquipo]);

  const equiposAgrupadosPorMes = useMemo(() => {
    const grupos = equiposFiltrados.reduce((acc, eq) => {
      // ⬇️ FIX TIMEZONE: forzar interpretación UTC para evitar desfase en Argentina
      let fecha = null;
      if (eq.fecha_ingreso) {
        const raw = eq.fecha_ingreso.toString();
        // Si ya tiene timezone (Z o +00) lo usamos directo
        // Si no, reemplazamos el espacio por T y agregamos Z para forzar UTC
        const normalized = raw.includes("Z") || raw.includes("+")
          ? raw
          : raw.replace(" ", "T") + "Z";
        fecha = new Date(normalized);
        if (isNaN(fecha.getTime())) fecha = null;
      }

      let key = "Sin fecha", sortKey = "9999-12";
      if (fecha) {
        // Usamos UTC para extraer año y mes — evita desfase de timezone
        const year  = fecha.getUTCFullYear();
        const month = fecha.getUTCMonth();
        sortKey = `${year}-${String(month + 1).padStart(2, "0")}`;
        key = `${new Date(Date.UTC(year, month, 1))
          .toLocaleString("es-AR", { month: "long", timeZone: "UTC" })} ${year}`;
      }

      const b = balanceByEquipoId[eq.id];
      if (!acc[sortKey]) acc[sortKey] = {
        label: key, equipos: [],
        totalCosto: 0, totalVenta: 0, totalBalance: 0,
      };
      acc[sortKey].equipos.push(eq);
      acc[sortKey].totalCosto   += b?.costo_total   ?? 0;
      acc[sortKey].totalVenta   += b?.total_total   ?? 0;
      acc[sortKey].totalBalance += b?.balance_final ?? 0;
      return acc;
    }, {});

    return Object.entries(grupos).sort(([a], [b]) => {
      if (a === "9999-12") return 1;
      if (b === "9999-12") return -1;
      return b.localeCompare(a);
    });
  }, [equiposFiltrados, balanceByEquipoId]);

  const handleFiltro = useCallback(async (tipo) => {
    setFiltro(tipo);
    setFiltroEquipo("");
    setLoading(true);
    try {
      if (tipo === "todos") {
        await fetchEquipos();
      } else if (tipo === "otros") {
        const todos = await getEquipos();
        setEquipos(todos.filter(eq =>
          !["celular", "notebook", "pc"].includes(eq.tipo?.toLowerCase())
        ));
      } else {
        const data = await getEquiposByTipo(tipo);
        setEquipos(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchEquipos]);

  const buscarPorCliente = useCallback(async (clienteId) => {
    setLoading(true);
    setFiltroEquipo("");
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
  }, [fetchEquipos]);

  const handleDelete = useCallback(async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar equipo?",
      text: "Esta acción dará de baja el equipo y sus órdenes asociadas.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
        title: "text-xl font-bold",
        htmlContainer: "text-gray-300",
        confirmButton: "bg-red-600 hover:bg-red-700",
        cancelButton: "bg-gray-600 hover:bg-gray-700",
      },
    });
    if (result.isConfirmed) {
      await deleteEquipo(id);
      await refrescar();
      setAlert({ message: "✅ Equipo eliminado correctamente", type: "success" });
    }
  }, [refrescar]);

  const handleSubmitEquipo = useCallback(async (equipoId, formData) => {
    const payload = {
      tipo:       String(formData.tipo   || "").trim(),
      marca:      String(formData.marca  || "").trim(),
      modelo:     String(formData.modelo || "").trim(),
      imei:       formData.imei       || null,
      cliente_id: Number(formData.cliente_id),
      estado_id:  Number(formData.estado_id),
    };
    try {
      await updateEquipo(equipoId, payload);
      setAlert({ message: "✅ Equipo actualizado correctamente", type: "success" });
      await refrescar();
      return true;
    } catch (err) {
      console.error("Error al actualizar equipo:", err);
      setAlert({ message: "❌ Error al actualizar el equipo", type: "error" });
      return false;
    }
  }, [refrescar]);

  return {
    equipos,
    loading,
    balanceByEquipoId,
    totalBalanceGeneral,
    equiposFiltrados,
    equiposAgrupadosPorMes,
    filtro,
    filtroEquipo,
    setFiltroEquipo,
    alert,
    setAlert,
    getNombreEstado,
    refrescar,
    fetchEquipos,
    handleFiltro,
    buscarPorCliente,
    handleDelete,
    handleSubmitEquipo,
  };
};