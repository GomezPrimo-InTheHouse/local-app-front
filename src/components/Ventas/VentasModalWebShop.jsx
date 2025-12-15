import { X, BadgePercent, ShoppingBag, User, ReceiptText } from "lucide-react";

const money = (n) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(
    Number(n || 0)
  );

const fmtDate = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function VentasModalWebShop({ open, onClose, venta }) {
  if (!open) return null;
  if (!venta) return null;

  const detalles = Array.isArray(venta.detalle_venta) ? venta.detalle_venta : [];
  const cliente = venta.cliente || {};
  const cupon = venta.cupon || null;

  const subtotalItems =
    Number(venta.subtotal_items) ||
    detalles.reduce((acc, d) => acc + Number(d.subtotal || 0), 0);

  const descuentoReal = Number(venta.descuento_real) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <button
        onClick={onClose}
        className="absolute inset-0 bg-black/70"
        aria-label="Cerrar modal"
      />

      <div className="relative w-[95vw] max-w-4xl rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-white/10 p-4 sm:p-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-neutral-200">
                <ShoppingBag className="h-4 w-4" />
                Venta Web Shop (solo lectura)
              </span>

              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                #{venta.id}
              </span>

              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-neutral-300">
                {fmtDate(venta.fecha)}
              </span>
            </div>

            <p className="mt-2 text-sm text-neutral-300">
              Esta venta fue generada por el ecommerce. No se permite modificar
              productos, precios ni cupón.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-neutral-200 hover:bg-white/10"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-4 p-4 sm:p-5 lg:grid-cols-3">
          {/* Cliente */}
          <div className="rounded-2xl border border-white/10 bg-neutral-950/40 p-4">
            <div className="mb-3 flex items-center gap-2 text-neutral-200">
              <User className="h-5 w-5" />
              <h3 className="text-sm font-semibold">Cliente</h3>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-neutral-400">Nombre</span>
                <span className="truncate text-neutral-100">
                  {cliente.nombre || "-"} {cliente.apellido || ""}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-neutral-400">DNI</span>
                <span className="text-neutral-100">{cliente.dni || "-"}</span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-neutral-400">Email</span>
                <span className="truncate text-neutral-100">
                  {cliente.email || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="rounded-2xl border border-white/10 bg-neutral-950/40 p-4 lg:col-span-2">
            <div className="mb-3 flex items-center gap-2 text-neutral-200">
              <ReceiptText className="h-5 w-5" />
              <h3 className="text-sm font-semibold">Resumen</h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-neutral-400">Subtotal items</div>
                <div className="mt-1 text-lg font-semibold text-neutral-100">
                  {money(subtotalItems)}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-neutral-400">Descuento</div>
                <div className="mt-1 text-lg font-semibold text-neutral-100">
                  {money(descuentoReal)}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-neutral-400">Total final</div>
                <div className="mt-1 text-lg font-semibold text-neutral-100">
                  {money(venta.total)}
                </div>
              </div>
            </div>

            {/* Cupón */}
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-neutral-200">
                <BadgePercent className="h-5 w-5" />
                <h4 className="text-sm font-semibold">Cupón aplicado</h4>
              </div>

              {cupon ? (
                <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-neutral-400">Código</span>
                    <span className="text-neutral-100">{cupon.codigo}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-neutral-400">Descripción</span>
                    <span className="truncate text-neutral-100">
                      {cupon.descripcion || "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-neutral-400">% desc.</span>
                    <span className="text-neutral-100">
                      {cupon.descuento_porcentaje ?? "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-neutral-400">$ desc.</span>
                    <span className="text-neutral-100">
                      {cupon.descuento_monto ?? "—"}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-neutral-400">
                  No se aplicó cupón en esta venta.
                </p>
              )}
            </div>
          </div>

          {/* Detalle de productos */}
          <div className="rounded-2xl border border-white/10 bg-neutral-950/40 p-4 lg:col-span-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-neutral-200">
                Detalle de productos
              </h3>
              <span className="text-xs text-neutral-400">
                {detalles.length} ítem(s)
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-white/5 text-xs uppercase text-neutral-400">
                  <tr>
                    <th className="px-3 py-2">Producto</th>
                    <th className="px-3 py-2">Cant.</th>
                    <th className="px-3 py-2">P. unit</th>
                    <th className="px-3 py-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {detalles.map((d) => (
                    <tr key={d.id} className="text-neutral-200">
                      <td className="px-3 py-2">
                        <div className="font-medium text-neutral-100">
                          {d?.producto?.nombre || `Producto #${d.producto_id}`}
                        </div>
                        <div className="text-xs text-neutral-400">
                          ID producto: {d.producto_id}
                        </div>
                      </td>
                      <td className="px-3 py-2">{d.cantidad}</td>
                      <td className="px-3 py-2">{money(d.precio_unitario)}</td>
                      <td className="px-3 py-2">{money(d.subtotal)}</td>
                    </tr>
                  ))}

                  {detalles.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-6 text-center text-neutral-400"
                      >
                        No hay items para mostrar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-200">
                <span className="text-neutral-400">Monto abonado: </span>
                <span className="font-semibold">{money(venta.monto_abonado)}</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-200">
                <span className="text-neutral-400">Saldo: </span>
                <span className="font-semibold">{money(venta.saldo)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-white/10 p-4 sm:p-5">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-200 hover:bg-white/10"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
