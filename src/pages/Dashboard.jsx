// src/pages/Dashboard.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EstadisticasModal from "../components/General/EstadisticasModal";
import HeaderActions from "../components/General/Header.jsx";
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
 

  const handleProfile = () => {
    console.log('Ir al perfil');
    // 👉 Aquí redirigís con useNavigate('/perfil')
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col items-center justify-center px-4">
      {/* elevar este div arriba de todo */}
      <div className="absolute top-0 left-0 w-full" >
         <HeaderActions handleLogout={handleLogout} handleProfile={handleProfile} />
      </div>
      
      <h1 className="text-4xl font-bold mb-10">Panel Principal</h1>
      
      {/* 💡 CAMBIO: Usamos flex-col y gap-4 para apilar los botones */}
      <div className="flex flex-col gap-4 w-full max-w-sm sm:max-w-md">
        
        {/* 💡 Botón 1: Clientes */}
        <Link
          to="/clientes"
          // Clases añadidas: hover:font-bold, focus:text-white, active:text-white
          className="bg-red-600 hover:bg-red-700 text-white font-semibold hover:font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center focus:text-white active:text-white"
        >
          Clientes
        </Link>
        
        {/* 💡 Botón 2: Equipos */}
        <Link
          to="/equipos"
          // Clases añadidas: hover:font-bold, focus:text-white, active:text-white
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold hover:font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center focus:text-white active:text-white"
        >
          Equipos
        </Link>
        
        {/* 💡 Botón 3: Estadísticas (Es un <button>, no necesita focus/active para el color de texto) */}
        <button
          onClick={handleOpenModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold hover:font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center"
        >
          Estadísticas
        </button>
        
        {/* 💡 Botón 4: Ventas */}
        <Link
          to="/ventas"
          // Clases añadidas: hover:font-bold, focus:text-white, active:text-white
          className="bg-green-600 hover:bg-green-700 text-white font-semibold hover:font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center focus:text-white active:text-white"
        >
          Ventas
        </Link> 
        
        {/* 💡 Botón 5: Productos */}
        <Link
          to="/productos"
          // Clases añadidas: hover:font-bold, focus:text-white, active:text-white
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold hover:font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center focus:text-white active:text-white"
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
