// src/components/equipos/EquipoModal.jsx

import { useEffect, useState } from "react";

const EquipoModal = ({ isOpen, onClose, onSubmit, equipoSeleccionado, clientes }) => {
  const [formData, setFormData] = useState({
    tipo: "",
    marca: "",
    modelo: "",
    problema: "",
    clienteId: "",
    fechaIngreso: "",
    presupuesto: ""
  });



  useEffect(() => {
    if (equipoSeleccionado) {
      setFormData({
        tipo: equipoSeleccionado.tipo,
        marca: equipoSeleccionado.marca,
        modelo: equipoSeleccionado.modelo,
        problema: equipoSeleccionado.problema,
        clienteId: equipoSeleccionado.clienteId,
        fechaIngreso: equipoSeleccionado.fechaIngreso,
        presupuesto: equipoSeleccionado.presupuesto || ""
      });
    } else {
      setFormData({
        tipo: "",
        marca: "",
        modelo: "",
        problema: "",
        clienteId: "",
        fechaIngreso: "",
        presupuesto: "",
      });
    }
  }, [equipoSeleccionado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // manejar alta o modificación desde EquiposPage.jsx
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-neutral-800 p-6 rounded-xl w-full max-w-lg shadow-lg text-neutral-100">
        <h2 className="text-xl font-semibold mb-4">
          {equipoSeleccionado ? "Modificar Equipo" : "Agregar Nuevo Equipo"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="w-full bg-neutral-700 text-white p-2 rounded"
            required
          >
            <option value="">Tipo de equipo</option>
            <option value="celular">Celular</option>
            <option value="notebook">Notebook</option>
            <option value="consola">Consola</option>
            <option value="tablet">Tablet</option>
            <option value="otro">Otro</option>
          </select>

          <input
            type="text"
            name="marca"
            placeholder="Marca"
            value={formData.marca}
            onChange={handleChange}
            className="w-full bg-neutral-700 text-white p-2 rounded"
            required
          />
          <input
            type="text"
            name="modelo"
            placeholder="Modelo"
            value={formData.modelo}
            onChange={handleChange}
            className="w-full bg-neutral-700 text-white p-2 rounded"
            required
          />
          <textarea
            name="problema"
            placeholder="Inconveniente / Problema"
            value={formData.problema}
            onChange={handleChange}
            className="w-full bg-neutral-700 text-white p-2 rounded"
            required
          />
          <select
            name="clienteId"
            value={formData.clienteId}
            onChange={handleChange}
            className="w-full bg-neutral-700 text-white p-2 rounded"
            required
          >
            <option value="">Seleccionar cliente</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre} {cliente.apellido}
              </option>
            ))}
          </select>
          <div className="mb-4">
            <label htmlFor="fechaIngreso" className="block text-sm font-medium text-white mb-1">
              Fecha de ingreso
            </label>
            <input
              type="date"
              id="fechaIngreso"
              name="fechaIngreso"
              value={formData.fechaIngreso}
              onChange={handleChange}
              className="w-full bg-neutral-700 text-white p-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-1">
              Presupuesto de reparación (opcional)
            </label>
            <input
              type="number"
              name="presupuesto"
              value={formData.presupuesto || ''}
              onChange={handleChange}
              placeholder="Ej: 15000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-orange-500"
            />
          </div>



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
