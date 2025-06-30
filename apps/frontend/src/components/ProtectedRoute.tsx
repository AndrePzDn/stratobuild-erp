import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import Sidebar from "./Sidebar";
import { useCallback, useEffect } from "react";
import { toast } from "react-toastify";

export const ProtectedRoute = () => {
  const isAuth = useAuthStore((state) => state.isAuthenticated());
  const userData = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const checkFirstLogin = useCallback(async () => {
    if (userData?.haveToUpdatePassword) {
      navigate("/update-password");
      toast.info("Debe actualizar su contraseña antes de continuar");
      return;
    }
  }, [userData, navigate]);

  useEffect(() => {
    if (isAuth) {
      checkFirstLogin();
    }
  }, [checkFirstLogin, isAuth]);

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
