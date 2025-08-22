

// src/pages/DetalleEquiposPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEquipoById } from "../api/EquiposApi.jsx";
import { getPresupuestosByEquipo, deletePresupuesto } from "../api/PresupuestoApi.jsx";
import { getEstados } from "../api/EstadoApi.jsx";
import PresupuestoModal from "../components/Presupuesto/PresupuestoModal.jsx";

import CambiarEstadoModal from "../components/Ingreso/CambiarEstadoModal.jsx";
import AlertNotification from "../components/Alerta/AlertNotification.jsx";



const DetalleEquiposPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null); // resultado de getEquipoById
  const [loading, setLoading] = useState(true);

  const [ingresoActual, setIngresoActual] = useState(null); // ingreso activo (detalles.ingreso)
  const [presupuestos, setPresupuestos] = useState([]); // lista de presupuestos por equipo
  const [estados, setEstados] = useState([]); // lista de estados
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

  // asigno la data a estados 

  useEffect(() => {
    (async () => {
      const data = await getEstados();
      setEstados(data);
    })();
  }, []);
  // 🔹 Buscar el nombre del estado del ingreso
  const estadoIngresoNombre =
    estados.find((e) => e.id === ingresoActual?.estado)?.nombre ||
    "Sin estado definido";

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

  // const handleUpdateIngreso = async (data) => {
  //   try {
  //     await updateIngreso(data.id, {
  //       estado: data.estado,
  //       fecha_ingreso: data.fecha_ingreso,
  //       fecha_egreso: data.fecha_egreso,
  //     });
  //     showAlert("Estado actualizado correctamente", "success");
  //     await fetchAll();
  //   } catch (err) {
  //     console.error("Error actualizando ingreso:", err);
  //     showAlert("Error al actualizar estado", "error");
  //   }
  // };



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



  const presupuestosValidos = Array.isArray(presupuestos)
    ? presupuestos.filter(p => p && (p.presupuesto_id || p.id))
    : [];

  // 🔹 CALCULOS TOTALES
  const totalCostos = presupuestosValidos.reduce(
    (acc, p) => acc + (p.costo_presupuesto ?? p.costo ?? 0),
    0
  );

  const totalIngresos = presupuestosValidos.reduce(
    (acc, p) => acc + (p.total_presupuesto ?? p.total ?? 0),
    0
  );

  const totalFinal = totalIngresos - totalCostos;

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
          {/* ESTADO */}
          <p className="text-sm text-gray-400">
            Estado actual:{" "}
            <span className="font-medium text-emerald-400">
              {estadoIngresoNombre}
            </span>
          </p>
          {/* EGRESO */}
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
        {/* 🔹 Card de total */}
   
       

        {/* Lista de presupuestos */}


        <div className="bg-neutral-800 p-4 rounded shadow  overflow-y-auto">
           <div className="mt-4 w-full max-w-md mx-auto">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-4 md:p-5 rounded-xl shadow-md flex flex-col items-center md:items-start text-white">
            
            {/* Título: se oculta en sm */}
            <h3 className="text-md md:text-lg font-semibold mb-1 md:mb-2 hidden sm:block">
              Balance Total
            </h3>

            {/* Total siempre visible */}
            <p className="text-xl md:text-2xl font-bold tracking-wide">
              ${totalFinal.toLocaleString("es-AR")}
            </p>

            {/* Desglose de Ingresos/Costos: solo en md+ */}
            <div className="mt-1 md:mt-3 flex flex-col md:flex-row gap-1 md:gap-2 text-xs md:text-sm text-emerald-100 hidden md:flex">
              <span>Ingresos: ${totalIngresos.toLocaleString("es-AR")}</span>
              <span> | </span>
              <span>Costos: ${totalCostos.toLocaleString("es-AR")}</span>
            </div>

          </div>
        </div>
          <h3 className="text-lg font-semibold mb-2">Historial de presupuestos</h3>
          

          {presupuestosValidos.length > 0 ? (
            // 🔹 Mapeamos presupuestos válidos


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




      {/* Modal cambio estado */}

      {/* <CambiarEstadoModal
        isOpen={isEstadoModalOpen}
        onClose={() => setIsEstadoModalOpen(false)}
        ingresoActual={ingresoActual} // 🔹 todo el objeto
        onSubmit={handleUpdateIngreso} // 🔹 maneja la API en el padre
      /> */}
      <CambiarEstadoModal
        isOpen={isEstadoModalOpen}
        onClose={() => setIsEstadoModalOpen(false)}
        ingresoActual={ingresoActual}
        onSuccess={(m) => showAlert(m, "success")}
        onError={(m) => showAlert(m, "error")}
        onUpdated={fetchAll}
      />

      {/* Modal crear presupuesto */}

      <PresupuestoModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        ingresoSeleccionado={ingresoSeleccionado}
        presupuesto={presupuestoSeleccionado}
        esEdicion={!!presupuestoSeleccionado}
        onPresupuestoGuardado={fetchAll}
      />
    </div>
  );
};

export default DetalleEquiposPage;

