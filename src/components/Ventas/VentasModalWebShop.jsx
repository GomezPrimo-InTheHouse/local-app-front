
import { X } from "lucide-react";

import { useEffect, useMemo, useState } from "react";

const VentasModalWebShop = ({ open, venta, onClose, onGuardar }) => {
    const [nuevoPago, setNuevoPago] = useState("");
    const [saving, setSaving] = useState(false);
    const ventaId = venta?.id ?? venta?.venta_id ?? null;

    const detalles = useMemo(() => {
        if (Array.isArray(venta?.detalle_venta)) return venta.detalle_venta;
        if (Array.isArray(venta?.detalles)) return venta.detalles;
        return [];
    }, [venta]);

    const total = Number(venta?.total || 0);
    const clienteId = venta?.cliente?.id ?? venta?.cliente_id ?? null;

    const pagadoActual = Number(venta?.monto_abonado ?? 0);

    // helpers
    const sanitizeNumberString = (raw) => {
        if (raw == null) return "";
        return String(raw).replace(/[^0-9]/g, "");
    };

    const onChangeNuevoPago = (e) => {
        const v = sanitizeNumberString(e.target.value);
        setNuevoPago(v === "" ? "" : v);
    };

    // cuando abre o cambia de venta: limpiar el “nuevo pago”
    useEffect(() => {
        if (!open) return;
        setNuevoPago("");
    }, [open, ventaId]);

    const nuevoPagoNum = Number(nuevoPago || 0);
    const montoAbonadoNuevo = Math.max(0, pagadoActual + nuevoPagoNum);
    const saldoNuevo = Math.max(0, total - montoAbonadoNuevo);

    const subtotalItems = useMemo(() => {
        const backendSubtotal = Number(venta?.subtotal_items);
        if (Number.isFinite(backendSubtotal) && backendSubtotal > 0) return backendSubtotal;
        return detalles.reduce((acc, d) => acc + Number(d?.subtotal || 0), 0);
    }, [venta, detalles]);

    const descuentoReal = useMemo(() => {
        const backendDesc = Number(venta?.descuento_real);
        if (Number.isFinite(backendDesc) && backendDesc >= 0) return backendDesc;
        return Math.max(0, subtotalItems - total);
    }, [venta, subtotalItems, total]);

    useEffect(() => {
        if (!open) return;
        const onKeyDown = (ev) => ev.key === "Escape" && onClose?.();
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!open || !venta) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!ventaId) return alert("Venta inválida (sin id).");
        if (!clienteId) return alert("Venta inválida (sin cliente_id).");

        const nuevoPagoNum = Number(nuevoPago || 0);

        if (!Number.isFinite(nuevoPagoNum) || nuevoPagoNum <= 0) {
            return alert("Ingresá un nuevo pago mayor a 0.");
        }

        // ✅ si ya está saldada
        if (pagadoActual >= total) {
            return alert("Esta venta ya está saldada.");
        }

        const montoAbonadoNuevo = Math.max(0, pagadoActual + nuevoPagoNum);
        const saldoNuevo = Math.max(0, total - montoAbonadoNuevo);

        // ✅ no permitir pasarse del total
        if (montoAbonadoNuevo > total) {
            return alert("El pago excede el total. Revisá el importe.");
        }

        if (typeof onGuardar !== "function") {
            return alert("Falta onGuardar en VentasModalWebShop.");
        }

        // Normalizamos detalles para tu backend (solo lectura)
        const detallesPayload = (detalles || []).map((d) => {
            const cantidad = Number(d?.cantidad || 0);
            const precio_unitario_num = Number(d?.precio_unitario || 0);

            const subtotalNum =
                d?.subtotal != null
                    ? Number(d.subtotal)
                    : Number((cantidad * precio_unitario_num).toFixed(2));

            return {
                id: d?.id ?? null,
                producto_id: Number(d?.producto_id ?? d?.producto?.id),
                cantidad,
                precio_unitario: precio_unitario_num.toFixed(2),
                subtotal: subtotalNum.toFixed(2),
            };
        });

        const payload = {
            venta: {
                id: ventaId,
                cliente_id: clienteId,
                monto_abonado: String(Math.floor(montoAbonadoNuevo)),
                total: Number(total).toFixed(2),
                saldo: Number(saldoNuevo).toFixed(2),
            },
            detalles: detallesPayload,
        };

        try {
            setSaving(true);

            // ✅ clave: esperar al padre
            const resp = await onGuardar(payload);

            // ✅ limpiar input para permitir cargar otro pago
            setNuevoPago("");

            // ✅ opcional: cerrar si querés cerrar sí o sí después de guardar
            onClose?.();

            return resp;
        } catch (err) {
            console.error("Error registrando pago:", err);
            // NO cierro el modal así el usuario ve el error y puede reintentar
            return;
        } finally {
            setSaving(false);
        }
    };

    const cliente = venta?.cliente || null;
    const cupon = venta?.cupon ?? null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
                type="button"
                className="absolute inset-0 bg-black/70"
                onClick={onClose}
                aria-label="Cerrar"
            />

            <div
                className="relative w-full max-w-lg bg-neutral-800 rounded-2xl p-6 shadow-lg text-white flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    disabled={saving}
                    aria-label="Cerrar"
                    className="absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full
             bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white
             transition focus:outline-none focus:ring-2 focus:ring-emerald-500/60
             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                    </svg>
                </button>

                <h2 className="text-xl font-semibold mb-1">🛒 Venta Web (Shop)</h2>
                <p className="text-xs text-gray-400 mb-4">
                    Productos/cupón solo lectura. Acá se registra un nuevo pago.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 -mr-2">
                        <div className="bg-neutral-700 p-3 rounded">
                            <p className="text-sm text-gray-300">Cliente</p>
                            <p className="font-semibold text-gray-100 truncate">
                                {cliente ? `${cliente.nombre} ${cliente.apellido}` : "Sin cliente"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                DNI: <span className="text-gray-200">{cliente?.dni ?? "—"}</span>
                                {" · "}Email: <span className="text-gray-200">{cliente?.email ?? "—"}</span>
                            </p>
                        </div>

                        <div className="bg-neutral-700 p-3 rounded space-y-2">
                            <p className="text-sm text-gray-300">Cupón</p>
                            {cupon ? (
                                <p className="text-sm text-gray-100">
                                    <span className="font-semibold">{cupon.codigo}</span>{" "}
                                    <span className="text-xs text-gray-400">
                                        {cupon.descuento_porcentaje != null
                                            ? `(${cupon.descuento_porcentaje}% OFF)`
                                            : cupon.descuento_monto != null
                                                ? `($${Number(cupon.descuento_monto).toLocaleString("es-AR")} OFF)`
                                                : ""}
                                    </span>
                                </p>
                            ) : (
                                <p className="text-sm text-gray-400">Sin cupón</p>
                            )}

                            <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="bg-neutral-800 rounded-lg p-2 border border-white/10">
                                    <div className="text-gray-400">Subtotal</div>
                                    <div className="text-gray-100 font-semibold">
                                        ${subtotalItems.toLocaleString("es-AR")}
                                    </div>
                                </div>
                                <div className="bg-neutral-800 rounded-lg p-2 border border-white/10">
                                    <div className="text-gray-400">Descuento</div>
                                    <div className="text-gray-100 font-semibold">
                                        ${descuentoReal.toLocaleString("es-AR")}
                                    </div>
                                </div>
                                <div className="bg-neutral-800 rounded-lg p-2 border border-white/10">
                                    <div className="text-gray-400">Total</div>
                                    <div className="text-gray-100 font-semibold">
                                        ${total.toLocaleString("es-AR")}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-neutral-700 p-3 rounded">
                            <p className="text-sm text-gray-300 mb-2">Productos (solo lectura)</p>
                            {detalles.length ? (
                                <ul className="text-sm text-gray-200 space-y-1">
                                    {detalles.map((d, idx) => (
                                        <li key={d?.id ?? `d-${idx}`} className="truncate">
                                            {d?.producto?.nombre ?? `Producto #${d.producto_id}`} —{" "}
                                            {d.cantidad} × ${Number(d.precio_unitario).toLocaleString("es-AR")} ={" "}
                                            <span className="font-semibold">
                                                ${Number(d.subtotal).toLocaleString("es-AR")}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-400">Sin productos</p>
                            )}
                        </div>

                        {/* Pagos */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-neutral-700 p-3 rounded">
                                <p className="text-xs text-gray-400">Pagado actual</p>
                                <p className="text-lg font-bold text-gray-100">
                                    ${pagadoActual.toLocaleString("es-AR")}
                                </p>
                            </div>

                            <div className="bg-neutral-700 p-3 rounded">
                                <label className="block text-xs text-gray-400 mb-1">Nuevo pago</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d*"
                                    value={nuevoPago}
                                    onChange={onChangeNuevoPago}
                                    className={[
                                        "w-full p-2 rounded text-white transition",
                                        "bg-neutral-600",
                                        "focus:outline-none focus:ring-2 focus:ring-emerald-500/60",
                                        saving ? "opacity-60 cursor-not-allowed" : "hover:bg-neutral-500",
                                    ].join(" ")}
                                    placeholder={saving ? "Guardando..." : "Ej: 5000"}
                                    disabled={saving || pagadoActual >= total}
                                />

                            </div>
                        </div>
                        {pagadoActual >= total ? (
                            <div className="mt-2 text-xs px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-200">
                                ✅ Esta venta ya está saldada. No podés registrar más pagos.
                            </div>
                        ) : saving ? (
                            <div className="mt-2 text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-200">
                                ⏳ Registrando pago… no cierres esta ventana.
                            </div>
                        ) : null}


                        {/* Resumen */}
                        <div className="flex justify-between items-center text-sm text-gray-200 mt-2">
                            <div>
                                <div>Total abonado (nuevo):</div>
                                <div className="text-xl font-bold">
                                    ${montoAbonadoNuevo.toLocaleString("es-AR")}
                                </div>
                            </div>
                            <div>
                                <div>Saldo (nuevo):</div>
                                <div className={`text-lg font-semibold ${saldoNuevo > 0 ? "text-red-400" : "text-green-400"}`}>
                                    ${saldoNuevo.toLocaleString("es-AR")}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-700">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving || pagadoActual >= total || Number(nuevoPago || 0) <= 0}
                            className={[
                                "px-4 py-2 rounded font-medium transition flex items-center gap-2",
                                "bg-emerald-600 hover:bg-emerald-700",
                                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-600",
                                "focus:outline-none focus:ring-2 focus:ring-emerald-500/60",
                            ].join(" ")}
                        >
                            {saving ? (
                                <>
                                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Guardando...
                                </>
                            ) : (
                                "Registrar pago"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VentasModalWebShop;






