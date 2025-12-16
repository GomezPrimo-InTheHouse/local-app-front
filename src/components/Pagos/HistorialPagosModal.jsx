// // src/components/Cliente/HistorialPagosModal.jsx
// import { useState, useEffect, useCallback } from 'react';
// import Modal from 'react-modal';
// import { getPagosCliente, createPagoAbono } from "../../api/PagoApi.jsx"; 

// // Iconos (usaremos los mismos que en EquipoPage para consistencia)
// const IconDollar = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8h.01M12 21A9 9 0 1012 3a9 9 0 000 18z" /></svg> );
// const IconHistory = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> );
// const IconCheckCircle = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> );
// const IconTools = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg> );

// // --- Helpers ---
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


// const HistorialPagosModal = ({ isOpen, onClose, clienteId, clienteNombre }) => {
//     const [equiposHistorial, setEquiposHistorial] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
//     const [pagoMonto, setPagoMonto] = useState('');

//     // --- Data Fetch ---
//     const fetchHistorial = useCallback(async () => {
//         if (!clienteId) return;

//         setLoading(true);
//         try {
//             const data = await getPagosCliente(clienteId); 
//             setEquiposHistorial(data);

//             // Intentar mantener la selección o seleccionar el primero si no hay selección
//             const currentSelectionId = equipoSeleccionado?.equipo_id;
//             const newSelection = data.find(eq => eq.equipo_id === currentSelectionId) || 
//                                  data.find(eq => eq.presupuesto_final?.saldo_pendiente > 0) || // Priorizar pendiente
//                                  data[0] || null;
            
//             setEquipoSeleccionado(newSelection);
            
//         } catch (error) {
//             console.error("Error al cargar historial de equipos y pagos:", error);
//             setEquiposHistorial([]);
//             setEquipoSeleccionado(null);
//         } finally {
//             setLoading(false);
//         }
//     }, [clienteId, equipoSeleccionado?.equipo_id]); // Dependencia clave para refrescar

//     useEffect(() => {
//         if (isOpen && clienteId) {
//             fetchHistorial();
//         } 
//     }, [isOpen, clienteId, fetchHistorial]);
    
//     // Obtiene el presupuesto y saldos del equipo seleccionado
//     const presupuesto = equipoSeleccionado?.presupuesto_final;
//     const saldoPendiente = presupuesto?.saldo_pendiente ?? 0;
//     const totalVenta = presupuesto?.total_venta ?? 0;
//     const totalAbonado = presupuesto?.total_abonado ?? 0;
//     const pagos = presupuesto?.pagos || [];
//     const cuentaSaldada = saldoPendiente <= 0 && totalVenta > 0;
//     const presupuestoId = presupuesto?.id;

//     // --- Manejar nuevo pago ---
//     const handleNuevoPago = async (e) => {
//         e.preventDefault();
//         const form = e.target;
//         const monto = parseFloat(form.monto.value);
//         const observaciones = form.observaciones.value;
//         const metodo_pago = form.metodo_pago.value;

//         if (!presupuestoId || isNaN(monto) || monto === 0 || totalVenta === 0) {
//             alert("Error: No hay presupuesto activo o monto inválido.");
//             return;
//         }
        
//         // Verificar que si es un pago positivo, no exceda el saldo
//         if (monto > 0 && monto > saldoPendiente) {
//             alert(`Monto inválido. El pago no puede exceder el saldo pendiente ($${formatPrice(saldoPendiente)}).`);
//             return;
//         }

//         try {
//             const nuevoPago = {
//                 presupuesto_id: presupuestoId,
//                 monto,
//                 observaciones,
//                 metodo_pago,
//             };
            
//             await createPagoAbono(nuevoPago); 
//             await fetchHistorial(); // Refrescar data
            
//             // Limpiar formulario
//             setPagoMonto('');
//             form.observaciones.value = '';
            
//             const message = monto > 0 
//                 ? `✅ Abono de $${formatPrice(monto)} registrado correctamente.` 
//                 : `✅ Ajuste/Reverso de $${formatPrice(monto)} registrado correctamente.`;
            
