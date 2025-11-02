import { useState } from "react";
import { Wallet, TrendingUp, TrendingDown, DollarSign, Plus, Search } from "lucide-react";
import MonthSelector from "@/components/MonthSelector";
import SummaryCard from "@/components/SummaryCard";
import TransactionItem from "@/components/TransactionItem";
import TransactionModal from "@/components/TransactionModal";
import BarChart from "@/components/BarChart";
import PieChart from "@/components/PieChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Transaction } from "@/lib/storage";

export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date(2025, 0, 1));
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'income',
      amount: 5000,
      category: 'Salário',
      description: 'Salário Março',
      date: '2025-03-01',
      recurrence: 'monthly',
      recurrenceGroupId: 'salary'
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
  ]);

  const handleSaveTransaction = (transaction: Partial<Transaction>) => {
    if (transaction.id) {
      setTransactions(prev => prev.map(t => t.id === transaction.id ? { ...t, ...transaction } as Transaction : t));
    } else {
      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString(),
      } as Transaction;
      setTransactions(prev => [...prev, newTransaction]);
    }
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const monthlyData = [
    { label: 'Jan', value: 4500 },
    { label: 'Fev', value: 5200 },
    { label: 'Mar', value: balance },
  ];

  const categoryData = [
    { label: 'Alimentação', value: 1200, color: 'hsl(var(--chart-1))' },
    { label: 'Transporte', value: 450, color: 'hsl(var(--chart-2))' },
    { label: 'Moradia', value: 1800, color: 'hsl(var(--chart-3))' },
  ];

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="pb-20">
      <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
      
      <div className="p-4 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <SummaryCard icon={Wallet} label="Saldo Total" value={balance} trend={12.5} />
          <SummaryCard icon={TrendingUp} label="Receitas" value={totalIncome} iconColor="bg-chart-2/10 text-chart-2" />
          <SummaryCard icon={TrendingDown} label="Despesas" value={totalExpense} iconColor="bg-destructive/10 text-destructive" />
          <SummaryCard icon={DollarSign} label="Saldo do Mês" value={balance} />
        </div>

        <div className="grid gap-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Evolução Mensal</h3>
            <BarChart data={monthlyData} />
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Distribuição por Categoria</h3>
            <PieChart data={categoryData} size={220} />
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Transações Recentes</h3>
            <Button onClick={() => setShowTransactionModal(true)} data-testid="button-add-transaction">
              <Plus className="w-4 h-4 mr-1" />
              Nova
            </Button>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-transactions"
              />
            </div>
            <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
              <SelectTrigger className="w-32" data-testid="select-filter-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="income">Receitas</SelectItem>
                <SelectItem value="expense">Despesas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            {filteredTransactions.map(transaction => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onEdit={() => {}}
                onDelete={() => setTransactions(prev => prev.filter(t => t.id !== transaction.id))}
              />
            ))}
          </div>
        </div>
      </div>

      <TransactionModal
        open={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        onSave={handleSaveTransaction}
      />
    </div>
  );
}
