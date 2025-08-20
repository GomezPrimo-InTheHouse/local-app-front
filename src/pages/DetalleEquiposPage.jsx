

// src/pages/DetalleEquiposPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEquipoById } from "../api/EquiposApi.jsx";
import { getPresupuestosByEquipo, deletePresupuesto } from "../api/PresupuestoApi.jsx";
import { updateIngreso } from "../api/IngresoApi.jsx";
import PresupuestoModal from "../components/Presupuesto/PresupuestoModal.jsx";

import CambiarEstadoModal from "../components/Ingreso/CambiarEstadoModal.jsx";
import AlertNotification from "../components/Alerta/AlertNotification.jsx";



const DetalleEquiposPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null); // resultado de getEquipoById
  const [loading, setLoading] = useState(true);

  const [ingresoActual, setIngresoActual] = useState(null); // ingreso activo (detalles.ingreso)
  const [presupuestos, setPresupuestos] = useState([]); // lista de presupuestos por equipo

  // Modales
  const [isEstadoModalOpen, setIsEstadoModalOpen] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState(null);
  const [ingresoSeleccionado, setIngresoSeleccionado] = useState(null);

  // Alertas globales (padre)
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const showAlert = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => setAlertMessage(""), 2000); // 2s
  };

  // --- Helpers para obtener y normalizar datos ---
  const normalizePresupuestosResponse = (res) => {
    // manejo ambos casos: la API puede devolver [] o { status, count, data }
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (res.data && Array.isArray(res.data)) return res.data;
    return [];
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      const equipoResp = await getEquipoById(id);
      setData(equipoResp);
      const ingreso = equipoResp?.detalles?.ingreso ?? null;
      setIngresoActual(ingreso);

      const rawPres = await getPresupuestosByEquipo(id);
      const lista = normalizePresupuestosResponse(rawPres);

      // ordernar por fecha_presupuesto (desc) — si la propiedad cambia, adaptar
      const ordenados = [...lista].sort((a, b) => {
        const A = new Date(a.fecha_presupuesto || a.fecha || 0).getTime();
        const B = new Date(b.fecha_presupuesto || b.fecha || 0).getTime();
        return B - A;
      });

      setPresupuestos(ordenados);
    } catch (err) {
      console.error("Error cargando detalle/presupuestos:", err);
      showAlert("Error cargando datos del equipo", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);


  const handleEliminarPresupuesto = async (presupuestoId) => {
    if (!presupuestoId) return;

    const confirmar = window.confirm("¿Seguro que deseas eliminar este presupuesto?");
    if (!confirmar) return;

    try {
      await deletePresupuesto(presupuestoId);
      console.log(`Presupuesto ${presupuestoId} eliminado con éxito`);

      // 🔁 Refrescar lista de presupuestos
      await refrescarPresupuestos();
    } catch (error) {
      console.error("Error al eliminar presupuesto:", error);
      alert("Ocurrió un error al eliminar el presupuesto.");
    }
  };

  // Refrescar solo presupuestos
  const refrescarPresupuestos = async () => {
    try {
      const raw = await getPresupuestosByEquipo(id);
      const lista = normalizePresupuestosResponse(raw);
      setPresupuestos(
        [...lista].sort((a, b) => new Date(b.fecha_presupuesto || b.fecha) - new Date(a.fecha_presupuesto || a.fecha))
      );
    } catch (err) {
      console.error("Error refrescando presupuestos:", err);
    }
  };

  // Manejo actualización de estado del ingreso (desde CambiarEstadoModal)
 
  const handleUpdateIngreso = async (data) => {
    try {
      await updateIngreso(data.id, {
        estado: data.estado,
        fecha_ingreso: data.fecha_ingreso,
        fecha_egreso: data.fecha_egreso,
      });
      showAlert("Estado actualizado correctamente", "success");
      await fetchAll();
    } catch (err) {
      console.error("Error actualizando ingreso:", err);
      showAlert("Error al actualizar estado", "error");
    }
  };



  // Abrir modal Presu para crear
  const handleNuevoPresupuesto = () => {

    if (!ingresoActual) return; // seguridad

    setPresupuestoSeleccionado(null);
    setIngresoSeleccionado({ id: ingresoActual.id }); // aquí está el ingreso_id correcto
    setModalAbierto(true);
  };


  // Abrir modal Presu para editar
  const handleEditarPresupuesto = (presupuesto) => {
    console.log("Editar presupuesto:", presupuesto, presupuesto.ingreso_id);
    setPresupuestoSeleccionado(presupuesto);
    setIngresoSeleccionado({ id: presupuesto.ingreso_id }); // 👈 ahora es objeto con .id
    setModalAbierto(true);
  };

  if (loading) return <p className="text-gray-400 p-6">Cargando...</p>;
  if (!data) return <p className="text-gray-400 p-6">Equipo no encontrado.</p>;

  const { equipo, cliente, detalles } = data;
  const fechaIngreso = ingresoActual?.fecha_ingreso
    ? new Date(ingresoActual.fecha_ingreso).toLocaleDateString("es-AR")
    : "Sin fecha";

  const presupuestosValidos = Array.isArray(presupuestos)
    ? presupuestos.filter(p => p && (p.presupuesto_id || p.id))
    : [];

  return (
    <div className="flex flex-col h-screen w-screen bg-neutral-900 text-white overflow-hidden relative">
      {/* alerta global */}
      {alertMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <AlertNotification message={alertMessage} type={alertType} />
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-neutral-700 flex justify-between items-center">
        <Link to="/equipos" className="text-emerald-400 hover:text-emerald-200 underline">
          ← Volver a Equipos Cargados
        </Link>
        <h2 className="text-2xl font-bold text-emerald-400">Detalle del Equipo</h2>
      </div>

      {/* Contenido */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* Info principal */}
        <div className="bg-neutral-800 p-4 rounded shadow space-y-1">
          <p className="font-semibold text-white">
            {equipo?.tipo?.toUpperCase()} - {equipo?.marca} {equipo?.modelo}
          </p>
          <p className="text-gray-400">{equipo?.problema}</p>
          <p className="text-gray-500">Ingreso: {ingresoActual?.fecha_ingreso ? new Date(ingresoActual.fecha_ingreso).toLocaleDateString("es-AR") : "Sin fecha"}</p>
          <p className="text-sm text-gray-400">
            Cliente: {cliente?.nombre} {cliente?.apellido} | {cliente?.celular}
          </p>
          <p className="text-sm text-gray-400">Estado: {ingresoActual?.estado || "Sin estado definido"}</p>
          <p className="text-sm text-gray-400">
            Fecha de egreso: {ingresoActual?.fecha_egreso ? new Date(ingresoActual.fecha_egreso).toLocaleDateString("es-AR") : "No definido"}
          </p>
        </div>

        {/* Botones header */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              if (!ingresoActual?.id) {
                showAlert("No existe ingreso activo para crear presupuesto", "error");
                return;
              }
              handleNuevoPresupuesto()
            }}
            className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded font-semibold"
          >
            + Crear Presupuesto
          </button>

          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => {
              if (!ingresoActual) {
                showAlert("No hay ingreso para modificar", "error");
                return;
              }
              setIsEstadoModalOpen(true); // 🔹 abre modal
            }}
          >
            Actualizar Ingreso
          </button>

        </div>

        {/* Lista de presupuestos */}

        <div className="bg-neutral-800 p-4 rounded shadow max-h-64 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">Historial de presupuestos</h3>

          {presupuestosValidos.length > 0 ? (
  <ul className="space-y-3">
    {presupuestosValidos.map((p) => {
      const id = p.presupuesto_id ?? p.id ?? `${p.ingreso_id}-${p.fecha_presupuesto}`;
      const fecha = new Date(p.fecha_presupuesto || p.fecha || "").toLocaleDateString("es-AR");
      const costo = p.costo_presupuesto ?? p.costo;
      const total = p.total_presupuesto ?? p.total;
      const observaciones = p.observaciones_presupuesto ?? p.observaciones;

      // 🔹 Usamos el nombre real del estado
      const estadoNombre = p.estado_presupuesto_nombre ?? p.estado ?? "Pendiente";

      // 🔹 Colores según el estado
      const estadoColor =
        estadoNombre.toLowerCase() === "entregado y cobrado"
          ? "text-green-400"
          : estadoNombre.toLowerCase() === "rechazado"
          ? "text-red-400"
          : "text-yellow-400";
         estadoNombre.toLowerCase() === "finalizado"
          ? "text-orange-400"
          : estadoNombre.toLowerCase() === "rechazado"
          ? "text-red-400"
          : "text-yellow-400";

      return (
        <li
          key={id}
          className="border-b border-neutral-700 pb-2 last:border-0 flex justify-between items-start"
        >
          <div>
            <p className="text-sm text-gray-400">Fecha: {fecha}</p>
            <p className="text-sm">Costo: ${costo}</p>
            <p className="text-sm">Total: ${total}</p>
            {observaciones && (
              <p className="text-sm text-gray-500 italic">{observaciones}</p>
            )}
            <p className={`text-sm font-medium ${estadoColor}`}>
              Estado: {estadoNombre}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleEditarPresupuesto(p)}
              className="ml-4 bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm font-medium"
            >
              Modificar
            </button>
            <button
              onClick={() => handleEliminarPresupuesto(p.presupuesto_id)}
              className="ml-4 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-medium"
            >
              Eliminar
            </button>
          </div>
        </li>
      );
    })}
  </ul>
) : (
  <p className="text-gray-500 italic">No hay presupuestos cargados.</p>
)}

        </div>

      </div>

      {/* Modal crear presupuesto */}


      {/* Modal cambio estado */}

      <CambiarEstadoModal
        isOpen={isEstadoModalOpen}
        onClose={() => setIsEstadoModalOpen(false)}
        ingresoActual={ingresoActual} // 🔹 todo el objeto
        onSubmit={handleUpdateIngreso} // 🔹 maneja la API en el padre
      />


      {/* <PresupuestoModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        ingresoSeleccionado={ingresoSeleccionado}
        presupuesto={presupuestoSeleccionado}
        onPresupuestoGuardado={fetchAll}
      /> */}

      <PresupuestoModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        ingresoSeleccionado={ingresoSeleccionado}
        presupuesto={presupuestoSeleccionado}
        esEdicion={!!presupuestoSeleccionado} // 👈 Agregar esta línea
        onPresupuestoGuardado={fetchAll}
      />
    </div>
  );
};

export default DetalleEquiposPage;

