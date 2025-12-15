// import { X, BadgePercent, ShoppingBag, User, ReceiptText } from "lucide-react";

// const money = (n) =>
//   new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(
//     Number(n || 0)
//   );

// const fmtDate = (iso) => {
//   if (!iso) return "-";
//   const d = new Date(iso);
//   return d.toLocaleString("es-AR", {
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// export default function VentasModalWebShop({ open, onClose, venta }) {
//   if (!open) return null;
//   if (!venta) return null;

//   const detalles = Array.isArray(venta.detalle_venta) ? venta.detalle_venta : [];
//   const cliente = venta.cliente || {};
//   const cupon = venta.cupon || null;

//   const subtotalItems =
//     Number(venta.subtotal_items) ||
//     detalles.reduce((acc, d) => acc + Number(d.subtotal || 0), 0);

//   const descuentoReal = Number(venta.descuento_real) || 0;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* backdrop */}
//       <button
//         onClick={onClose}
//         className="absolute inset-0 bg-black/70"
//         aria-label="Cerrar modal"
//       />

//       <div className="relative w-[95vw] max-w-4xl rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl">
//         {/* Header */}
//         <div className="flex items-start justify-between gap-3 border-b border-white/10 p-4 sm:p-5">
//           <div className="min-w-0">
//             <div className="flex flex-wrap items-center gap-2">
//               <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-neutral-200">
//                 <ShoppingBag className="h-4 w-4" />
//                 Venta Web Shop (solo lectura)
//               </span>

//               <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
//                 #{venta.id}
//               </span>

//               <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-neutral-300">
//                 {fmtDate(venta.fecha)}
//               </span>
//             </div>

//             <p className="mt-2 text-sm text-neutral-300">
//               Esta venta fue generada por el ecommerce. No se permite modificar
//               productos, precios ni cupón.
//             </p>
//           </div>

//           <button
//             onClick={onClose}
//             className="rounded-xl border border-white/10 bg-white/5 p-2 text-neutral-200 hover:bg-white/10"
//             aria-label="Cerrar"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="grid grid-cols-1 gap-4 p-4 sm:p-5 lg:grid-cols-3">
//           {/* Cliente */}
//           <div className="rounded-2xl border border-white/10 bg-neutral-950/40 p-4">
//             <div className="mb-3 flex items-center gap-2 text-neutral-200">
//               <User className="h-5 w-5" />
//               <h3 className="text-sm font-semibold">Cliente</h3>
//             </div>

//             <div className="space-y-2 text-sm">
//               <div className="flex items-center justify-between gap-3">
//                 <span className="text-neutral-400">Nombre</span>
//                 <span className="truncate text-neutral-100">
//                   {cliente.nombre || "-"} {cliente.apellido || ""}
//                 </span>
//               </div>

//               <div className="flex items-center justify-between gap-3">
//                 <span className="text-neutral-400">DNI</span>
//                 <span className="text-neutral-100">{cliente.dni || "-"}</span>
//               </div>

//               <div className="flex items-center justify-between gap-3">
//                 <span className="text-neutral-400">Email</span>
//                 <span className="truncate text-neutral-100">
//                   {cliente.email || "—"}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Resumen */}
//           <div className="rounded-2xl border border-white/10 bg-neutral-950/40 p-4 lg:col-span-2">
//             <div className="mb-3 flex items-center gap-2 text-neutral-200">
//               <ReceiptText className="h-5 w-5" />
//               <h3 className="text-sm font-semibold">Resumen</h3>
//             </div>

//             <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
//               <div className="rounded-xl border border-white/10 bg-white/5 p-3">
//                 <div className="text-xs text-neutral-400">Subtotal items</div>
//                 <div className="mt-1 text-lg font-semibold text-neutral-100">
//                   {money(subtotalItems)}
//                 </div>
//               </div>

//               <div className="rounded-xl border border-white/10 bg-white/5 p-3">
//                 <div className="text-xs text-neutral-400">Descuento</div>
//                 <div className="mt-1 text-lg font-semibold text-neutral-100">
//                   {money(descuentoReal)}
//                 </div>
//               </div>

//               <div className="rounded-xl border border-white/10 bg-white/5 p-3">
//                 <div className="text-xs text-neutral-400">Total final</div>
//                 <div className="mt-1 text-lg font-semibold text-neutral-100">
//                   {money(venta.total)}
//                 </div>
//               </div>
//             </div>

//             {/* Cupón */}
//             <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
//               <div className="mb-2 flex items-center gap-2 text-neutral-200">
//                 <BadgePercent className="h-5 w-5" />
//                 <h4 className="text-sm font-semibold">Cupón aplicado</h4>
//               </div>

