// src/components/Pagos/HistorialPagosVentasModal.jsx
// Historial y carga de pagos de VENTAS de un cliente.
// Misma lógica que HistorialPagosModal (servicio técnico): un pago del cliente
// se reparte a la venta más vieja primero. También se puede pagar una venta puntual.
// Los pagos no se borran: se anulan y quedan tachados en el historial.
import { useState, useEffect, useCallback, useMemo } from "react";
import Modal from "react-modal";
import Swal from "sweetalert2";
import {
  getPagosVentasCliente,
  pagarVentasCliente,
  registrarPagoVenta,
  anularPagoVenta,
} from "../../api/VentaApi.jsx";

const METODOS = ["Efectivo", "Transferencia", "Tarjeta", "Mercado Pago"];
const DESTINO_REPARTIR = "repartir";

const parseNumber = (v) => parseInt(String(v).replace(/\D/g, ""), 10) || 0;
const formatNumberWithDots = (n) =>
  n === 0 ? "" : Number(n).toLocaleString("es-AR", { maximumFractionDigits: 0 });
const formatPrice = (p) =>
  Number(p || 0).toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const formatDate = (s) => {
  if (!s) return "—";
  const d = new Date(s);
  return isNaN(d.getTime())
    ? "—"
    : d.toLocaleString("es-AR", {
        day: "2-digit", month: "2-digit", year: "2-digit",
        hour: "2-digit", minute: "2-digit",
        timeZone: "America/Argentina/Buenos_Aires",
      });
};

const swalDark = {
  popup: "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
  htmlContainer: "text-gray-300",
};

