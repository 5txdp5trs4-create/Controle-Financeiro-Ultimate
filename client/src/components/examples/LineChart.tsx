import { Card } from "../ui/card";
import LineChart from "../LineChart";

export default function LineChartExample() {
  const mockData = [
    { label: 'Jan', value: 2500 },
    { label: 'Fev', value: 3200 },
    { label: 'Mar', value: 4100 },
    { label: 'Abr', value: 3800 },
    { label: 'Mai', value: 4500 },
    { label: 'Jun', value: 5200 },
  ];

  return (
    <div className="bg-background p-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Evolução do Saldo</h3>
        <LineChart data={mockData} color="hsl(var(--chart-2))" />
      </Card>
    </div>
  );
}
