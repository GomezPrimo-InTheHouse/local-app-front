// src/components/layout/HeaderActions.jsx

// Asegúrate de importar los íconos
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';

// No es necesario pasar las funciones por props si usas un contexto de autenticación,
// pero por ahora lo mantenemos para que siga funcionando con tu código actual.
const HeaderActions = ({ handleLogout, handleProfile }) => {
  return (
    // ✨ CAMBIOS CLAVE:
    // 1. 'absolute top-0 left-0': Lo posiciona arriba de todo, flotando.
    // 2. 'w-full': Asegura que ocupe todo el ancho.
    // 3. 'z-50': Le da una capa superior para que esté por encima de otros elementos.
    // 4. 'bg-black/50': Un fondo negro con 50% de opacidad. Es más limpio que el gradiente para este caso.
    <header className="absolute top-0 left-0 w-full bg-black/50 backdrop-blur-lg shadow-md z-50">
      <div className="container mx-auto flex justify-end items-center gap-4 p-4">
        {/* Botón de perfil */}
        <button
          onClick={handleProfile}
          className="relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm tracking-wide text-white 
                     bg-blue-600/80 hover:bg-blue-600
                     shadow-lg 
                     hover:scale-105 hover:shadow-blue-500/50
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
                     bg-red-600/80 hover:bg-red-600
                     shadow-lg 
                     hover:scale-105 hover:shadow-red-500/50
                     active:scale-95
                     transition-all duration-300 ease-out"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default HeaderActions;