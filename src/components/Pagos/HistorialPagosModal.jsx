
// // // src/components/Cliente/HistorialPagosModal.jsx
// import { useState, useEffect, useCallback, useMemo } from 'react';
// import Modal from 'react-modal';
// import { getPagosCliente, createPagoAbono } from "../../api/PagoApi.jsx";
// import Swal from 'sweetalert2';

// // Iconos (usaremos los mismos que en EquipoPage para consistencia)
// const IconDollar = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8h.01M12 21A9 9 0 1012 3a9 9 0 000 18z" /></svg>);
// const IconHistory = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
// const IconCheckCircle = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>);
// const IconTool = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 6V5a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2h-4a2 2 0 01-2-2zM9 12V6M3 12h.01M15 12h.01M19 12h.01M11 17v-4a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2zM9 18h.01M3 18h.01M15 18h.01M19 18h.01" /></svg>);

// // --- Helpers de Formato de Número ---
// const parseNumber = (value) => {
//     // Elimina todos los puntos y caracteres no numéricos, y luego convierte a entero.
//     return parseInt(String(value).replace(/\D/g, ''), 10) || 0;
// };

// const formatNumberWithDots = (num) => {
//     if (num === 0) return '0';
//     // Utiliza el helper existente para formatear
//     return Number(num).toLocaleString("es-AR", {
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 0,
//     });
// };

// const formatPrice = (price) =>
//     Number(price || 0).toLocaleString("es-AR", {
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 0,
//     });

// const formatDateShort = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return "N/A";
//     return date.toLocaleDateString("es-AR");
// };
// // --- Fin Helpers ---


// const HistorialPagosModal = ({ isOpen, onClose, clienteId, clienteNombre }) => {
//     const [equiposHistorial, setEquiposHistorial] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [pagoMonto, setPagoMonto] = useState(''); // Monto como string (formateado con puntos)
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     // 1. CÁLCULO DEL TOTAL CONSOLIDADO ADEUDADO
//     const consolidatedData = useMemo(() => {
//         let totalAdeudado = 0;
//         let todosPagos = [];
//         // 💡 AÑADIDO: Array clave para la distribución de pagos en handleNuevoPago
//         let presupuestosPendientes = [];

//         equiposHistorial.forEach(eq => {
//             const presupuesto = eq.presupuesto_final;
//             // Aseguramos que el ingreso_id esté disponible en el objeto principal (viene del RPC)
//             const ingresoId = eq.ingreso_id;

//             if (presupuesto && ingresoId) {
//                 // Sumar saldos pendientes (solo si son positivos)
//                 if (presupuesto.saldo_pendiente > 0) {
//                     totalAdeudado += presupuesto.saldo_pendiente;

//                     // Llenar el array con los datos que la función de pago necesita
//                     presupuestosPendientes.push({
//                         ingreso_id: ingresoId, // Clave que requiere la API
//                         presupuesto_id: presupuesto.id,
//                         saldo_pendiente: presupuesto.saldo_pendiente,
//                         fecha_ingreso: eq.fecha_ingreso,
//                     });
//                 }
//                 // Recolectar todos los pagos para el historial unificado
//                 if (presupuesto.pagos) {
//                     todosPagos.push(...presupuesto.pagos.map(p => ({
//                         ...p,
//                         equipo: `${eq.marca} ${eq.modelo}`
//                     })));
//                 }
//             }
//         });

//         // Ordenar presupuestos/ingresos pendientes por fecha de ingreso (los más antiguos primero)
//         presupuestosPendientes.sort((a, b) => new Date(a.fecha_ingreso) - new Date(b.fecha_ingreso));

//         // El historial unificado de pagos ordenado por fecha descendente
//         const historialPagosUnificado = todosPagos.sort((a, b) => new Date(b.fecha_pago) - new Date(a.fecha_pago));

//         return {
//             totalAdeudado,
//             historialPagosUnificado,
//             // 💡 AÑADIDO: Devolver el array para su uso en handleNuevoPago
//             presupuestosPendientes
//         };
//     }, [equiposHistorial]);

