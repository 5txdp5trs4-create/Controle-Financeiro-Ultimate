import { Card } from "../ui/card";
import BarChart from "../BarChart";

export default function BarChartExample() {
  const mockData = [
    { label: 'Jan', value: 4500 },
    { label: 'Fev', value: 5200 },
    { label: 'Mar', value: 4800 },
    { label: 'Abr', value: 6100 },
    { label: 'Mai', value: 5500 },
    { label: 'Jun', value: 5900 },
  ];

  return (
    <div className="bg-background p-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Evolução Mensal</h3>
        <BarChart data={mockData} />
      </Card>
    </div>
  );
}
