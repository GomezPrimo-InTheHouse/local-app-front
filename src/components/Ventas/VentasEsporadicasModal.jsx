// src/components/Ventas/VentaEsporadicaModal.jsx
import { useState } from 'react';
import { createCliente } from '../../api/ClienteApi';
import { createVentaEsporadica } from '../../api/VentaEsporadicaApi';
import Swal from 'sweetalert2';

// ─── Helpers ────────────────────────────────────────────────────────────────
const fmt = (n) =>
  Number(n || 0).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const sanitize = (v) => String(v).replace(/[^0-9]/g, '');

const PRECIO_MIN_FACTOR = 1.5;  // +150%
const PRECIO_MAX_FACTOR = 2.0;  // +200%

// ─── Componente ─────────────────────────────────────────────────────────────
const VentaEsporadicaModal = ({ onClose, onGuardar }) => {
  // Cliente
  const [nombre,   setNombre]   = useState('');
  const [apellido, setApellido] = useState('');

  // Productos
  const [items, setItems] = useState([]);

  // Item en edición (formulario de producto)
  const [itemForm, setItemForm] = useState({
    nombre_producto: '',
    costo:           '',
    precio_unitario: '',
    cantidad:        '1',
  });

  // Pago
  const [pagado,  setPagado]  = useState('');
  const [saving,  setSaving]  = useState(false);

  // ── Sugerencia de precio ──────────────────────────────────────────────────
  const costoNum        = Number(sanitize(itemForm.costo)) || 0;
  const precioSugMin    = Math.ceil(costoNum * PRECIO_MIN_FACTOR);
  const precioSugMax    = Math.ceil(costoNum * PRECIO_MAX_FACTOR);
  const showSugerencia  = costoNum > 0;

  // ── Totales ───────────────────────────────────────────────────────────────
  const total     = items.reduce((acc, it) => acc + it.cantidad * it.precio_unitario, 0);
  const pagadoNum = Number(sanitize(pagado)) || 0;
  const saldo     = Math.max(0, total - pagadoNum);

  // ── Handlers item form ────────────────────────────────────────────────────
  const handleItemFormChange = (field, value) => {
    setItemForm(prev => ({ ...prev, [field]: sanitize(value) }));
  };

  const handleAddItem = () => {
    const nombre_producto = itemForm.nombre_producto.trim();
    const cantidad        = Math.max(1, Number(sanitize(itemForm.cantidad)) || 1);
    const precio_unitario = Number(sanitize(itemForm.precio_unitario)) || 0;
    const costo           = Number(sanitize(itemForm.costo)) || 0;

    if (!nombre_producto) {
      Swal.fire('Error', 'El nombre del producto es obligatorio.', 'warning'); return;
    }
    if (precio_unitario <= 0) {
      Swal.fire('Error', 'El precio de venta debe ser mayor a 0.', 'warning'); return;
    }

    setItems(prev => [...prev, {
      id: Date.now(),          // key temporal
      nombre_producto,
      cantidad,
      precio_unitario,
      costo,
      subtotal: cantidad * precio_unitario,
    }]);

    // Limpiar formulario de producto
    setItemForm({ nombre_producto: '', costo: '', precio_unitario: '', cantidad: '1' });
  };

  const handleRemoveItem = (id) =>
    setItems(prev => prev.filter(it => it.id !== id));

  const handleUpdateItemCantidad = (id, value) => {
    const cant = Math.max(1, Number(sanitize(value)) || 1);
    setItems(prev => prev.map(it =>
      it.id === id
        ? { ...it, cantidad: cant, subtotal: cant * it.precio_unitario }
        : it
    ));
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (!nombre.trim() || !apellido.trim()) {
      Swal.fire('Error', 'El nombre y apellido del cliente son obligatorios.', 'warning'); return;
    }
    if (items.length === 0) {
      Swal.fire('Error', 'Agregá al menos un producto.', 'warning'); return;
    }
    if (pagadoNum > total) {
      Swal.fire('Error', 'El monto pagado no puede superar el total.', 'warning'); return;
    }

    setSaving(true);

    try {
      // 1. Crear cliente con nombre + apellido
      const clienteCreado = await createCliente({
        nombre:   nombre.trim(),
        apellido: apellido.trim(),
      });

      const cliente_id = clienteCreado?.id;
      if (!cliente_id) throw new Error('No se pudo obtener el ID del cliente creado.');

      // 2. Crear venta esporádica
      const payload = {
        cliente_id,
        monto_abonado: pagadoNum,
        detalles: items.map(({ nombre_producto, cantidad, precio_unitario, costo }) => ({
          nombre_producto,
          cantidad,
          precio_unitario,
          costo,
        })),
      };

      await createVentaEsporadica(payload);

      Swal.fire({
        title: '¡Venta registrada!',
        text: `Venta esporádica guardada correctamente.`,
        icon: 'success',
        timer: 2500,
        showConfirmButton: false,
        customClass: {
          popup: 'bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl',
        },
      });

      onGuardar?.();
      onClose?.();

    } catch (error) {
      console.error('Error al guardar venta esporádica:', error);
      Swal.fire({
        title: 'Error',
        text: error?.error || 'No se pudo guardar la venta. Revisá la conexión.',
        icon: 'error',
        customClass: {
          popup: 'bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl',
        },
      });
    } finally {
      setSaving(false);
    }
  };

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        onClick={() => !saving && onClose?.()}
        disabled={saving}
        aria-label="Cerrar"
      />

      <div
        className="relative w-full max-w-lg bg-neutral-800 rounded-2xl p-6 shadow-lg text-white flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={() => !saving && onClose?.()}
          disabled={saving}
          className="absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full
                     bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white
                     transition disabled:opacity-50"
          aria-label="Cerrar"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {/* Título */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold">⚡ Venta Esporádica</h2>
          <p className="text-xs text-gray-400 mt-1">
            Cliente sin registrar · Productos manuales · Pago en el momento.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 -mr-2">

            {/* ── SECCIÓN CLIENTE ── */}
            <div className="bg-neutral-700 p-3 rounded space-y-2">
              <p className="text-sm text-gray-300 font-medium">Cliente</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Nombre *</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    placeholder="Ej: Juan"
                    disabled={saving}
                    className="w-full bg-neutral-600 p-2 rounded text-white text-sm placeholder-neutral-400
                               focus:outline-none focus:ring-2 focus:ring-emerald-500/60 disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Apellido *</label>
                  <input
                    type="text"
                    value={apellido}
                    onChange={e => setApellido(e.target.value)}
                    placeholder="Ej: García"
                    disabled={saving}
                    className="w-full bg-neutral-600 p-2 rounded text-white text-sm placeholder-neutral-400
                               focus:outline-none focus:ring-2 focus:ring-emerald-500/60 disabled:opacity-60"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Se creará como cliente nuevo. Podés completar DNI, teléfono y dirección luego desde el módulo de clientes.
              </p>
            </div>

            {/* ── SECCIÓN AGREGAR PRODUCTO ── */}
            <div className="bg-neutral-700 p-3 rounded space-y-3">
              <p className="text-sm text-gray-300 font-medium">Agregar producto</p>

              {/* Nombre producto */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Nombre del producto *</label>
                <input
                  type="text"
                  value={itemForm.nombre_producto}
                  onChange={e => setItemForm(prev => ({ ...prev, nombre_producto: e.target.value }))}
                  placeholder="Ej: Cable HDMI 2m"
                  disabled={saving}
                  className="w-full bg-neutral-600 p-2 rounded text-white text-sm placeholder-neutral-400
                             focus:outline-none focus:ring-2 focus:ring-emerald-500/60 disabled:opacity-60"
                />
              </div>

              {/* Costo + Precio + Cantidad */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Costo</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={itemForm.costo}
                    onChange={e => handleItemFormChange('costo', e.target.value)}
                    placeholder="0"
                    disabled={saving}
                    className="w-full bg-neutral-600 p-2 rounded text-white text-sm placeholder-neutral-400
                               focus:outline-none focus:ring-2 focus:ring-emerald-500/60 disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Precio venta *</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={itemForm.precio_unitario}
                    onChange={e => handleItemFormChange('precio_unitario', e.target.value)}
                    placeholder="0"
                    disabled={saving}
                    className="w-full bg-neutral-600 p-2 rounded text-white text-sm placeholder-neutral-400
                               focus:outline-none focus:ring-2 focus:ring-emerald-500/60 disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Cantidad</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={itemForm.cantidad}
                    onChange={e => handleItemFormChange('cantidad', e.target.value)}
                    placeholder="1"
                    disabled={saving}
                    className="w-full bg-neutral-600 p-2 rounded text-white text-sm placeholder-neutral-400
                               focus:outline-none focus:ring-2 focus:ring-emerald-500/60 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Sugerencia de precio */}
              {showSugerencia && (
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs text-amber-400">
                    💡 Precio sugerido: ${fmt(precioSugMin)} – ${fmt(precioSugMax)}
                  </p>
                  <button
                    type="button"
                    onClick={() => setItemForm(prev => ({
                      ...prev,
                      precio_unitario: String(precioSugMin),
                    }))}
                    className="text-xs px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30
                               border border-amber-500/30 text-amber-300 transition"
                  >
                    Usar mínimo
                  </button>
                  <button
                    type="button"
                    onClick={() => setItemForm(prev => ({
                      ...prev,
                      precio_unitario: String(precioSugMax),
                    }))}
                    className="text-xs px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30
                               border border-amber-500/30 text-amber-300 transition"
                  >
                    Usar máximo
                  </button>
                </div>
              )}

              {/* Botón agregar */}
              <button
                type="button"
                onClick={handleAddItem}
                disabled={saving}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-semibold
                           transition disabled:opacity-50"
              >
                + Agregar producto
              </button>
            </div>

            {/* ── LISTA DE PRODUCTOS AGREGADOS ── */}
            {items.length > 0 && (
              <div className="space-y-2">
                {items.map(item => (
                  <div
                    key={item.id}
                    className="bg-neutral-800/50 border border-white/10 p-3 rounded-lg flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-100 truncate">{item.nombre_producto}</p>
                      <div className="flex flex-wrap gap-2 items-center text-xs text-gray-300 mt-2">
                        <span className="text-gray-400">Cant.</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={item.cantidad}
                          onChange={e => handleUpdateItemCantidad(item.id, e.target.value)}
                          disabled={saving}
                          className="w-14 bg-neutral-600 p-2 rounded text-white text-center
                                     focus:outline-none focus:ring-2 focus:ring-emerald-500/60 disabled:opacity-60"
                        />
                        <span className="text-gray-400">x ${fmt(item.precio_unitario)}</span>
                        <span className="ml-1 font-semibold text-gray-100">
                          = ${fmt(item.cantidad * item.precio_unitario)}
                        </span>
                      </div>
                      {item.costo > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Costo: ${fmt(item.costo)} · Margen: ${fmt(item.precio_unitario - item.costo)}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={saving}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full
                                 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20
                                 text-red-200 transition disabled:opacity-50"
                      aria-label="Quitar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 100 2h2a1 1 0 100-2h-2z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {items.length === 0 && (
              <div className="text-sm text-gray-400 bg-neutral-800/40 border border-white/10 rounded-lg p-3">
                Agregá productos desde el formulario de arriba.
              </div>
            )}

            {/* ── PAGO + RESUMEN ── */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-neutral-700 p-3 rounded">
                <label className="block text-sm text-gray-300 mb-1">Monto pagado</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={pagado}
                  onChange={e => setPagado(sanitize(e.target.value))}
                  disabled={saving}
                  placeholder="Ej: 15000"
                  className="w-full bg-neutral-600 p-2 rounded text-white transition
                             focus:outline-none focus:ring-2 focus:ring-emerald-500/60 disabled:opacity-60"
                />
                <p className="text-xs text-gray-400 mt-2">El saldo se calcula automáticamente.</p>
              </div>

              <div className="bg-neutral-700 p-3 rounded">
                <div className="text-xs text-gray-400">Total</div>
                <div className="text-xl font-bold text-gray-100">${fmt(total)}</div>
                <div className="mt-3 text-xs text-gray-400">Saldo</div>
                <div className={`text-lg font-semibold ${saldo > 0 ? 'text-red-300' : 'text-emerald-300'}`}>
                  ${fmt(saldo)}
                </div>
              </div>
            </div>

            {saving && (
              <div className="text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-200">
                ⏳ Guardando… por favor no cierres esta ventana.
              </div>
            )}
          </div>

          {/* ── BOTONES ── */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-700">
            <button
              type="button"
              onClick={() => !saving && onClose?.()}
              disabled={saving}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !nombre.trim() || !apellido.trim() || items.length === 0}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded transition
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Guardando...
                </>
              ) : (
                'Guardar venta'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VentaEsporadicaModal;