// // src/components/OrdenTrabajo/NuevaOrdenTrabajoModal.jsx
// import { useEffect, useState, useCallback } from "react";
// import { getClientes } from "../../api/ClienteApi.jsx";
// import { getEquiposByClienteId, createEquipo } from "../../api/EquiposApi.jsx";
// import { createOrdenTrabajo } from "../../api/OrdenTrabajoApi.jsx";
// import { getEstadoByAmbito } from "../../api/EstadoApi.jsx";
// import PatronInput from "../Equipo/PatronInput.jsx";

// const TIPOS_EQUIPO = ["celular", "notebook", "pc", "consola", "tablet", "impresora", "joystick", "reloj", "otro"];

// const PASO = { CLIENTE: 1, EQUIPO: 2, ORDEN: 3 };

// const NuevaOrdenTrabajoModal = ({ isOpen, onClose, onSuccess }) => {
//   // ── paso actual ──
//   const [paso, setPaso] = useState(PASO.CLIENTE);

//   // ── paso 1: cliente ──
//   const [clientes, setClientes] = useState([]);
//   const [searchCliente, setSearchCliente] = useState("");
//   const [filteredClientes, setFilteredClientes] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

//   // ── paso 2: equipo ──
//   const [equiposCliente, setEquiposCliente] = useState([]);
//   const [loadingEquipos, setLoadingEquipos] = useState(false);
//   const [equipoSeleccionado, setEquipoSeleccionado] = useState(null); // equipo existente
//   const [modoNuevoEquipo, setModoNuevoEquipo] = useState(false);
//   const [formEquipo, setFormEquipo] = useState({
//     tipo: "", marca: "", modelo: "", imei: "",
//   });

//   // ── paso 3: orden de trabajo ──
//   const [estadosOT, setEstadosOT] = useState([]);
//   const [loadingEstados, setLoadingEstados] = useState(false);
//   const [formOT, setFormOT] = useState({
//     falla_reportada: "",
//     password: "",
//     patron: "",
//     diagnostico: "",
//     fecha_ingreso: new Date().toISOString().split("T")[0],
//     estado_id: "",
//   });

//   // ── estado general ──
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // ── reset completo al cerrar ──
//   const resetAll = useCallback(() => {
//     setPaso(PASO.CLIENTE);
//     setSearchCliente("");
//     setFilteredClientes([]);
//     setClienteSeleccionado(null);
//     setEquiposCliente([]);
//     setEquipoSeleccionado(null);
//     setModoNuevoEquipo(false);
//     setFormEquipo({ tipo: "", marca: "", modelo: "", imei: "" });
//     setFormOT({
//       falla_reportada: "", password: "", patron: "",
//       diagnostico: "", fecha_ingreso: new Date().toISOString().split("T")[0], estado_id: "",
//     });
//     setError("");
//   }, []);

//   const handleClose = () => { resetAll(); onClose(); };

//   // ── cargar clientes al abrir ──
//   useEffect(() => {
//     if (!isOpen) return;
//     resetAll();
//     (async () => {
//       try {
//         const lista = await getClientes();
//         setClientes(lista || []);
//         setFilteredClientes(lista || []);
//       } catch (e) {
//         console.error("Error cargando clientes:", e);
//       }
//     })();
//   }, [isOpen, resetAll]);

//   // ── cargar estados OT al abrir ──
//   useEffect(() => {
//     if (!isOpen) return;
//     (async () => {
//       try {
//         setLoadingEstados(true);
//         const lista = await getEstadoByAmbito("equipo");
//         setEstadosOT(lista || []);
//         if (lista?.length) {
//           const ingresado = lista.find(e => e.nombre?.toLowerCase().includes("ingresado"));
//           setFormOT(prev => ({ ...prev, estado_id: String(ingresado?.id || lista[0].id) }));
//         }
//       } catch (e) {
//         console.error("Error cargando estados:", e);
//       } finally {
//         setLoadingEstados(false);
//       }
//     })();
//   }, [isOpen]);

//   // ── filtro clientes ──
//   useEffect(() => {
//     if (!searchCliente.trim()) { setFilteredClientes(clientes); return; }
//     const q = searchCliente.toLowerCase();
//     setFilteredClientes(
//       clientes.filter(c =>
//         c.nombre?.toLowerCase().includes(q) ||
//         c.apellido?.toLowerCase().includes(q) ||
//         c.celular?.includes(searchCliente) ||
//         c.dni?.includes(searchCliente)
//       )
//     );
//   }, [searchCliente, clientes]);

//   // ── seleccionar cliente → cargar sus equipos ──
//   const handleSelectCliente = async (cliente) => {
//   setClienteSeleccionado(cliente);
//   setSearchCliente(`${cliente.nombre} ${cliente.apellido}`);
//   setShowDropdown(false);
//   setLoadingEquipos(true);
//   setEquiposCliente([]);
//   setEquipoSeleccionado(null);
//   setModoNuevoEquipo(false);

