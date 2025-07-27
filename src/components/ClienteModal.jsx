import { Dialog } from '@headlessui/react';

const ClienteModal = ({ isOpen, onClose, onSubmit, formData, setFormData }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-md rounded bg-neutral-800 p-6 text-white shadow-lg">
          <Dialog.Title className="text-lg font-bold mb-4 text-indigo-400">
            Nuevo Cliente
          </Dialog.Title>
          <form onSubmit={onSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full p-2 rounded bg-neutral-700 border border-neutral-600"
              required
            />
            <input
              type="text"
              placeholder="Apellido"
              value={formData.apellido}
              onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              className="w-full p-2 rounded bg-neutral-700 border border-neutral-600"
            />
            <input
              type="text"
              placeholder="Dirección"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              className="w-full p-2 rounded bg-neutral-700 border border-neutral-600"
            />
            <input
              type="tel"
              placeholder="Nro Celular"
              value={formData.celular}
              onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
              className="w-full p-2 rounded bg-neutral-700 border border-neutral-600"
            />
            <input
              type="tel"
              placeholder="Nro Celular de Contacto"
              value={formData.celularContacto}
              onChange={(e) => setFormData({ ...formData, celularContacto: e.target.value })}
              className="w-full p-2 rounded bg-neutral-700 border border-neutral-600"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded font-semibold"
              >
                Guardar
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ClienteModal;
