import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/login" />;
}
export default ProtectedRoute;