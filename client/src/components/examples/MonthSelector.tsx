import { useState } from "react";
import MonthSelector from "../MonthSelector";

export default function MonthSelectorExample() {
  const [month, setMonth] = useState(new Date(2025, 0, 1));
  
  return (
    <div className="bg-background min-h-screen">
      <MonthSelector selectedMonth={month} onMonthChange={setMonth} />
    </div>
  );
}
