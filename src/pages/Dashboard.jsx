// src/pages/Dashboard.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EstadisticasModal from "../components/General/EstadisticasModal";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmitEstadisticas = ({ mes, anio }) => {
    // Redirige a EstadisticasPage con query params
    navigate(`/estadisticas?mes=${mes}&anio=${anio}`);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-10">Panel Principal</h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 w-full max-w-md">
        <Link
          to="/clientes"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-2xl shadow transition-colors duration-200 text-center"
        >
          Clientes
        </Link>
        <Link
          to="/equipos"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-2xl shadow transition-colors duration-200 text-center"
        >
          Equipos
        </Link>
        <button
          onClick={handleOpenModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl shadow transition-colors duration-200 text-center"
        >
          Estadísticas
        </button>
        <Link
          to="/ventas"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-2xl shadow transition-colors duration-200 text-center"
        >
          Ventas
        </Link> 
      </div>

      <EstadisticasModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitEstadisticas}
      />
    </div>
  );
};

export default Dashboard;
