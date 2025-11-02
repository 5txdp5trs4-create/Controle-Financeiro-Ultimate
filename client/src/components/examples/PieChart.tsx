import { Card } from "../ui/card";
import PieChart from "../PieChart";

export default function PieChartExample() {
  const mockData = [
    { label: 'Alimentação', value: 1200, color: 'hsl(var(--chart-1))' },
    { label: 'Transporte', value: 450, color: 'hsl(var(--chart-2))' },
    { label: 'Moradia', value: 1800, color: 'hsl(var(--chart-3))' },
    { label: 'Lazer', value: 300, color: 'hsl(var(--chart-4))' },
    { label: 'Saúde', value: 600, color: 'hsl(var(--chart-5))' },
  ];

  return (
    <div className="bg-background p-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Distribuição por Categoria</h3>
        <PieChart data={mockData} size={240} />
      </Card>
    </div>
  );
}
