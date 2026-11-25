// src/components/Dashboard/AccesosEmpleado.jsx
// Inicio del empleado: accesos directos a sus módulos. Sin KPIs ni estadísticas.
import { Link } from "react-router-dom";
import useAuth from "../../hooks/UseAuth.jsx";
import { MODULOS } from "../../utils/Modulos.jsx";

const AccesosEmpleado = () => {
  const { user, puede } = useAuth();
  const disponibles = MODULOS.filter((m) => puede(m.key));

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-neutral-100">
          Hola{user?.nombre ? `, ${user.nombre}` : ""} 👋
        </h2>
        <p className="text-sm text-neutral-400">Estos son los módulos que tenés habilitados.</p>
      </div>

      {disponibles.length === 0 ? (
        <div className="rounded-2xl border border-amber-700/40 bg-amber-900/20 p-4 text-sm text-amber-200">
          Todavía no tenés módulos habilitados. Pedile al administrador que te dé acceso.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {disponibles.map((m) => (
            <Link key={m.key} to={m.to}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-800/60 p-4 transition-colors">
              <div className="text-2xl mb-2">{m.emoji}</div>
              <p className="font-semibold text-neutral-100">{m.label}</p>
              <p className="text-xs text-neutral-400 mt-1">{m.descripcion}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default AccesosEmpleado;