//     // 💡 CORREGIDO: Desestructurar el nuevo array 'presupuestosPendientes'
//     const { totalAdeudado, historialPagosUnificado, presupuestosPendientes } = consolidatedData;

//     // --- Data Fetch ---
//     const fetchHistorial = useCallback(async () => {
//         if (!clienteId) return;

//         setLoading(true);
//         try {
//             // Esta API debe devolver una lista de equipos, cada uno con su 'presupuesto_final' y sus 'pagos'
//             const data = await getPagosCliente(clienteId);
//             setEquiposHistorial(data);
//         } catch (error) {
//             console.error("Error al cargar historial de equipos y pagos:", error);
//             setEquiposHistorial([]);
//         } finally {
//             setLoading(false);
//         }
//     }, [clienteId]);

//     useEffect(() => {
//         if (isOpen && clienteId) {
//             fetchHistorial();
//         }
//     }, [isOpen, clienteId, fetchHistorial]);

//     // 2. LÓGICA DE FORMATO Y MANEJO DE INPUT
//     const handleMontoChange = (e) => {
//         const rawValue = e.target.value;
//         const number = parseNumber(rawValue);
//         // Almacenamos el valor formateado para mostrarlo en el input
//         setPagoMonto(formatNumberWithDots(number));
//     };

//     // --- Manejar nuevo pago CONSOLIDADO con DISTRIBUCIÓN POR INGRESO ---
//     const handleNuevoPago = async (e) => {
//         e.preventDefault();

//         const form = e.target;
//         // Obtener el valor numérico real sin puntos
//         const montoNumerico = parseNumber(pagoMonto);
//         const observaciones = form.observaciones.value;
//         const metodo_pago = form.metodo_pago.value;

//         if (montoNumerico === 0) {
//             Swal.fire('Error', 'El monto debe ser mayor o menor a cero.', 'warning');
//             return;
//         }

//         // Validación de no exceder saldo pendiente consolidado
//         if (montoNumerico > 0 && montoNumerico > totalAdeudado && totalAdeudado > 0) {
//             Swal.fire('Error', `El pago no puede exceder el saldo pendiente consolidado ($${formatPrice(totalAdeudado)}).`, 'warning');
//             return;
//         }

//         // 🛑 Importante: Bloquear el botón durante la ejecución de múltiples llamadas
//         setIsSubmitting(true);

//         let montoRestante = montoNumerico;
//         const pagosRealizados = [];
//         let success = true;

//         try {
//             // Recorrer los presupuestos/ingresos pendientes (ordenados por antigüedad)
//             for (const p of presupuestosPendientes) {

//                 if (montoRestante <= 0) break; // Detener si el pago total fue cubierto

//                 // Calcular el monto parcial a aplicar al saldo pendiente de este ingreso
//                 const montoAPagar = Math.min(montoRestante, p.saldo_pendiente);

//                 if (montoAPagar > 0) {
//                     // 🔑 PAYLOAD CORREGIDO: Enviamos ingreso_id
//                     const pagoData = {
//                         ingreso_id: p.ingreso_id, // ¡Ahora enviamos el ID correcto!
//                         monto: montoAPagar,
//                         observaciones,
//                         metodo_pago,
//                     };

//                     await createPagoAbono(pagoData); // Llamada a la API

//                     montoRestante -= montoAPagar;
//                     pagosRealizados.push(pagoData);
//                 }
//             }

//             // Lógica para montos negativos (ajuste/reverso): se aplica el monto total negativo al primer ingreso pendiente
//             if (montoNumerico < 0 && presupuestosPendientes.length > 0) {
//                 const primerIngreso = presupuestosPendientes[0];
//                 const pagoData = {
//                     ingreso_id: primerIngreso.ingreso_id,
//                     monto: montoNumerico,
//                     observaciones,
//                     metodo_pago,
//                 };
//                 await createPagoAbono(pagoData);
//                 pagosRealizados.push(pagoData);
//             } else if (montoNumerico < 0 && presupuestosPendientes.length === 0) {
//                 Swal.fire('Error', 'No hay saldos pendientes para aplicar un ajuste/reverso. Debe seleccionar un equipo manualmente si requiere un ajuste específico.', 'error');
//                 setIsSubmitting(false);
//                 return;
//             }

