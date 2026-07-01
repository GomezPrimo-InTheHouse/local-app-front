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
import PresupuestoModal        from "../components/Presupuesto/PresupuestoModal.jsx";

const formatPrice = (p) =>
  Number(p || 0).toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const IconMoney = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const EquipoPage = () => {
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

  const [mostrarBalances, setMostrarBalances] = useState(false);

  // ── Modal Nueva OT ──
  const [isNuevaOTOpen, setIsNuevaOTOpen]               = useState(false);
  const [equipoPreseleccionado, setEquipoPreseleccionado] = useState(null);

  // ── Modal Modificar Equipo ──
  const [isEquipoModalOpen, setIsEquipoModalOpen]       = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado]     = useState(null);

  // ── Modal Historial ──
  const [isHistorialOpen, setIsHistorialOpen]           = useState(false);
  const [clienteHistorial, setClienteHistorial]         = useState({ id: null, nombre: "" });

  // ── Modal Presupuesto (desde card) ──
  const [isPresupuestoOpen, setIsPresupuestoOpen]       = useState(false);
  const [ordenParaPresupuesto, setOrdenParaPresupuesto] = useState(null); // { id: ultima_ot_id }
  const [tipoEquipoPresupuesto, setTipoEquipoPresupuesto] = useState("");

  // ── Handlers ──
  const handleAgregar = useCallback(() => {
    setEquipoPreseleccionado(null);
    setIsNuevaOTOpen(true);
  }, []);

  const handleNuevaOTDesdeCard = useCallback((eq) => {
    setEquipoPreseleccionado(eq);
    setIsNuevaOTOpen(true);
  }, []);

  // Abre el PresupuestoModal con la última OT del equipo pre-cargada
  const handleNuevoPresupuestoDesdeCard = useCallback((eq) => {
    if (!eq.ultima_ot_id) {
      setAlert({ message: "⚠️ Este equipo no tiene una orden de trabajo activa. Creá una OT primero.", type: "error" });
      return;
    }
    setOrdenParaPresupuesto({ id: eq.ultima_ot_id });
    setTipoEquipoPresupuesto(eq.tipo);
    setIsPresupuestoOpen(true);
  }, [setAlert]);

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

  const showAlert = useCallback((msg, type = "success") => {
    setAlert({ message: msg, type });
  }, [setAlert]);

  return (
    <div className="min-h-dvh w-screen bg-neutral-900 text-white/95 overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-0 md:gap-6 w-full">

          {/* SIDEBAR */}
          <aside className="md:sticky md:top-4 md:h-[calc(100vh-2rem)] overflow-y-auto px-3 sm:px-4 py-4 border-b md:border-b-0 md:border-r border-white/10 [scrollbar-width:thin] bg-transparent">
            <div className="space-y-4">
              <button onClick={handleAgregar}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-base font-semibold tracking-wide transition-all duration-200 shadow-xl shadow-emerald-900/50">
                ➕ Nueva Orden de Trabajo
              </button>
              <div className="rounded-2xl border border-white/10 bg-neutral-800/70 p-4 sm:p-5 shadow-sm text-sm leading-6
                [&_*]:!max-w-none [&_*]:mx-0 [&_*]:text-left [&_h1]:text-base [&_h2]:text-base [&_h3]:text-sm
                [&_p]:text-sm [&_small]:text-xs [&_.flex]:items-stretch [&_.flex]:justify-start
                [&_.grid]:grid-cols-1 [&_.grid]:gap-2 [&_button]:w-full [&_button]:h-11 [&_button]:rounded-lg
                [&_button]:px-3 [&_button]:text-sm [&_button]:inline-flex [&_button]:items-center [&_button]:justify-start
                [&_a]:w-full [&_a]:h-11 [&_a]:rounded-lg [&_a]:px-3 [&_a]:text-sm
                [&_a]:inline-flex [&_a]:items-center [&_a]:justify-start [&_li]:mb-2 [&_li:last-child]:mb-0">
                <SidebarEquipos filtro={filtro} handleFiltro={handleFiltro} handleAgregar={handleAgregar} />
              </div>
              <div className="rounded-2xl border border-white/10 bg-neutral-800/40 p-4">
                <p className="text-xs text-neutral-400 leading-5">
                  Agrupamos por <b className="text-neutral-300">mes de ingreso</b> de la última OT.
                  Se refresca automáticamente cada 5 min.
                </p>
              </div>
            </div>
          </aside>

          {/* MAIN */}
          <main className="md:h-[100svh] md:overflow-y-auto">
            <div className="sticky top-0 z-10 px-3 sm:px-4 py-3 backdrop-blur bg-neutral-900/90 border-b border-white/10">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base sm:text-lg font-semibold">Lista de Equipos</h3>
                <div className="flex items-center gap-2">
                  {filtroEquipo && (
                    <span className="text-xs text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded-lg">
                      "{filtroEquipo}"
                    </span>
                  )}
                  <button onClick={() => setMostrarBalances(v => !v)}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800/70 hover:bg-neutral-800 border border-white/10 text-xs sm:text-sm transition-colors">
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
                    <span className="text-sm text-neutral-300 flex items-center gap-2"><IconMoney /> Balance GLOBAL</span>
                    <span className={`text-xl font-semibold ${totalBalanceGeneral >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {mostrarBalances ? "******" : `$${formatPrice(totalBalanceGeneral)}`}
                    </span>
                  </div>
                </div>
              </section>

              <EquipoBalanceTable
                equiposAgrupadosPorMes={equiposAgrupadosPorMes}
                mostrarBalances={mostrarBalances}
              />

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
                onNuevoPresupuesto={handleNuevoPresupuestoDesdeCard}
                onLimpiarFiltro={() => setFiltroEquipo("")}
              />
            </div>
          </main>
        </div>

        {/* MODALES */}
        <NuevaOrdenTrabajoModal
          isOpen={isNuevaOTOpen}
          onClose={() => { setIsNuevaOTOpen(false); setEquipoPreseleccionado(null); }}
          equipoPreseleccionado={equipoPreseleccionado}
          onSuccess={(msg) => { setAlert({ message: msg, type: "success" }); refrescar(); }}
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

        {/* PresupuestoModal — abre desde la card con la OT pre-cargada */}
        <PresupuestoModal
          isOpen={isPresupuestoOpen}
          onClose={() => { setIsPresupuestoOpen(false); setOrdenParaPresupuesto(null); }}
          ingresoSeleccionado={ordenParaPresupuesto}
          presupuesto={null}
          esEdicion={false}
          tipoEquipo={tipoEquipoPresupuesto}
          showAlert={showAlert}
          onPresupuestoGuardado={() => {
            setIsPresupuestoOpen(false);
            setOrdenParaPresupuesto(null);
            refrescar();
          }}
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