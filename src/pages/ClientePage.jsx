import { useEffect, useState } from "react";
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../api/clienteApi";
import ClienteModal from "../components/ClienteModal.jsx";

const ClientePage = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // 🔹 Obtener clientes al montar el componente
  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const data = await getClientes();
      setClientes(data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgregar = () => {
    setClienteSeleccionado(null); // nuevo cliente
    setIsOpen(true);
  };

  const handleModificar = (cliente) => {
    setClienteSeleccionado(cliente); // editar cliente
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este cliente?")) return;
    try {
      await deleteCliente(id);
      cargarClientes();
    } catch (error) {
      console.error("Error eliminando cliente:", error);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (clienteSeleccionado) {
        await updateCliente(clienteSeleccionado.id, formData);
      } else {
        await createCliente(formData);
      }
      cargarClientes();
    } catch (error) {
      console.error("Error guardando cliente:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-neutral-900 text-white">
      {/* 🔹 Columna izquierda 30% */}
      <div className="w-full md:w-[30%] bg-neutral-800 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-emerald-400 mb-4">
            Gestión de Clientes
          </h2>
          <button
            onClick={handleAgregar}
            className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded font-semibold w-full"
          >
            + Agregar Cliente
          </button>
        </div>
      </div>

      {/* 🔹 Columna derecha 70% */}
      <div className="w-full md:w-[70%] p-6 overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Lista de Clientes</h3>

        {loading ? (
          <p className="text-gray-400">Cargando clientes...</p>
        ) : !Array.isArray(clientes) || clientes.length === 0 ? (
          <p className="text-gray-400">Aún no hay clientes cargados.</p>
        ) : (
          <ol className="space-y-4 list-decimal list-inside">
            {clientes.map((cli) => (
              <li
                key={cli.id}
                className="bg-neutral-800 p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-white">
                    {cli.nombre} {cli.apellido}
                  </p>
                  <p className="text-sm text-gray-400">
                    {cli.celular} | {cli.direccion}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleModificar(cli)}
                    className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm font-medium"
                  >
                    Modificar
                  </button>
                  <button
                    onClick={() => handleDelete(cli.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* 🔹 Modal de cliente */}
      <ClienteModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        clienteSeleccionado={clienteSeleccionado}
      />
    </div>
  );
};

export default ClientePage;
