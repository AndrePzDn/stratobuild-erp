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
    <main className="flex h-screen items-center justify-center bg-slate-200">
      <article className="flex w-1/2 h-2/3 shadow-lg rounded-4xl bg-white overflow-clip">
        <figure className="flex w-full h-full">
          <img
            src={ConstructionPlan}
            alt="Construction Plan"
            className="h-full w-full object-cover"
          />
        </figure>
        <section className="flex flex-col w-full items-center justify-center p-8">
          <header>
            <h1 className="text-center text-3xl font-extrabold tracking-tight text-balance mb-8">
              Iniciar Sesión
            </h1>
          </header>
          <LoginForm />
        </section>
      </article>
    </main>
  );
}
