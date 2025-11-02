import { Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import SummaryCard from "../SummaryCard";

export default function SummaryCardExample() {
  return (
    <div className="bg-background p-4">
      <div className="grid grid-cols-2 gap-3 max-w-4xl">
        <SummaryCard
          icon={Wallet}
          label="Saldo Total"
          value={5420.50}
          trend={12.5}
        />
        <SummaryCard
          icon={TrendingUp}
          label="Receitas"
          value={8500.00}
          trend={5.2}
          iconColor="bg-chart-2/10 text-chart-2"
        />
        <SummaryCard
          icon={TrendingDown}
          label="Despesas"
          value={3079.50}
          trend={-2.1}
          iconColor="bg-destructive/10 text-destructive"
        />
        <SummaryCard
          icon={DollarSign}
          label="Saldo do Mês"
          value={5420.50}
        />
      </div>
    </div>
  );
}