//             // Manejo de éxito
//             const message = montoNumerico > 0
//                 ? `✅ Abono de $${formatPrice(montoNumerico)} registrado en ${pagosRealizados.length} ingresos.`
//                 : `✅ Ajuste/Reverso de $${formatPrice(montoNumerico)} registrado.`;

//             Swal.fire({
//                 title: 'Éxito',
//                 text: message,
//                 icon: 'success',
//                 timer: 3000,
//                 showConfirmButton: false,
//                 customClass: {
//                     popup: "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
//                 },
//             });

//         } catch (error) {
//             // Manejo de error
//             success = false;
//             console.error("Error al registrar pago consolidado:", error);
//             Swal.fire({
//                 title: 'Error',
//                 text: "❌ Error al registrar el pago. Revisa la conexión o el backend.",
//                 icon: 'error',
//                 customClass: {
//                     popup: "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
//                 },
//             });
//         } finally {
//             if (success) {
//                 setPagoMonto('');
//                 form.observaciones.value = '';
//                 await fetchHistorial(); // Refrescar data solo si hubo éxito
//             }
//             setIsSubmitting(false);
//         }
//     };
//     // ----------------------------------------------------

//     return (
//         <Modal
//             isOpen={isOpen}
//             onRequestClose={onClose}
//             ariaHideApp={false}
//             className="fixed inset-0 flex items-center justify-center p-4 z-50"
//             overlayClassName="fixed inset-0 bg-black/70 z-40"
//         >
//             <div className="bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">

//                 {/* Membrete del Cliente */}
//                 <div className="p-5 border-b border-neutral-800 bg-neutral-800/50">
//                     <h2 className="text-xl sm:text-2xl font-bold text-white">
//                         Historial: <span className="text-purple-400">{clienteNombre}</span>
//                     </h2>
//                     <p className="text-sm text-neutral-400">{equiposHistorial.length} equipos en historial.</p>
//                     <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-white transition text-3xl leading-none">
//                         &times;
//                     </button>
//                 </div>

//                 {/* Contenido (GRID 1/3 para Registro Consolidado, 2/3 para Detalle de Equipos) */}
//                 <div className="flex-grow grid md:grid-cols-3 gap-4 p-5 overflow-hidden">

//                     {/* COLUMNA 1: REGISTRO DE PAGO CONSOLIDADO + HISTORIAL DE PAGOS */}
//                     <div className="md:col-span-1 border-r border-neutral-800 pr-4 flex flex-col overflow-y-auto space-y-4">

//                         <h3 className="text-lg font-semibold mb-2 text-white flex items-center gap-2">
//                             <IconDollar /> Registro de Abono Consolidado
//                         </h3>

//                         {/* RESUMEN CONSOLIDADO */}
//                         <div className={`p-4 rounded-xl shadow-lg border ${totalAdeudado > 0 ? 'bg-red-900/40 border-red-500/50' : 'bg-emerald-900/40 border-emerald-500/50'}`}>
//                             <p className="text-sm font-medium text-neutral-300">Total Consolidado Adeudado:</p>
//                             <p className="text-3xl font-extrabold tracking-tight">
//                                 <span className={totalAdeudado > 0 ? 'text-red-400' : 'text-emerald-400'}>
//                                     ${formatPrice(totalAdeudado)}
//                                 </span>
//                             </p>
//                             <small className="text-neutral-500 block mt-1">
//                                 Suma de saldos pendientes de todos los equipos.
//                             </small>
//                         </div>

//                         {/* 🌟 FORMULARIO NUEVO PAGO CONSOLIDADO (Ajustado) 🌟 */}
//                         <form onSubmit={handleNuevoPago} className="p-3 bg-neutral-800 border border-neutral-700 rounded-lg grid grid-cols-4 gap-3">
//                             <h4 className="col-span-4 text-sm font-semibold text-neutral-300 mb-2">Registrar Pago/Abono</h4>

