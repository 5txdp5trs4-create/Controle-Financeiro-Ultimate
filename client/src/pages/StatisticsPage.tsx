import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Calendar, PieChart as PieChartIcon, BarChart3, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { storage, type Transaction } from "@/lib/storage";
import { formatCurrency } from "@/lib/currency";
import BarChart from "@/components/BarChart";
import PieChart from "@/components/PieChart";
import LineChart from "@/components/LineChart";

type TimePeriod = 'week' | 'month' | 'quarter' | 'year' | 'all';

export default function StatisticsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [period, setPeriod] = useState<TimePeriod>('month');

  useEffect(() => {
    const data = storage.getTransactions();
    setTransactions(data);
  }, []);

  const filterByPeriod = (transactions: Transaction[]) => {
    if (period === 'all') return transactions;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      
      switch (period) {
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return transactionDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return transactionDate >= monthAgo;
        case 'quarter':
          const quarterAgo = new Date(today);
          quarterAgo.setMonth(quarterAgo.getMonth() - 3);
          return transactionDate >= quarterAgo;
        case 'year':
          const yearAgo = new Date(today);
          yearAgo.setFullYear(yearAgo.getFullYear() - 1);
          return transactionDate >= yearAgo;
        default:
          return true;
      }
    });
  };

  const filteredTransactions = filterByPeriod(transactions);

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;
  const averageIncome = filteredTransactions.filter(t => t.type === 'income').length > 0 
    ? totalIncome / filteredTransactions.filter(t => t.type === 'income').length 
    : 0;
  const averageExpense = filteredTransactions.filter(t => t.type === 'expense').length > 0
    ? totalExpense / filteredTransactions.filter(t => t.type === 'expense').length
    : 0;

  const getCategoryData = () => {
    const categoryMap: { [key: string]: number } = {};
    
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      });

    const colors = [
      'hsl(var(--chart-1))',
      'hsl(var(--chart-2))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
      'hsl(var(--chart-5))',
    ];

    return Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, value], index) => ({
        label,
        value,
        color: colors[index % colors.length],
      }));
  };

  const getMonthlyTrend = () => {
    const monthlyMap: { [key: string]: { income: number; expense: number } } = {};
    
    filteredTransactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { income: 0, expense: 0 };
      }
      
      if (t.type === 'income') {
        monthlyMap[monthKey].income += t.amount;
      } else {
        monthlyMap[monthKey].expense += t.amount;
      }
    });

    const sortedMonths = Object.keys(monthlyMap).sort();
    const lastMonths = sortedMonths.slice(-6);

    return lastMonths.map(key => {
      const [year, month] = key.split('-');
      const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('pt-BR', { month: 'short' });
      return {
        label: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        value: monthlyMap[key].income - monthlyMap[key].expense,
      };
    });
  };

  const getIncomeVsExpenseTrend = () => {
    const monthlyMap: { [key: string]: { income: number; expense: number } } = {};
    
    filteredTransactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { income: 0, expense: 0 };
      }
      
      if (t.type === 'income') {
        monthlyMap[monthKey].income += t.amount;
      } else {
        monthlyMap[monthKey].expense += t.amount;
      }
    });

    const sortedMonths = Object.keys(monthlyMap).sort();
    const lastMonths = sortedMonths.slice(-6);

    return {
      income: lastMonths.map(key => {
        const [year, month] = key.split('-');
        const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('pt-BR', { month: 'short' });
        return {
          label: monthName.charAt(0).toUpperCase() + monthName.slice(1),
          value: monthlyMap[key].income,
        };
      }),
      expense: lastMonths.map(key => {
        const [year, month] = key.split('-');
        const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('pt-BR', { month: 'short' });
        return {
          label: monthName.charAt(0).toUpperCase() + monthName.slice(1),
          value: monthlyMap[key].expense,
        };
      }),
    };
  };

  const categoryData = getCategoryData();
  const monthlyTrend = getMonthlyTrend();
  const incomeVsExpense = getIncomeVsExpenseTrend();

  const getRecurrenceStats = () => {
    const recurrenceMap: { [key: string]: number } = {};
    
    filteredTransactions.forEach(t => {
      const recurrence = t.recurrence === 'none' ? 'Única' : 
                        t.recurrence === 'daily' ? 'Diária' :
                        t.recurrence === 'weekly' ? 'Semanal' :
                        t.recurrence === 'biweekly' ? 'Quinzenal' :
                        t.recurrence === 'monthly' ? 'Mensal' :
                        t.recurrence === 'semiannual' ? 'Semestral' : 'Anual';
      
      recurrenceMap[recurrence] = (recurrenceMap[recurrence] || 0) + 1;
    });

    return Object.entries(recurrenceMap).map(([label, value]) => ({
      label,
      count: value,
    }));
  };

  const recurrenceStats = getRecurrenceStats();

  return (
    <div className="pb-20 p-4 space-y-4 md:space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold">Estatísticas</h2>
        <Select value={period} onValueChange={(v: any) => setPeriod(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Última semana</SelectItem>
            <SelectItem value="month">Último mês</SelectItem>
            <SelectItem value="quarter">Último trimestre</SelectItem>
            <SelectItem value="year">Último ano</SelectItem>
            <SelectItem value="all">Todo período</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-chart-2" />
            <p className="text-xs text-muted-foreground">Total Receitas</p>
          </div>
          <p className="text-lg font-semibold text-chart-2">{formatCurrency(totalIncome)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Média: {formatCurrency(averageIncome)}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-destructive" />
            <p className="text-xs text-muted-foreground">Total Despesas</p>
          </div>
          <p className="text-lg font-semibold text-destructive">{formatCurrency(totalExpense)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Média: {formatCurrency(averageExpense)}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground">Saldo Período</p>
          </div>
          <p className={`text-lg font-semibold ${balance >= 0 ? 'text-chart-2' : 'text-destructive'}`}>
            {formatCurrency(balance)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {filteredTransactions.length} transações
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground">Taxa Economia</p>
          </div>
          <p className={`text-lg font-semibold ${balance >= 0 ? 'text-chart-2' : 'text-destructive'}`}>
            {totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : '0'}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {balance >= 0 ? 'Economizando' : 'Déficit'}
          </p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="text-base md:text-lg font-semibold">Evolução do Saldo</h3>
          </div>
          {monthlyTrend.length > 0 ? (
            <BarChart data={monthlyTrend} />
          ) : (
            <p className="text-muted-foreground text-center py-8">Sem dados para exibir</p>
          )}
        </Card>

        <Card className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-primary" />
            <h3 className="text-base md:text-lg font-semibold">Gastos por Categoria</h3>
          </div>
          {categoryData.length > 0 ? (
            <>
              <PieChart data={categoryData} size={220} />
              <div className="mt-4 space-y-2">
                {categoryData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.label}</span>
                    </div>
                    <span className="font-medium">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-center py-8">Sem dados para exibir</p>
          )}
        </Card>
      </div>

      <Card className="p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="text-base md:text-lg font-semibold">Receitas vs Despesas</h3>
        </div>
        <div className="space-y-4">
          {incomeVsExpense.income.length > 0 ? (
            <>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Receitas</p>
                <LineChart data={incomeVsExpense.income} height={200} color="hsl(var(--chart-2))" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Despesas</p>
                <LineChart data={incomeVsExpense.expense} height={200} color="hsl(var(--destructive))" />
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-center py-8">Sem dados para exibir</p>
          )}
        </div>
      </Card>

      <Card className="p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-base md:text-lg font-semibold">Transações por Recorrência</h3>
        </div>
        {recurrenceStats.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {recurrenceStats.map((stat, index) => (
              <div key={index} className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.count}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {((stat.count / filteredTransactions.length) * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">Sem dados para exibir</p>
        )}
      </Card>
    </div>
  );
}
