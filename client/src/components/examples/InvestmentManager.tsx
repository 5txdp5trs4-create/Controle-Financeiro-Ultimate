import { useState } from "react";
import InvestmentManager from "../InvestmentManager";
import type { Investment } from "@/lib/storage";

export default function InvestmentManagerExample() {
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

  return (
    <div className="bg-background p-4">
      <InvestmentManager
        investments={investments}
        onSave={setInvestments}
      />
    </div>
  );
}