//                             {/* Input Monto (Con Formato) */}
//                             <div className="col-span-2 relative">
//                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">$</span>
//                                 <input
//                                     type="text"
//                                     name="monto"
//                                     placeholder="Monto"
//                                     className="w-full pl-7 pr-3 py-2 rounded bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:border-purple-500"
//                                     required
//                                     value={pagoMonto}
//                                     onChange={handleMontoChange} // Aplicación del Formateo
//                                 />
//                             </div>

//                             {/* Select Método */}
//                             <select
//                                 name="metodo_pago"
//                                 className="col-span-2 p-2 rounded bg-neutral-900 border border-neutral-700 text-white text-sm focus:border-purple-500"
//                                 required
//                             >
//                                 <option value="Efectivo">Efectivo</option>
//                                 <option value="Transferencia">Transferencia</option>
//                                 <option value="Tarjeta">Tarjeta</option>
//                                 <option value="Mercado Pago">Mercado Pago</option>
//                             </select>

//                             {/* Observaciones */}
//                             <input
//                                 type="text"
//                                 name="observaciones"
//                                 placeholder="Observaciones (opcional)"
//                                 className="col-span-4 p-2 rounded bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:border-purple-500"
//                             />

//                             {/* Botón */}
//                             <button
//                                 type="submit"
//                                 className="col-span-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold p-2 rounded transition text-sm disabled:opacity-50"
//                                 // 💡 CORRECCIÓN 1: Agregar 'isSubmitting' a la condición 'disabled'
//                                 // 💡 CORRECCIÓN 2: Mostrar texto "Procesando"
//                                 disabled={isSubmitting || (totalAdeudado <= 0 && parseNumber(pagoMonto) > 0)}
//                             >
//                                 {isSubmitting ? 'Procesando...' : 'Registrar Abono'}
//                             </button>
//                         </form>

//                         {/* Historial de Pagos Unificado */}
//                         <div className="pt-4 border-t border-neutral-800">
//                             <h4 className="text-sm font-semibold text-neutral-400 flex items-center gap-1 mb-2">
//                                 <IconHistory /> Historial de Abonos (Todos los equipos):
//                             </h4>
//                             {historialPagosUnificado.length === 0 ? (
//                                 <p className="text-neutral-500 text-sm">No hay abonos registrados para este cliente.</p>
//                             ) : (
//                                 <ul className="divide-y divide-neutral-800">
//                                     {historialPagosUnificado.map(pago => (
//                                         <li key={pago.pago_id} className="py-2 flex justify-between items-start text-sm">
//                                             <div className="flex flex-col">
//                                                 <span className={`font-medium ${pago.monto < 0 ? 'text-red-400' : 'text-white'}`}>
//                                                     ${formatPrice(pago.monto)}
//                                                 </span>
//                                                 <span className="text-xs text-neutral-500">
//                                                     {pago.metodo_pago} ({pago.equipo || 'N/A'})
//                                                 </span>
//                                             </div>
//                                             <div className="flex flex-col items-end">
//                                                 <span className="text-xs text-neutral-400 italic max-w-[50%] overflow-hidden text-right whitespace-nowrap text-ellipsis" title={pago.observaciones}>
//                                                     {pago.observaciones}
//                                                 </span>
//                                                 <span className="text-xs text-neutral-600">{formatDateShort(pago.fecha_pago)}</span>
//                                             </div>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             )}
//                         </div>

//                     </div>

