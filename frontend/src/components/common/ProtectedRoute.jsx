import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, hydrated } = useContext(AuthContext);

  // Wait until localStorage hydration finishes to avoid flicker/incorrect redirects
  if (!hydrated) return null;

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
