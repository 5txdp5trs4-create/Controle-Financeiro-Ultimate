import { useState, useEffect } from "react";
import { Calendar, Download, Filter, Search, TrendingUp, TrendingDown, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { storage, type Transaction } from "@/lib/storage";
import { formatCurrency } from "@/lib/currency";
import TransactionItem from "@/components/TransactionItem";
import * as XLSX from 'xlsx';

type PeriodFilter = 'all' | 'today' | 'week' | 'month' | 'year' | 'custom';
type SortOrder = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('month');
  const [sortOrder, setSortOrder] = useState<SortOrder>('date-desc');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const data = storage.getTransactions();
    setTransactions(data);
  }, []);

  useEffect(() => {
    let result = [...transactions];

    if (typeFilter !== 'all') {
      result = result.filter(t => t.type === typeFilter);
    }

    if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory);
    }

    if (searchTerm) {
      result = result.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (periodFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      result = result.filter(t => {
        const transactionDate = new Date(t.date);
        
        switch (periodFilter) {
          case 'today':
            return transactionDate >= today;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return transactionDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return transactionDate >= monthAgo;
          case 'year':
            const yearAgo = new Date(today);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            return transactionDate >= yearAgo;
          default:
            return true;
        }
      });
    }

    result.sort((a, b) => {
      switch (sortOrder) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    setFilteredTransactions(result);
  }, [transactions, typeFilter, selectedCategory, searchTerm, periodFilter, sortOrder]);

  const handleExportFiltered = () => {
    const exportData = filteredTransactions.map(t => ({
      Data: t.date,
      Tipo: t.type === 'income' ? 'Receita' : 'Despesa',
      Categoria: t.category,
      Descrição: t.description,
      Valor: t.amount,
      Recorrência: t.recurrence,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Histórico');
    XLSX.writeFile(wb, `historico-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    storage.saveTransactions(updatedTransactions);
  };

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const categories = Array.from(new Set(transactions.map(t => t.category)));

  const groupByDate = (transactions: Transaction[]) => {
    const groups: { [key: string]: Transaction[] } = {};
    
    transactions.forEach(t => {
      const date = new Date(t.date);
      const key = date.toLocaleDateString('pt-BR', { 
        year: 'numeric', 
        month: 'long',
        day: 'numeric'
      });
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(t);
    });
    
    return groups;
  };

  const groupedTransactions = groupByDate(filteredTransactions);

  return (
    <div className="pb-20 p-4 space-y-4 md:space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold">Histórico Completo</h2>
        <Button 
          onClick={handleExportFiltered} 
          variant="outline" 
          size="sm"
          disabled={filteredTransactions.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-chart-2" />
            <p className="text-xs text-muted-foreground">Receitas</p>
          </div>
          <p className="text-lg font-semibold text-chart-2">{formatCurrency(totalIncome)}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-destructive" />
            <p className="text-xs text-muted-foreground">Despesas</p>
          </div>
          <p className="text-lg font-semibold text-destructive">{formatCurrency(totalExpense)}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground">Saldo</p>
          </div>
          <p className={`text-lg font-semibold ${balance >= 0 ? 'text-chart-2' : 'text-destructive'}`}>
            {formatCurrency(balance)}
          </p>
        </Card>
      </div>

      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Filter className="w-4 h-4" />
          Filtros
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por descrição ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Select value={typeFilter} onValueChange={(v: any) => setTypeFilter(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="income">Receitas</SelectItem>
              <SelectItem value="expense">Despesas</SelectItem>
            </SelectContent>
          </Select>

          <Select value={periodFilter} onValueChange={(v: any) => setPeriodFilter(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo período</SelectItem>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mês</SelectItem>
              <SelectItem value="year">Último ano</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={(v: any) => setSortOrder(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Data (mais recente)</SelectItem>
              <SelectItem value="date-asc">Data (mais antiga)</SelectItem>
              <SelectItem value="amount-desc">Valor (maior)</SelectItem>
              <SelectItem value="amount-asc">Valor (menor)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredTransactions.length} transações encontradas
          </p>
        </div>

        {Object.keys(groupedTransactions).length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Nenhuma transação encontrada</p>
          </Card>
        ) : (
          Object.entries(groupedTransactions).map(([date, transactions]) => (
            <div key={date} className="space-y-2">
              <div className="flex items-center gap-2 px-2">
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">{date}</h3>
              </div>
              {transactions.map(transaction => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={() => {}}
                  onDelete={() => handleDeleteTransaction(transaction.id)}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
