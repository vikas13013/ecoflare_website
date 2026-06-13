import React from "react";
import { Navigate } from "react-router-dom";
import { RootState } from "../app/store";
import { useSelector } from "react-redux";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // restrict route by roles
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  // ✅ Better check for logged in user
  const isLoggedIn = !!(user && (user.email || user.id));

  if (!isLoggedIn) {
    return <Navigate to="/register" replace />;
  }

  // ✅ Role check - add additional safety checks
  if (allowedRoles && allowedRoles.length > 0) {
    // Check if user has roles and if it includes any of the allowed roles
    const hasRole = user.roles && 
      allowedRoles
        .map(r => r.toLowerCase())
        .includes(user.roles.toLowerCase());
    
    if (!hasRole) {
      return <Navigate to="/register" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;