import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Spinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground font-medium">Carregando...</p>
    </div>
  </div>
);

export default function ProtectedRoute() {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  if (isLoadingAuth) return <Spinner />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
