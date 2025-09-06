// src/components/Ventas/VentasModal.jsx
import { useEffect, useState } from "react";
import { getClientes } from "../../api/ClienteApi";

const VentasModal = ({ onClose, onGuardar }) => {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // campos de la venta (usamos strings para inputs y convertimos al crear)
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("1"); // por defecto 1
  const [precio, setPrecio] = useState(""); // vacío para que no muestre 0 inicial
  const [pagado, setPagado] = useState(""); // monto pagado (puede ser vacío)

  // obtener clientes
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getClientes();
        if (mounted) {
          setClientes(Array.isArray(data) ? data : []);
          setFilteredClientes(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error cargando clientes:", err);
      }
    })();
    return () => (mounted = false);
  }, []);

  // filtrar clientes a medida que se escribe
  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      setFilteredClientes(clientes);
      return;
    }
    setFilteredClientes(
      clientes.filter(
        (c) =>
          (c.nombre || "").toLowerCase().includes(q) ||
          (c.apellido || "").toLowerCase().includes(q) ||
          (c.celular || "").includes(q)
      )
    );
  }, [search, clientes]);

  // si seleccionás un cliente, sincronizamos el input y cerramos dropdown
  const handleSelectCliente = (c) => {
    setClienteSeleccionado(c);
    setSearch(`${c.nombre} ${c.apellido}`);
    setShowDropdown(false);
  };

  const handleClearCliente = () => {
    setClienteSeleccionado(null);
    setSearch("");
    setFilteredClientes(clientes);
  };

  // Helper que limpia la entrada para aceptar solo dígitos y evita ceros a la izquierda
  const sanitizeNumberString = (raw, allowZero = false) => {
    if (raw == null) return "";
    // eliminar todo lo que no sea dígito
    let v = String(raw).replace(/\D/g, "");
    // eliminar ceros a la izquierda (pero dejar "0" solo si allowZero y el valor es "0")
    if (!allowZero) v = v.replace(/^0+/, "");
    return v;
  };

  // Handlers para inputs numéricos
  const onChangeCantidad = (e) => {
    const v = sanitizeNumberString(e.target.value, false);
    setCantidad(v === "" ? "" : v); // permitimos temporalmente campo vacío
  };
  const onChangePrecio = (e) => {
    const v = sanitizeNumberString(e.target.value, false);
    setPrecio(v === "" ? "" : v);
  };
  const onChangePagado = (e) => {
    const v = sanitizeNumberString(e.target.value, true); // pagado puede ser 0
    setPagado(v === "" ? "" : v);
  };

  // Cálculos en tiempo real (usar Number(...))
  const cantidadNum = Number(cantidad || 0);
  const precioNum = Number(precio || 0);
  const pagadoNum = Number(pagado || 0);

  const total = cantidadNum * precioNum;
  const saldo = Math.max(0, total - pagadoNum);

  // Validación y envío
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!producto.trim()) {
      alert("Debe ingresar el nombre del producto.");
      return;
    }
    if (!cantidad || cantidadNum <= 0) {
      alert("Cantidad inválida. Debe ser mayor a 0.");
      return;
    }
    if (!precio || precioNum <= 0) {
      alert("Precio inválido. Debe ser mayor a 0.");
      return;
    }
    if (pagado && pagadoNum > total) {
      alert("El monto pagado no puede exceder el total.");
      return;
    }

    // Construir objeto de venta (convertir a números)
    const venta = {
      cliente: clienteSeleccionado || null,
      producto: producto.trim(),
      cantidad: cantidadNum,
      precio: precioNum,
      total,
      pagado: pagadoNum,
      saldo,
      fecha: new Date().toISOString(),
    };

    onGuardar && onGuardar(venta);
    // limpiar formulario local
    setProducto("");
    setCantidad("1");
    setPrecio("");
    setPagado("");
    handleClose();
  };

  const handleClose = () => {
    // limpiar y cerrar
    setClienteSeleccionado(null);
    setSearch("");
    setFilteredClientes(clientes);
    onClose && onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-neutral-800 rounded-2xl p-6 shadow-lg text-white relative">
        <h2 className="text-xl font-semibold mb-4">➕ Registrar Nueva Venta</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* CLIENTE */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Cliente (opcional)</label>

            {/* input de búsqueda */}
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // permitir click en lista
              placeholder="Buscar cliente por nombre, apellido o celular"
              className="w-full bg-neutral-700 p-2 rounded text-white"
            />

            {/* dropdown */}
            {showDropdown && (
              <ul className="absolute z-50 mt-1 bg-neutral-700 w-full rounded max-h-44 overflow-y-auto shadow-lg">
                {filteredClientes.length > 0 ? (
                  // si hay cliente seleccionado y el texto coincide exactamente, mostrarlo primero
                  filteredClientes.map((c) => (
                    <li
                      key={c.id}
                      onClick={() => handleSelectCliente(c)}
                      className={`px-3 py-2 hover:bg-neutral-600 cursor-pointer ${
                        clienteSeleccionado?.id === c.id ? "bg-neutral-600" : ""
                      }`}
                    >
                      {c.nombre} {c.apellido} {c.celular ? `- ${c.celular}` : ""}
                    </li>
                  ))
                ) : clienteSeleccionado ? (
                  // mostrar cliente seleccionado (evita "Sin resultados" justo después de elegir)
                  <li className="px-3 py-2">
                    {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
                  </li>
                ) : (
                  <li className="px-3 py-2 text-gray-300">Sin resultados</li>
                )}
              </ul>
            )}

            {/* pill cliente seleccionado + limpiar */}
            {clienteSeleccionado && (
              <div className="mt-2 flex items-center gap-2">
                <div className="px-3 py-1 rounded bg-neutral-700 text-sm">
                  {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
                </div>
                <button
                  type="button"
                  onClick={handleClearCliente}
                  className="px-2 py-1 bg-red-600 rounded text-sm hover:bg-red-500"
                >
                  Limpiar
                </button>
              </div>
            )}
          </div>

          {/* PRODUCTO */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Producto</label>
            <input
              type="text"
              value={producto}
              onChange={(e) => setProducto(e.target.value)}
              placeholder="Nombre del producto"
              className="w-full bg-neutral-700 p-2 rounded text-white"
              required
            />
          </div>

          {/* CANTIDAD y PRECIO */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Cantidad</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                value={cantidad}
                onChange={onChangeCantidad}
                className="w-full bg-neutral-700 p-2 rounded text-white"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Precio Unitario</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                value={precio}
                onChange={onChangePrecio}
                className="w-full bg-neutral-700 p-2 rounded text-white"
                placeholder="0"
              />
            </div>
          </div>

          {/* PAGADO (parcial o total) */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Monto Pagado</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d*"
              value={pagado}
              onChange={onChangePagado}
              className="w-full bg-neutral-700 p-2 rounded text-white"
              placeholder="0"
            />
          </div>

          {/* Resumen */}
          <div className="flex justify-between items-center text-sm text-gray-200 mt-2">
            <div>
              <div>Total:</div>
              <div className="text-xl font-bold">${total.toLocaleString("es-AR")}</div>
            </div>
            <div>
              <div>Saldo:</div>
              <div className={`text-lg font-semibold ${saldo > 0 ? "text-red-400" : "text-green-400"}`}>
                ${saldo.toLocaleString("es-AR")}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
            >
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded">
              Guardar Venta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VentasModal;
