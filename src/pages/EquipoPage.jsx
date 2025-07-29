// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import EquipoModal from '../components/EquipoModal';

// const EquipoPage = () => {
//   const [equipos, setEquipos] = useState([]);
//   const [nextId, setNextId] = useState(1);

//   const [isOpen, setIsOpen] = useState(false);

//   const clientesMock = [
//     { id: 1, nombre: 'Juan Pérez' },
//     { id: 2, nombre: 'Ana Torres' },
//   ];

//   const handleAgregar = () => setIsOpen(true);

//   const handleClose = () => setIsOpen(false);

//   const handleSubmit = (formData) => {
//     const nuevo = {
//       ...formData,
//       id: nextId,
//     };
//     setEquipos([...equipos, nuevo]);
//     setNextId(nextId + 1);
//     handleClose();
//   };

//   return (
//     <div className="min-h-screen bg-neutral-900 text-white p-6">
//       <Link to="/" className="inline-block mb-4 text-sm text-emerald-400 hover:text-emerald-200 underline">
//         ← Volver al Dashboard
//       </Link>

//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-emerald-400">Gestión de Equipos</h2>
//         <button
//           onClick={handleAgregar}
//           className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded font-semibold"
//         >
//           + Agregar Equipo
//         </button>
//       </div>

//       <ul className="space-y-4">
//         {equipos.map((eq) => (
//           <li
//             key={eq.id}
//             className="bg-neutral-800 p-4 rounded shadow flex justify-between items-center"
//           >
//             <div>
//               <p className="font-semibold text-white">{eq.tipo.toUpperCase()} - {eq.marca} {eq.modelo}</p>
//               <p className="text-sm text-gray-400">{eq.problema}</p>
//               {eq.fechaIngreso && <p className="text-sm text-gray-400">Fecha: {eq.fechaIngreso}</p>}
//               {eq.presupuesto && <p className="text-sm text-gray-400">Presupuesto: ${eq.presupuesto}</p>}
//             </div>
//             <button className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm font-medium">
//               Modificar
//             </button>
//           </li>
//         ))}
//       </ul>

//       <EquipoModal
//         isOpen={isOpen}
//         onClose={handleClose}
//         onSubmit={handleSubmit}
//         clientes={clientesMock}
//       />
//     </div>
//   );
// };

// export default EquipoPage;



// src/pages/EquipoPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import EquipoModal from './../components/EquipoModal';

const EquipoPage = () => {
  const [equipos, setEquipos] = useState([
    {
      id: 1,
      tipo: 'celular',
      marca: 'Samsung',
      modelo: 'A04e',
      password: '1234',
      problema: 'No enciende',
      clienteId: 1,
      fechaIngreso: '2025-07-01',
      presupuesto: 15000,
      patron: '1235789',
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [nextId, setNextId] = useState(2); // control de IDs únicos

  const clientesMock = [
    { id: 1, nombre: 'Juan', apellido: 'Pérez' },
    { id: 2, nombre: 'Ana', apellido: 'Torres' },
  ];

  const handleAgregar = () => {
    setEquipoSeleccionado(null); // nuevo equipo
    setIsOpen(true);
  };

  const handleModificar = (equipo) => {
    setEquipoSeleccionado(equipo); // edición de equipo existente
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEquipoSeleccionado(null);
  };

  const handleSubmit = (formData) => {
    if (equipoSeleccionado) {
      // Modificar equipo existente
      const equiposActualizados = equipos.map((eq) =>
        eq.id === equipoSeleccionado.id ? { ...formData, id: eq.id } : eq
      );
      setEquipos(equiposActualizados);
    } else {
      // Agregar nuevo equipo
      const nuevoEquipo = {
        ...formData,
        id: nextId,
      };
      setEquipos([...equipos, nuevoEquipo]);
      setNextId(nextId + 1);
    }

    handleClose();
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      <Link
        to="/"
        className="inline-block mb-4 text-sm text-emerald-400 hover:text-emerald-200 underline"
      >
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
              <p className="font-semibold text-white">
                {eq.tipo.toUpperCase()} - {eq.marca} {eq.modelo}
              </p>
              <p className="text-sm text-gray-400">{eq.problema}</p>
            </div>
            <button
              onClick={() => handleModificar(eq)}
              className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm font-medium"
            >
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
        equipoSeleccionado={equipoSeleccionado}
        clientes={clientesMock}
      />
    </div>
  );
};

export default EquipoPage;