//                     {/* COLUMNA 2: DETALLE DE PRESUPUESTOS Y SALDOS POR EQUIPO */}
//                     <div className="md:col-span-2 flex flex-col space-y-4 overflow-y-auto pl-4">
//                         <h3 className="text-lg font-semibold text-neutral-300 flex items-center gap-2">
//                             <IconTool /> Detalle de Saldo por Equipo
//                         </h3>
//                         {loading ? (
//                             <p className="text-neutral-500">Cargando detalles...</p>
//                         ) : equiposHistorial.length === 0 ? (
//                             <p className="text-neutral-500 text-lg md:pt-10 text-center">No hay equipos en historial para este cliente.</p>
//                         ) : (
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                 {equiposHistorial.map(eq => {
//                                     const presupuesto = eq.presupuesto_final;
//                                     const saldoPendiente = presupuesto?.saldo_pendiente ?? 0;
//                                     const totalVenta = presupuesto?.total_venta ?? 0;
//                                     const totalAbonado = presupuesto?.total_abonado ?? 0;

//                                     return (
//                                         <div
//                                             key={eq.equipo_id}
//                                             className={`p-4 rounded-xl shadow-inner transition ${saldoPendiente > 0 ? 'bg-neutral-800/70 border border-red-800/50'
//                                                     : totalVenta > 0 ? 'bg-neutral-800/70 border border-emerald-800/50'
//                                                         : 'bg-neutral-800/50 border border-neutral-700'
//                                                 } space-y-2`}
//                                         >
//                                             <p className="font-bold text-sm text-purple-300 line-clamp-1">
//                                                 {eq.marca} {eq.modelo}
//                                             </p>

//                                             {totalVenta > 0 ? (
//                                                 <div className="space-y-1">
//                                                     <div className="flex justify-between text-xs text-neutral-400">
//                                                         <span>Venta:</span>
//                                                         <span className="font-semibold text-green-400">${formatPrice(totalVenta)}</span>
//                                                     </div>
//                                                     <div className="flex justify-between text-xs text-neutral-400">
//                                                         <span>Abonado:</span>
//                                                         <span className="font-semibold text-yellow-400">${formatPrice(totalAbonado)}</span>
//                                                     </div>
//                                                     <div className="flex justify-between text-sm font-bold pt-1 border-t border-neutral-700">
//                                                         <span>Pendiente:</span>
//                                                         <span className={saldoPendiente > 0 ? 'text-red-400' : 'text-emerald-400'}>
//                                                             {saldoPendiente > 0 ? `$${formatPrice(saldoPendiente)}` : 'Saldado'}
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                             ) : (
//                                                 <p className="text-xs text-neutral-500 italic">Sin presupuesto final.</p>
//                                             )}
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </Modal>
//     );
// };

// export default HistorialPagosModal;

// src/components/Cliente/HistorialPagosModal.jsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import Modal from 'react-modal';
import { getPagosCliente, createPagoAbono } from "../../api/PagoApi.jsx";
import Swal from 'sweetalert2';

const ESTADO_APROBADO = 2;

const IconDollar = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8h.01M12 21A9 9 0 1012 3a9 9 0 000 18z" /></svg>);
const IconHistory = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const IconTool = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 6V5a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2h-4a2 2 0 01-2-2zM9 12V6M3 12h.01M15 12h.01M19 12h.01M11 17v-4a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2zM9 18h.01M3 18h.01M15 18h.01M19 18h.01" /></svg>);

const parseNumber = (value) => {
    return parseInt(String(value).replace(/\D/g, ''), 10) || 0;
};

const formatNumberWithDots = (num) => {
    if (num === 0) return '0';
    return Number(num).toLocaleString("es-AR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
};

const formatPrice = (price) =>
    Number(price || 0).toLocaleString("es-AR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

const formatDateShort = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("es-AR");
};


const HistorialPagosModal = ({ isOpen, onClose, clienteId, clienteNombre }) => {
    const [equiposHistorial, setEquiposHistorial] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagoMonto, setPagoMonto] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // CÁLCULO DEL TOTAL CONSOLIDADO — solo presupuestos Aprobados
    const consolidatedData = useMemo(() => {
        let totalAdeudado = 0;
        let todosPagos = [];
        let presupuestosPendientes = [];

        equiposHistorial.forEach(eq => {
            const presupuesto = eq.presupuesto_final;
            const ingresoId = eq.ingreso_id;

            if (!presupuesto || !ingresoId) return;

            // ✅ Solo ingresos con al menos un presupuesto en estado 'Aprobado'
            const tieneAprobado = presupuesto.presupuestos?.some(
                p => p.estado_id === ESTADO_APROBADO
            );
            if (!tieneAprobado) return;

            if (presupuesto.saldo_pendiente > 0) {
                totalAdeudado += presupuesto.saldo_pendiente;
                presupuestosPendientes.push({
                    ingreso_id: ingresoId,
                    presupuesto_id: presupuesto.id,
                    saldo_pendiente: presupuesto.saldo_pendiente,
                    fecha_ingreso: eq.fecha_ingreso,
                });
            }

            if (presupuesto.pagos) {
                todosPagos.push(...presupuesto.pagos.map(p => ({
                    ...p,
                    equipo: `${eq.marca} ${eq.modelo}`
                })));
            }
        });

        presupuestosPendientes.sort((a, b) =>
            new Date(a.fecha_ingreso) - new Date(b.fecha_ingreso)
        );

        const historialPagosUnificado = todosPagos.sort(
            (a, b) => new Date(b.fecha_pago) - new Date(a.fecha_pago)
        );

        return { totalAdeudado, historialPagosUnificado, presupuestosPendientes };
    }, [equiposHistorial]);

    const { totalAdeudado, historialPagosUnificado, presupuestosPendientes } = consolidatedData;

    const fetchHistorial = useCallback(async () => {
        if (!clienteId) return;
        setLoading(true);
        try {
            const data = await getPagosCliente(clienteId);
            setEquiposHistorial(data);
        } catch (error) {
            console.error("Error al cargar historial de equipos y pagos:", error);
            setEquiposHistorial([]);
        } finally {
            setLoading(false);
        }
    }, [clienteId]);

    useEffect(() => {
        if (isOpen && clienteId) {
            fetchHistorial();
        }
    }, [isOpen, clienteId, fetchHistorial]);

    const handleMontoChange = (e) => {
        const rawValue = e.target.value;
        const number = parseNumber(rawValue);
        setPagoMonto(formatNumberWithDots(number));
    };

    const handleNuevoPago = async (e) => {
        e.preventDefault();

        const form = e.target;
        const montoNumerico = parseNumber(pagoMonto);
        const observaciones = form.observaciones.value;
        const metodo_pago = form.metodo_pago.value;

        if (montoNumerico === 0) {
            Swal.fire('Error', 'El monto debe ser mayor o menor a cero.', 'warning');
            return;
        }

        if (montoNumerico > 0 && montoNumerico > totalAdeudado && totalAdeudado > 0) {
            Swal.fire('Error', `El pago no puede exceder el saldo pendiente consolidado ($${formatPrice(totalAdeudado)}).`, 'warning');
            return;
        }

        setIsSubmitting(true);

        let montoRestante = montoNumerico;
        const pagosRealizados = [];
        let success = true;

        try {
            for (const p of presupuestosPendientes) {
                if (montoRestante <= 0) break;

                const montoAPagar = Math.min(montoRestante, p.saldo_pendiente);

                if (montoAPagar > 0) {
                    const pagoData = {
                        ingreso_id: p.ingreso_id,
                        monto: montoAPagar,
                        observaciones,
                        metodo_pago,
                    };
                    await createPagoAbono(pagoData);
                    montoRestante -= montoAPagar;
                    pagosRealizados.push(pagoData);
                }
            }

            if (montoNumerico < 0 && presupuestosPendientes.length > 0) {
                const primerIngreso = presupuestosPendientes[0];
                const pagoData = {
                    ingreso_id: primerIngreso.ingreso_id,
                    monto: montoNumerico,
                    observaciones,
                    metodo_pago,
                };
                await createPagoAbono(pagoData);
                pagosRealizados.push(pagoData);
            } else if (montoNumerico < 0 && presupuestosPendientes.length === 0) {
                Swal.fire('Error', 'No hay saldos pendientes para aplicar un ajuste/reverso.', 'error');
                setIsSubmitting(false);
                return;
            }

            const message = montoNumerico > 0
                ? `✅ Abono de $${formatPrice(montoNumerico)} registrado en ${pagosRealizados.length} ingresos.`
                : `✅ Ajuste/Reverso de $${formatPrice(montoNumerico)} registrado.`;

            Swal.fire({
                title: 'Éxito',
                text: message,
                icon: 'success',
                timer: 3000,
                showConfirmButton: false,
                customClass: {
                    popup: "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
                },
            });

        } catch (error) {
            success = false;
            console.error("Error al registrar pago consolidado:", error);
            Swal.fire({
                title: 'Error',
                text: "❌ Error al registrar el pago. Revisa la conexión o el backend.",
                icon: 'error',
                customClass: {
                    popup: "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
                },
            });
        } finally {
            if (success) {
                setPagoMonto('');
                form.observaciones.value = '';
                await fetchHistorial();
            }
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
            overlayClassName="fixed inset-0 bg-black/70 z-40"
        >
            <div className="bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="p-5 border-b border-neutral-800 bg-neutral-800/50 relative">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                        Historial: <span className="text-purple-400">{clienteNombre}</span>
                    </h2>
                    <p className="text-sm text-neutral-400">{equiposHistorial.length} equipos en historial.</p>
                    <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-white transition text-3xl leading-none">
                        &times;
                    </button>
                </div>

                {/* Contenido */}
                <div className="flex-grow grid md:grid-cols-3 gap-4 p-5 overflow-hidden">

                    {/* COLUMNA 1: REGISTRO DE PAGO CONSOLIDADO + HISTORIAL */}
                    <div className="md:col-span-1 border-r border-neutral-800 pr-4 flex flex-col overflow-y-auto space-y-4">

                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <IconDollar /> Registro de Abono Consolidado
                        </h3>

                        {/* Resumen consolidado */}
                        <div className={`p-4 rounded-xl shadow-lg border ${totalAdeudado > 0 ? 'bg-red-900/40 border-red-500/50' : 'bg-emerald-900/40 border-emerald-500/50'}`}>
                            <p className="text-sm font-medium text-neutral-300">Total Consolidado Adeudado:</p>
                            <p className="text-3xl font-extrabold tracking-tight">
                                <span className={totalAdeudado > 0 ? 'text-red-400' : 'text-emerald-400'}>
                                    ${formatPrice(totalAdeudado)}
                                </span>
                            </p>
                            <small className="text-neutral-500 block mt-1">
                                Suma de saldos pendientes de presupuestos aprobados.
                            </small>
                        </div>

                        {/* Formulario nuevo pago */}
                        <form onSubmit={handleNuevoPago} className="p-3 bg-neutral-800 border border-neutral-700 rounded-lg grid grid-cols-4 gap-3">
                            <h4 className="col-span-4 text-sm font-semibold text-neutral-300 mb-2">Registrar Pago/Abono</h4>

                            <div className="col-span-2 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">$</span>
                                <input
                                    type="text"
                                    name="monto"
                                    placeholder="Monto"
                                    className="w-full pl-7 pr-3 py-2 rounded bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:border-purple-500"
                                    required
                                    value={pagoMonto}
                                    onChange={handleMontoChange}
                                />
                            </div>

                            <select
                                name="metodo_pago"
                                className="col-span-2 p-2 rounded bg-neutral-900 border border-neutral-700 text-white text-sm focus:border-purple-500"
                                required
                            >
                                <option value="Efectivo">Efectivo</option>
                                <option value="Transferencia">Transferencia</option>
                                <option value="Tarjeta">Tarjeta</option>
                                <option value="Mercado Pago">Mercado Pago</option>
                            </select>

                            <input
                                type="text"
                                name="observaciones"
                                placeholder="Observaciones (opcional)"
                                className="col-span-4 p-2 rounded bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:border-purple-500"
                            />

                            <button
                                type="submit"
                                className="col-span-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold p-2 rounded transition text-sm disabled:opacity-50"
                                disabled={isSubmitting || (totalAdeudado <= 0 && parseNumber(pagoMonto) > 0)}
                            >
                                {isSubmitting ? 'Procesando...' : 'Registrar Abono'}
                            </button>
                        </form>

                        {/* Historial de pagos unificado */}
                        <div className="pt-4 border-t border-neutral-800">
                            <h4 className="text-sm font-semibold text-neutral-400 flex items-center gap-1 mb-2">
                                <IconHistory /> Historial de Abonos (Todos los equipos):
                            </h4>
                            {historialPagosUnificado.length === 0 ? (
                                <p className="text-neutral-500 text-sm">No hay abonos registrados para este cliente.</p>
                            ) : (
                                <ul className="divide-y divide-neutral-800">
                                    {historialPagosUnificado.map(pago => (
                                        <li key={pago.pago_id} className="py-2 flex justify-between items-start text-sm">
                                            <div className="flex flex-col">
                                                <span className={`font-medium ${pago.monto < 0 ? 'text-red-400' : 'text-white'}`}>
                                                    ${formatPrice(pago.monto)}
                                                </span>
                                                <span className="text-xs text-neutral-500">
                                                    {pago.metodo_pago} ({pago.equipo || 'N/A'})
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs text-neutral-400 italic max-w-[50%] overflow-hidden text-right whitespace-nowrap text-ellipsis" title={pago.observaciones}>
                                                    {pago.observaciones}
                                                </span>
                                                <span className="text-xs text-neutral-600">{formatDateShort(pago.fecha_pago)}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* COLUMNA 2: DETALLE POR EQUIPO */}
                    <div className="md:col-span-2 flex flex-col space-y-4 overflow-y-auto pl-4">
                        <h3 className="text-lg font-semibold text-neutral-300 flex items-center gap-2">
                            <IconTool /> Detalle de Saldo por Equipo
                        </h3>
                        {loading ? (
                            <p className="text-neutral-500">Cargando detalles...</p>
                        ) : equiposHistorial.length === 0 ? (
                            <p className="text-neutral-500 text-lg md:pt-10 text-center">No hay equipos en historial para este cliente.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {equiposHistorial.map(eq => {
                                    const presupuesto = eq.presupuesto_final;

                                    // ✅ Solo mostrar si tiene presupuesto Aprobado
                                    const tieneAprobado = presupuesto?.presupuestos?.some(
                                        p => p.estado_id === ESTADO_APROBADO
                                    );

                                    const saldoPendiente = presupuesto?.saldo_pendiente ?? 0;
                                    const totalVenta = presupuesto?.total_venta ?? 0;
                                    const totalAbonado = presupuesto?.total_abonado ?? 0;
                                    const costoTotal = presupuesto?.costo_total ?? 0;

                                    return (
                                        <div
                                            key={eq.equipo_id}
                                            className={`p-4 rounded-xl shadow-inner transition ${
                                                !tieneAprobado
                                                    ? 'bg-neutral-800/30 border border-neutral-700/50 opacity-50'
                                                    : saldoPendiente > 0
                                                        ? 'bg-neutral-800/70 border border-red-800/50'
                                                        : totalVenta > 0
                                                            ? 'bg-neutral-800/70 border border-emerald-800/50'
                                                            : 'bg-neutral-800/50 border border-neutral-700'
                                            } space-y-2`}
                                        >
                                            <p className="font-bold text-sm text-purple-300 line-clamp-1">
                                                {eq.marca} {eq.modelo}
                                            </p>

                                            {tieneAprobado && totalVenta > 0 ? (
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-xs text-neutral-400">
                                                        <span>Costo repuestos:</span>
                                                        <span className="font-semibold text-neutral-300">
                                                            ${formatPrice(costoTotal)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-xs text-neutral-400">
                                                        <span>Total (c/ MO):</span>
                                                        <span className="font-semibold text-green-400">
                                                            ${formatPrice(totalVenta)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-xs text-neutral-400">
                                                        <span>Abonado:</span>
                                                        <span className="font-semibold text-yellow-400">
                                                            ${formatPrice(totalAbonado)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-sm font-bold pt-1 border-t border-neutral-700">
                                                        <span>Pendiente:</span>
                                                        <span className={saldoPendiente > 0 ? 'text-red-400' : 'text-emerald-400'}>
                                                            {saldoPendiente > 0 ? `$${formatPrice(saldoPendiente)}` : 'Saldado ✓'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-neutral-500 italic">
                                                    {!tieneAprobado ? 'Sin presupuesto aprobado.' : 'Sin presupuesto final.'}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default HistorialPagosModal;