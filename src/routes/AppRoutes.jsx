// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Dashboard from '../pages/Dashboard';
// import ClientePage from '../pages/ClientePage.jsx';
// import EquipoPage from '../pages/EquipoPage';
// import DetalleDeEquipoPage from '../pages/DetalleEquiposPage.jsx';
// import Historial from '../pages/Historial.jsx';
// import Estadisticas from '../pages/EstadisticasPage.jsx';
// import VentasPage from '../pages/VentasPage.jsx';
// import ProductoPage from '../pages/ProductoPage.jsx';
// import Login from '../pages/LoginPage.jsx';

// const AppRoutes = () => (
//   <Router>
//     <Routes>
//       <Route path="/" element={<Dashboard />} />
//       <Route path="/clientes" element={<ClientePage />} />
//       <Route path="/estadisticas" element={<Estadisticas />} />
//       <Route path="/equipos" element={<EquipoPage />} />
//       <Route path="/equipos/:id" element={<DetalleDeEquipoPage />} />
//       <Route path="/equipos/:id/historial" element={<Historial />} />
//       <Route path="/ventas" element={<VentasPage />} />
//       <Route path="/productos" element={<ProductoPage />} />
//       <Route path="/login" element={<Login/>} />
//     </Routes>
//   </Router>
// );

// export default AppRoutes;

// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ClientePage from "../pages/ClientePage.jsx";
import EquipoPage from "../pages/EquipoPage";
import DetalleDeEquipoPage from "../pages/DetalleEquiposPage.jsx";
import Historial from "../pages/Historial.jsx";
import Estadisticas from "../pages/EstadisticasPage.jsx";
import VentasPage from "../pages/VentasPage.jsx";
import ProductoPage from "../pages/ProductoPage.jsx";
import Login from "../pages/LoginPage.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

const AppRoutes = () => (
  
  <Router>
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clientes" element={<ClientePage />} />
        <Route path="/estadisticas" element={<Estadisticas />} />
        <Route path="/equipos" element={<EquipoPage />} />
        <Route path="/equipos/:id" element={<DetalleDeEquipoPage />} />
        <Route path="/equipos/:id/historial" element={<Historial />} />
        <Route path="/ventas" element={<VentasPage />} />
        <Route path="/productos" element={<ProductoPage />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRoutes;

