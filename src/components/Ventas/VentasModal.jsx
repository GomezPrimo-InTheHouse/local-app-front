// src/components/Ventas/VentasModal.jsx
import { useEffect, useState } from "react";
import { getClientes } from "../../api/ClienteApi";
import { getProductos } from "../../api/ProductoApi";

const VentasModal = ({ onClose, onGuardar, initialData }) => {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [productos, setProductos] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [items, setItems] = useState([]);
  const [pagado, setPagado] = useState("");

  const [montoAbonadoToForm, setMontoAbonadoToForm] = useState(0);


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const clientesResponse = await getClientes();

        setClientes(Array.isArray(clientesResponse) ? clientesResponse : []);
        setFilteredClientes(Array.isArray(clientesResponse) ? clientesResponse : []);

        const productosResponse = await getProductos();
        setProductos(Array.isArray(productosResponse.data) ? productosResponse.data : []);
      } catch (err) {
        console.error("Error cargando datos iniciales:", err);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (initialData && productos.length > 0 && clientes.length > 0) {
      if (initialData.cliente_id) {
        const clienteEncontrado = clientes.find(c => c.id === initialData.cliente_id);
        if (clienteEncontrado) {
          setClienteSeleccionado(clienteEncontrado);
          setSearch(`${clienteEncontrado.nombre} ${clienteEncontrado.apellido}`);
        } else {
          setClienteSeleccionado(null);
          setSearch("");
        }
      } else {
        setClienteSeleccionado(null);
        setSearch("");
      }

      const loadedItems = (initialData.detalles || []).map(detail => {
        const productInfo = productos.find(p => p.id === detail.producto_id);
        return {
          id: detail.producto_id,
          nombre: productInfo ? productInfo.nombre : 'Producto desconocido',
          cantidad: detail.cantidad,
          precio: detail.precio_unitario,
          stock: productInfo ? productInfo.stock : 0,
          detalle_id: detail.detalle_id,
        };
      });
      setItems(loadedItems);
      // 🔹 MODIFICACIÓN AQUÍ: Se asegura de que el valor sea un entero y 0 si es nulo
      console.log('Monto Abonado Inicial:', initialData.monto_abonado);
      setPagado(String(initialData.monto_abonado ? Math.floor(initialData.monto_abonado) : 0));
    }
  }, [initialData, productos, clientes]);

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

  const sanitizeNumberString = (raw) => {
    if (raw == null) return "";
    return String(raw).replace(/[^0-9]/g, "");
  };

  const onChangePagado = (e) => {
    const v = sanitizeNumberString(e.target.value);
    setPagado(v === "" ? "" : v);
  };

  const handleAddItem = (e) => {
    const productoSeleccionado = productos.find(
      (p) => p.id.toString() === e.target.value
    );
    if (
      productoSeleccionado &&
      !items.some((item) => item.id === productoSeleccionado.id)
    ) {
      setItems([
        ...items,
        {
          id: productoSeleccionado.id,
          nombre: productoSeleccionado.nombre,
          cantidad: 1,
          precio: Math.floor(productoSeleccionado.precio),
          stock: productoSeleccionado.stock,
        },
      ]);
    }
    e.target.value = "";
  };

  const handleUpdateItem = (id, field, value) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          let sanitizedValue = sanitizeNumberString(value);
          if (field === "cantidad") {
            // 🔹 Se limita la cantidad al stock disponible
            const maxCantidad = item.stock;
            const newCantidad = Number(sanitizedValue);
            sanitizedValue = newCantidad > maxCantidad ? String(maxCantidad) : sanitizedValue;
            // Si el valor no es un número, se establece en 1
            if (isNaN(newCantidad) || newCantidad <= 0) {
              sanitizedValue = "1";
            }
          }
          return { ...item, [field]: sanitizedValue };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const total = items.reduce((acc, item) => {
    const cantidadNum = Number(item.cantidad || 0);
    const precioNum = Number(item.precio || 0);
    return acc + cantidadNum * precioNum;
  }, 0);

  const pagadoNum = Number(pagado || 0);
  const saldo = Math.max(0, total - pagadoNum);
  // 🔹 MODIFICACIÓN AQUÍ: Actualiza los estados cada vez que cambian total o sald
  useEffect(() => {
    setMontoAbonadoToForm(pagadoNum);
  }, [pagadoNum]);



  const handleSubmit = (e) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Debe agregar al menos un producto.");
      return;
    }
    for (const item of items) {
      if (Number(item.cantidad) <= 0) {
        alert("Cantidad inválida. Debe ser mayor a 0.");
        return;
      }
      if (Number(item.precio) <= 0) {
        alert("Precio inválido. Debe ser mayor a 0.");
        return;
      }
      if (Number(item.cantidad) > item.stock) {
        alert(
          `La cantidad de ${item.nombre} no puede ser mayor al stock disponible (${item.stock}).`
        );
        return;
      }
    }
    if (pagado && pagadoNum > total) {
      alert("El monto pagado no puede exceder el total.");
      return;
    }

    const ventaPayload = {
      cliente_id: clienteSeleccionado?.id || null,
      monto_abonado: montoAbonadoToForm,

      detalles: items.map(item => ({
        id: item.detalle_id || null,
        producto_id: item.id,
        cantidad: Number(item.cantidad),
        precio_unitario: Number(item.precio)
      }))
    };
    console.log('Venta Payload:', ventaPayload);
    onGuardar(ventaPayload);
    handleClose();
  };


  const handleClose = () => {
    setClienteSeleccionado(null);
    setSearch("");
    setFilteredClientes(clientes);
    setItems([]);
    setPagado("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-neutral-800 rounded-2xl p-6 shadow-lg text-white relative flex flex-col max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "✏️ Editar Venta" : "➕ Registrar Nueva Venta"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-full overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 -mr-2">
            {/* CLIENTE */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Cliente
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                placeholder="Buscar cliente por nombre, apellido o celular"
                className="w-full bg-neutral-700 p-2 rounded text-white"
              />
              {showDropdown && (
                <ul className="absolute z-50 mt-1 bg-neutral-700 w-[calc(100%-3rem)] rounded max-h-44 overflow-y-auto shadow-lg">
                  {filteredClientes.length > 0 ? (
                    filteredClientes.map((c) => (
                      <li
                        key={c.id}
                        onClick={() => handleSelectCliente(c)}
                        className={`px-3 py-2 hover:bg-neutral-600 cursor-pointer ${clienteSeleccionado?.id === c.id
                            ? "bg-neutral-600"
                            : ""
                          }`}
                      >
                        {c.nombre} {c.apellido}{" "}

                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-gray-300">Sin resultados</li>
                  )}
                </ul>
              )}
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
            {/* SECCIÓN DE PRODUCTOS */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Productos
              </label>
              <select
                onChange={handleAddItem}
                className="w-full bg-neutral-700 p-2 rounded text-white"
                value=""
              >
                <option value="" disabled>
                  Añade un producto
                </option>
                {productos.map((p) => (
                  <option
                    key={p.id}
                    value={p.id}
                    disabled={items.some((item) => item.id === p.id)}
                  >
                    {p.nombre} — ${Math.floor(p.precio).toLocaleString("es-AR")}{" "}
                    ({p.stock} en stock)
                  </option>
                ))}
              </select>
              <div className="mt-4 space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-neutral-700 p-3 rounded-lg flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-100 truncate">
                        {item.nombre}
                      </p>
                      <div className="flex gap-2 items-center text-xs text-gray-400 mt-1">
                        <span>Cant.</span>
                        <input
                          type="number"
                          inputMode="numeric"
                          pattern="\d*"
                          value={item.cantidad}
                          onChange={(e) =>
                            handleUpdateItem(item.id, "cantidad", e.target.value)
                          }
                          className="w-12 bg-neutral-600 p-1 rounded text-white text-center"
                        />
                        <span>x</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="\d*"
                          value={item.precio}
                          onChange={(e) =>
                            handleUpdateItem(item.id, "precio", e.target.value)
                          }
                          className="w-16 bg-neutral-600 p-1 rounded text-white text-center"
                        />
                        <span className="text-gray-300 font-bold ml-1">
                          $
                          {(
                            Number(item.cantidad) * Number(item.precio)
                          ).toLocaleString("es-AR")}
                        </span>
                      </div>
                      {/* 🔹 NUEVA LÍNEA: Muestra el stock disponible */}
                      <p className="text-xs text-gray-500 mt-1">
                        Stock disponible: <span className="text-gray-300">{item.stock}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-400 hover:text-red-500 transition-colors self-start"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 100 2h2a1 1 0 100-2h-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* PAGADO (parcial o total) */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Monto Pagado
              </label>
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
                  className={`text-lg font-semibold ${saldo > 0 ? "text-red-400" : "text-green-400"
                    }`}
                >
                  ${saldo.toLocaleString("es-AR")}
                </div>
              </div>
            </div>
          </div>
          {/* Botones Fijos */}
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
              {initialData ? "Guardar Cambios" : "Guardar Venta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VentasModal;