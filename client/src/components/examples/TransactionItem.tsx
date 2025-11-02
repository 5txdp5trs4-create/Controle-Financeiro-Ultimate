import TransactionItem from "../TransactionItem";
import type { Transaction } from "@/lib/storage";

export default function TransactionItemExample() {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      type: 'income',
      amount: 5000,
      category: 'Salário',
      description: 'Salário Março',
      date: '2025-03-01',
      recurrence: 'monthly',
      recurrenceGroupId: 'salary-group'
    },
    {
      id: '2',
      type: 'expense',
      amount: 250.50,
      category: 'Alimentação',
      description: 'Mercado da semana',
      date: '2025-03-15',
      recurrence: 'none'
    },
    {
      id: '3',
      type: 'expense',
      amount: 1200,
      category: 'Moradia',
      description: 'Aluguel',
      date: '2025-03-05',
      recurrence: 'monthly',
      recurrenceGroupId: 'rent-group'
    }
  ];

  return (
    <div className="bg-background p-4 space-y-2">
      {mockTransactions.map(transaction => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onEdit={(t) => console.log('Editar:', t)}
          onDelete={(t) => console.log('Excluir:', t)}
        />
      ))}
    </div>
  );
}
