import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import ClientePage from '../pages/ClientePage.jsx';
import EquipoPage from '../pages/EquipoPage';
import DetalleDeEquipoPage from '../pages/DetalleEquiposPage.jsx';
const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/clientes" element={<ClientePage />} />
      <Route path="/equipos" element={<EquipoPage />} />
       <Route path="/equipos/:id" element={<DetalleDeEquipoPage />} />
    </Routes>
  </Router>
);

export default AppRoutes;
