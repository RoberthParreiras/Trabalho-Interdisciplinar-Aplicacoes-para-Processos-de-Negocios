// components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';

export default function RotaProtegida() {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <div>Carregando...</div>;
  }

  return usuario ? <Outlet /> : <Navigate to="/login" replace />;
}