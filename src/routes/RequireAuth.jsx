import toast from 'react-hot-toast';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const token = sessionStorage.getItem('loggedIn');
  const location = useLocation();

  if (!token) {
    toast.error('You must be logged in to view this page.', { duration: 3000 });
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
