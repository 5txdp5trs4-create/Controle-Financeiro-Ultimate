import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";
import { formatCurrency } from "@/lib/currency";

interface SummaryCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  trend?: number;
  iconColor?: string;
}

export default function SummaryCard({ icon: Icon, label, value, trend, iconColor = "bg-primary/10 text-primary" }: SummaryCardProps) {
  return (
    <Card className="p-4" data-testid={`card-summary-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium ${trend >= 0 ? 'text-chart-2' : 'text-destructive'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">{label}</p>
        <p className="text-2xl font-bold mt-1 tabular-nums" data-testid={`text-${label.toLowerCase().replace(/\s+/g, '-')}-value`}>
          {formatCurrency(value)}
        </p>
      </div>
    </Card>
  );
}
