// src/pages/Dashboard.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EstadisticasModal from "../components/General/EstadisticasModal";
import useAuth from "../hooks/UseAuth.jsx";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmitEstadisticas = ({ mes, anio }) => {
    // Redirige a EstadisticasPage con query params
    navigate(`/estadisticas?mes=${mes}&anio=${anio}`);
  };
   const handleLogout = async () => {
    try {
      await logout(); // llama a AuthService.logout() desde el contexto
      navigate("/login", { replace: true }); // redirige al login
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col items-center justify-center px-4">
      {/* elevar este div arriba de todo */}
      <div className="absolute top-0 left-0 w-full" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
        <button
        onClick={handleLogout}
        className="mt-2 px-4 py-2 mb-4 rounded bg-black-400 hover:bg-gray-500 text-white font-semibold transition"
      >
        Cerrar sesión
      </button>

      </div>
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
        <Link
          to="/productos"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-2xl shadow transition-colors duration-200 text-center"
        >
          Productos
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
