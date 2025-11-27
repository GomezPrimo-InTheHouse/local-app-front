// import { useEffect, useState } from "react";

// const ClienteModal = ({ isOpen, onClose, onSubmit, clienteSeleccionado }) => {
//   const [formData, setFormData] = useState({
//     nombre: "",
//     apellido: "",
//     dni: "",
//     direccion: "",
//     celular: "",
//     celular_contacto: "",
//   });

//   // 🔹 Cargar datos si estamos editando
// useEffect(() => {
//   if (!isOpen) return; // solo ejecutar cuando se abre el modal

//   if (clienteSeleccionado) {
//     setFormData({
//       nombre: clienteSeleccionado.nombre || "",
//       apellido: clienteSeleccionado.apellido || "",
//       dni: clienteSeleccionado.dni || "",
//       direccion: clienteSeleccionado.direccion || "",
//       celular: clienteSeleccionado.celular || "",
//       celular_contacto: clienteSeleccionado.celular_contacto || "",
//     });
//   } else {
//     // 👇 reset al abrir en modo "nuevo cliente"
//     setFormData({
//       nombre: "",
//       apellido: "",
//       dni: "",
//       direccion: "",
//       celular: "",
//       celular_contacto: "",
//     });
//   }
// }, [isOpen, clienteSeleccionado]);


//   // 🔹 Manejar cambios de input
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // 🔹 Validar y enviar formulario
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Validación básica
//     if (
//       !formData.nombre.trim() ||
//       !formData.apellido.trim() ||
//       !formData.direccion.trim() ||
//       !formData.celular.trim() ||
//       !formData.dni.trim()
//     ) {
//       alert("Por favor complete todos los campos obligatorios (*)");
//       return;
//     }

//     onSubmit(formData);
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//       <div className="bg-neutral-800 p-6 rounded-xl w-full max-w-lg shadow-lg text-neutral-100 max-h-[80vh] overflow-y-auto p-4">
//         <h2 className="text-xl font-semibold mb-4">
//           {clienteSeleccionado ? "Modificar Cliente" : "Agregar Nuevo Cliente"}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             name="nombre"
//             placeholder="Nombre *"
//             value={formData.nombre}
//             onChange={handleChange}
//             className="w-full bg-neutral-700 text-white p-2 rounded"
//             required
//           />
//           <input
//             type="text"
//             name="apellido"
//             placeholder="Apellido *"
//             value={formData.apellido}
//             onChange={handleChange}
//             className="w-full bg-neutral-700 text-white p-2 rounded"
//             required
//           />
//           {/* dni */}
//           <input
//             type="text"
//             name="dni"
//             placeholder="DNI *"
//             value={formData.dni}
//             onChange={handleChange}
//             className="w-full bg-neutral-700 text-white p-2 rounded"
//             required
//           />
//           <input
//             type="text"
//             name="direccion"
//             placeholder="Dirección *"
//             value={formData.direccion}
//             onChange={handleChange}
//             className="w-full bg-neutral-700 text-white p-2 rounded"
//             required
//           />
//           <input
//             type="tel"
//             name="celular"
//             placeholder="Celular *"
//             value={formData.celular}
//             onChange={handleChange}
//             className="w-full bg-neutral-700 text-white p-2 rounded"
//             required
//           />
//           <input
//             type="tel"
//             name="celular_contacto"
//             placeholder="Celular de contacto (opcional)"
//             value={formData.celular_contacto}
//             onChange={handleChange}
//             className="w-full bg-neutral-700 text-white p-2 rounded"
//           />

//           {/* Botones */}
//           <div className="flex justify-end gap-3 mt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
//             >
//               Cancelar
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded"
//             >
//               {clienteSeleccionado ? "Guardar Cambios" : "Agregar"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ClienteModal;

import { useEffect, useState } from "react";