//             // Usar SweetAlert2 para la notificación
//              Swal.fire({
//                 title: 'Éxito',
//                 text: message,
//                 icon: 'success',
//                 timer: 3000,
//                 showConfirmButton: false,
//                 customClass: {
//                     popup: "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
//                     title: "text-xl font-bold",
//                     htmlContainer: "text-gray-300",
//                 },
//             });

//         } catch (error) {
//             console.error("Error al registrar pago:", error);
//             Swal.fire({
//                 title: 'Error',
//                 text: "❌ Error al registrar el pago. Revisa la conexión o el backend.",
//                 icon: 'error',
//                 customClass: {
//                     popup: "bg-neutral-800 text-white border border-neutral-700 rounded-lg shadow-xl",
//                     title: "text-xl font-bold",
//                     htmlContainer: "text-gray-300",
//                 },
//             });
//         }
//     };

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

//                 {/* Contenido (GRID 1/3 para equipos, 2/3 para pagos) */}
//                 <div className="flex-grow grid md:grid-cols-3 gap-4 p-5 overflow-hidden">
                    
//                     {/* COLUMNA 1: LISTA DE EQUIPOS (Historial) */}
//                     <div className="md:col-span-1 border-r border-neutral-800 pr-4 flex flex-col overflow-y-auto">
//                         <h3 className="text-lg font-semibold mb-3 text-neutral-300 flex items-center gap-2">
//                              <IconHistory /> Equipos del Cliente
//                         </h3>
//                         {loading ? (
//                             <p className="text-neutral-500">Cargando historial...</p>
//                         ) : (
//                             <div className="space-y-3">
//                                 {equiposHistorial.map(eq => (
//                                     <div
//                                         key={eq.equipo_id}
//                                         onClick={() => setEquipoSeleccionado(eq)}
//                                         className={`p-3 rounded-lg cursor-pointer transition ${
//                                             equipoSeleccionado?.equipo_id === eq.equipo_id 
//                                                 ? 'bg-purple-800/40 border border-purple-600' 
//                                                 : 'bg-neutral-800/70 border border-transparent hover:bg-neutral-700/70'
//                                         }`}
//                                     >
//                                         <p className="font-semibold text-white text-sm line-clamp-1">{eq.marca} {eq.modelo}</p>
//                                         <div className="flex justify-between items-center">
//                                             <p className="text-xs text-neutral-400">Ingreso: {formatDateShort(eq.fecha_ingreso)}</p>
//                                             <span 
//                                                 className={`text-xs font-bold px-2 py-0.5 rounded ${
//                                                     eq.presupuesto_final?.saldo_pendiente <= 0 && eq.presupuesto_final?.total_venta > 0 
//                                                         ? 'bg-emerald-600/30 text-emerald-300' 
//                                                         : eq.presupuesto_final?.total_venta > 0 
//                                                         ? 'bg-red-600/30 text-red-300'
//                                                         : 'bg-neutral-600/30 text-neutral-400'
//                                                 }`}
//                                             >
//                                                 {eq.presupuesto_final?.total_venta > 0 
//                                                     ? `$${formatPrice(eq.presupuesto_final.saldo_pendiente)} Pendiente`
//                                                     : 'Sin Presupuesto'
//                                                 }
//                                             </span>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     {/* COLUMNA 2: DETALLE DE PAGOS Y ABONO */}
//                     <div className="md:col-span-2 flex flex-col space-y-4">
//                         {equipoSeleccionado ? (
//                             <>
//                                 <h3 className="text-xl font-bold text-purple-300">
//                                     Detalle de Pagos para: {equipoSeleccionado.marca} {equipoSeleccionado.modelo}
//                                 </h3>
                                
//                                 {/* Resumen de Saldos */}
//                                 <div className="grid grid-cols-3 gap-4 p-3 bg-neutral-800 rounded-lg text-center shadow-inner">
//                                     <div>
//                                         <p className="text-xs text-neutral-400">Total Venta</p>
//                                         <p className="text-base font-bold text-green-400">${formatPrice(totalVenta)}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-xs text-neutral-400">Total Abonado</p>
//                                         <p className="text-base font-bold text-yellow-400">${formatPrice(totalAbonado)}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-xs text-neutral-400">Saldo Pendiente</p>
//                                         <p className={`text-base font-bold ${saldoPendiente > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
//                                             {saldoPendiente > 0 ? `$${formatPrice(saldoPendiente)}` : <span className="flex items-center justify-center gap-1"><IconCheckCircle /> Saldado</span>}
//                                         </p>
//                                     </div>
//                                 </div>
                                
