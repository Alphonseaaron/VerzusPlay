import { Navigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  allowGuest?: boolean;
}

export function AuthGuard({ children, allowGuest = false }: AuthGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  if (!user && !allowGuest) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}