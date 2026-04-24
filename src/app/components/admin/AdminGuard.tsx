import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { AdminLoader } from "./AdminLoader"; 

export function AdminGuard() {
  const { user, isAuthLoading } = useAuth();

  // 1. Wait for Laravel to confirm the session using our premium loader!
  if (isAuthLoading) {
    return <AdminLoader />;
  }

  // 2. Auth check is complete. Are they logged in AND an admin?
  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    return <Navigate to="/login" replace />;
  }

  // 3. They are a verified admin. Let them through!
  return <Outlet />;
}