import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ShelfCardProps {
  id: number;
  name: string;
  capacity: number;
  usedSpace: number;
}

export const ShelfCard = ({ id, name, capacity, usedSpace }: ShelfCardProps) => {
  const usagePercentage = (usedSpace / capacity) * 100;
  
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-primary pb-2">
        <CardTitle className="text-white text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Capacidade:</span>
            <span className="font-medium">{capacity} itens</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Em uso:</span>
            <span className="font-medium">{usedSpace} itens</span>
          </div>
          <div className="mt-4">
            <div className="w-full bg-secondary-dark rounded-full h-2">
              <div
                className={`h-full rounded-full ${
                  usagePercentage > 90 ? 'bg-red-500' : 'bg-accent'
                }`}
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 text-right">
              {usagePercentage.toFixed(1)}% utilizado
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};