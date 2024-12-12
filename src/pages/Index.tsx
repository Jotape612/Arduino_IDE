import { ShelfCard } from "@/components/ShelfCard";

// Dados mockados para exemplo
const mockShelves = [
  { id: 1, name: "Prateleira A1", capacity: 100, usedSpace: 75 },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-secondary p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Dashboard de Prateleiras</h1>
          <p className="text-gray-600 mt-2">Gerencie suas prateleiras e monitore a capacidade</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockShelves.map((shelf) => (
            <ShelfCard
              key={shelf.id}
              id={shelf.id}
              name={shelf.name}
              capacity={shelf.capacity}
              usedSpace={shelf.usedSpace}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;