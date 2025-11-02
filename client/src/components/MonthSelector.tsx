import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface MonthSelectorProps {
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
}

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function MonthSelector({ selectedMonth, onMonthChange }: MonthSelectorProps) {
  const handlePrevMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  return (
    <div className="sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-card border-b border-card-border">
      <Button
        size="icon"
        variant="ghost"
        onClick={handlePrevMonth}
        data-testid="button-prev-month"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      
      <div className="text-lg font-semibold text-foreground" data-testid="text-current-month">
        {MONTHS[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
      </div>
      
      <Button
        size="icon"
        variant="ghost"
        onClick={handleNextMonth}
        data-testid="button-next-month"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
