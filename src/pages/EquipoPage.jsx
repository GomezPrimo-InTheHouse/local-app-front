//dependencias
import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

//api
import {
  getEquipos,
  createEquipo,
  updateEquipo,
  deleteEquipo,
  getEquiposByTipo,
  getEquiposByClienteId
} from '../api/EquiposApi.jsx';

//componentes
import SidebarEquipos from "../components/Equipo/SidebarEquipos.jsx";
import EquipoModal from '../components/Equipo/EquipoModal.jsx';
import BuscadorComponent from "../components/General/BuscadorComponent.jsx";
import AlertNotification from '../components/Alerta/AlertNotification.jsx';
import { getBalancesPresupuestos } from "../api/PresupuestoApi.jsx";
import { useMemo } from "react";
import { getEstados } from "../api/EstadoApi.jsx";
import { createIngreso } from "../api/IngresoApi";

const EquipoPage = () => {
  const [filtro, setFiltro] = useState("todos");
  const [equipos, setEquipos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: "", type: "success" });
  const [estados, setEstados] = useState([]);
  const [balances, setBalances] = useState([]);
  const navigate = useNavigate();

  // 🔹 Centralizamos la carga de equipos
  const fetchEquipos = async () => {
   
    setLoading(true);
    try {
      const data = await getEquipos();
    
      setEquipos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al obtener equipos:', err);
      setEquipos([]);
    } finally {
      setLoading(false);
    }
  };

  //Fetch a los balances
  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const res = await getBalancesPresupuestos();
        setBalances(res.balances || []);
      } catch (error) {
        console.error("Error al traer balances:", error);
      }
    };
    fetchBalances();
  }, []);
  // 🔹 Calculo del total general

  const balanceByEquipoId = useMemo(() => {
    const map = {};
    for (const b of balances) map[b.equipo_id] = b;
    return map;
  }, [balances]);

  const totalBalanceGeneral = useMemo(
    () => balances.reduce((acc, b) => acc + (b?.balance_final ?? 0), 0),
    [balances]
  );


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

  //handle delete con alertas
  const handleDelete = async (id) => {
   
    Swal.fire({
      title: 'Info!',
      text: '¿Estás seguro de que deseas eliminar este equipo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      theme: 'dark'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteEquipo(id);
        await fetchEquipos(); // ✅ refrescar después de borrar

        setAlert({ message: "✅ Equipo eliminado correctamente", type: "success" });
      }else{
        setAlert({ message: "Operación cancelada", type: "info" });
      }
    });
  };

//handle crear ingreso con alertas
const handleCrearIngreso = async (eq) => {
  Swal.fire({
    title: "Crear Ingreso",
    text: "¿Estás seguro de que deseas crear un nuevo ingreso?",
    icon: "warning",
    theme: "dark",
    showCancelButton: true,
    confirmButtonText: "Sí, crear",
    cancelButtonText: "Cancelar"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const payload = {
          equipo_id: eq.id,
          fecha_ingreso: new Date().toISOString(),
          estado_id: 1, // Pendiente
        };
        const ingresoCreado = await createIngreso(payload);
        setAlert({ message: "✅ Ingreso creado correctamente", type: "success" });

        // Navegamos al detalle pasando el ingreso_id recién creado
        navigate(`/equipos/${eq.id}`, { state: { nuevoIngresoId: ingresoCreado.id } });
      } catch (e) {
        console.error("Error creando ingreso:", e);
        setAlert({ message: "No se pudo crear el ingreso.", type: "error" });
      }
    }
  });
};

 
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

        {/* 🔹 Balance global */}
        <div className="mb-4">
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm text-gray-300">Balance global</span>
            <span className="text-xl font-semibold text-emerald-400">
              ${totalBalanceGeneral.toLocaleString("es-AR")}
            </span>
          </div>
        </div>

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
          ).map(([mes, equiposMes]) => {
            // 🔹 Total mensual
            const totalMes = equiposMes.reduce(
              (acc, eq) => acc + (balanceByEquipoId[eq.id]?.balance_final ?? 0),
              0
            );

            return (
              <div key={mes} className="mb-6">
                <div className="border-b border-gray-600 my-4">
                  <h4 className="text-lg font-semibold text-gray-300 capitalize">{mes}</h4>
                </div>

                {/* 🔹 Balance del mes */}
                <div className="mb-4">
                  <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-3 flex items-center justify-between">
                    <span className="text-sm text-gray-300">Balance del mes</span>
                    <span className="text-lg font-semibold text-emerald-400">
                      ${totalMes.toLocaleString("es-AR")}
                    </span>
                  </div>
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

                    const monto = balanceByEquipoId[eq.id]?.balance_final ?? 0;

                    return (
                      <li
                        key={eq.id}
                        className="bg-neutral-800 p-4 rounded shadow flex flex-col md:flex-row justify-between md:items-center gap-3"
                      >
                        {/* 🔹 Info principal a la izquierda */}
                        <div className="flex-1">
                          <p className="font-semibold text-white">
                            {eq.tipo?.toUpperCase()} - {eq.marca} {eq.modelo}
                          </p>

                          <p className="text-sm text-gray-400">{eq.problema}</p>
                          <p className="text-sm text-gray-400">
                            Estado: {getNombreEstado(eq.estado_id)}
                          </p>

                          {eq.tipo?.toLowerCase() === "celular" && eq.patron && (
                            <p className="text-sm text-gray-400">Patrón: {eq.patron}</p>
                          )}
                          {eq.tipo?.toLowerCase() !== "consola" && eq.password && (
                            <p className="text-sm text-gray-400">Password: {eq.password}</p>
                          )}

                          <p className="text-sm text-gray-400">
                            Cliente: {eq.cliente_nombre} {eq.cliente_apellido}
                          </p>

                          <p className="text-sm text-gray-500">Ingreso: {fechaFormateada}</p>
                        </div>

                        {/* 🔹 Mini-card de balance a la derecha */}
                        <div className="flex flex-col items-end gap-2">
                          <div className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 flex items-center justify-between md:justify-center gap-2">
                            <span className="hidden sm:block text-xs text-gray-300">Balance</span>
                            <span className="text-base md:text-lg font-semibold text-emerald-400">
                              ${monto.toLocaleString("es-AR")}
                            </span>
                          </div>

                          {/* 🔹 Botones */}
                          <div className="flex gap-2">
                             <button
                              onClick={() => handleCrearIngreso(eq)}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium"
                            >
                              Nuevo Ingreso
                            </button>
                            <Link
                              to={`/equipos/${eq.id}`}
                              className="bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
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
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            );
          })
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
