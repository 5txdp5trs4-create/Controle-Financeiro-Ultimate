import GoalCard from "../GoalCard";
import type { Goal } from "@/lib/storage";

export default function GoalCardExample() {
  const mockGoals: Goal[] = [
    {
      id: '1',
      name: 'Juntar para viagem',
      targetAmount: 5000,
      currentAmount: 3200,
      deadline: '2025-12-31'
    },
    {
      id: '2',
      name: 'Fundo de emergência',
      targetAmount: 10000,
      currentAmount: 6500,
      deadline: '2025-06-30'
    }
  ];

  return (
    <div className="bg-background p-4 space-y-4">
      {mockGoals.map(goal => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onEdit={(g) => console.log('Editar:', g)}
          onDelete={(g) => console.log('Excluir:', g)}
        />
      ))}
    </div>
  );
}
