import { useState } from 'react';
import { Link } from 'react-router-dom';
import EquipoModal from '../components/EquipoModal';

const EquipoPage = () => {
  const [equipos, setEquipos] = useState([
    { id: 1, tipo: 'celular', marca: 'Samsung', modelo: 'A04e', problema: 'No enciende', clienteId: 1 },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [nuevoEquipo, setNuevoEquipo] = useState({
    tipo: '',
    marca: '',
    modelo: '',
    problema: '',
    clienteId: '',
  });

  const clientesMock = [
    { id: 1, nombre: 'Juan Pérez' },
    { id: 2, nombre: 'Ana Torres' },
  ]; // Luego se obtendrán de un endpoint

  const handleAgregar = () => setIsOpen(true);

  const handleClose = () => {
    setIsOpen(false);
    setNuevoEquipo({
      tipo: '',
      marca: '',
      modelo: '',
      problema: '',
      clienteId: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevo = {
      ...nuevoEquipo,
      id: Date.now(),
    };
    setEquipos([...equipos, nuevo]);
    handleClose();
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      <Link to="/" className="inline-block mb-4 text-sm text-emerald-400 hover:text-emerald-200 underline">
        ← Volver al Dashboard
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-emerald-400">Gestión de Equipos</h2>
        <button
          onClick={handleAgregar}
          className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded font-semibold"
        >
          + Agregar Equipo
        </button>
      </div>

      <ul className="space-y-4">
        {equipos.map((eq) => (
          <li
            key={eq.id}
            className="bg-neutral-800 p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-white">{eq.tipo.toUpperCase()} - {eq.marca} {eq.modelo}</p>
              <p className="text-sm text-gray-400">{eq.problema}</p>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm font-medium">
              Modificar
            </button>
          </li>
        ))}
      </ul>

      {/* Modal */}
      <EquipoModal
        isOpen={isOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        formData={nuevoEquipo}
        setFormData={setNuevoEquipo}
        clientes={clientesMock}
      />
    </div>
  );
};

export default EquipoPage;
