//dependencias
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
//api
import { 
  getEquipos, 
  createEquipo, 
  updateEquipo, 
  deleteEquipo, 
  getEquiposByTipo, 
  getEquiposByClienteId } from '../api/EquiposApi.jsx';

//componentes
import SidebarEquipos from "../components/Equipo/SidebarEquipos.jsx";
import EquipoModal from '../components/Equipo/EquipoModal.jsx';
import BuscadorComponent from "../components/General/BuscadorComponent.jsx";
import AlertNotification from '../components/Alerta/AlertNotification.jsx';

import { getEstados } from "../api/EstadoApi.jsx";

const EquipoPage = () => {
  const [filtro, setFiltro] = useState("todos");
  const [equipos, setEquipos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: "", type: "success" });
  const [estados, setEstados] = useState([]);
  // 🔹 Centralizamos la carga de equipos
  const fetchEquipos = async () => {
    setLoading(true);
    try {
      const data = await getEquipos();
      console.log(data)
      setEquipos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al obtener equipos:', err);
      setEquipos([]);
    } finally {
      setLoading(false);
    }
  };

  // fetch a estados

  useEffect(() => {
    (async () => {
      const lista = await getEstados();
      setEstados(lista);
    })();
  }, []);

  // Función para obtener el nombre del estado a partir del id
  const getNombreEstado = (id) => {
    const estado = estados.find((e) => e.id === id);
    return estado ? estado.nombre : "Desconocido";
  };

  // Cargar al montar el componente
  useEffect(() => {
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
    await fetchEquipos(); // ✅ refrescar después de borrar

    setAlert({ message: "✅ Equipo eliminado correctamente", type: "success" });
  };

  // const handleSubmit = async (formData) => {
  //   console.log('equipo seleccionado: ', equipoSeleccionado);
  //   console.log('data desde equipo page: ', formData);
  //   try {
  //     if (equipoSeleccionado) {
        
  //       await updateEquipo(equipoSeleccionado.id, formData);
  //     } else {
  //       await createEquipo(formData);
  //     }

  //     // ✅ siempre recargar desde la DB después de crear/modificar
  //     await fetchEquipos();
  //   } catch (err) {
  //     console.error('Error al guardar equipo:', err);
  //   } finally {
  //     handleClose();
  //   }
  // };


  const handleSubmit = async (formData) => {
  // ✅ Normalizamos el payload que viaja al backend
  const payload = {
    tipo: String(formData.tipo || "").trim(),
    marca: String(formData.marca || "").trim(),
    modelo: String(formData.modelo || "").trim(),
    password: formData.password ?? null,
    problema: String(formData.problema || "").trim(),
    cliente_id: Number(formData.cliente_id),
    fecha_ingreso: formData.fecha_ingreso || null,
    // 👇 patron SIEMPRE presente; si está vacío, mandamos null (útil si tu SQL usa COALESCE)
    patron: (formData.patron && formData.patron.trim() !== "") ? formData.patron.trim() : null,
    estado_id: Number(formData.estado_id),
  };

  try {
    if (equipoSeleccionado) {
      await updateEquipo(equipoSeleccionado.id, payload);
        setAlert({ message: "✅ Equipo actualizado correctamente", type: "success" });
    } else {
      await createEquipo(payload);
        setAlert({ message: "✅ Equipo creado correctamente", type: "success" });
    }
    await fetchEquipos(); // refresca tabla
  } catch (err) {
    console.error("Error al guardar equipo:", err);
    setAlert({ message: "❌ Error al guardar el equipo", type: "error" });
  } finally {
    handleClose();
  }
};

  const handleFiltro = async (tipo) => {
    setFiltro(tipo);
    setLoading(true);
    try {
      if (tipo === "todos") {
        await fetchEquipos();
      } else if (tipo === "otros") {
        const todos = await getEquipos();
        const filtrados = todos.filter(
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-neutral-900 text-white overflow-hidden">
      <SidebarEquipos
        filtro={filtro}
        handleFiltro={handleFiltro}
        handleAgregar={handleAgregar}
      />

      <div className="w-full md:w-[70%] p-6 overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Lista de Equipos</h3>

        <BuscadorComponent
          onBuscar={async (clienteId) => {
            setLoading(true);
            try {
              if (!clienteId) {
                await fetchEquipos();
              } else {
                const data = await getEquiposByClienteId(clienteId);
                setEquipos(Array.isArray(data) ? data : []);
              }
            } finally {
              setLoading(false);
            }
          }}
        />

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
              <div className="border-b border-gray-600 my-4">
                <h4 className="text-lg font-semibold text-gray-300 capitalize">{mes}</h4>
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
                      className="bg-neutral-800 p-4 rounded shadow flex flex-col md:flex-row justify-between md:items-center gap-3"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-white">
                          {eq.tipo?.toUpperCase()} - {eq.marca} {eq.modelo}
                        </p>

                        <p className="text-sm text-gray-400">{eq.problema}</p>
                          <p className="text-sm text-gray-400">
                            Estado: {getNombreEstado(eq.estado_id)}
                          </p>
                          {/* Patrón: solo si es celular */}
                        {eq.tipo?.toLowerCase() === "celular" && eq.patron && (
                          <p className="text-sm text-gray-400">Patrón: {eq.patron}</p>
                        )}
                         {eq.tipo?.toLowerCase() != "consola" && eq.password && (
                          
                          <p className="text-sm text-gray-400" > Password: {eq.password}</p>
                        )}

                        {/* Cliente */}

                       <p className="text-sm text-gray-400">Cliente: {eq.cliente_nombre} {eq.cliente_apellido}</p>
                         

                        <p className="text-sm text-gray-500">Ingreso: {fechaFormateada}</p>

                      </div>
                      <div className="flex gap-2 self-end md:self-auto">
                        <Link
                          to={`/equipos/${eq.id}`}
                          className="text-emerald-400 hover:text-emerald-200 text-sm  mt-2 block"
                        >
                          Ver Detalles
                        </Link>
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

      <EquipoModal
        isOpen={isOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        equipoSeleccionado={equipoSeleccionado}
      />

      {alert.message && (
        <AlertNotification
          message={alert.message}
          type={alert.type}
          duration={4000}
          onClose={() => setAlert({ message: "", type: "success" })}
        />
      )}
    </div>

    
  );
};

export default EquipoPage;
