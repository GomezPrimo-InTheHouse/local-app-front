import { useEffect, useState } from "react";
import PatronInput from "../Equipo/PatronInput.jsx"; 
import { getClientes } from "../../api/ClienteApi";

const EquipoModal = ({ isOpen, onClose, onSubmit, equipoSeleccionado }) => {
  const [formData, setFormData] = useState({
    tipo: "",
    marca: "",
    modelo: "",
    password: "",
    problema: "",
    cliente_id: "",
    fecha_ingreso: "",
    patron: ""
  });

  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false); // 🔹 Nuevo estado

  // Cargar clientes desde la API
  useEffect(() => {
    if (isOpen) {
      getClientes()
        .then((res) => {
          setClientes(res);
          setFilteredClientes(res);
        })
        .catch((err) => console.error("Error cargando clientes:", err));
    }
  }, [isOpen]);

  // Cargar datos si se está modificando
  useEffect(() => {
    if (equipoSeleccionado) {
      setFormData({
        tipo: equipoSeleccionado.tipo,
        marca: equipoSeleccionado.marca,
        modelo: equipoSeleccionado.modelo,
        password: equipoSeleccionado.password || "",
        problema: equipoSeleccionado.problema,
        cliente_id: equipoSeleccionado.cliente_id || "",
        fecha_ingreso: equipoSeleccionado.fecha_ingreso
          ? new Date(equipoSeleccionado.fecha_ingreso).toISOString().split("T")[0]
          : "",
       
        patron: equipoSeleccionado.patron || ""
      });

      // Mostrar el cliente actual seleccionado en el input
      if (equipoSeleccionado.cliente_id) {
        const clienteSel = clientes.find(c => c.id === equipoSeleccionado.cliente_id);
        if (clienteSel) {
          setSelectedCliente(clienteSel);
          setSearch(`${clienteSel.nombre} ${clienteSel.apellido}`);
        }
      }
    } else {
      setFormData({
        tipo: "",
        marca: "",
        modelo: "",
        password: "",
        problema: "",
        cliente_id: "",
        fecha_ingreso:  new Date().toISOString().split("T")[0],
        
        patron: ""
      });
      setSelectedCliente(null);
      setSearch("");
    }
  }, [equipoSeleccionado, clientes]);

  // Filtrar clientes al escribir
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredClientes(clientes);
    } else {
      const query = search.toLowerCase();
      setFilteredClientes(
        clientes.filter(
          (c) =>
            c.nombre.toLowerCase().includes(query) ||
            c.apellido.toLowerCase().includes(query) ||
            (c.celular && c.celular.includes(query))
        )
      );
    }
  }, [search, clientes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectCliente = (cliente) => {
    setSelectedCliente(cliente);
    setFormData((prev) => ({ ...prev, cliente_id: cliente.id }));
    setSearch(`${cliente.nombre} ${cliente.apellido}`);
    setShowDropdown(false); // 🔹 Ocultar al seleccionar
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

    onSubmit(formData);
    onClose();
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

          {/* 🔹 Buscador de clientes */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar cliente por nombre o celular *"
              value={search}
              onFocus={() => setShowDropdown(true)}   // 🔹 Solo al hacer focus
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // 🔹 Oculta tras perder foco
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


          {/* Patrón de desbloqueo solo si es celular */}
          {formData.tipo === "celular" && (
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Patrón de desbloqueo
              </label>
              <PatronInput
                value={formData.patron || ""}
                onChange={(nuevoPatron) =>
                  setFormData({ ...formData, patron: nuevoPatron })
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
