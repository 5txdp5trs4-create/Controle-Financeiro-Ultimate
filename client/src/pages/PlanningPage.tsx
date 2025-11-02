import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GoalCard from "@/components/GoalCard";
import SalaryCalculator from "@/components/SalaryCalculator";
import InvestmentManager from "@/components/InvestmentManager";
import BarChart from "@/components/BarChart";
import PieChart from "@/components/PieChart";
import { Card } from "@/components/ui/card";
import type { Goal, SalaryData, Investment } from "@/lib/storage";

export default function PlanningPage() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Fundo de Emergência',
      targetAmount: 10000,
      currentAmount: 6500,
      deadline: '2025-12-31'
    }
  ]);

  const [investments, setInvestments] = useState<Investment[]>([
    {
      id: '1',
      name: 'Tesouro Selic',
      type: 'Renda Fixa',
      amount: 10000,
      returnType: 'percentage',
      returnValue: 0.8,
      date: '2025-01-15'
    }
  ]);

  const gainsData = [
    { label: 'Jan', value: 80 },
    { label: 'Fev', value: 85 },
    { label: 'Mar', value: 90 },
  ];

  const portfolioData = [
    { label: 'Renda Fixa', value: 10000, color: 'hsl(var(--chart-1))' },
    { label: 'Ações', value: 5000, color: 'hsl(var(--chart-2))' },
    { label: 'Fundos', value: 3000, color: 'hsl(var(--chart-3))' },
  ];

  return (
    <div className="p-4 pb-20 space-y-6">
      <h2 className="text-2xl font-bold">Planejamentos e Metas</h2>

      <Tabs defaultValue="goals" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="goals" data-testid="tab-goals">Metas</TabsTrigger>
          <TabsTrigger value="salary" data-testid="tab-salary">Salário</TabsTrigger>
          <TabsTrigger value="investments" data-testid="tab-investments">Investimentos</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Minhas Metas</h3>
            <Button size="sm" data-testid="button-add-goal">
              <Plus className="w-4 h-4 mr-1" />
              Nova Meta
            </Button>
          </div>

          <div className="space-y-4">
            {goals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={(g) => console.log('Editar:', g)}
                onDelete={(g) => setGoals(prev => prev.filter(goal => goal.id !== g.id))}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="salary" className="mt-6">
          <SalaryCalculator
            onSave={(data) => console.log('Salário salvo:', data)}
          />
        </TabsContent>

        <TabsContent value="investments" className="space-y-4 mt-6">
          <InvestmentManager
            investments={investments}
            onSave={setInvestments}
          />

          <div className="grid gap-4 mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Ganhos Mensais</h3>
              <BarChart data={gainsData} color="hsl(var(--chart-2))" />
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Carteira de Investimentos</h3>
              <PieChart data={portfolioData} size={220} />
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
