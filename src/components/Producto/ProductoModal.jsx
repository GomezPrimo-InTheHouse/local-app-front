// src/components/productos/ProductoModal.jsx
import { useEffect, useState } from "react";
import { getEstadoByAmbito } from "../../api/EstadoApi.jsx"; // opcional: para cargar estados de producto

const ProductoModal = ({ isOpen, onClose, onSave, producto = null }) => {
  const [form, setForm] = useState({
    nombre: "",
    stock: "",
    precio: "",
    descripcion: "",
    estado_id: "",
    categoria: "",
    costo: ""
  });

  const [estados, setEstados] = useState([]);
  const [focused, setFocused] = useState({ stock: false, precio: false, costo: false });

  // Cargar estados (si los querés en el select)
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const lista = await getEstadoByAmbito('producto'); // asume getEstados retorna array
        setEstados(lista || []);
      } catch (e) {
        console.error("No se pudieron cargar estados:", e);
      }
    })();
  }, [isOpen]);

  // Inicializa/Resetea el formulario cuando se abre/cierra o cambia producto
  useEffect(() => {
    if (!isOpen) {
      // reset
      setForm({
        nombre: "",
        stock: "",
        precio: "",
        descripcion: "",
        estado_id: "",
        categoria: "",
        costo: ""
      });
      setFocused({ stock: false, precio: false });
      return;
    }

    if (producto) {
      // cargar datos del producto (modo edición)
      setForm({
        nombre: producto.nombre ?? "",
        stock: producto.stock != null ? String(producto.stock) : "",
        // aseguramos que precio venga como string con punto decimal si corresponde
        precio:
          producto.precio != null
            ? String(producto.precio).replace(",", ".")
            : "",
        descripcion: producto.descripcion ?? "",
        estado_id:
          producto.estado_id != null ? String(producto.estado_id) : "",
        categoria: producto.categoria ?? "",
        costo: producto.costo != null ? String(producto.costo).replace(",", ".") : ""
      });
    } else {
      // nuevo producto: valores vacíos
      setForm({
        nombre: "",
        stock: "",
        precio: "",
        descripcion: "",
        estado_id: "",
        categoria: "",
        costo: ""
      });
    }
  }, [isOpen, producto]);

  // ---------- Helpers de sanitización / formateo ----------
  const sanitizeIntegerInput = (val) => {
    if (!val) return "";
    // quitar todo lo que no sea dígito
    let v = String(val).replace(/\D+/g, "");
    // quitar ceros a la izquierda (no dejar "0" inicial)
    v = v.replace(/^0+(?=\d)/, "");
    return v;
  };

  const sanitizeDecimalInput = (val) => {
    if (!val) return "";
    // permitir dígitos y un único punto decimal
    let v = String(val).replace(/,/g, "."); // normalizar comas a punto
    // quitar todo lo que no sea dígito o punto
    v = v.replace(/[^0-9.]/g, "");
    // dejar un solo punto
    const parts = v.split(".");
    if (parts.length > 1) {
      v = parts[0] + "." + parts.slice(1).join("");
    }
    // evitar ceros a la izquierda en la parte entera (pero permitir "0" si es 0.x)
    v = v.replace(/^0+(?=\d)/, "");
    return v;
  };

  const formatIntegerDisplay = (val) => {
    if (!val && val !== 0) return "";
    const n = Number(val);
    if (isNaN(n)) return "";
    return new Intl.NumberFormat("es-AR").format(n);
  };

  const formatDecimalDisplay = (val) => {
    if (val === "" || val == null) return "";
    const n = Number(val);
    if (isNaN(n)) return "";
    // si tiene parte decimal preservamos la cantidad de decimales que tiene el input
    const decimals = String(val).includes(".") ? String(val).split(".")[1].length : 0;
    return new Intl.NumberFormat("es-AR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(n);
  };

  // ---------- Handlers ----------
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStockChange = (rawValue) => {
    const s = sanitizeIntegerInput(rawValue);
    setForm((prev) => ({ ...prev, stock: s }));
  };

  const handlePrecioChange = (rawValue) => {
    const s = sanitizeDecimalInput(rawValue);
    setForm((prev) => ({ ...prev, precio: s }));
  };

  const handleCostoChange = (rawValue) => {
    const s = sanitizeDecimalInput(rawValue);
    setForm((prev) => ({ ...prev, costo: s }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // validaciones mínimas
    if (!form.nombre.trim()) {
      alert("El nombre es obligatorio.");
      return;
    }
    if (form.precio === "" || isNaN(Number(form.precio))) {
      alert("El precio es obligatorio y debe ser numérico.");
      return;
    }

    //armo el payload para enviar al padre

    //costo es un valor de tipo decimal
    const payload = {
      nombre: form.nombre.trim(),
      stock: form.stock ? parseInt(form.stock, 10) : 0,
      precio: form.precio ? parseFloat(form.precio) : 0,
      descripcion: form.descripcion.trim(),
      estado_id: form.estado_id ? Number(form.estado_id) : null,
      categoria: form.categoria.trim(),
      costo: form.costo ? parseFloat(form.costo) : 0,
    };

    // entregamos payload al padre (que realizará create/update)
    onSave && onSave(payload);
    onClose && onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
      <div className="w-full max-w-xl bg-neutral-900 text-white rounded-2xl shadow-2xl border border-gray-800 overflow-auto">
        <div className="px-6 py-5 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">
            {producto ? "Editar Producto" : "Nuevo Producto"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Nombre *</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleTextChange}
              className="w-full bg-neutral-800 text-white p-2 rounded border border-gray-700 focus:outline-none focus:ring-0"
              placeholder="Nombre del producto"
              required
            />
          </div>
          {/* Categoría */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Categoría</label>
            <input
              name="categoria"
              value={form.categoria}
              onChange={handleTextChange}
              className="w-full bg-neutral-800 text-white p-2 rounded border border-gray-700 focus:outline-none focus:ring-0"
              placeholder="Categoría del producto (opcional)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stock */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Stock</label>
              <input
                type="text"
                inputMode="numeric"
                value={focused.stock ? form.stock : formatIntegerDisplay(form.stock)}
                onFocus={() => setFocused((f) => ({ ...f, stock: true }))}
                onBlur={() => setFocused((f) => ({ ...f, stock: false }))}
                onChange={(e) => handleStockChange(e.target.value)}
                placeholder="0"
                className="w-full bg-neutral-800 text-white p-2 rounded border border-gray-700 focus:outline-none"
              />
            </div>
            {/* Costo */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Costo</label>
              <input
                type="text"
                inputMode="decimal"
                value={focused.costo ? form.costo : formatDecimalDisplay(form.costo)}
                onFocus={() => setFocused((f) => ({ ...f, costo: true }))}
                onBlur={() => setFocused((f) => ({ ...f, costo: false }))}
                onChange={(e) => handleCostoChange(e.target.value)}
                placeholder="0.00"
                className="w-full bg-neutral-800 text-white p-2 rounded border border-gray-700 focus:outline-none"
                required
              />
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Precio *</label>
              <input
                type="text"
                inputMode="decimal"
                value={focused.precio ? form.precio : formatDecimalDisplay(form.precio)}
                onFocus={() => setFocused((f) => ({ ...f, precio: true }))}
                onBlur={() => setFocused((f) => ({ ...f, precio: false }))}
                onChange={(e) => handlePrecioChange(e.target.value)}
                placeholder="0.00"
                className="w-full bg-neutral-800 text-white p-2 rounded border border-gray-700 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleTextChange}
              rows={3}
              className="w-full bg-neutral-800 text-white p-2 rounded border border-gray-700 focus:outline-none"
              placeholder="Detalles / observaciones (opcional)"
            />
          </div>

          {/* Estado (si quieres) */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Estado</label>
            <select
              name="estado_id"
              value={form.estado_id}
              onChange={handleTextChange}
              className="w-full bg-neutral-800 text-white p-2 rounded border border-gray-700 focus:outline-none"
            >
              <option value="">-- Seleccionar estado --</option>
              {estados.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => {
                onClose && onClose();
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-white font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white font-bold"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductoModal;