//               {cupon ? (
//                 <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
//                   <div className="flex items-center justify-between gap-3">
//                     <span className="text-neutral-400">Código</span>
//                     <span className="text-neutral-100">{cupon.codigo}</span>
//                   </div>
//                   <div className="flex items-center justify-between gap-3">
//                     <span className="text-neutral-400">Descripción</span>
//                     <span className="truncate text-neutral-100">
//                       {cupon.descripcion || "—"}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between gap-3">
//                     <span className="text-neutral-400">% desc.</span>
//                     <span className="text-neutral-100">
//                       {cupon.descuento_porcentaje ?? "—"}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between gap-3">
//                     <span className="text-neutral-400">$ desc.</span>
//                     <span className="text-neutral-100">
//                       {cupon.descuento_monto ?? "—"}
//                     </span>
//                   </div>
//                 </div>
//               ) : (
//                 <p className="text-sm text-neutral-400">
//                   No se aplicó cupón en esta venta.
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Detalle de productos */}
//           <div className="rounded-2xl border border-white/10 bg-neutral-950/40 p-4 lg:col-span-3">
//             <div className="mb-3 flex items-center justify-between gap-3">
//               <h3 className="text-sm font-semibold text-neutral-200">
//                 Detalle de productos
//               </h3>
//               <span className="text-xs text-neutral-400">
//                 {detalles.length} ítem(s)
//               </span>
//             </div>

//             <div className="overflow-x-auto rounded-xl border border-white/10">
//               <table className="min-w-full text-left text-sm">
//                 <thead className="bg-white/5 text-xs uppercase text-neutral-400">
//                   <tr>
//                     <th className="px-3 py-2">Producto</th>
//                     <th className="px-3 py-2">Cant.</th>
//                     <th className="px-3 py-2">P. unit</th>
//                     <th className="px-3 py-2">Subtotal</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-white/10">
//                   {detalles.map((d) => (
//                     <tr key={d.id} className="text-neutral-200">
//                       <td className="px-3 py-2">
//                         <div className="font-medium text-neutral-100">
//                           {d?.producto?.nombre || `Producto #${d.producto_id}`}
//                         </div>
//                         <div className="text-xs text-neutral-400">
//                           ID producto: {d.producto_id}
//                         </div>
//                       </td>
//                       <td className="px-3 py-2">{d.cantidad}</td>
//                       <td className="px-3 py-2">{money(d.precio_unitario)}</td>
//                       <td className="px-3 py-2">{money(d.subtotal)}</td>
//                     </tr>
//                   ))}

//                   {detalles.length === 0 && (
//                     <tr>
//                       <td
//                         colSpan={4}
//                         className="px-3 py-6 text-center text-neutral-400"
//                       >
//                         No hay items para mostrar.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
//               <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-200">
//                 <span className="text-neutral-400">Monto abonado: </span>
//                 <span className="font-semibold">{money(venta.monto_abonado)}</span>
//               </div>
//               <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-200">
//                 <span className="text-neutral-400">Saldo: </span>
//                 <span className="font-semibold">{money(venta.saldo)}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-end gap-2 border-t border-white/10 p-4 sm:p-5">
//           <button
//             onClick={onClose}
//             className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-200 hover:bg-white/10"
//           >
//             Cerrar
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";

