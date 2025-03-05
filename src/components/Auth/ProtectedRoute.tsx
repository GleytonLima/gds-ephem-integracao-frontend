import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../../services/auth.service';

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  redirectPath = '/login'
}) => {
  if (!isAuthenticated()) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute; 