//   try {
//     const data = await getEquiposByClienteId(cliente.id);
//     const lista = Array.isArray(data) ? data : [];
//     setEquiposCliente(lista);
//     if (lista.length === 0) setModoNuevoEquipo(true);
//   } catch (e) {
//     // El backend devuelve 404 cuando no hay equipos — no es un error real
//     console.log("Cliente sin equipos registrados");
//     setEquiposCliente([]);
//     setModoNuevoEquipo(true);
//   } finally {
//     // SIEMPRE liberar el loading, sin importar qué pasó
//     setLoadingEquipos(false);
//   }
// };

//   // ── paso 1 → 2 ──
//   const irPaso2 = () => {
//     if (!clienteSeleccionado) { setError("Seleccioná un cliente."); return; }
//     setError("");
//     setPaso(PASO.EQUIPO);
//   };

//   // ── paso 2 → 3 ──
//   const irPaso3 = () => {
//     if (!equipoSeleccionado && !modoNuevoEquipo) {
//       setError("Seleccioná un equipo existente o registrá uno nuevo."); return;
//     }
//     if (modoNuevoEquipo) {
//       if (!formEquipo.tipo || !formEquipo.marca || !formEquipo.modelo) {
//         setError("Completá tipo, marca y modelo del equipo."); return;
//       }
//     }
//     setError("");
//     setPaso(PASO.ORDEN);
//   };

//   // ── submit final ──
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formOT.falla_reportada.trim()) { setError("La falla reportada es obligatoria."); return; }
//     if (!formOT.estado_id) { setError("Seleccioná un estado."); return; }
//     setError("");
//     setLoading(true);

//     try {
//       let equipoId = equipoSeleccionado?.id;

//       // Si es equipo nuevo, lo creamos primero
//       if (modoNuevoEquipo) {
//         const nuevoEquipo = await createEquipo({
//           tipo: formEquipo.tipo,
//           marca: formEquipo.marca,
//           modelo: formEquipo.modelo,
//           imei: formEquipo.imei || null,
//           cliente_id: clienteSeleccionado.id,
//           estado_id: Number(formOT.estado_id),
//         });
//         equipoId = nuevoEquipo?.id ?? nuevoEquipo?.data?.id;
//         if (!equipoId) throw new Error("No se pudo obtener el ID del equipo creado.");
//       }

//       // Crear la orden de trabajo
//       await createOrdenTrabajo({
//         equipo_id: equipoId,
//         falla_reportada: formOT.falla_reportada.trim(),
//         password: formOT.password || null,
//         patron: formOT.patron || null,
//         diagnostico: formOT.diagnostico || null,
//         fecha_ingreso: formOT.fecha_ingreso,
//         estado_id: Number(formOT.estado_id),
//       });

//       onSuccess?.("✅ Orden de trabajo creada correctamente");
//       handleClose();
//     } catch (err) {
//       console.error("Error creando OT:", err);
//       setError(err?.response?.data?.error || err.message || "Error al crear la orden de trabajo.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   const iconoTipo = (tipo) => {
//     const map = { celular: "📱", notebook: "💻", pc: "🖥️", consola: "🎮", tablet: "📟", impresora: "🖨️", joystick: "🕹️", reloj: "⌚", otro: "🔧" };
//     return map[tipo?.toLowerCase()] || "🔧";
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
//       <div className="bg-neutral-800 rounded-xl w-full max-w-lg shadow-2xl text-neutral-100 max-h-[90vh] overflow-y-auto">

//         {/* Header */}
//         <div className="sticky top-0 bg-neutral-800 border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
//           <div>
//             <h2 className="text-lg font-semibold">Nueva Orden de Trabajo</h2>
//             <div className="flex items-center gap-1 mt-1">
//               {[PASO.CLIENTE, PASO.EQUIPO, PASO.ORDEN].map((p) => (
//                 <div key={p} className="flex items-center gap-1">
//                   <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${paso === p ? "bg-emerald-500 text-white" :
//                       paso > p ? "bg-emerald-800 text-emerald-300" :
//                         "bg-neutral-700 text-neutral-400"
//                     }`}>{p}</div>
//                   {p < PASO.ORDEN && <div className={`w-8 h-0.5 ${paso > p ? "bg-emerald-700" : "bg-neutral-700"}`} />}
//                 </div>
//               ))}
//               <span className="ml-2 text-xs text-neutral-400">
//                 {paso === PASO.CLIENTE && "Cliente"}
//                 {paso === PASO.EQUIPO && "Equipo"}
//                 {paso === PASO.ORDEN && "Orden de trabajo"}
//               </span>
//             </div>
//           </div>
//           <button onClick={handleClose} className="text-neutral-400 hover:text-white text-xl leading-none">✕</button>
//         </div>

//         <div className="px-6 py-5 space-y-5">