const VentasModalWebShop = ({ onClose, onGuardar, initialData }) => {
  const [pagado, setPagado] = useState("");

  const isEdicion = Boolean(initialData?.id ?? initialData?.venta_id);

  const detalles = useMemo(() => {
    return initialData?.detalle_venta || initialData?.detalles || [];
  }, [initialData]);

  // ✅ total final (ya viene aplicado con descuento en web)
  const total = useMemo(() => Number(initialData?.total || 0), [initialData]);

  // ✅ subtotal items (si viene del backend, genial; si no, lo calculamos)
  const subtotalItems = useMemo(() => {
    const backendSubtotal = Number(initialData?.subtotal_items);
    if (Number.isFinite(backendSubtotal) && backendSubtotal > 0) return backendSubtotal;

    return (detalles || []).reduce((acc, d) => acc + Number(d?.subtotal || 0), 0);
  }, [initialData, detalles]);

  // ✅ descuento real (si viene del backend, genial; si no, lo inferimos)
  const descuentoReal = useMemo(() => {
    const backendDesc = Number(initialData?.descuento_real);
    if (Number.isFinite(backendDesc) && backendDesc >= 0) return backendDesc;

    return Math.max(0, subtotalItems - total);
  }, [initialData, subtotalItems, total]);

  const cliente = initialData?.cliente || null;
  const cupon = initialData?.cupon || null;

  // ===== Helpers numéricos (idéntico al local) =====
  const sanitizeNumberString = (raw) => {
    if (raw == null) return "";
    return String(raw).replace(/[^0-9]/g, "");
  };

  const onChangePagado = (e) => {
    const v = sanitizeNumberString(e.target.value);
    setPagado(v === "" ? "" : v);
  };

  // Cargar monto abonado actual
  useEffect(() => {
    const abonado = Number(initialData?.monto_abonado ?? 0);
    setPagado(String(Number.isFinite(abonado) ? Math.floor(abonado) : 0));
  }, [initialData]);

  const pagadoNum = Number(pagado || 0);
  const saldo = Math.max(0, total - pagadoNum);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isEdicion) {
      alert("Esta venta web ya existe; solo se permite actualizar el pago.");
      return;
    }

    if (pagado !== "" && pagadoNum > total) {
      alert("El monto pagado no puede exceder el total.");
      return;
    }

    // ✅ payload mínimo para actualizar con tu mismo endpoint updateVenta
    const ventaPayload = {
      id: initialData?.id ?? initialData?.venta_id ?? undefined,
      monto_abonado: pagadoNum,
      total, // lo mandamos igual para compatibilidad (no debería cambiar)
      saldo,
      // canal: "web_shop" // opcional, si tu backend lo valida
      // NO mandamos detalles: no se pueden editar en web_shop
    };

    onGuardar(ventaPayload);
    handleClose();
  };

  const handleClose = () => {
    setPagado("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-neutral-800 rounded-2xl p-6 shadow-lg text-white relative flex flex-col max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-1">🛒 Venta Web (Shop)</h2>
        <p className="text-xs text-gray-400 mb-4">
          Solo lectura para productos/cupón. Podés actualizar el pago del cliente.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 -mr-2">
            {/* Cliente */}
            <div className="bg-neutral-700/40 border border-white/10 rounded-xl p-3">
              <p className="text-sm text-gray-300 mb-1">Cliente</p>
              <p className="text-sm text-gray-100 font-semibold truncate">
                {cliente ? `${cliente.nombre} ${cliente.apellido}` : "Sin cliente"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                DNI: <span className="text-gray-200">{cliente?.dni ?? "—"}</span>
                {" · "}Email: <span className="text-gray-200">{cliente?.email ?? "—"}</span>
              </p>
            </div>

            {/* Cupón + Descuento */}
            <div className="bg-neutral-700/40 border border-white/10 rounded-xl p-3">
              <p className="text-sm text-gray-300 mb-2">Descuento</p>

              {cupon ? (
                <div className="text-xs text-gray-300 space-y-1">
                  <div>
                    Cupón:{" "}
                    <span className="text-gray-100 font-semibold">{cupon.codigo}</span>
                  </div>
                  {cupon.descripcion && (
                    <div className="text-gray-400 truncate">{cupon.descripcion}</div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {cupon.descuento_porcentaje != null && (
                      <span className="px-2 py-1 rounded bg-white/5 border border-white/10">
                        {cupon.descuento_porcentaje}% OFF
                      </span>
                    )}
                    {cupon.descuento_monto != null && (
                      <span className="px-2 py-1 rounded bg-white/5 border border-white/10">
                        ${Number(cupon.descuento_monto).toLocaleString("es-AR")} OFF
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400">No se aplicó cupón.</p>
              )}

              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
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

            {/* Detalle productos (solo lectura) */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Productos (solo lectura)
              </label>

              <div className="space-y-2">
                {(detalles || []).length > 0 ? (
                  detalles.map((d, idx) => (
                    <div
                      key={d?.id ?? `d-${idx}`}
                      className="bg-neutral-700 p-3 rounded-lg flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-100 truncate">
                          {d?.producto?.nombre || `Producto #${d.producto_id}`}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {d.cantidad} unid. x ${Number(d.precio_unitario).toLocaleString("es-AR")}
                          {" · "}Subtotal:{" "}
                          <span className="text-gray-200 font-semibold">
                            ${Number(d.subtotal).toLocaleString("es-AR")}
                          </span>
                        </p>
                      </div>

                      <span className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-300">
                        ID {d.producto_id}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-400">Sin productos.</div>
                )}
              </div>
            </div>

            {/* Pago editable */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Monto Pagado</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                value={pagado}
                onChange={onChangePagado}
                className="w-full bg-neutral-700 p-2 rounded text-white"
              />
            </div>

            {/* Resumen */}
            <div className="flex justify-between items-center text-sm text-gray-200 mt-2">
              <div>
                <div>Total:</div>
                <div className="text-xl font-bold">
                  ${total.toLocaleString("es-AR")}
                </div>
              </div>
              <div>
                <div>Saldo:</div>
                <div
                  className={`text-lg font-semibold ${
                    saldo > 0 ? "text-red-400" : "text-green-400"
                  }`}
                >
                  ${saldo.toLocaleString("es-AR")}
                </div>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-700">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded"
            >
              Guardar Pago
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VentasModalWebShop;