//                                 {/* Formulario Nuevo Pago */}
//                                 <form onSubmit={handleNuevoPago} className="p-3 bg-neutral-800 border border-neutral-700 rounded-lg grid grid-cols-4 gap-3">
//                                     {totalVenta === 0 ? (
//                                         <p className="col-span-4 text-center text-neutral-400 font-semibold">
//                                             <IconTools /> No hay presupuesto final para este equipo, no se pueden registrar pagos.
//                                         </p>
//                                     ) : cuentaSaldada ? (
//                                         <p className="col-span-4 text-center text-emerald-400 font-semibold flex items-center justify-center gap-2">
//                                             <IconCheckCircle /> ¡La cuenta de este equipo está saldada!
//                                         </p>
//                                     ) : (
//                                         <>
//                                             <input
//                                                 type="number"
//                                                 name="monto"
//                                                 step="1"
//                                                 placeholder={`Monto (Máx: ${formatPrice(saldoPendiente)})`}
//                                                 className="col-span-2 p-2 rounded bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 text-sm"
//                                                 required
//                                                 value={pagoMonto}
//                                                 onChange={(e) => setPagoMonto(e.target.value)}
//                                             />
//                                             <select
//                                                 name="metodo_pago"
//                                                 className="p-2 rounded bg-neutral-900 border border-neutral-700 text-white text-sm"
//                                                 required
//                                             >
//                                                 <option value="Efectivo">Efectivo</option>
//                                                 <option value="Transferencia">Transferencia</option>
//                                                 <option value="Tarjeta">Tarjeta</option>
//                                                 <option value="Mercado Pago">Mercado Pago</option>
//                                             </select>
//                                             <button
//                                                 type="submit"
//                                                 className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold p-2 rounded transition text-sm disabled:opacity-50"
//                                             >
//                                                 Registrar Abono
//                                             </button>
//                                             <input
//                                                 type="text"
//                                                 name="observaciones"
//                                                 placeholder="Observaciones (opcional)"
//                                                 className="col-span-4 p-2 rounded bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 text-sm"
//                                             />
//                                         </>
//                                     )}
//                                 </form>

//                                 {/* Lista de Pagos */}
//                                 <div className="flex-grow overflow-y-auto space-y-2 pr-2">
//                                     <h4 className="text-sm font-semibold text-neutral-400 flex items-center gap-1">
//                                         <IconDollar /> Detalle de Abonos:
//                                     </h4>
//                                     {pagos.length === 0 ? (
//                                         <p className="text-neutral-500 text-sm">No hay abonos registrados.</p>
//                                     ) : (
//                                         <ul className="divide-y divide-neutral-800">
//                                             {pagos.sort((a, b) => new Date(b.fecha_pago) - new Date(a.fecha_pago)).map(pago => (
//                                                 <li key={pago.pago_id} className="py-2 flex justify-between items-center text-sm">
//                                                     <div className="flex flex-col">
//                                                         <span className={`font-medium ${pago.monto < 0 ? 'text-red-400' : 'text-white'}`}>
//                                                             ${formatPrice(pago.monto)}
//                                                         </span>
//                                                         <span className="text-xs text-neutral-500">{pago.metodo_pago} - {formatDateShort(pago.fecha_pago)}</span>
//                                                     </div>
//                                                     <span className="text-xs text-neutral-400 italic max-w-[50%] overflow-hidden text-right whitespace-nowrap text-ellipsis" title={pago.observaciones}>{pago.observaciones}</span>
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     )}
//                                 </div>

//                             </>
//                         ) : (
//                             <p className="text-neutral-500 text-lg md:pt-10 text-center">Selecciona un equipo para ver su historial de pagos.</p>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </Modal>
//     );
// };

// export default HistorialPagosModal;
import React, { useState, useEffect, useMemo } from 'react';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
// Importaciones de API (ejemplo)
// import { getEquiposCliente, registrarPago } from '../../api/ClienteApi'; 
// import { getPresupuestosByEquipoId } from '../../api/PresupuestoApi'; 