const ClienteModal = ({ isOpen, onClose, onSubmit, clienteSeleccionado }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    direccion: "",
    celular: "",
    celular_contacto: "",
    fotoFile: null,    // 🔹 archivo seleccionado
    foto_url: "",      // 🔹 URL existente (cuando editás)
  });

  // 🔹 Cargar datos si estamos editando
  useEffect(() => {
    if (!isOpen) return; // solo ejecutar cuando se abre el modal

    if (clienteSeleccionado) {
      setFormData({
        nombre: clienteSeleccionado.nombre || "",
        apellido: clienteSeleccionado.apellido || "",
        dni: clienteSeleccionado.dni || "",
        direccion: clienteSeleccionado.direccion || "",
        celular: clienteSeleccionado.celular || "",
        celular_contacto: clienteSeleccionado.celular_contacto || "",
        fotoFile: null,
        foto_url: clienteSeleccionado.foto_url || "", // si existe en la BD
      });
    } else {
      // 👇 reset al abrir en modo "nuevo cliente"
      setFormData({
        nombre: "",
        apellido: "",
        dni: "",
        direccion: "",
        celular: "",
        celular_contacto: "",
        fotoFile: null,
        foto_url: "",
      });
    }
  }, [isOpen, clienteSeleccionado]);

  // 🔹 Manejar cambios de input de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Manejar selección de archivo (foto)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Podrías validar tamaño, tipo, etc. acá si quisieras
    setFormData((prev) => ({
      ...prev,
      fotoFile: file,
      // opcional: podrías limpiar foto_url si querés considerar esto como reemplazo directo
      // foto_url: prev.foto_url,
    }));
  };

  // 🔹 Validar y enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica
    if (
      !formData.nombre.trim() ||
      !formData.apellido.trim() ||
      !formData.direccion.trim() ||
      !formData.celular.trim() ||
      !formData.dni.trim()
    ) {
      alert("Por favor complete todos los campos obligatorios (*)");
      return;
    }

    // Enviamos TODO el formData, incluyendo fotoFile y foto_url
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  // 🔹 Determinar qué imagen mostrar en el preview
  let previewSrc = null;
  if (formData.fotoFile) {
    previewSrc = URL.createObjectURL(formData.fotoFile);
  } else if (formData.foto_url) {
    previewSrc = formData.foto_url;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      {/* Contenedor responsive con padding lateral para mobile */}
      <div className="w-full max-w-lg mx-4">
        <div className="bg-neutral-800 rounded-xl shadow-lg text-neutral-100 max-h-[85vh] overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {clienteSeleccionado ? "Modificar Cliente" : "Agregar Nuevo Cliente"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-gray-400 hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <input
              type="text"
              name="nombre"
              placeholder="Nombre *"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full bg-neutral-700 text-white p-2 rounded outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />

            {/* Apellido */}
            <input
              type="text"
              name="apellido"
              placeholder="Apellido *"
              value={formData.apellido}
              onChange={handleChange}
              className="w-full bg-neutral-700 text-white p-2 rounded outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />

            {/* DNI */}
            <input
              type="text"
              name="dni"
              placeholder="DNI *"
              value={formData.dni}
              onChange={handleChange}
              className="w-full bg-neutral-700 text-white p-2 rounded outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />

            {/* Dirección */}
            <input
              type="text"
              name="direccion"
              placeholder="Dirección *"
              value={formData.direccion}
              onChange={handleChange}
              className="w-full bg-neutral-700 text-white p-2 rounded outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />

            {/* Celular */}
            <input
              type="tel"
              name="celular"
              placeholder="Celular *"
              value={formData.celular}
              onChange={handleChange}
              className="w-full bg-neutral-700 text-white p-2 rounded outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />

            {/* Celular de contacto */}
            <input
              type="tel"
              name="celular_contacto"
              placeholder="Celular de contacto (opcional)"
              value={formData.celular_contacto}
              onChange={handleChange}
              className="w-full bg-neutral-700 text-white p-2 rounded outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {/* Foto del cliente */}
            <div className="border border-white/10 rounded-lg p-3 bg-neutral-700/40">
              <label className="block text-sm font-medium text-white mb-2">
                Foto del cliente (opcional)
              </label>

              <input
                type="file"
                accept="image/*" // iPhone friendly: jpg, png, heic (el navegador suele convertir)
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-300
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-md file:border-0
                           file:text-sm file:font-semibold
                           file:bg-purple-600 file:text-white
                           hover:file:bg-purple-700"
              />

              {/* Preview */}
              {previewSrc && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-16 w-16 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                    <img
                      src={previewSrc}
                      alt="Foto cliente"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    Vista previa de la foto que se guardará para este cliente.
                  </p>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded font-medium text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded font-medium text-sm"
              >
                {clienteSeleccionado ? "Guardar Cambios" : "Agregar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClienteModal;

