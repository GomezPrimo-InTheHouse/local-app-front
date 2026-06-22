// src/components/Equipo/EquipoModal.jsx
import { useEffect, useState } from "react";
import PatronInput from "../Equipo/PatronInput.jsx";
import { getClientes } from "../../api/ClienteApi";
import { getEstadoByAmbito } from "../../api/EstadoApi.jsx";

const EquipoModal = ({ isOpen, onClose, onSubmit, equipoSeleccionado }) => {
  const [formData, setFormData] = useState({
    tipo:       "",
    marca:      "",
    modelo:     "",
    cliente_id: "",
    estado_id:  "",
    imei:       "",
    patron:     "",
  });

  const [clientes, setClientes]               = useState([]);
  const [search, setSearch]                   = useState("");
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [showDropdown, setShowDropdown]       = useState(false);
  const [estados, setEstados]                 = useState([]);
  const [loadingEstados, setLoadingEstados]   = useState(true);

  // Cargar clientes y estados al abrir
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const lista = await getClientes();
        setClientes(lista || []);
        setFilteredClientes(lista || []);
      } catch (err) { console.error("Error cargando clientes:", err); }
    })();
    (async () => {
      try {
        setLoadingEstados(true);
        const lista = await getEstadoByAmbito('equipo');
        setEstados(lista || []);
      } catch (e) { console.error("Error cargando estados:", e); }
      finally { setLoadingEstados(false); }
    })();
  }, [isOpen]);

  // Inicializar formData cuando abre o cambia el equipo seleccionado
  useEffect(() => {
    if (!isOpen) return;
    if (equipoSeleccionado) {
      setFormData({
        tipo:       equipoSeleccionado.tipo       || "",
        marca:      equipoSeleccionado.marca      || "",
        modelo:     equipoSeleccionado.modelo     || "",
        cliente_id: equipoSeleccionado.cliente_id || "",
        estado_id:  equipoSeleccionado.estado_id  ? String(equipoSeleccionado.estado_id) : "",
        imei:       equipoSeleccionado.imei       || "",
        patron:     equipoSeleccionado.ultimo_patron || "",
      });
    } else {
      setFormData({ tipo: "", marca: "", modelo: "", cliente_id: "", estado_id: "", imei: "", patron: "" });
    }
  }, [isOpen, equipoSeleccionado]);

  // Mostrar cliente en el buscador cuando se abre en modo edición
  useEffect(() => {
    if (!equipoSeleccionado?.cliente_id || !clientes.length) return;
    const clienteSel = clientes.find(c => c.id === equipoSeleccionado.cliente_id);
    if (clienteSel) {
      setSearch(`${clienteSel.nombre} ${clienteSel.apellido}`);
    } else {
      setSearch("");
    }
  }, [equipoSeleccionado?.cliente_id, clientes]);

  // Filtro clientes
  useEffect(() => {
    if (!search.trim()) { setFilteredClientes(clientes); return; }
    const q = search.toLowerCase();
    setFilteredClientes(
      clientes.filter(c =>
        c.nombre?.toLowerCase().includes(q) ||
        c.apellido?.toLowerCase().includes(q) ||
        (c.celular && c.celular.includes(search))
      )
    );
  }, [search, clientes]);

  const handleClose = () => {
    setFormData({ tipo: "", marca: "", modelo: "", cliente_id: "", estado_id: "", imei: "", patron: "" });
    setSearch("");
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectCliente = (cliente) => {
    setFormData(prev => ({ ...prev, cliente_id: cliente.id }));
    setSearch(`${cliente.nombre} ${cliente.apellido}`);
    setShowDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación sin problema ni password — esos van en la OT
    if (!formData.tipo || !formData.marca || !formData.modelo) {
      alert("Por favor completá tipo, marca y modelo.");
      return;
    }
    if (!formData.cliente_id) {
      alert("Debe seleccionar un cliente.");
      return;
    }
    if (!formData.estado_id) {
      alert("Debe seleccionar un estado.");
      return;
    }
    onSubmit(formData);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-neutral-800 rounded-xl w-full max-w-lg shadow-2xl text-neutral-100 flex flex-col max-h-[95vh] sm:max-h-[90vh]">

        {/* Header */}
        <div className="sticky top-0 bg-neutral-800 border-b border-white/10 px-5 py-4 rounded-t-xl flex items-center justify-between z-10 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold">
            {equipoSeleccionado ? "Modificar Equipo" : "Agregar Nuevo Equipo"}
          </h2>
          <button type="button" onClick={onClose}
            className="text-neutral-400 hover:text-white text-2xl leading-none transition-colors">
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="overflow-y-auto flex-1 px-5 py-4 [scrollbar-width:thin]">
          <form onSubmit={handleSubmit} className="space-y-4" id="form-equipo">

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Tipo de equipo *</label>
              <select name="tipo" value={formData.tipo} onChange={handleChange}
                className="w-full bg-neutral-700 text-white p-2.5 rounded-lg text-sm" required>
                <option value="">Seleccioná un tipo</option>
                <option value="celular">📱 Celular</option>
                <option value="notebook">💻 Notebook</option>
                <option value="pc">🖥️ PC</option>
                <option value="consola">🎮 Consola</option>
                <option value="tablet">📟 Tablet</option>
                <option value="impresora">🖨️ Impresora</option>
                <option value="joystick">🕹️ Joystick</option>
                <option value="reloj">⌚ Reloj</option>
                <option value="otro">🔧 Otro</option>
              </select>
            </div>

            {/* Marca y Modelo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Marca *</label>
                <input type="text" name="marca" placeholder="Ej: Samsung"
                  value={formData.marca} onChange={handleChange}
                  className="w-full bg-neutral-700 text-white p-2.5 rounded-lg text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Modelo *</label>
                <input type="text" name="modelo" placeholder="Ej: A52"
                  value={formData.modelo} onChange={handleChange}
                  className="w-full bg-neutral-700 text-white p-2.5 rounded-lg text-sm" required />
              </div>
            </div>

            {/* Buscador clientes */}
            <div className="relative">
              <label className="block text-sm font-medium text-neutral-300 mb-1">Cliente *</label>
              <input type="text" placeholder="Buscar por nombre, apellido o celular..."
                value={search}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-neutral-700 text-white p-2.5 rounded-lg text-sm" />
              {showDropdown && filteredClientes.length > 0 && (
                <ul className="absolute z-50 bg-neutral-700 border border-white/10 w-full mt-1 rounded-lg max-h-40 overflow-y-auto shadow-xl">
                  {filteredClientes.map(cliente => (
                    <li key={cliente.id} onClick={() => handleSelectCliente(cliente)}
                      className="px-3 py-2.5 hover:bg-neutral-600 cursor-pointer text-sm">
                      <span className="font-medium">{cliente.nombre} {cliente.apellido}</span>
                      <span className="text-neutral-400 text-xs ml-2">{cliente.celular}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Estado *</label>
              <select name="estado_id" value={formData.estado_id} onChange={handleChange}
                className="w-full bg-neutral-700 text-white p-2.5 rounded-lg text-sm" required>
                <option value="">Seleccioná un estado</option>
                {loadingEstados ? (
                  <option disabled>Cargando estados...</option>
                ) : (
                  estados.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)
                )}
              </select>
            </div>

            {/* IMEI — solo celular */}
            {formData.tipo === "celular" && (
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">
                  IMEI <span className="text-neutral-500">(opcional)</span>
                </label>
                <input type="text" name="imei" placeholder="Ej: 356789123456789"
                  value={formData.imei}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value) && e.target.value.length <= 15)
                      handleChange(e);
                  }}
                  className="w-full bg-neutral-700 text-white p-2.5 rounded-lg text-sm" />
                {formData.imei && formData.imei.length > 0 && formData.imei.length < 14 && (
                  <p className="text-yellow-400 text-xs mt-1">El IMEI suele tener 14–15 dígitos.</p>
                )}
              </div>
            )}

            {/* Patrón — solo celular */}
            {formData.tipo === "celular" && (
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Patrón de desbloqueo</label>
                <PatronInput
                  value={formData.patron || ""}
                  onChange={nuevoPatron => setFormData(prev => ({ ...prev, patron: nuevoPatron }))}
                />
              </div>
            )}

          </form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-neutral-800 border-t border-white/10 px-5 py-4 rounded-b-xl flex justify-end gap-3 flex-shrink-0">
          <button type="button" onClick={handleClose}
            className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm transition-colors">
            Cancelar
          </button>
          <button type="submit" form="form-equipo"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-semibold transition-colors">
            {equipoSeleccionado ? "Guardar Cambios" : "Agregar"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EquipoModal;