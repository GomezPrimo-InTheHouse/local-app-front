// src/pages/Dashboard.jsx

import { Link } from "react-router-dom";

const Dashboard = () => {
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
      </div>
    </div>
  );
};

export default Dashboard;
