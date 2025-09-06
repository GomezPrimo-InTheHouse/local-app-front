import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VentasModal from "../components/Ventas/VentasModal.jsx";

const VentasPage = () => {
  const navigate = useNavigate();
  const [ventas, setVentas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const handleNuevaVenta = (venta) => {
    setVentas([...ventas, venta]);
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-neutral-900 text-white overflow-hidden">
      {/* Sidebar 30% en desktop */}
      <aside className="w-1/3 bg-neutral-800 p-6 hidden lg:flex flex-col justify-start shadow-xl">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 mb-6 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition"
        >
          ⬅️ Volver al Dashboard
        </button>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold shadow"
        >
          ➕ Agregar Nueva Venta
        </button>
      </aside>

      {/* Header en móviles */}
      <header className="lg:hidden w-full bg-neutral-800 p-4 flex justify-between items-center shadow">
        <button
          onClick={() => navigate("/")}
          className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm"
        >
          ⬅️ Dashboard
        </button>
        <button
          onClick={() => setModalOpen(true)}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm"
        >
          ➕ Nueva Venta
        </button>
      </header>

      {/* Contenido 70% */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-purple-400 mb-6">📦 Ventas</h1>

        {ventas.length === 0 ? (
          <p className="text-gray-400">No hay ventas registradas aún.</p>
        ) : (
          <div className="grid gap-4">
            {ventas.map((venta, index) => (
              <div
                key={index}
                className="bg-neutral-800 p-4 rounded-xl shadow flex flex-col md:flex-row justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold">
                    {venta.producto} × {venta.cantidad}
                  </h2>
                  <p className="text-gray-400">
                    Cliente: {venta.cliente?.nombre || "Sin cliente"}
                  </p>
                  <p className="text-gray-400">Total: ${venta.total}</p>
                  <p
                    className={`font-semibold ${
                      venta.saldo > 0 ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {venta.saldo > 0
                      ? `Saldo pendiente: $${venta.saldo}`
                      : "Pagado en su totalidad"}
                  </p>
                </div>
                <div className="text-sm text-gray-500 mt-2 md:mt-0">
                  Fecha: {new Date().toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {modalOpen && (
        <VentasModal
          onClose={() => setModalOpen(false)}
          onGuardar={handleNuevaVenta}
        />
      )}
    </div>
  );
};

export default VentasPage;
