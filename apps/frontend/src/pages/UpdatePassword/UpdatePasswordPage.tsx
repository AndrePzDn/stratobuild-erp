import UpdatePasswordForm from "./components/UpdatePasswordForm";

export default function UpdatePasswordPage() {
  return (
    <main className="flex h-screen items-center justify-center bg-slate-200">
      <article className="flex w-1/2 h-2/3 shadow-lg rounded-4xl bg-white overflow-clip">
        <section className="flex flex-col w-full items-center justify-center p-8">
          <header className="w-full mb-4">
            <h1 className="text-center text-3xl font-extrabold tracking-tight text-balance mb-8">
              Actualizar Contraseña
            </h1>
          </header>
          <UpdatePasswordForm />
        </section>
      </article>
    </main>
  );
}
