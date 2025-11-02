import { Pencil, Trash2 } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { formatCurrency } from "@/lib/currency";
import type { Goal } from "@/lib/storage";

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
}

export default function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const deadline = new Date(goal.deadline).toLocaleDateString('pt-BR');

  return (
    <Card className="p-4 group" data-testid={`card-goal-${goal.id}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-base" data-testid={`text-goal-name-${goal.id}`}>{goal.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">Meta até {deadline}</p>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onEdit(goal)}
            data-testid={`button-edit-goal-${goal.id}`}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onDelete(goal)}
            data-testid={`button-delete-goal-${goal.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Progress value={progress} className="h-3 mb-3" />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Progresso</p>
          <p className="text-lg font-bold tabular-nums" data-testid={`text-goal-current-${goal.id}`}>
            {formatCurrency(goal.currentAmount)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Meta</p>
          <p className="text-lg font-bold tabular-nums" data-testid={`text-goal-target-${goal.id}`}>
            {formatCurrency(goal.targetAmount)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-primary" data-testid={`text-goal-percentage-${goal.id}`}>
            {progress.toFixed(0)}%
          </p>
        </div>
      </div>
    </Card>
  );
}
