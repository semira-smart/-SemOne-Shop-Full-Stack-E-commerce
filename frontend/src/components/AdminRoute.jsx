// frontend/src/components/AdminRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * AdminRoute Component
 * Redirects to home if user is not Admin
 */
const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useContext(AuthContext);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if not admin
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  // Render admin content if user is admin
  return children;
};

export default AdminRoute;