const HistorialPagosVentasModal = ({
  isOpen,
  onClose,
  clienteId,
  clienteNombre,
  ventaIdFoco = null, // si se abre desde una venta, se preselecciona como destino
  onChange,           // se llama después de cargar/anular un pago (para refrescar la lista)
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [monto, setMonto] = useState("");
  const [metodo, setMetodo] = useState("Efectivo");
  const [observaciones, setObservaciones] = useState("");
  const [destino, setDestino] = useState(DESTINO_REPARTIR);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ventas = useMemo(() => data?.ventas ?? [], [data]);
  const pagos = useMemo(() => data?.pagos ?? [], [data]);
  const deudaTotal = Number(data?.deuda_total ?? 0);

  const ventasConSaldo = useMemo(
    () => ventas.filter((v) => !v.anulada && Number(v.saldo) > 0),
    [ventas]
  );

  const abonosPrevios = useMemo(
    () => ventas.filter((v) => Number(v.abonado_previo) > 0),
    [ventas]
  );

  const saldoDestino =
    destino === DESTINO_REPARTIR
      ? deudaTotal
      : Number(ventasConSaldo.find((v) => String(v.venta_id) === String(destino))?.saldo ?? 0);

  const fetchHistorial = useCallback(async () => {
    if (!clienteId) return;
    setLoading(true);
    try {
      const res = await getPagosVentasCliente(clienteId);
      setData(res);
      return res;
    } catch (error) {
      console.error("Error al cargar pagos de ventas:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [clienteId]);

  useEffect(() => {
    if (!isOpen || !clienteId) return;
    setMonto("");
    setObservaciones("");
    setMetodo("Efectivo");
    fetchHistorial().then((res) => {
      const foco = (res?.ventas ?? []).find(
        (v) => String(v.venta_id) === String(ventaIdFoco) && !v.anulada && Number(v.saldo) > 0
      );
      setDestino(foco ? String(foco.venta_id) : DESTINO_REPARTIR);
    });
  }, [isOpen, clienteId, ventaIdFoco, fetchHistorial]);

  const handleNuevoPago = async (e) => {
    e.preventDefault();
    const montoNum = parseNumber(monto);

    if (montoNum <= 0) {
      Swal.fire({ title: "Monto inválido", text: "El pago debe ser mayor a 0.", icon: "warning", customClass: swalDark });
      return;
    }
    if (montoNum > saldoDestino) {
      Swal.fire({
        title: "Monto mayor al saldo",
        text: `El pago no puede superar $${formatPrice(saldoDestino)}.`,
        icon: "warning",
        customClass: swalDark,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let mensaje;
      if (destino === DESTINO_REPARTIR) {
        const res = await pagarVentasCliente(clienteId, {
          monto: montoNum,
          metodo_pago: metodo,
          observaciones,
        });
        const aplicado = res?.data?.aplicado ?? [];
        mensaje =
          `Pago de $${formatPrice(montoNum)} aplicado en ${aplicado.length} venta${aplicado.length !== 1 ? "s" : ""}: ` +
          aplicado.map((a) => `#${a.venta_id} ($${formatPrice(a.monto)})`).join(", ");
      } else {
        await registrarPagoVenta(destino, { monto: montoNum, metodo_pago: metodo, observaciones });
        mensaje = `Pago de $${formatPrice(montoNum)} registrado en la venta #${destino}.`;
      }

      Swal.fire({ title: "Pago registrado", text: mensaje, icon: "success", timer: 3500, showConfirmButton: false, customClass: swalDark });
      setMonto("");
      setObservaciones("");
      const res = await fetchHistorial();
      const sigueConSaldo = (res?.ventas ?? []).some(
        (v) => String(v.venta_id) === String(destino) && !v.anulada && Number(v.saldo) > 0
      );
      if (!sigueConSaldo) setDestino(DESTINO_REPARTIR);
      onChange?.();
    } catch (error) {
      console.error("Error al registrar pago:", error);
      Swal.fire({ title: "Error", text: error?.error || "No se pudo registrar el pago.", icon: "error", customClass: swalDark });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnular = async (pago) => {
    const result = await Swal.fire({
      title: `¿Anular pago de $${formatPrice(pago.monto)}?`,
      text: `Venta #${pago.venta_id} · ${pago.metodo_pago}. El pago queda en el historial como anulado y el saldo vuelve a la venta.`,
      input: "text",
      inputPlaceholder: "Motivo (opcional)",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Anular pago",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      customClass: { ...swalDark, input: "bg-neutral-900 text-white border border-neutral-700" },
    });
    if (!result.isConfirmed) return;

    try {
      await anularPagoVenta(pago.pago_id, result.value || null);
      await fetchHistorial();
      onChange?.();
      Swal.fire({ title: "Pago anulado", icon: "success", timer: 2000, showConfirmButton: false, customClass: swalDark });
    } catch (error) {
      console.error("Error al anular pago:", error);
      Swal.fire({ title: "Error", text: error?.error || "No se pudo anular el pago.", icon: "error", customClass: swalDark });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      overlayClassName="fixed inset-0 bg-black/70 z-40"
    >
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 bg-neutral-800/50 relative">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Pagos de ventas: <span className="text-purple-400">{clienteNombre}</span>
          </h2>
          <p className="text-sm text-neutral-400">
            {ventas.length} venta{ventas.length !== 1 ? "s" : ""} · {pagos.filter((p) => !p.anulado).length} pago
            {pagos.filter((p) => !p.anulado).length !== 1 ? "s" : ""} registrados
          </p>
          <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-white transition text-3xl leading-none">
            &times;
          </button>
        </div>

        <div className="flex-grow grid md:grid-cols-3 gap-4 p-5 overflow-y-auto md:overflow-hidden">
          {/* COLUMNA 1: CARGA + HISTORIAL */}
          <div className="md:col-span-1 md:border-r border-neutral-800 md:pr-4 flex flex-col md:overflow-y-auto space-y-4">
            <div className={`p-4 rounded-xl border ${deudaTotal > 0 ? "bg-red-900/40 border-red-500/50" : "bg-emerald-900/40 border-emerald-500/50"}`}>
              <p className="text-sm font-medium text-neutral-300">Deuda en ventas:</p>
              <p className="text-3xl font-extrabold tracking-tight">
                <span className={deudaTotal > 0 ? "text-red-400" : "text-emerald-400"}>${formatPrice(deudaTotal)}</span>
              </p>
              <small className="text-neutral-500 block mt-1">
                Total pagado con historial: ${formatPrice(data?.total_pagado)}
              </small>
            </div>

            {/* Formulario */}
            <form onSubmit={handleNuevoPago} className="p-3 bg-neutral-800 border border-neutral-700 rounded-lg grid grid-cols-4 gap-3">
              <h4 className="col-span-4 text-sm font-semibold text-neutral-300">Registrar pago</h4>

              <select
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                disabled={ventasConSaldo.length === 0 || isSubmitting}
                className="col-span-4 p-2 rounded bg-neutral-900 border border-neutral-700 text-white text-sm focus:border-purple-500"
              >
                <option value={DESTINO_REPARTIR}>Repartir (venta más vieja primero)</option>
                {ventasConSaldo.map((v) => (
                  <option key={v.venta_id} value={String(v.venta_id)}>
                    Venta #{v.venta_id} · saldo ${formatPrice(v.saldo)}
                  </option>
                ))}
              </select>

              <div className="col-span-2 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Monto"
                  value={monto}
                  onChange={(e) => setMonto(formatNumberWithDots(parseNumber(e.target.value)))}
                  disabled={ventasConSaldo.length === 0 || isSubmitting}
                  className="w-full pl-7 pr-3 py-2 rounded bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:border-purple-500"
                />
              </div>

              <select
                value={metodo}
                onChange={(e) => setMetodo(e.target.value)}
                disabled={ventasConSaldo.length === 0 || isSubmitting}
                className="col-span-2 p-2 rounded bg-neutral-900 border border-neutral-700 text-white text-sm focus:border-purple-500"
              >
                {METODOS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Observaciones (opcional)"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                disabled={ventasConSaldo.length === 0 || isSubmitting}
                className="col-span-4 p-2 rounded bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:border-purple-500"
              />

              {ventasConSaldo.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMonto(formatNumberWithDots(Math.floor(saldoDestino)))}
                  className="col-span-4 text-xs text-purple-300 hover:text-purple-200 text-left"
                >
                  Completar con el saldo (${formatPrice(saldoDestino)})
                </button>
              )}

              <button
                type="submit"
                disabled={isSubmitting || ventasConSaldo.length === 0 || parseNumber(monto) <= 0}
                className="col-span-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold p-2 rounded transition text-sm disabled:opacity-50"
              >
                {isSubmitting ? "Procesando..." : ventasConSaldo.length === 0 ? "Sin saldo pendiente" : "Registrar pago"}
              </button>
            </form>

            {/* Historial */}
            <div className="pt-4 border-t border-neutral-800">
              <h4 className="text-sm font-semibold text-neutral-400 mb-2">Historial de pagos</h4>
              {loading ? (
                <p className="text-neutral-500 text-sm">Cargando…</p>
              ) : pagos.length === 0 && abonosPrevios.length === 0 ? (
                <p className="text-neutral-500 text-sm">No hay pagos registrados.</p>
              ) : (
                <ul className="divide-y divide-neutral-800">
                  {pagos.map((pago) => (
                    <li key={pago.pago_id} className={`py-2 text-sm ${pago.anulado ? "opacity-60" : ""}`}>
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex flex-col min-w-0">
                          <span className={`font-medium ${pago.anulado ? "line-through text-neutral-500" : "text-white"}`}>
                            ${formatPrice(pago.monto)}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {pago.metodo_pago} · Venta #{pago.venta_id}
                            {pago.grupo_pago ? " · repartido" : ""}
                          </span>
                          {pago.observaciones && (
                            <span className="text-xs text-neutral-400 italic truncate" title={pago.observaciones}>
                              {pago.observaciones}
                            </span>
                          )}
                          {pago.anulado && (
                            <span className="text-xs text-red-300">
                              Anulado {formatDate(pago.anulado_at)}
                              {pago.anulado_motivo ? ` · ${pago.anulado_motivo}` : ""}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col items-end flex-shrink-0">
                          <span className="text-xs text-neutral-500">{formatDate(pago.fecha_pago)}</span>
                          {!pago.anulado && (
                            <button
                              type="button"
                              onClick={() => handleAnular(pago)}
                              className="mt-1 text-[11px] text-red-400 hover:text-red-300"
                            >
                              Anular
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}

                  {abonosPrevios.map((v) => (
                    <li key={`previo-${v.venta_id}`} className="py-2 text-sm">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex flex-col">
                          <span className="font-medium text-neutral-300">${formatPrice(v.abonado_previo)}</span>
                          <span className="text-xs text-neutral-500">
                            Abonado previo (sin detalle) · Venta #{v.venta_id}
                          </span>
                        </div>
                        <span className="text-xs text-neutral-600">{formatDate(v.fecha)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* COLUMNA 2: DETALLE POR VENTA */}
          <div className="md:col-span-2 flex flex-col space-y-4 md:overflow-y-auto md:pl-4">
            <h3 className="text-lg font-semibold text-neutral-300">Saldo por venta</h3>
            {loading && !data ? (
              <p className="text-neutral-500">Cargando…</p>
            ) : ventas.length === 0 ? (
              <p className="text-neutral-500 text-lg md:pt-10 text-center">Este cliente no tiene ventas.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ventas.map((v) => {
                  const saldo = Number(v.saldo);
                  return (
                    <div
                      key={v.venta_id}
                      className={`p-4 rounded-xl space-y-2 ${
                        v.anulada
                          ? "bg-neutral-800/30 border border-neutral-700/50 opacity-50"
                          : saldo > 0
                            ? "bg-neutral-800/70 border border-red-800/50"
                            : "bg-neutral-800/70 border border-emerald-800/50"
                      } ${String(v.venta_id) === String(ventaIdFoco) ? "ring-2 ring-purple-500/60" : ""}`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-bold text-sm text-purple-300">
                          Venta #{v.venta_id}
                          <span className="ml-2 text-[11px] font-normal text-neutral-400">
                            {v.canal === "web_shop" ? "Web" : "Local"} · {formatDate(v.fecha)}
                          </span>
                        </p>
                        {v.anulada && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-600/20 text-red-300">
                            {v.estado_nombre || "Anulada"}
                          </span>
                        )}
                      </div>
                      {v.productos && <p className="text-xs text-neutral-400 line-clamp-2">{v.productos}</p>}

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-neutral-400">
                          <span>Total:</span>
                          <span className="font-semibold text-green-400">${formatPrice(v.total)}</span>
                        </div>
                        {Number(v.descuento) > 0 && (
                          <div className="flex justify-between text-xs text-neutral-400">
                            <span>Descuento:</span>
                            <span className="text-amber-300">${formatPrice(v.descuento)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-xs text-neutral-400">
                          <span>Abonado:</span>
                          <span className="font-semibold text-yellow-400">${formatPrice(v.monto_abonado)}</span>
                        </div>
                        {Number(v.abonado_previo) > 0 && (
                          <div className="flex justify-between text-[11px] text-neutral-500">
                            <span>(incluye abonado previo sin detalle)</span>
                            <span>${formatPrice(v.abonado_previo)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm font-bold pt-1 border-t border-neutral-700">
                          <span>Pendiente:</span>
                          <span className={saldo > 0 && !v.anulada ? "text-red-400" : "text-emerald-400"}>
                            {v.anulada ? "—" : saldo > 0 ? `$${formatPrice(saldo)}` : "Saldado ✓"}
                          </span>
                        </div>
                      </div>

                      {!v.anulada && saldo > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setDestino(String(v.venta_id));
                            setMonto(formatNumberWithDots(Math.floor(saldo)));
                          }}
                          className="w-full mt-1 text-xs py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-200"
                        >
                          Pagar esta venta
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default HistorialPagosVentasModal;