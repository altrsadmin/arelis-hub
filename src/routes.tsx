import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';

// Importações lazy
const Login = React.lazy(() => import('./pages/Login'));
const Agents = React.lazy(() => import('./pages/Agents'));
const Workflows = React.lazy(() => import('./pages/Workflows'));
const Customers = React.lazy(() => import('./pages/Customers'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Connectors = React.lazy(() => import('./pages/Connectors'));
const ApiDocs = React.lazy(() => import('./pages/ApiDocs'));
const Maintenance = React.lazy(() => import('./pages/Maintenance'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Componente para proteger rotas autenticadas
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/maintenance" element={<Maintenance />} />

      {/* Rotas protegidas */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/agents" replace />} />
        <Route path="agents" element={<Agents />} />
        <Route path="workflows" element={<Workflows />} />
        <Route path="customers" element={<Customers />} />
        <Route path="settings" element={<Settings />} />
        <Route path="connectors" element={<Connectors />} />
        <Route path="api" element={<ApiDocs />} />
      </Route>

      {/* Rota 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
