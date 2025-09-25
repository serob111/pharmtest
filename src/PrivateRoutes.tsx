
import { ReactNode } from "react";
import { useAuth } from "./context/AuthProvider";
import { Navigate } from "react-router";

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const auth = useAuth();

  if (auth === undefined) {
    return null; 
  }

  if (!auth) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}
