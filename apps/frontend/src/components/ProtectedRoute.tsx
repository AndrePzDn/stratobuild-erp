import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import Sidebar from "./Sidebar";

export const ProtectedRoute = () => {
  const isAuth = useAuthStore((state) => state.isAuthenticated());

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto relative">
        <Outlet />
      </main>
    </div>
  );
};
