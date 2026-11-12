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
} from "../api/EquiposApi.jsx";
import { getBalancesPresupuestos } from "../api/PresupuestoApi.jsx";
import { getEstados } from "../api/EstadoApi.jsx";
import Swal from "sweetalert2";

const AUTO_REFRESH_MS = 5 * 60 * 1000;
const TIPOS_PRINCIPALES = ["celular", "notebook", "pc"];

// ── Período: helpers de fecha (todo como texto "YYYY-MM-DD", sin líos de zona horaria) ──
const pad = (n) => String(n).padStart(2, "0");
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const ultimoDiaMes = (y, m) => new Date(y, m + 1, 0).getDate(); // m: 0-11
const mesActualStr = () => { const h = new Date(); return `${h.getFullYear()}-${pad(h.getMonth() + 1)}`; };
const nombreMes = (y, m) =>
  new Date(y, m, 1).toLocaleString("es-AR", { month: "long", year: "numeric" });
const fmtCorta = (s) => (s ? s.split("-").reverse().join("/") : "…");

// Misma interpretación que la agrupación por mes (la fecha guardada se lee como UTC)
const fechaKeyEquipo = (eq) => {
  if (!eq?.fecha_ingreso) return null;
  const raw = eq.fecha_ingreso.toString();
  const normalized = raw.includes("Z") || raw.includes("+") ? raw : raw.replace(" ", "T") + "Z";
  const f = new Date(normalized);
  if (isNaN(f.getTime())) return null;
  return `${f.getUTCFullYear()}-${pad(f.getUTCMonth() + 1)}-${pad(f.getUTCDate())}`;
};

// Devuelve { desde, hasta, etiqueta } o null si no hay filtro
const calcularRango = (periodo) => {
  const hoy = new Date();
  const y = hoy.getFullYear(), m = hoy.getMonth();
  switch (periodo.modo) {
    case "este_mes":
      return { desde: `${y}-${pad(m + 1)}-01`, hasta: ymd(hoy), etiqueta: nombreMes(y, m) };
    case "mes_ant": {
      const d = new Date(y, m - 1, 1);
      const ya = d.getFullYear(), ma = d.getMonth();
      return { desde: `${ya}-${pad(ma + 1)}-01`, hasta: `${ya}-${pad(ma + 1)}-${ultimoDiaMes(ya, ma)}`, etiqueta: nombreMes(ya, ma) };
    }
    case "ult_3": {
      const d = new Date(y, m - 2, 1);
      return { desde: ymd(d), hasta: ymd(hoy), etiqueta: "Últimos 3 meses" };
    }
    case "este_anio":
      return { desde: `${y}-01-01`, hasta: ymd(hoy), etiqueta: `Año ${y}` };
    case "mes": {
      if (!periodo.mes) return null;
      const [ys, ms] = periodo.mes.split("-").map(Number);
      return { desde: `${periodo.mes}-01`, hasta: `${periodo.mes}-${ultimoDiaMes(ys, ms - 1)}`, etiqueta: nombreMes(ys, ms - 1) };
    }
    case "rango": {
      if (!periodo.desde && !periodo.hasta) return null;
      let { desde, hasta } = periodo;
      if (desde && hasta && desde > hasta) [desde, hasta] = [hasta, desde];
      return { desde: desde || null, hasta: hasta || null, etiqueta: `${fmtCorta(desde)} → ${fmtCorta(hasta)}` };
    }
    default:
      return null;
  }
};

export const useEquipos = () => {
  const [equipos, setEquipos]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [balances, setBalances]         = useState([]);
  const [estados, setEstados]           = useState([]);
  const [filtro, setFiltro]             = useState("todos");
  const [filtroEquipo, setFiltroEquipo] = useState("");
  const [clienteFiltroId, setClienteFiltroId] = useState(null);
  const [alert, setAlert]               = useState({ message: "", type: "success" });
  const [periodo, setPeriodo]           = useState(() => ({
    modo: "todos", mes: mesActualStr(), desde: "", hasta: "",
  }));

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

  const rangoPeriodo = useMemo(() => calcularRango(periodo), [periodo]);

  const equiposFiltrados = useMemo(() => {
    let lista = equipos;

    if (clienteFiltroId) {
      lista = lista.filter(eq => Number(eq.cliente_id) === clienteFiltroId);
    }

    if (filtro && filtro !== "todos") {
      const t = filtro.toLowerCase();
      lista = t === "otros"
        ? lista.filter(eq => !TIPOS_PRINCIPALES.includes(eq.tipo?.toLowerCase()))
        : lista.filter(eq => eq.tipo?.toLowerCase() === t);
    }

    if (filtroEquipo.trim()) {
      const q = filtroEquipo.toLowerCase();
      lista = lista.filter(eq =>
        eq.marca?.toLowerCase().includes(q)  ||
        eq.modelo?.toLowerCase().includes(q) ||
        eq.tipo?.toLowerCase().includes(q)
      );
    }

    if (rangoPeriodo) {
      const { desde, hasta } = rangoPeriodo;
      lista = lista.filter(eq => {
        const k = fechaKeyEquipo(eq);
        if (!k) return false; // sin fecha: queda fuera cuando hay período
        if (desde && k < desde) return false;
        if (hasta && k > hasta) return false;
        return true;
      });
    }

    return lista;
  }, [equipos, clienteFiltroId, filtro, filtroEquipo, rangoPeriodo]);

  // Balance de lo que se está viendo (para cuando hay período elegido)
  const totalBalancePeriodo = useMemo(
    () => equiposFiltrados.reduce((acc, eq) => acc + (balanceByEquipoId[eq.id]?.balance_final ?? 0), 0),
    [equiposFiltrados, balanceByEquipoId]
  );

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

  // Tipo y cliente se filtran sobre la lista completa (ya trae la fecha de la última OT,
  // ultima_ot_id, falla, etc.). Así no se pierden datos y el auto-refresh no borra el filtro.
  const handleFiltro = useCallback((tipo) => {
    setFiltro(tipo);
    setFiltroEquipo("");
    setClienteFiltroId(null);
  }, []);

  const buscarPorCliente = useCallback((clienteId) => {
    setFiltroEquipo("");
    setFiltro("todos");
    setClienteFiltroId(clienteId ? Number(clienteId) : null);
  }, []);

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
    totalBalancePeriodo,
    equiposFiltrados,
    equiposAgrupadosPorMes,
    filtro,
    filtroEquipo,
    setFiltroEquipo,
    periodo,
    setPeriodo,
    rangoPeriodo,
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