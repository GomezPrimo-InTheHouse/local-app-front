import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import ClientePage from '../pages/ClientePage.jsx';
import EquipoPage from '../pages/EquipoPage';
import DetalleDeEquipoPage from '../pages/DetalleEquiposPage.jsx';
import Historial from '../pages/Historial.jsx';
import Estadisticas from '../pages/EstadisticasPage.jsx';
import VentasPage from '../pages/VentasPage.jsx';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/clientes" element={<ClientePage />} />
      <Route path="/estadisticas" element={<Estadisticas />} />
      <Route path="/equipos" element={<EquipoPage />} />
      <Route path="/equipos/:id" element={<DetalleDeEquipoPage />} />
      <Route path="/equipos/:id/historial" element={<Historial />} />
      <Route path="/ventas" element={<VentasPage />} />
    </Routes>
  </Router>
);

export default AppRoutes;
