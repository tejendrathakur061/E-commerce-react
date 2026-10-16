import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoutes = ({ children, role }) => {
  const { currentUser: user } = useAuth();
  {
    if (!user) return <Navigate to="/login" replace />;

    if (user.role !== role)
      return user.role === "admin" ? (
        <Navigate to="/admin/dashboard" replace />
      ) : (
        <Navigate to="/products" replace />
      );

    return children;
  }
};

export default ProtectedRoutes;

export const AuthRoute = ({ children }) => {
  const { currentUser: user } = useAuth();

  if (user)
    return user.role === "admin" ? (
      <Navigate to="/admin" replace />
    ) : (
      <Navigate to="/products" replace />
    );

  return children;
};
