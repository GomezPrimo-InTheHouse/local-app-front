// src/components/Auth/RequireModulo.jsx
// Protege una ruta por módulo (o solo admin). Si no tiene acceso, vuelve al inicio.
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/UseAuth.jsx";

const RequireModulo = ({ modulo, soloAdmin = false }) => {
  const { esAdmin, puede, loading } = useAuth();
  if (loading) return null;
  const permitido = soloAdmin ? esAdmin : puede(modulo);
  return permitido ? <Outlet /> : <Navigate to="/" replace />;
};

export default RequireModulo;