//           {/* ── PASO 1: CLIENTE ── */}
//           {paso === PASO.CLIENTE && (
//             <div className="space-y-4">
//               <p className="text-sm text-neutral-300">Buscá el cliente por nombre, apellido, celular o DNI.</p>
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Buscar cliente..."
//                   value={searchCliente}
//                   onChange={e => { setSearchCliente(e.target.value); setClienteSeleccionado(null); }}
//                   onFocus={() => setShowDropdown(true)}
//                   onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
//                   className="w-full bg-neutral-700 text-white p-3 rounded-lg text-sm"
//                   autoFocus
//                 />
//                 {showDropdown && filteredClientes.length > 0 && (
//                   <ul className="absolute z-50 bg-neutral-700 w-full mt-1 rounded-lg max-h-52 overflow-y-auto shadow-xl border border-white/10">
//                     {filteredClientes.map(c => (
//                       <li key={c.id} onMouseDown={() => handleSelectCliente(c)}
//                         className="px-4 py-2.5 hover:bg-neutral-600 cursor-pointer text-sm">
//                         <span className="font-medium">{c.nombre} {c.apellido}</span>
//                         <span className="text-neutral-400 text-xs ml-2">{c.celular} {c.dni ? `· DNI ${c.dni}` : ""}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>

//               {clienteSeleccionado && (
//                 <div className="bg-emerald-900/30 border border-emerald-700/40 rounded-lg p-3 text-sm">
//                   <p className="font-medium text-emerald-300">✓ {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}</p>
//                   <p className="text-neutral-400 text-xs mt-0.5">{clienteSeleccionado.celular} {clienteSeleccionado.email ? `· ${clienteSeleccionado.email}` : ""}</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ── PASO 2: EQUIPO ── */}
//           {paso === PASO.EQUIPO && (
//             <div className="space-y-4">
//               <div className="bg-neutral-700/40 rounded-lg px-3 py-2 text-sm">
//                 <span className="text-neutral-400">Cliente:</span>{" "}
//                 <span className="font-medium">{clienteSeleccionado.nombre} {clienteSeleccionado.apellido}</span>
//               </div>

//               {loadingEquipos ? (
//                 <p className="text-sm text-neutral-400">Cargando equipos del cliente...</p>
//               ) : equiposCliente.length > 0 && !modoNuevoEquipo ? (
//                 <div className="space-y-2">
//                   <p className="text-sm text-neutral-300 font-medium">Equipos registrados de este cliente:</p>
//                   <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
//                     {equiposCliente.map(eq => (
//                       <button key={eq.id} type="button"
//                         onClick={() => { setEquipoSeleccionado(eq); setModoNuevoEquipo(false); }}
//                         className={`w-full text-left rounded-lg border p-3 transition-colors text-sm ${equipoSeleccionado?.id === eq.id
//                             ? "border-emerald-500 bg-emerald-900/30"
//                             : "border-white/10 bg-neutral-700/40 hover:bg-neutral-700"
//                           }`}>
//                         <div className="flex items-center gap-2">
//                           <span className="text-lg">{iconoTipo(eq.tipo)}</span>
//                           <div>
//                             <p className="font-medium">{eq.marca} {eq.modelo}</p>
//                             <p className="text-xs text-neutral-400 capitalize">{eq.tipo}{eq.imei ? ` · IMEI: ${eq.imei}` : ""}</p>
//                           </div>
//                           {equipoSeleccionado?.id === eq.id && (
//                             <span className="ml-auto text-emerald-400 text-xs font-semibold">✓ Seleccionado</span>
//                           )}
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                   <button type="button" onClick={() => { setEquipoSeleccionado(null); setModoNuevoEquipo(true); }}
//                     className="w-full border border-dashed border-white/20 rounded-lg p-3 text-sm text-neutral-400 hover:text-white hover:border-white/40 transition-colors text-center">
//                     + Registrar un equipo nuevo para este cliente
//                   </button>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {!modoNuevoEquipo && (
//                     <p className="text-sm text-neutral-400">Este cliente no tiene equipos registrados. Completá los datos del equipo nuevo.</p>
//                   )}
//                   {modoNuevoEquipo && equiposCliente.length > 0 && (
//                     <button type="button" onClick={() => { setModoNuevoEquipo(false); setFormEquipo({ tipo: "", marca: "", modelo: "", imei: "" }); }}
//                       className="text-xs text-emerald-400 hover:underline">
//                       ← Volver a los equipos del cliente
//                     </button>
//                   )}

//                   {/* Form equipo nuevo */}
//                   <select value={formEquipo.tipo}
//                     onChange={e => setFormEquipo(prev => ({ ...prev, tipo: e.target.value }))}
//                     className="w-full bg-neutral-700 text-white p-2.5 rounded-lg text-sm">
//                     <option value="">Tipo de equipo *</option>
//                     {TIPOS_EQUIPO.map(t => <option key={t} value={t}>{iconoTipo(t)} {t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
//                   </select>

//                   <input type="text" placeholder="Marca *"
//                     value={formEquipo.marca}
//                     onChange={e => setFormEquipo(prev => ({ ...prev, marca: e.target.value }))}
//                     className="w-full bg-neutral-700 text-white p-2.5 rounded-lg text-sm" />

//                   <input type="text" placeholder="Modelo *"
//                     value={formEquipo.modelo}
//                     onChange={e => setFormEquipo(prev => ({ ...prev, modelo: e.target.value }))}
//                     className="w-full bg-neutral-700 text-white p-2.5 rounded-lg text-sm" />

