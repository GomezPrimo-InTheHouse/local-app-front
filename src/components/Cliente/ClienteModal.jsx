import { useEffect, useState } from "react";

const ClienteModal = ({ isOpen, onClose, onSubmit, clienteSeleccionado }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    celular: "",
    celular_contacto: "",
  });

  // 🔹 Cargar datos si estamos editando
  useEffect(() => {
    if (clienteSeleccionado) {
      setFormData({
        nombre: clienteSeleccionado.nombre || "",
        apellido: clienteSeleccionado.apellido || "",
        direccion: clienteSeleccionado.direccion || "",
        celular: clienteSeleccionado.celular || "",
        celular_contacto: clienteSeleccionado.celular_contacto || "",
      });
    } else {
      setFormData({
        nombre: "",
        apellido: "",
        direccion: "",
        celular: "",
        celular_contacto: "",
      });
    }
  }, [clienteSeleccionado]);

  // 🔹 Manejar cambios de input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Validar y enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica
    if (
      !formData.nombre.trim() ||
      !formData.apellido.trim() ||
      !formData.direccion.trim() ||
      !formData.celular.trim()
    ) {
      alert("Por favor complete todos los campos obligatorios (*)");
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
          {clienteSeleccionado ? "Modificar Cliente" : "Agregar Nuevo Cliente"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre *"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full bg-neutral-700 text-white p-2 rounded"
            required
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido *"
            value={formData.apellido}
            onChange={handleChange}
            className="w-full bg-neutral-700 text-white p-2 rounded"
            required
          />
          <input
            type="text"
            name="direccion"
            placeholder="Dirección *"
            value={formData.direccion}
            onChange={handleChange}
            className="w-full bg-neutral-700 text-white p-2 rounded"
            required
          />
          <input
            type="tel"
            name="celular"
            placeholder="Celular *"
            value={formData.celular}
            onChange={handleChange}
            className="w-full bg-neutral-700 text-white p-2 rounded"
            required
          />
          <input
            type="tel"
            name="celular_contacto"
            placeholder="Celular de contacto (opcional)"
            value={formData.celular_contacto}
            onChange={handleChange}
            className="w-full bg-neutral-700 text-white p-2 rounded"
          />

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
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded"
            >
              {clienteSeleccionado ? "Guardar Cambios" : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteModal;
