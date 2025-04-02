
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface CandidateRouteProps {
  children: ReactNode;
}

const CandidateRoute = ({ children }: CandidateRouteProps) => {
  const { isAuthenticated, isCandidate, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isCandidate) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default CandidateRoute;