//                   {formEquipo.tipo === "celular" && (
//                     <div>
//                       <input type="text" placeholder="IMEI (opcional, 15 dígitos)"
//                         value={formEquipo.imei}
//                         onChange={e => {
//                           if (/^\d*$/.test(e.target.value) && e.target.value.length <= 15)
//                             setFormEquipo(prev => ({ ...prev, imei: e.target.value }));
//                         }}
//                         className="w-full bg-neutral-700 text-white p-2.5 rounded-lg text-sm" />
//                       {formEquipo.imei && formEquipo.imei.length > 0 && formEquipo.imei.length < 14 && (
//                         <p className="text-yellow-400 text-xs mt-1">El IMEI suele tener 14–15 dígitos.</p>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ── PASO 3: ORDEN DE TRABAJO ── */}
//           {paso === PASO.ORDEN && (
//             <form onSubmit={handleSubmit} className="space-y-4" id="form-ot">
//               {/* Resumen */}
//               <div className="bg-neutral-700/40 rounded-lg px-3 py-2.5 text-sm space-y-0.5">
//                 <p><span className="text-neutral-400">Cliente:</span> <span className="font-medium">{clienteSeleccionado.nombre} {clienteSeleccionado.apellido}</span></p>
//                 <p><span className="text-neutral-400">Equipo:</span> <span className="font-medium">
//                   {modoNuevoEquipo
//                     ? `${iconoTipo(formEquipo.tipo)} ${formEquipo.marca} ${formEquipo.modelo} (nuevo)`
//                     : `${iconoTipo(equipoSeleccionado?.tipo)} ${equipoSeleccionado?.marca} ${equipoSeleccionado?.modelo}`}
//                 </span></p>
//               </div>

//               {/* Falla reportada */}
//               <div>
//                 <label className="block text-sm text-neutral-300 mb-1">Falla reportada *</label>
//                 <textarea rows={3} placeholder="Describí el problema que reporta el cliente..."
//                   value={formOT.falla_reportada}
//                   onChange={e => setFormOT(prev => ({ ...prev, falla_reportada: e.target.value }))}
//                   className="w-full bg-neutral-700 text-white p-2.5 rounded-lg text-sm resize-none"
//                   required />
//               </div>

//               {/* Fecha ingreso */}
//               <div>
//                 <label className="block text-sm text-neutral-300 mb-1">Fecha de ingreso</label>
//                 <input type="date"
//                   value={formOT.fecha_ingreso}
//                   onChange={e => setFormOT(prev => ({ ...prev, fecha_ingreso: e.target.value }))}
//                   className="w-full bg-neutral-700 text-white p-2.5 rounded-lg text-sm" />
//               </div>

//               {/* Estado */}
//               <div>
//                 <label className="block text-sm text-neutral-300 mb-1">Estado *</label>
//                 <select value={formOT.estado_id}
//                   onChange={e => setFormOT(prev => ({ ...prev, estado_id: e.target.value }))}
//                   className="w-full bg-neutral-700 text-white p-2.5 rounded-lg text-sm" required>
//                   <option value="">{loadingEstados ? "Cargando..." : "Seleccioná un estado"}</option>
//                   {estadosOT.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
//                 </select>
//               </div>

//               {/* Password */}
//               <div>
//                 <label className="block text-sm text-neutral-300 mb-1">Contraseña / PIN</label>
//                 <input type="text" placeholder="Contraseña o PIN del equipo (opcional)"
//                   value={formOT.password}
//                   onChange={e => setFormOT(prev => ({ ...prev, password: e.target.value }))}
//                   className="w-full bg-neutral-700 text-white p-2.5 rounded-lg text-sm" />
//               </div>

//               {/* Patrón — solo si el equipo es celular */}
//               {(equipoSeleccionado?.tipo === "celular" || formEquipo.tipo === "celular") && (
//                 <div>
//                   <label className="block text-sm text-neutral-300 mb-1">Patrón de desbloqueo</label>
//                   <PatronInput
//                     value={formOT.patron}
//                     onChange={nuevoPatron => setFormOT(prev => ({ ...prev, patron: nuevoPatron }))}
//                   />
//                 </div>
//               )}

//               {/* Diagnóstico inicial (opcional) */}
//               <div>
//                 <label className="block text-sm text-neutral-300 mb-1">Diagnóstico inicial <span className="text-neutral-500">(opcional)</span></label>
//                 <textarea rows={2} placeholder="Primera impresión técnica..."
//                   value={formOT.diagnostico}
//                   onChange={e => setFormOT(prev => ({ ...prev, diagnostico: e.target.value }))}
//                   className="w-full bg-neutral-700 text-white p-2.5 rounded-lg text-sm resize-none" />
//               </div>
//             </form>
//           )}

//           {/* Error */}
//           {error && (
//             <div className="bg-red-900/30 border border-red-700/40 rounded-lg px-3 py-2 text-sm text-red-300">
//               {error}
//             </div>
//           )}
//         </div>

//         {/* Footer con botones de navegación */}
//         <div className="sticky bottom-0 bg-neutral-800 border-t border-white/10 px-6 py-4 flex justify-between gap-3">
//           <div>
//             {paso > PASO.CLIENTE && (
//               <button type="button"
//                 onClick={() => { setError(""); setPaso(p => p - 1); }}
//                 className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm">
//                 ← Atrás
//               </button>
//             )}
//           </div>
//           <div className="flex gap-2">
//             <button type="button" onClick={handleClose}
//               className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm">
//               Cancelar
//             </button>

