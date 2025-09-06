import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EstadisticasModal = ({ isOpen, onClose }) => {
  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState("2025");
  const navigate = useNavigate();

  const mesesDelAnio = [
    { nombre: "Enero", numero: "1" },
    { nombre: "Febrero", numero: "2" },
    { nombre: "Marzo", numero: "3" },
    { nombre: "Abril", numero: "4" },
    { nombre: "Mayo", numero: "5" },
    { nombre: "Junio", numero: "6" },
    { nombre: "Julio", numero: "7" },
    { nombre: "Agosto", numero: "8" },
    { nombre: "Septiembre", numero: "9" },
    { nombre: "Octubre", numero: "10" },
    { nombre: "Noviembre", numero: "11" },
    { nombre: "Diciembre", numero: "12" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!mes || !anio) {
      alert("Debe seleccionar un mes y un año.");
      return;
    }

    navigate("/estadisticas", { state: { mes, anio } });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-neutral-800 text-white p-8 rounded-2xl shadow-2xl w-full max-w-sm transform transition-transform duration-300 scale-95 hover:scale-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-400">
          Seleccionar Período 📈
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="mes" className="block text-sm font-medium mb-2 text-gray-300">
              Mes:
            </label>
            <select
              id="mes"
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              className="w-full p-3 rounded-lg bg-neutral-700 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            >
              <option value="" disabled>Selecciona un mes</option>
              {mesesDelAnio.map((m) => (
                <option key={m.numero} value={m.numero}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="anio" className="block text-sm font-medium mb-2 text-gray-300">
              Año:
            </label>
            <input
              type="number"
              id="anio"
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
              className="w-full p-3 rounded-lg bg-neutral-700 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-700 text-white py-3 rounded-lg font-semibold hover:bg-purple-800 transition-colors duration-300 shadow-md"
          >
            Ver Estadísticas
          </button>
        </form>
      </div>
    </div>
  );
};

export default EstadisticasModal;