// Asegúrate de enlazar Modal a tu app principal (p. ej., index.js)
// Modal.setAppElement('#root'); 

// --- Helpers para formateo ---

// Función para remover el formato (puntos) y convertir a número entero
const parseNumber = (value) => {
    // Elimina todos los puntos y comas, y luego convierte a entero.
    return parseInt(String(value).replace(/\D/g, ''), 10) || 0;
};

// Función para formatear el número con separadores de miles (ej: 300.000)
const formatNumberWithDots = (num) => {
    if (num === 0) return '0';
    return num.toLocaleString('es-AR', { maximumFractionDigits: 0 });
};

// ---------------------------

const HistorialPagosModal = ({ isOpen, onClose, clienteId, clienteNombre }) => {
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [montoPago, setMontoPago] = useState(''); // Usaremos string para el formateo
    const [descripcionPago, setDescripcionPago] = useState('');
    // ... otros estados si los tienes (ej: historial de pagos)

    // 1. CÁLCULO DEL TOTAL CONSOLIDADO
    const totalConsolidadoAPagar = useMemo(() => {
        if (!equipos || equipos.length === 0) return 0;

        let total = 0;
        
        equipos.forEach(equipo => {
            // Asumo que 'presupuestos' está anidado dentro de cada equipo
            equipo.presupuestos?.forEach(presupuesto => {
                // Sumamos solo si el presupuesto está 'emitido' o 'aprobado' (ajusta la lógica si es necesario)
                // Usaremos todos los presupuestos para el ejemplo:
                total += presupuesto.total_total || 0; 
            });
        });

        // Aquí deberías restar los pagos ya realizados por el cliente
        // Si tienes un campo 'total_pagado' en el objeto cliente/equipo:
        // total -= (pagosRealizados || 0); 

        return total;
    }, [equipos]);

    // Función de ejemplo para cargar los datos (adaptar a tu API)
    const fetchDatosCliente = async () => {
        setLoading(true);
        try {
            // Ejemplo: obtener equipos con sus presupuestos anidados para el clienteId
            // const data = await getEquiposCliente(clienteId); 
            // setEquipos(data.equipos || []);

            // ** SIMULACIÓN DE DATOS (REEMPLAZAR CON TU API) **
            const mockEquipos = [
                { id: 1, marca: 'HP', presupuestos: [{ id: 101, descripcion: 'Cambio de pantalla', total_total: 100000 }] },
                { id: 2, marca: 'Dell', presupuestos: [{ id: 102, descripcion: 'Formateo y RAM', total_total: 200000 }] },
            ];
            setEquipos(mockEquipos);
            // ** FIN SIMULACIÓN **

        } catch (error) {
            console.error("Error al cargar datos del cliente:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && clienteId) {
            fetchDatosCliente();
        }
    }, [isOpen, clienteId]);


    // 2. LÓGICA DE FORMATO DE INPUT (MANEJO DEL ESTADO)
    const handleMontoChange = (e) => {
        const rawValue = e.target.value;
        const number = parseNumber(rawValue);
        
        // Almacenamos el valor formateado para mostrarlo en el input
        setMontoPago(formatNumberWithDots(number)); 
    };

    const handlePagoSubmit = async () => {
        const montoNumerico = parseNumber(montoPago);

        if (montoNumerico <= 0) {
            Swal.fire('Error', 'El monto a pagar debe ser mayor a cero.', 'warning');
            return;
        }

        // Aquí implementarías la llamada a tu API para registrar el pago
        console.log({
            cliente_id: clienteId,
            monto: montoNumerico,
            descripcion: descripcionPago,
            // Podrías pasar el totalConsolidadoAPagar para validación backend
        });

        Swal.fire('Éxito', `Pago de $${formatNumberWithDots(montoNumerico)} registrado.`, 'success');
        
        // Limpiar y cerrar (y forzar un refresh en el componente padre si es necesario)
        setMontoPago('');
        setDescripcionPago('');
        onClose(); // Asumo que onClose también fuerza un fetch en EquipoPage.jsx
    };
    // ----------------------------------------------------


    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl p-6 md:p-8"
            overlayClassName="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            contentLabel={`Historial de Pagos de ${clienteNombre}`}
        >
            <div className="text-white w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-neutral-700 pb-3 mb-4">
                    <h2 className="text-2xl font-bold text-purple-400">Historial de Pagos de {clienteNombre}</h2>
                    <button onClick={onClose} className="text-neutral-400 hover:text-white text-3xl leading-none">
                        &times;
                    </button>
                </div>

                {/* Contenido del Modal: Lado Izquierdo (Pagos) y Lado Derecho (Presupuestos) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* ➡️ LADO IZQUIERDO: REGISTRO DE PAGO CONSOLIDADOS */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white border-b border-neutral-800 pb-2">
                            Registro de Pago
                        </h3>

                        {/* 🌟 TOTAL CONSOLIDADO A PAGAR 🌟 */}
                        <div className="bg-neutral-800 p-4 rounded-xl border border-red-500/50">
                            <p className="text-lg font-medium text-neutral-300">Total Adeudado (Consolidado):</p>
                            <p className="text-3xl font-extrabold text-red-400 tracking-tight">
                                ${formatNumberWithDots(totalConsolidadoAPagar)}
                            </p>
                            <small className="text-neutral-500 block mt-1">
                                Suma de todos los presupuestos emitidos.
                            </small>
                        </div>
                        
                        {/* INPUT PARA REGISTRAR EL MONTO */}
                        <div>
                            <label htmlFor="montoPago" className="block text-sm font-medium text-neutral-300 mb-1">
                                Monto a Registrar:
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">$</span>
                                <input
                                    id="montoPago"
                                    type="text"
                                    value={montoPago}
                                    onChange={handleMontoChange} // Usa la función de formateo
                                    placeholder="Ej: 150.000"
                                    className="w-full pl-7 pr-3 py-2 border border-neutral-700 rounded-lg bg-neutral-900 text-white focus:ring-purple-500 focus:border-purple-500 text-lg font-mono"
                                />
                            </div>
                        </div>

                        {/* DESCRIPCIÓN */}
                        <div>
                            <label htmlFor="descripcionPago" className="block text-sm font-medium text-neutral-300 mb-1">
                                Descripción / Método de Pago (Opcional):
                            </label>
                            <input
                                id="descripcionPago"
                                type="text"
                                value={descripcionPago}
                                onChange={(e) => setDescripcionPago(e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-700 rounded-lg bg-neutral-900 text-white focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>

                        {/* BOTÓN DE REGISTRO */}
                        <button
                            onClick={handlePagoSubmit}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors"
                        >
                            Registrar Pago
                        </button>

                        {/* Aquí iría el Historial de Pagos ya registrados (lista) */}
                        <h4 className="text-lg font-semibold text-neutral-400 pt-4 border-t border-neutral-800">
                            Pagos Registrados (Placeholder)
                        </h4>
                        <p className='text-sm text-neutral-500'>[Aquí se listaría el historial de pagos de este cliente.]</p>
                    </div>

                    {/* ⬅️ LADO DERECHO: DETALLE DE PRESUPUESTOS POR EQUIPO */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white border-b border-neutral-800 pb-2">
                            Detalle de Presupuestos ({equipos.length} Equipos)
                        </h3>

                        {loading ? (
                            <p className="text-neutral-400">Cargando detalles...</p>
                        ) : (
                            equipos.map(equipo => (
                                <div key={equipo.id} className="bg-neutral-800/70 p-4 rounded-xl space-y-3">
                                    <p className="font-bold text-lg text-purple-300">{equipo.marca || 'Equipo Desconocido'}</p>
                                    
                                    {equipo.presupuestos && equipo.presupuestos.length > 0 ? (
                                        equipo.presupuestos.map(p => (
                                            <div key={p.id} className="flex justify-between text-sm border-t border-neutral-700 pt-2">
                                                <span className="text-neutral-400 truncate pr-2" title={p.descripcion}>
                                                    {p.descripcion || 'Presupuesto sin descripción'}
                                                </span>
                                                <span className="font-semibold text-yellow-300 flex-shrink-0">
                                                    ${formatNumberWithDots(p.total_total)}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-neutral-500">No hay presupuestos emitidos para este equipo.</p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default HistorialPagosModal;