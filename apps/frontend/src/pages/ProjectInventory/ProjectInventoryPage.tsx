import InventoryList from "./components/InventoryList";

export default function ProjectInventoryPage() {
  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Inventario</h1>
      </header>
      <InventoryList />
    </section>
  );
}
