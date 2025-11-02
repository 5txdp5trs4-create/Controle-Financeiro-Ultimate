import { Pencil, Trash2, ShoppingCart, Coffee, Home as HomeIcon, Car, Heart, Film, Briefcase, Repeat } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { formatCurrency } from "@/lib/currency";
import type { Transaction } from "@/lib/storage";

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  'Alimentação': Coffee,
  'Transporte': Car,
  'Moradia': HomeIcon,
  'Saúde': Heart,
  'Lazer': Film,
  'Salário': Briefcase,
  'Compras': ShoppingCart,
};

const RECURRENCE_LABELS: Record<string, string> = {
  'none': '',
  'daily': 'Diário',
  'weekly': 'Semanal',
  'biweekly': '15 dias',
  'monthly': 'Mensal',
  'semiannual': '6 meses',
  'annual': 'Anual',
};

export default function TransactionItem({ transaction, onEdit, onDelete }: TransactionItemProps) {
  const Icon = CATEGORY_ICONS[transaction.category] || ShoppingCart;
  const isIncome = transaction.type === 'income';

  return (
    <div
      className="flex items-center justify-between p-3 hover-elevate rounded-lg border border-transparent group"
      data-testid={`transaction-item-${transaction.id}`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          isIncome ? 'bg-chart-2/10 text-chart-2' : 'bg-destructive/10 text-destructive'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm truncate" data-testid={`text-transaction-description-${transaction.id}`}>
              {transaction.description}
            </p>
            {transaction.recurrence !== 'none' && (
              <Badge variant="secondary" className="text-xs flex items-center gap-1">
                <Repeat className="w-3 h-3" />
                {RECURRENCE_LABELS[transaction.recurrence]}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {transaction.category} • {new Date(transaction.date).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="text-right mr-2">
          <p className={`font-semibold text-base tabular-nums ${isIncome ? 'text-chart-2' : 'text-destructive'}`}
             data-testid={`text-transaction-amount-${transaction.id}`}>
            {isIncome ? '+' : '-'} {formatCurrency(Math.abs(transaction.amount))}
          </p>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onEdit(transaction)}
            data-testid={`button-edit-${transaction.id}`}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onDelete(transaction)}
            data-testid={`button-delete-${transaction.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
