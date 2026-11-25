// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

// ⬇️ Lazy imports (cada página genera su propio chunk)
const Dashboard = lazy(() => import("../pages/Dashboard"));
const ClientePage = lazy(() => import("../pages/ClientePage.jsx"));
const EquipoPage = lazy(() => import("../pages/EquipoPage"));
const DetalleDeEquipoPage = lazy(() => import("../pages/DetalleEquiposPage.jsx"));
const Historial = lazy(() => import("../pages/Historial.jsx"));
const Estadisticas = lazy(() => import("../pages/EstadisticasPage.jsx"));
const VentasPage = lazy(() => import("../pages/VentasPage.jsx"));
const ProductoPage = lazy(() => import("../pages/ProductoPage.jsx"));
const EstadisticasHistoricasPage = lazy(() => import("../pages/EstadisticasHistoricasPage.jsx"));
const CelularesPage = lazy(() => import("../pages/CelularesPage.jsx"));
const ServiciosPage = lazy(() => import("../pages/ServiciosPage.jsx"));
const Login = lazy(() => import("../pages/LoginPage.jsx"));
const ProtectedRoute = lazy(() => import("../components/ProtectedRoute.jsx"));
const RequireModulo = lazy(() => import("../components/Auth/RequireModulo.jsx"));
const EmpleadosPage = lazy(() => import("../pages/EmpleadosPage.jsx"));

// ⬇️ Fallback minimalista mientras cargan los chunks
function RouteFallback() {
  return (
    <div className="min-h-dvh grid place-items-center bg-neutral-900 text-white/90">
      <div className="flex items-center gap-3">
        <span className="inline-block h-3 w-3 animate-ping rounded-full bg-indigo-400" />
        <span className="text-sm">Cargando…</span>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Router>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            {/* Inicio: el admin ve KPIs; el empleado, sus accesos directos */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Módulos habilitables por empleado */}
            <Route element={<RequireModulo modulo="clientes" />}>
              <Route path="/clientes" element={<ClientePage />} />
              <Route path="/historial/cliente/:clienteId" element={<Historial />} />
            </Route>
            <Route element={<RequireModulo modulo="equipos" />}>
              <Route path="/equipos" element={<EquipoPage />} />
              <Route path="/equipos/:id" element={<DetalleDeEquipoPage />} />
              <Route path="/equipos/:id/historial" element={<Historial />} />
            </Route>
            <Route element={<RequireModulo modulo="ventas" />}>
              <Route path="/ventas" element={<VentasPage />} />
            </Route>
            <Route element={<RequireModulo modulo="productos" />}>
              <Route path="/productos" element={<ProductoPage />} />
            </Route>
            <Route element={<RequireModulo modulo="servicios" />}>
              <Route path="/servicios" element={<ServiciosPage />} />
            </Route>
            <Route element={<RequireModulo modulo="celulares" />}>
              <Route path="/celulares" element={<CelularesPage />} />
            </Route>

            {/* Siempre solo admin */}
            <Route element={<RequireModulo soloAdmin />}>
              <Route path="/estadisticas" element={<Estadisticas />} />
              <Route path="/estadisticas-historicas" element={<EstadisticasHistoricasPage />} />
              <Route path="/empleados" element={<EmpleadosPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}