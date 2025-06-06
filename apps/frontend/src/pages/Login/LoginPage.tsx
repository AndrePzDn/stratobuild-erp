import { useAuthStore } from "@/stores/authStore";
import ConstructionPlan from "../../assets/high-angle-measuring-tools-still-life.webp";
import LoginForm from "./components/LoginForm";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated()) {
    return <Navigate to="/home" replace />;
  }

  return (
    <main className="flex h-screen">
      <aside className="w-1/2 h-full">
        <img
          src={ConstructionPlan}
          alt="StratoBuild Logo"
          className="h-full w-full object-cover"
        />
      </aside>
      <section className="w-1/2 flex items-center justify-center">
        <div className="w-2/3">
          <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance mb-8">
            Iniciar Sesión
          </h1>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
