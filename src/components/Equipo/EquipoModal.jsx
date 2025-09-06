
// src/components/modales/EquipoModal.jsx
import { useEffect, useState } from "react";
import PatronInput from "../Equipo/PatronInput.jsx";
import { getClientes } from "../../api/ClienteApi";
import { getEstados } from "../../api/EstadoApi.jsx";

const EquipoModal = ({ isOpen, onClose, onSubmit, equipoSeleccionado }) => {
  const [formData, setFormData] = useState({
    tipo: "",
    marca: "",
    modelo: "",
    password: "",
    problema: "",
    cliente_id: "",
    fecha_ingreso: "",
    patron: "",
    estado_id: ""
  });

  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [estados, setEstados] = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(true);

  // Cargar listas al abrir
  useEffect(() => {
    if (!isOpen) return;

    (async () => {
      try {
        const listaClientes = await getClientes();
        setClientes(listaClientes || []);
        setFilteredClientes(listaClientes || []);
      } catch (err) {
        console.error("Error cargando clientes:", err);
      }
    })();

    (async () => {
      try {
        setLoadingEstados(true);
        const lista = await getEstados();
        setEstados(lista || []);
      } catch (e) {
        console.error("Error cargando estados:", e);
      } finally {
        setLoadingEstados(false);
      }
    })();
  }, [isOpen]);

  const formatFecha = (fecha) => {
    if (!fecha) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha;
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(fecha)) return fecha.split(" ")[0];
    const d = new Date(fecha);
    if (!isNaN(d)) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${dd}`;
    }
    return "";
  };

  // ⚠️ Inicializa formData SOLO cuando abre o cambia el equipo seleccionado
  useEffect(() => {
    if (!isOpen) return;

    if (equipoSeleccionado) {
      setFormData({
        tipo: equipoSeleccionado.tipo || "",
        marca: equipoSeleccionado.marca || "",
        modelo: equipoSeleccionado.modelo || "",
        password: equipoSeleccionado.password || "",
        problema: equipoSeleccionado.problema || "",
        cliente_id: equipoSeleccionado.cliente_id || "",
        fecha_ingreso: equipoSeleccionado.fecha_ingreso
          ? formatFecha(equipoSeleccionado.fecha_ingreso)
          : "",
        patron: equipoSeleccionado.patron || "",
        estado_id: equipoSeleccionado.estado_id ? String(equipoSeleccionado.estado_id) : "",
      });
    } else {
      setFormData({
        tipo: "",
        marca: "",
        modelo: "",
        password: "",
        problema: "",
        cliente_id: "",
        fecha_ingreso: "",
        patron: "",
        estado_id: "",
      });
    }
  }, [isOpen, equipoSeleccionado]);

  const handleClose = () => {
    setFormData({
      tipo: "",
      marca: "",
      modelo: "",
      password: "",
      problema: "",
      cliente_id: "",
      fecha_ingreso: "",
      patron: "",
      estado_id: "",
    });
    setSelectedCliente(null); // 👈 limpia el cliente
    setSearch("");            // 👈 limpia el buscador
    onClose();
  };


  // Muestra el cliente en el input de búsqueda SIN tocar formData
  useEffect(() => {
    if (!equipoSeleccionado?.cliente_id || !clientes.length) return;
    const clienteSel = clientes.find(c => c.id === equipoSeleccionado.cliente_id);
    if (clienteSel) {
      setSelectedCliente(clienteSel);
      setSearch(`${clienteSel.nombre} ${clienteSel.apellido}`);
    } else {
      // 👇 cuando NO hay equipo seleccionado, limpiar
      setSelectedCliente(null);
      setSearch("");
    }
  }, [equipoSeleccionado?.cliente_id, clientes]);

  // Filtro clientes
  useEffect(() => {
    if (!search.trim()) {
      setFilteredClientes(clientes);
    } else {
      const q = search.toLowerCase();
      setFilteredClientes(
        clientes.filter(
          (c) =>
            c.nombre.toLowerCase().includes(q) ||
            c.apellido.toLowerCase().includes(q) ||
            (c.celular && c.celular.includes(search))
        )
      );
    }
  }, [search, clientes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectCliente = (cliente) => {
    setSelectedCliente(cliente);
    setFormData(prev => ({ ...prev, cliente_id: cliente.id }));
    setSearch(`${cliente.nombre} ${cliente.apellido}`);
    setShowDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.tipo || !formData.marca || !formData.modelo || !formData.problema) {
      alert("Por favor complete los campos obligatorios (*)");
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

    handleClose(); // este handle elimina todos los campos seteados en el form
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-neutral-800 p-6 rounded-xl w-full max-w-lg shadow-lg text-neutral-100 max-h-[80vh] overflow-y-auto p-4">
        <h2 className="text-xl font-semibold mb-4">
          {equipoSeleccionado ? "Modificar Equipo" : "Agregar Nuevo Equipo"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de equipo */}
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="w-full bg-neutral-700 text-white p-2 rounded"
            required
          >
            <option value="">Tipo de equipo *</option>
            <option value="celular">Celular</option>
            <option value="notebook">Notebook</option>
            <option value="pc">PC</option>
            <option value="consola">Consola</option>
            <option value="tablet">Tablet</option>
            <option value="otro">Otro</option>
          </select>

          {/* Marca y modelo */}
          <input
            type="text"
            name="marca"
            placeholder="Marca *"
            value={formData.marca}
            onChange={handleChange}
            className="w-full bg-neutral-700 text-white p-2 rounded"
            required
          />
          <input
            type="text"
            name="modelo"
            placeholder="Modelo *"
            value={formData.modelo}
            onChange={handleChange}
            className="w-full bg-neutral-700 text-white p-2 rounded"
            required
          />

          {/* Password */}
          <input
            type="text"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-neutral-700 text-white p-2 rounded"
          />

          {/* Problema */}
          <textarea
            name="problema"
            placeholder="Inconveniente / Problema *"
            value={formData.problema}
            onChange={handleChange}
            className="w-full bg-neutral-700 text-white p-2 rounded"
            required
          />

          {/* Buscador de clientes */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar cliente por nombre o celular *"
              value={search}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-neutral-700 text-white p-2 rounded"
              required
            />
            {showDropdown && filteredClientes.length > 0 && (
              <ul className="absolute z-50 bg-neutral-700 w-full mt-1 rounded max-h-40 overflow-y-auto shadow-lg">
                {filteredClientes.map((cliente) => (
                  <li
                    key={cliente.id}
                    onClick={() => handleSelectCliente(cliente)}
                    className="px-3 py-2 hover:bg-neutral-600 cursor-pointer"
                  >
                    {cliente.nombre} {cliente.apellido} - {cliente.celular}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Fecha ingreso */}
          <div>
            <label htmlFor="fecha_ingreso" className="block text-sm font-medium text-white mb-1">
              Fecha de ingreso
            </label>
            <input
              type="date"
              id="fecha_ingreso"
              name="fecha_ingreso"
              value={formData.fecha_ingreso}
              onChange={handleChange}
              className="w-full bg-neutral-700 text-white p-2 rounded"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Estado</label>
            <select
              name="estado_id"
              value={formData.estado_id}
              onChange={handleChange}
              className="w-full bg-neutral-700 text-white p-2 rounded"
              required
            >
              <option value="">Selecciona un estado</option>
              {loadingEstados ? (
                <option disabled>Cargando estados...</option>
              ) : (
                estados.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Patrón (solo celular) */}
          {formData.tipo === "celular" && (
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Patrón de desbloqueo
              </label>
              <PatronInput
                value={formData.patron || ""}
                onChange={(nuevoPatron) =>
                  setFormData(prev => ({ ...prev, patron: nuevoPatron }))
                }
              />
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
            >
              {equipoSeleccionado ? "Guardar Cambios" : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipoModal;

