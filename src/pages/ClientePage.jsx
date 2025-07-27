import { useState } from 'react';
import { Link } from 'react-router-dom';
import ClienteModal from '../components/ClienteModal';

const ClientePage = () => {
  const [clientes, setClientes] = useState([
    { id: 1, nombre: 'Juan Pérez', email: 'juan@mail.com' },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    celular: '',
    celularContacto: '',
  });

  const handleAgregar = () => setIsOpen(true);

  const handleClose = () => {
    setIsOpen(false);
    setNuevoCliente({
      nombre: '',
      apellido: '',
      direccion: '',
      celular: '',
      celularContacto: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevo = {
      id: Date.now(),
      nombre: `${nuevoCliente.nombre} ${nuevoCliente.apellido}`,
      email: `(${nuevoCliente.celular})`, // solo ejemplo
    };
    setClientes([...clientes, nuevo]);
    handleClose();
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      <Link to="/" className="inline-block mb-4 text-sm text-indigo-400 hover:text-indigo-200 underline">
        ← Volver al Dashboard
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-indigo-400">Gestión de Clientes</h2>
        <button
          onClick={handleAgregar}
          className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded font-semibold"
        >
          + Agregar Cliente
        </button>
      </div>

      <ul className="space-y-4">
        {clientes.map((cliente) => (
          <li
            key={cliente.id}
            className="bg-neutral-800 p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-white">{cliente.nombre}</p>
              <p className="text-sm text-gray-400">{cliente.email}</p>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm font-medium">
              Modificar
            </button>
          </li>
        ))}
      </ul>

      {/* Modal */}
      <ClienteModal
        isOpen={isOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        formData={nuevoCliente}
        setFormData={setNuevoCliente}
      />
    </div>
  );
};

export default ClientePage;
