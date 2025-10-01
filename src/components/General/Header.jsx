import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function HeaderActions({ handleLogout, handleProfile }) {
  return (
    <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-black via-gray-900 to-black bg-opacity-60 backdrop-blur-md shadow-md z-50">
      <div className="flex justify-end items-center gap-4 p-4">
        {/* Botón de perfil */}
        <button
          onClick={handleProfile}
          className="relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm tracking-wide text-white 
                     bg-gradient-to-r from-blue-500 to-blue-700 
                     shadow-lg 
                     hover:scale-105 hover:shadow-blue-600/50
                     active:scale-95
                     transition-all duration-300 ease-out"
        >
          <UserCircleIcon className="w-5 h-5" />
          Perfil
        </button>

        {/* Botón de logout */}
        <button
          onClick={handleLogout}
          className="relative flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm tracking-wide text-white 
                     bg-gradient-to-r from-red-500 to-red-700 
                     shadow-lg 
                     hover:scale-105 hover:shadow-red-600/50
                     active:scale-95
                     transition-all duration-300 ease-out"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
