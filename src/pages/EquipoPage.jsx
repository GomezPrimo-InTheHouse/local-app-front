import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EquipoModal from '../components/EquipoModal.jsx';
import { getEquipos, createEquipo, updateEquipo, deleteEquipo, getEquiposByTipo } from '../api/EquiposApi.jsx';

const EquipoPage = () => {
  const [filtro, setFiltro] = useState("todos"); // 🔹 nuevo estado para f
  const [equipos, setEquipos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);

  const clientesMock = [
    { id: 1, nombre: 'Juan', apellido: 'Pérez' },
    { id: 2, nombre: 'Ana', apellido: 'Torres' },
  ];

  // 🔹 Obtener todos los equipos al montar el componente
  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const data = await getEquipos();
        setEquipos(data);
      } catch (err) {
        console.error('Error al obtener equipos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipos();
  }, []);

  const handleAgregar = () => {
    setEquipoSeleccionado(null);
    setIsOpen(true);
  };

  const handleModificar = (equipo) => {
    setEquipoSeleccionado(equipo);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEquipoSeleccionado(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este equipo?")) return;
    await deleteEquipo(id);
    setEquipos((prev) => prev.filter((eq) => eq.id !== id));
  };

  const handleSubmit = async (formData) => {
    try {
      if (equipoSeleccionado) {
        // 🔹 Modificar equipo existente
        const actualizado = await updateEquipo(equipoSeleccionado.id, formData);
        setEquipos((prev) =>
          prev.map((eq) => (eq.id === actualizado.id ? actualizado : eq))
        );
      } else {
        // 🔹 Crear equipo nuevo
        const nuevo = await createEquipo(formData);
        setEquipos((prev) => [...prev, nuevo]);
      }
    } catch (err) {
      console.error('Error al guardar equipo:', err);
    } finally {
      handleClose();
    }
  };

 


  // 🔹 Manejar filtro desde backend
  const handleFiltro = async (tipo) => {
    setFiltro(tipo);
    if (tipo === "todos") {
      const data = await getEquipos();
      console.log("Todos los equipos:", data);
      setEquipos(Array.isArray(data) ? data : []);
    } else if (tipo === "otros") {
      const todos = await getEquipos();
      const arrayTodos = Array.isArray(todos) ? todos : [];
      const filtrados = arrayTodos.filter(
        (eq) =>
          eq.tipo?.toLowerCase() !== "celular" &&
          eq.tipo?.toLowerCase() !== "notebook" &&
          eq.tipo?.toLowerCase() !== "pc"
      );
      setEquipos(filtrados);
    } else {
      const data = await getEquiposByTipo(tipo);
      setEquipos(Array.isArray(data) ? data : []);
    }
  };


  return (
    <div className="flex h-screen w-screen bg-neutral-900 text-white overflow-hidden">
      {/* Columna izquierda 30% */}
      <div className="w-[30%] border-r border-neutral-700 p-6 flex flex-col">
        <Link
          to="/"
          className="inline-block mb-4 text-sm text-emerald-400 hover:text-emerald-200 underline"
        >
          ← Volver al Dashboard
        </Link>


        <h2 className="text-2xl font-bold text-emerald-400 mb-4">
          Gestión de Equipos
        </h2>
        <h2 className="text-xl font-bold text-emerald-400 mb-4">Filtros</h2>

        <div className="flex flex-col gap-3 mb-8">
          {["todos", "celular", "notebook","PC",  "otros"].map((tipo) => (
            <button
              key={tipo}
              onClick={() => handleFiltro(tipo)}
              className={`px-4 py-2 rounded font-semibold ${filtro === tipo
                  ? "bg-emerald-600"
                  : "bg-neutral-700 hover:bg-neutral-600"
                }`}
            >
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </button>
          ))}
        </div>


        <button
          onClick={handleAgregar}
          className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded font-semibold"
        >
          + Agregar Equipo
        </button>
      </div>

      {/* Columna derecha 70% */}
      {/* Columna derecha 70% */}
<div className="w-[70%] p-6 overflow-y-auto">
  <h3 className="text-xl font-semibold mb-4">Lista de Equipos</h3>

  {loading ? (
    <p className="text-gray-400">Cargando equipos...</p>
  ) : !Array.isArray(equipos) || equipos.length === 0 ? (
    <p className="text-gray-400">Aún no hay equipos cargados.</p>
  ) : (
    Object.entries(
      equipos.reduce((grupos, eq) => {
        const fecha = eq.fecha_ingreso ? new Date(eq.fecha_ingreso) : null;
        const key = fecha
          ? `${fecha.toLocaleString("es-AR", { month: "long" })} ${fecha.getFullYear()}`
          : "Sin fecha";
        if (!grupos[key]) grupos[key] = [];
        grupos[key].push(eq);
        return grupos;
      }, {})
    ).map(([mes, equiposMes]) => (
      <div key={mes} className="mb-6">
        {/* Divisor de mes */}
        <div className="border-b border-gray-600 my-4">
          <h4 className="text-lg font-semibold text-gray-300 capitalize">
            {mes}
          </h4>
        </div>

        <ol className="space-y-4 list-decimal list-inside">
          {equiposMes.map((eq) => {
            const fechaFormateada = eq.fecha_ingreso
              ? new Date(eq.fecha_ingreso).toLocaleDateString("es-AR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
              : "Sin fecha";

            return (
              <li
                key={eq.id}
                className="bg-neutral-800 p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-white">
                    {eq.tipo?.toUpperCase()} - {eq.marca} {eq.modelo}
                  </p>
                  <p className="text-sm text-gray-400">{eq.problema}</p>
                  <p className="text-sm text-gray-500">
                    Ingreso: {fechaFormateada}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleModificar(eq)}
                    className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm font-medium"
                  >
                    Modificar
                  </button>
                  <button
                    onClick={() => handleDelete(eq.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    ))
  )}
</div>



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



