// src/pages/EquipoPage.jsx
import SidebarCard from "../components/Ui/SidebarCard.jsx";
//dependencias
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

//api
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
import { createIngreso } from "../api/IngresoApi"; // (lo mantenemos por si lo reactivás)
import { enviarMensaje } from "../api/TwilioApi.jsx";
import { getClienteById } from "../api/ClienteApi.jsx";

//componentes
import SidebarEquipos from "../components/Equipo/SidebarEquipos.jsx";
import EquipoModal from "../components/Equipo/EquipoModal.jsx";
// import BuscadorComponent from "../components/General/BuscadorComponent.jsx";
import AlertNotification from "../components/Alerta/AlertNotification.jsx";

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

  const navigate = useNavigate();

  // ---------- Data Fetch ----------
  const fetchEquipos = async () => {
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
  };

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
  }, []);

  // ---------- Acciones ----------
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
      theme: "dark",
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
        // await EnviarNotificacionWhatsApp(payload.cliente_id, payload);
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
                  title={mostrarBalances ? "Mostrar montos" : "Ocultar montos"}
                >
                  {mostrarBalances ? "Mostrar montos" : "Ocultar montos"}
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
                    {mostrarBalances ? "******" : totalBalanceGeneral.toLocaleString("es-AR")}
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
                Object.entries(
                  equipos.reduce((grupos, eq) => {
                    const fecha = eq.fecha_ingreso
                      ? new Date(eq.fecha_ingreso + "T12:00:00")
                      : null;
                    const key = fecha
                      ? `${fecha.toLocaleString("es-AR", { month: "long" })} ${fecha.getFullYear()}`
                      : "Sin fecha";
                    if (!grupos[key]) grupos[key] = [];
                    grupos[key].push(eq);
                    return grupos;
                  }, {})
                ).map(([mes, equiposMes]) => {
                  const totalMes = equiposMes.reduce(
                    (acc, eq) => acc + (balanceByEquipoId[eq.id]?.balance_final ?? 0),
                    0
                  );

                  return (
                    <div key={mes} className="mb-6">
                      <div className="border-b border-white/10 pb-2 mb-3">
                        <h4 className="text-lg font-semibold text-neutral-200 capitalize">
                          {mes}
                        </h4>
                      </div>

                      <div className="mb-3">
                        <div className="rounded-xl border border-white/10 bg-neutral-900/40 p-3 flex items-center justify-between">
                          <span className="text-sm text-neutral-300">Balance del mes</span>
                          <span className="text-lg font-semibold text-emerald-400">
                            {mostrarBalances ? "******" : totalMes.toLocaleString("es-AR")}
                          </span>
                        </div>
                      </div>

                      <ol className="space-y-4 list-decimal list-inside">
                        {equiposMes.map((eq) => {
                          const fechaFormateada = eq.fecha_ingreso
                            ? new Date(eq.fecha_ingreso + "T12:00:00").toLocaleDateString(
                                "es-AR",
                                { year: "numeric", month: "2-digit", day: "2-digit" }
                              )
                            : "Sin fecha";

                          const monto = balanceByEquipoId[eq.id]?.balance_final ?? 0;

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
                                  Cliente: {eq.cliente_nombre} {eq.cliente_apellido}
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
                                    {mostrarBalances ? "******" : monto.toLocaleString("es-AR")}
                                  </span>
                                </div>

                                {/* Botones */}
                                <div className="flex gap-2">
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

      {/* Modal */}
      <EquipoModal
        isOpen={isOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        equipoSeleccionado={equipoSeleccionado}
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