//             {paso === PASO.CLIENTE && (
//               <button type="button" onClick={irPaso2} disabled={!clienteSeleccionado}
//                 className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm font-semibold">
//                 Siguiente →
//               </button>
//             )}
//             {paso === PASO.EQUIPO && (
//               <button type="button" onClick={irPaso3}
//                 disabled={!equipoSeleccionado && !modoNuevoEquipo && !formEquipo.tipo}
//                 className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm font-semibold">
//                 Siguiente →
//               </button>
//             )}
//             {paso === PASO.ORDEN && (
//               <button type="submit" form="form-ot" disabled={loading}
//                 className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded-lg text-sm font-semibold">
//                 {loading ? "Creando..." : "✓ Crear orden de trabajo"}
//               </button>
//             )}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default NuevaOrdenTrabajoModal;


// src/components/OrdenTrabajo/NuevaOrdenTrabajoModal.jsx
import { useEffect, useState, useCallback } from "react";
import { getClientes } from "../../api/ClienteApi";
import { getEquiposByClienteId, createEquipo } from "../../api/EquiposApi.jsx";
import { createOrdenTrabajo } from "../../api/OrdenTrabajoApi.js";
import { getEstadoByAmbito } from "../../api/EstadoApi.jsx";
import PatronInput from "../Equipo/PatronInput.jsx";

const TIPOS_EQUIPO = [
  "celular","notebook","pc","consola",
  "tablet","impresora","joystick","reloj","otro",
];
const ICONO_TIPO = {
  celular:"📱", notebook:"💻", pc:"🖥️", consola:"🎮",
  tablet:"📟", impresora:"🖨️", joystick:"🕹️", reloj:"⌚", otro:"🔧",
};
const getIcono = (tipo) => ICONO_TIPO[tipo?.toLowerCase()] ?? "🔧";

const PASO = { CLIENTE: 1, EQUIPO: 2, ORDEN: 3 };

