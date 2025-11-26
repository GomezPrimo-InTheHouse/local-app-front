
// src/pages/VentasPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import VentasModal from "../components/Ventas/VentasModal.jsx";
import BuscadorComponent from "../components/General/BuscadorComponent.jsx";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import {
  getVentas,
  createVenta,
  updateVenta,
  deleteVenta,
} from "../api/VentaApi.jsx";
import { getProductos } from "../api/ProductoApi.jsx";

const VentasPage = () => {
  const navigate = useNavigate();
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVenta, setEditingVenta] = useState(null);
  const [filtroClienteId, setFiltroClienteId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Utilidades para normalizar claves (por si el backend a veces devuelve id o venta_id)
  const getVentaId = (venta) => venta?.id ?? venta?.venta_id ?? null;
  const getClienteId = (venta) =>
    venta?.cliente?.id ?? venta?.cliente_id ?? venta?.cliente ?? null;

  // Cargar ventas y productos
  const fetchData = async () => {
    setLoading(true);
    try {
      const ventasResponse = await getVentas();
      const productosResponse = await getProductos();

      // soportar respuesta { data: [...] } o directamente [...]
      const ventasData =
        ventasResponse?.data ?? ventasResponse ?? ventasResponse?.ventas ?? [];
      const productosData =
        productosResponse?.data ??
        productosResponse ??
        productosResponse?.productos ??
        [];

      setVentas(Array.isArray(ventasData) ? ventasData : []);
      setProductos(Array.isArray(productosData) ? productosData : []);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setVentas([]);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Guardar (crear/actualizar)
  const handleGuardarVenta = async (ventaPayload) => {
    try {
      if (editingVenta) {
        // editingVenta puede tener id o venta_id
        const ventaId = getVentaId(editingVenta);
        await updateVenta(ventaId, ventaPayload);
        Swal.fire({
          title: "¡Actualizada!",
          text: "La venta ha sido actualizada correctamente.",
          icon: "success",
          customClass: {
            popup:
              "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
            title: "text-xl font-bold text-emerald-400",
            htmlContainer: "text-gray-300",
          },
        });
      } else {
        await createVenta(ventaPayload);
        Swal.fire({
          title: "¡Creada!",
          text: "La venta ha sido creada correctamente.",
          icon: "success",
          customClass: {
            popup:
              "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
            title: "text-xl font-bold text-emerald-400",
            htmlContainer: "text-gray-300",
          },
        });
      }
      await fetchData();
    } catch (error) {
      console.error("Error al guardar la venta:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al guardar la venta.",
        icon: "error",
        customClass: {
          popup:
            "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
          title: "text-xl font-bold text-red-400",
          htmlContainer: "text-gray-300",
        },
      });
    } finally {
      setModalOpen(false);
      setEditingVenta(null);
    }
  };

  const handleEditVenta = (venta) => {
    // Pasamos el objeto tal cual (modal debe conocer este shape)
    setEditingVenta(venta);
    setModalOpen(true);
  };

  const handleDeleteVenta = (venta) => {
    const ventaId = getVentaId(venta);
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup:
          "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
        title: "text-xl font-bold",
        htmlContainer: "text-gray-300",
        confirmButton: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
        cancelButton: "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteVenta(ventaId);
          await fetchData();
          Swal.fire({
            title: "¡Eliminada!",
            text: "La venta ha sido eliminada correctamente.",
            icon: "success",
            customClass: {
              popup:
                "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
              title: "text-xl font-bold text-emerald-400",
              htmlContainer: "text-gray-300",
            },
          });
        } catch (error) {
          console.error("Error al eliminar la venta:", error);
          Swal.fire({
            title: "Error",
            text: "Hubo un problema al eliminar la venta.",
            icon: "error",
            customClass: {
              popup:
                "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
              title: "text-xl font-bold text-red-400",
              htmlContainer: "text-gray-300",
            },
          });
        }
      }
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    return new Date(dateString + 'T12:00:00').toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  // Filtrado por cliente (normaliza cliente.id o cliente_id)
  // Filtrado por cliente (normaliza cliente.id o cliente_id)
  const ventasFiltradas = useMemo(() => {
    if (!filtroClienteId) return ventas;
    return ventas.filter(
      (venta) => Number(getClienteId(venta)) === Number(filtroClienteId)
    );
  }, [ventas, filtroClienteId]);

  // ✅ Balance general NETO (ventas - costos)
  const totalBalanceGeneral = useMemo(() => {
    return ventas.reduce((acc, venta) => {
      const totalVenta = parseFloat(venta.total) || 0;

      const costoVenta = (venta.detalle_venta || []).reduce((costoAcc, det) => {
        const cantidad = Number(det.cantidad) || 0;
        const costoUnitario = det.producto ? Number(det.producto.costo) || 0 : 0;
        return costoAcc + cantidad * costoUnitario;
      }, 0);

      const balanceVenta = totalVenta - costoVenta;
      return acc + balanceVenta;
    }, 0);
  }, [ventas]);


  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-screen bg-neutral-900 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-1/4 xl:w-1/5 bg-neutral-800 p-6 flex-col justify-start shadow-xl z-10">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 mb-6 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition text-sm"
        >
          ⬅️ Volver al Dashboard
        </button>
        <button
          onClick={() => {
            setModalOpen(true);
            setEditingVenta(null);
          }}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold shadow"
        >
          ➕ Agregar Nueva Venta
        </button>
      </aside>

      {/* Header móvil */}
      <header className="lg:hidden w-full bg-neutral-800 p-4 flex justify-between items-center shadow">
        <button
          onClick={() => navigate("/")}
          className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm"
        >
          ⬅️ Dashboard
        </button>
        <button
          onClick={() => {
            setModalOpen(true);
            setEditingVenta(null);
          }}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm"
        >
          ➕ Nueva Venta
        </button>
      </header>

      {/* Main */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-purple-400 mb-6">📦 Ventas</h1>

        <BuscadorComponent onBuscar={setFiltroClienteId} />

        {/* Balance */}
        <div className="mb-4">
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm text-gray-300">
              Balance neto de ventas (ventas - costos)
            </span>
            <span className="text-xl font-semibold text-emerald-400">
              ${totalBalanceGeneral.toLocaleString("es-AR")}
            </span>
          </div>
        </div>


        {loading ? (
          <p className="text-gray-400">Cargando ventas...</p>
        ) : ventasFiltradas.length === 0 ? (
          <p className="text-gray-400">No hay ventas registradas.</p>
        ) : (
  <div>
  {Object.entries(
    ventasFiltradas.reduce((grupos, venta) => {
      // 💡 CORRECCIÓN APLICADA AQUÍ: Añadimos 'T12:00:00'
      const fecha = venta.fecha ? new Date(venta.fecha + "T12:00:00") : null;
      const key = fecha
        ? `${fecha.toLocaleString("es-AR", { month: "long" })} ${fecha.getFullYear()}`
        : "Sin fecha";

      if (!grupos[key]) grupos[key] = [];
      grupos[key].push(venta);
      return grupos;
    }, {})
  ).map(([mes, ventasMes]) => {
    // ✅ Cálculo de VENTAS, COSTOS y BALANCE por mes
    const { totalVentasMes, totalCostosMes, balanceMes } = ventasMes.reduce(
      (acc, venta) => {
        const totalVenta = parseFloat(venta.total) || 0;

        const costoVenta = (venta.detalle_venta || []).reduce((costoAcc, det) => {
          const cantidad = Number(det.cantidad) || 0;
          const costoUnitario = det.producto ? Number(det.producto.costo) || 0 : 0;
          return costoAcc + cantidad * costoUnitario;
        }, 0);

        const balanceVenta = totalVenta - costoVenta;

        acc.totalVentasMes += totalVenta;
        acc.totalCostosMes += costoVenta;
        acc.balanceMes += balanceVenta;
        return acc;
      },
      { totalVentasMes: 0, totalCostosMes: 0, balanceMes: 0 }
    );

    return (
      <div key={mes} className="mb-6">
        <div className="border-b border-gray-600 my-4">
          <h4 className="text-lg font-semibold text-gray-300 capitalize">
            {mes}
          </h4>
        </div>

        {/* Total por mes (NETO) */}
        <div className="mb-4">
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-sm text-gray-300">
              <p className="font-medium">
                Balance neto del mes <span className="text-xs text-gray-500">(ventas - costos)</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Ventas brutas:{" "}
                <span className="text-gray-200">
                  ${totalVentasMes.toLocaleString("es-AR")}
                </span>{" "}
                · Costos:{" "}
                <span className="text-red-300">
                  ${totalCostosMes.toLocaleString("es-AR")}
                </span>
              </p>
            </div>

            <span
              className={`text-lg sm:text-xl font-semibold ${
                balanceMes >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              ${balanceMes.toLocaleString("es-AR")}
            </span>
          </div>
        </div>

        {/* Ventas */}
        <div className="grid gap-4">
          {ventasMes.map((venta, vIndex) => {
            // clave única para cada venta
            const ventaKey = getVentaId(venta) ?? `${mes}-${vIndex}`;

            return (
              <div
                key={ventaKey}
                className="bg-neutral-800 p-4 rounded-xl shadow transition-transform transform hover:scale-[1.01] flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div
                  onClick={() => handleEditVenta(venta)}
                  className="flex-1 min-w-0 cursor-pointer"
                >
                  <div className="font-semibold text-lg flex items-center gap-2">
                    <span className="text-purple-400">Total:</span> $
                    {formatPrice(venta.total)}
                  </div>
                  <p className="text-gray-400 text-sm truncate">
                    Cliente:{" "}
                    <span className="text-gray-200">
                      {venta.cliente?.nombre || venta.cliente_nombre || "Sin cliente"}{" "}
                      {venta.cliente?.apellido || ""}
                    </span>
                  </p>

                  {/* Detalle productos */}
                  <ul className="list-disc list-inside mt-2 text-sm text-gray-300">
                    {venta.detalle_venta?.length > 0 ? (
                      venta.detalle_venta.map((detalle, dIndex) => {
                        const detalleKey =
                          detalle?.id ?? `${ventaKey}-detalle-${dIndex}`;
                        const producto = productos.find(
                          (p) => p.id === detalle.producto_id
                        );
                        return (
                          <li key={detalleKey}>
                            {producto ? producto.nombre : "Producto desconocido"}{" "}
                            - {detalle.cantidad} unid. a $
                            {formatPrice(detalle.precio_unitario)}
                          </li>
                        );
                      })
                    ) : (
                      <li>No hay productos en esta venta.</li>
                    )}
                  </ul>
                </div>

                <div className="flex flex-col items-end text-sm text-gray-500 mt-4 md:mt-0 md:ml-4">
                  <p className="text-xs text-gray-400 mb-1">
                    {formatDate(venta.fecha)}
                  </p>

                  <p className="font-semibold text-gray-400">
                    Monto Abonado:{" "}
                    <span className="text-gray-200">
                      ${formatPrice(venta.monto_abonado)}
                    </span>
                  </p>
                  <p className="font-semibold text-gray-400">
                    Saldo:{" "}
                    <span
                      className={`font-bold ${
                        Number(venta.saldo) > 0
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      ${formatPrice(venta.saldo)}
                    </span>
                  </p>
                  <button
                    onClick={() => handleDeleteVenta(venta)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-medium mt-2 text-white"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  })}
</div>

        )}
      </main>

      {modalOpen && (
        <VentasModal
          onClose={() => {
            setModalOpen(false);
            setEditingVenta(null);
          }}
          onGuardar={handleGuardarVenta}
          initialData={editingVenta}
          productos={productos} // pasamos lista de productos al modal para mostrar nombres/stock
        />
      )}
    </div>
  );
};

export default VentasPage;