const NuevaOrdenTrabajoModal = ({
  isOpen,
  onClose,
  onSuccess,
  equipoPreseleccionado = null, // { id, marca, modelo, tipo, cliente_id, cliente_nombre, cliente_apellido }
}) => {
  const [paso, setPaso] = useState(PASO.CLIENTE);

  // Paso 1
  const [clientes, setClientes]                   = useState([]);
  const [searchCliente, setSearchCliente]         = useState("");
  const [filteredClientes, setFilteredClientes]   = useState([]);
  const [showDropdown, setShowDropdown]           = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // Paso 2
  const [equiposCliente, setEquiposCliente]       = useState([]);
  const [loadingEquipos, setLoadingEquipos]       = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [modoNuevoEquipo, setModoNuevoEquipo]     = useState(false);
  const [formEquipo, setFormEquipo]               = useState({
    tipo: "", marca: "", modelo: "", imei: "",
  });

  // Paso 3
  const [estadosOT, setEstadosOT]                 = useState([]);
  const [loadingEstados, setLoadingEstados]       = useState(false);
  const [formOT, setFormOT]                       = useState({
    falla_reportada: "",
    password: "",
    patron: "",
    diagnostico: "",
    fecha_ingreso: new Date().toISOString().split("T")[0],
    estado_id: "",
  });

  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  // ── reset completo ──
  const resetAll = useCallback(() => {
    setPaso(PASO.CLIENTE);
    setSearchCliente("");
    setFilteredClientes([]);
    setClienteSeleccionado(null);
    setEquiposCliente([]);
    setEquipoSeleccionado(null);
    setModoNuevoEquipo(false);
    setFormEquipo({ tipo: "", marca: "", modelo: "", imei: "" });
    setFormOT({
      falla_reportada: "", password: "", patron: "",
      diagnostico: "", fecha_ingreso: new Date().toISOString().split("T")[0], estado_id: "",
    });
    setError("");
  }, []);

  const handleClose = () => { resetAll(); onClose(); };

  // ── Cargar clientes al abrir ──
  useEffect(() => {
    if (!isOpen) return;

    // Si viene con equipo preseleccionado → saltar directo al paso 3
    if (equipoPreseleccionado) {
      const clienteNombre = `${equipoPreseleccionado.cliente_nombre || ""} ${equipoPreseleccionado.cliente_apellido || ""}`.trim();
      setClienteSeleccionado({
        id:       equipoPreseleccionado.cliente_id,
        nombre:   equipoPreseleccionado.cliente_nombre || "",
        apellido: equipoPreseleccionado.cliente_apellido || "",
      });
      setSearchCliente(clienteNombre);
      setEquipoSeleccionado(equipoPreseleccionado);
      setModoNuevoEquipo(false);
      setPaso(PASO.ORDEN);
      return;
    }

    // Flujo normal: empezar desde paso 1
    resetAll();
    (async () => {
      try {
        const lista = await getClientes();
        setClientes(lista || []);
        setFilteredClientes(lista || []);
      } catch (e) { console.error("Error cargando clientes:", e); }
    })();
  }, [isOpen, equipoPreseleccionado, resetAll]);

  // ── Cargar estados OT al abrir ──
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        setLoadingEstados(true);
        const lista = await getEstadoByAmbito("equipo");
        setEstadosOT(lista || []);
        if (lista?.length) {
          const ingresado = lista.find(e =>
            e.nombre?.toLowerCase().includes("ingresado") ||
            e.nombre?.toLowerCase().includes("reingresado")
          );
          setFormOT(prev => ({
            ...prev,
            estado_id: String(ingresado?.id || lista[0].id),
          }));
        }
      } catch (e) { console.error("Error cargando estados:", e); }
      finally { setLoadingEstados(false); }
    })();
  }, [isOpen]);

  // ── Filtro clientes ──
  useEffect(() => {
    if (!searchCliente.trim()) { setFilteredClientes(clientes); return; }
    const q = searchCliente.toLowerCase();
    setFilteredClientes(
      clientes.filter(c =>
        c.nombre?.toLowerCase().includes(q) ||
        c.apellido?.toLowerCase().includes(q) ||
        c.celular?.includes(searchCliente) ||
        c.dni?.includes(searchCliente)
      )
    );
  }, [searchCliente, clientes]);

  // ── Seleccionar cliente → cargar sus equipos ──
  const handleSelectCliente = async (cliente) => {
    setClienteSeleccionado(cliente);
    setSearchCliente(`${cliente.nombre} ${cliente.apellido}`);
    setShowDropdown(false);
    setLoadingEquipos(true);
    setEquiposCliente([]);
    setEquipoSeleccionado(null);
    setModoNuevoEquipo(false);
    try {
      const data = await getEquiposByClienteId(cliente.id);
      const lista = Array.isArray(data) ? data : [];
      setEquiposCliente(lista);
      if (lista.length === 0) setModoNuevoEquipo(true);
    } catch {
      setEquiposCliente([]);
      setModoNuevoEquipo(true);
    } finally {
      setLoadingEquipos(false);
    }
  };

  // ── Navegación entre pasos ──
  const irPaso2 = () => {
    if (!clienteSeleccionado) { setError("Seleccioná un cliente."); return; }
    setError(""); setPaso(PASO.EQUIPO);
  };

  const irPaso3 = () => {
    if (!equipoSeleccionado && !modoNuevoEquipo) {
      setError("Seleccioná un equipo existente o registrá uno nuevo."); return;
    }
    if (modoNuevoEquipo && (!formEquipo.tipo || !formEquipo.marca || !formEquipo.modelo)) {
      setError("Completá tipo, marca y modelo del equipo."); return;
    }
    setError(""); setPaso(PASO.ORDEN);
  };

  // ── Submit final ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formOT.falla_reportada.trim()) { setError("La falla reportada es obligatoria."); return; }
    if (!formOT.estado_id)              { setError("Seleccioná un estado."); return; }
    setError(""); setLoading(true);

    try {
      let equipoId = equipoSeleccionado?.id;

      if (modoNuevoEquipo) {
        const nuevoEquipo = await createEquipo({
          tipo:       formEquipo.tipo,
          marca:      formEquipo.marca,
          modelo:     formEquipo.modelo,
          imei:       formEquipo.imei || null,
          cliente_id: clienteSeleccionado.id,
          estado_id:  Number(formOT.estado_id),
        });
        equipoId = nuevoEquipo?.data?.id ?? nuevoEquipo?.id;
        if (!equipoId) throw new Error("No se pudo obtener el ID del equipo creado.");
      }

      await createOrdenTrabajo({
        equipo_id:       equipoId,
        falla_reportada: formOT.falla_reportada.trim(),
        password:        formOT.password   || null,
        patron:          formOT.patron     || null,
        diagnostico:     formOT.diagnostico || null,
        fecha_ingreso:   formOT.fecha_ingreso,
        estado_id:       Number(formOT.estado_id),
      });

      onSuccess?.("✅ Orden de trabajo creada correctamente");
      handleClose();
    } catch (err) {
      console.error("Error creando OT:", err);
      setError(err?.response?.data?.error || err.message || "Error al crear la orden de trabajo.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-800 rounded-xl w-full max-w-lg shadow-2xl text-neutral-100 max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="sticky top-0 bg-neutral-800 border-b border-white/10 px-6 py-4 flex items-center justify-between z-10 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold">Nueva Orden de Trabajo</h2>
            <div className="flex items-center gap-1 mt-1">
              {[PASO.CLIENTE, PASO.EQUIPO, PASO.ORDEN].map(p => (
                <div key={p} className="flex items-center gap-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    paso === p ? "bg-emerald-500 text-white" :
                    paso > p   ? "bg-emerald-800 text-emerald-300" :
                                 "bg-neutral-700 text-neutral-400"
                  }`}>{p}</div>
                  {p < PASO.ORDEN && (
                    <div className={`w-8 h-0.5 ${paso > p ? "bg-emerald-700" : "bg-neutral-700"}`} />
                  )}
                </div>
              ))}
              <span className="ml-2 text-xs text-neutral-400">
                {paso === PASO.CLIENTE && "Cliente"}
                {paso === PASO.EQUIPO  && "Equipo"}
                {paso === PASO.ORDEN   && "Orden de trabajo"}
              </span>
            </div>
          </div>
          <button onClick={handleClose} className="text-neutral-400 hover:text-white text-xl">✕</button>
        </div>

        {/* Contenido */}
        <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">

          {/* ── PASO 1: CLIENTE ── */}
          {paso === PASO.CLIENTE && (
            <div className="space-y-4">
              <p className="text-sm text-neutral-300">Buscá el cliente por nombre, apellido, celular o DNI.</p>
              <div className="relative">
                <input type="text" placeholder="Buscar cliente..." value={searchCliente}
                  onChange={e => { setSearchCliente(e.target.value); setClienteSeleccionado(null); }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  className="w-full bg-neutral-700 text-white p-3 rounded-lg text-sm" autoFocus />
                {showDropdown && filteredClientes.length > 0 && (
                  <ul className="absolute z-50 bg-neutral-700 border border-white/10 w-full mt-1 rounded-lg max-h-52 overflow-y-auto shadow-xl">
                    {filteredClientes.map(c => (
                      <li key={c.id} onMouseDown={() => handleSelectCliente(c)}
                        className="px-4 py-2.5 hover:bg-neutral-600 cursor-pointer text-sm">
                        <span className="font-medium">{c.nombre} {c.apellido}</span>
                        <span className="text-neutral-400 text-xs ml-2">{c.celular}{c.dni ? ` · DNI ${c.dni}` : ""}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {clienteSeleccionado && (
                <div className="bg-emerald-900/30 border border-emerald-700/40 rounded-lg p-3 text-sm">
                  <p className="font-medium text-emerald-300">✓ {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}</p>
                  <p className="text-neutral-400 text-xs mt-0.5">{clienteSeleccionado.celular}</p>
                </div>
              )}
            </div>
          )}

          {/* ── PASO 2: EQUIPO ── */}
          {paso === PASO.EQUIPO && (
            <div className="space-y-3">
              <div className="bg-neutral-700/40 rounded-lg px-3 py-2 text-sm">
                <span className="text-neutral-400">Cliente:</span>{" "}
                <span className="font-medium">{clienteSeleccionado?.nombre} {clienteSeleccionado?.apellido}</span>
              </div>

              {loadingEquipos ? (
                <p className="text-sm text-neutral-400">Cargando equipos del cliente...</p>
              ) : equiposCliente.length > 0 && !modoNuevoEquipo ? (
                <div className="space-y-2">
                  <p className="text-sm text-neutral-300 font-medium">Equipos registrados:</p>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {equiposCliente.map(eq => (
                      <button key={eq.id} type="button"
                        onClick={() => { setEquipoSeleccionado(eq); setModoNuevoEquipo(false); }}
                        className={`w-full text-left rounded-lg border p-3 transition-colors text-sm ${
                          equipoSeleccionado?.id === eq.id
                            ? "border-emerald-500 bg-emerald-900/30"
                            : "border-white/10 bg-neutral-700/40 hover:bg-neutral-700"
                        }`}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getIcono(eq.tipo)}</span>
                          <div>
                            <p className="font-medium">{eq.marca} {eq.modelo}</p>
                            <p className="text-xs text-neutral-400 capitalize">
                              {eq.tipo}{eq.imei ? ` · IMEI: ${eq.imei}` : ""}
                            </p>
                          </div>
                          {equipoSeleccionado?.id === eq.id && (
                            <span className="ml-auto text-emerald-400 text-xs font-semibold">✓</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  <button type="button"
                    onClick={() => { setEquipoSeleccionado(null); setModoNuevoEquipo(true); }}
                    className="w-full border border-dashed border-white/20 rounded-lg p-3 text-sm text-neutral-400 hover:text-white hover:border-white/40 transition-colors text-center">
                    + Registrar un equipo nuevo para este cliente
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {modoNuevoEquipo && equiposCliente.length > 0 && (
                    <button type="button"
                      onClick={() => { setModoNuevoEquipo(false); setFormEquipo({ tipo: "", marca: "", modelo: "", imei: "" }); }}
                      className="text-xs text-emerald-400 hover:underline">
                      ← Volver a los equipos del cliente
                    </button>
                  )}
                  {!modoNuevoEquipo && (
                    <p className="text-sm text-neutral-400">Este cliente no tiene equipos registrados.</p>
                  )}
                  <select value={formEquipo.tipo}
                    onChange={e => setFormEquipo(prev => ({ ...prev, tipo: e.target.value }))}
                    className="w-full bg-neutral-700 text-white p-2.5 rounded-lg text-sm">
                    <option value="">Tipo de equipo *</option>
                    {TIPOS_EQUIPO.map(t => (
                      <option key={t} value={t}>{getIcono(t)} {t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                  <input type="text" placeholder="Marca *" value={formEquipo.marca}
                    onChange={e => setFormEquipo(prev => ({ ...prev, marca: e.target.value }))}
                    className="w-full bg-neutral-700 text-white p-2.5 rounded-lg text-sm" />
                  <input type="text" placeholder="Modelo *" value={formEquipo.modelo}
                    onChange={e => setFormEquipo(prev => ({ ...prev, modelo: e.target.value }))}
                    className="w-full bg-neutral-700 text-white p-2.5 rounded-lg text-sm" />
                  {formEquipo.tipo === "celular" && (
                    <div>
                      <input type="text" placeholder="IMEI (opcional)" value={formEquipo.imei}
                        onChange={e => {
                          if (/^\d*$/.test(e.target.value) && e.target.value.length <= 15)
                            setFormEquipo(prev => ({ ...prev, imei: e.target.value }));
                        }}
                        className="w-full bg-neutral-700 text-white p-2.5 rounded-lg text-sm" />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── PASO 3: ORDEN DE TRABAJO ── */}
          {paso === PASO.ORDEN && (
            <form onSubmit={handleSubmit} className="space-y-4" id="form-ot">
              {/* Resumen */}
              <div className="bg-neutral-700/40 rounded-lg px-3 py-2.5 text-sm space-y-0.5">
                <p>
                  <span className="text-neutral-400">Cliente:</span>{" "}
                  <span className="font-medium">{clienteSeleccionado?.nombre} {clienteSeleccionado?.apellido}</span>
                </p>
                <p>
                  <span className="text-neutral-400">Equipo:</span>{" "}
                  <span className="font-medium">
                    {modoNuevoEquipo
                      ? `${getIcono(formEquipo.tipo)} ${formEquipo.marca} ${formEquipo.modelo} (nuevo)`
                      : `${getIcono(equipoSeleccionado?.tipo)} ${equipoSeleccionado?.marca} ${equipoSeleccionado?.modelo}`}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-sm text-neutral-300 mb-1">Falla reportada *</label>
                <textarea rows={3} placeholder="Describí el problema que reporta el cliente..."
                  value={formOT.falla_reportada}
                  onChange={e => setFormOT(prev => ({ ...prev, falla_reportada: e.target.value }))}
                  className="w-full bg-neutral-700 text-white p-2.5 rounded-lg text-sm resize-none" required />
              </div>

              <div>
                <label className="block text-sm text-neutral-300 mb-1">Fecha de ingreso</label>
                <input type="date" value={formOT.fecha_ingreso}
                  onChange={e => setFormOT(prev => ({ ...prev, fecha_ingreso: e.target.value }))}
                  className="w-full bg-neutral-700 text-white p-2.5 rounded-lg text-sm" />
              </div>

              <div>
                <label className="block text-sm text-neutral-300 mb-1">Estado *</label>
                <select value={formOT.estado_id}
                  onChange={e => setFormOT(prev => ({ ...prev, estado_id: e.target.value }))}
                  className="w-full bg-neutral-700 text-white p-2.5 rounded-lg text-sm" required>
                  <option value="">{loadingEstados ? "Cargando..." : "Seleccioná un estado"}</option>
                  {estadosOT.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm text-neutral-300 mb-1">Contraseña / PIN <span className="text-neutral-500">(opcional)</span></label>
                <input type="text" placeholder="Contraseña o PIN del equipo"
                  value={formOT.password}
                  onChange={e => setFormOT(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full bg-neutral-700 text-white p-2.5 rounded-lg text-sm" />
              </div>

              {(equipoSeleccionado?.tipo === "celular" || formEquipo.tipo === "celular") && (
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">Patrón de desbloqueo</label>
                  <PatronInput
                    value={formOT.patron}
                    onChange={nuevoPatron => setFormOT(prev => ({ ...prev, patron: nuevoPatron }))}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-neutral-300 mb-1">Diagnóstico inicial <span className="text-neutral-500">(opcional)</span></label>
                <textarea rows={2} placeholder="Primera impresión técnica..."
                  value={formOT.diagnostico}
                  onChange={e => setFormOT(prev => ({ ...prev, diagnostico: e.target.value }))}
                  className="w-full bg-neutral-700 text-white p-2.5 rounded-lg text-sm resize-none" />
              </div>
            </form>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-900/30 border border-red-700/40 rounded-lg px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-neutral-800 border-t border-white/10 px-6 py-4 flex justify-between gap-3 flex-shrink-0">
          <div>
            {paso > PASO.CLIENTE && !equipoPreseleccionado && (
              <button type="button"
                onClick={() => { setError(""); setPaso(p => p - 1); }}
                className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm">
                ← Atrás
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={handleClose}
              className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm">
              Cancelar
            </button>
            {paso === PASO.CLIENTE && (
              <button type="button" onClick={irPaso2} disabled={!clienteSeleccionado}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm font-semibold">
                Siguiente →
              </button>
            )}
            {paso === PASO.EQUIPO && (
              <button type="button" onClick={irPaso3}
                disabled={!equipoSeleccionado && !modoNuevoEquipo}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm font-semibold">
                Siguiente →
              </button>
            )}
            {paso === PASO.ORDEN && (
              <button type="submit" form="form-ot" disabled={loading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded-lg text-sm font-semibold">
                {loading ? "Creando..." : "✓ Crear OT"}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default NuevaOrdenTrabajoModal;