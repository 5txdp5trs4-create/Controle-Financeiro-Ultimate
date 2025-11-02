import { useState } from "react";
import { X, Coffee, Car, Home as HomeIcon, Heart, Film, Briefcase, ShoppingCart, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { Transaction, RecurrenceType } from "@/lib/storage";

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (transaction: Partial<Transaction>) => void;
  transaction?: Transaction;
}

const CATEGORIES = [
  { name: 'Alimentação', icon: Coffee, type: 'expense' },
  { name: 'Transporte', icon: Car, type: 'expense' },
  { name: 'Moradia', icon: HomeIcon, type: 'expense' },
  { name: 'Saúde', icon: Heart, type: 'expense' },
  { name: 'Lazer', icon: Film, type: 'expense' },
  { name: 'Compras', icon: ShoppingCart, type: 'expense' },
  { name: 'Salário', icon: Briefcase, type: 'income' },
  { name: 'Freelance', icon: Plus, type: 'income' },
];

const RECURRENCE_OPTIONS: { value: RecurrenceType; label: string }[] = [
  { value: 'none', label: 'Sem recorrência' },
  { value: 'daily', label: 'Diariamente' },
  { value: 'weekly', label: 'Semanalmente' },
  { value: 'biweekly', label: 'A cada 15 dias' },
  { value: 'monthly', label: 'Mensalmente' },
  { value: 'semiannual', label: 'A cada 6 meses' },
  { value: 'annual', label: 'Anualmente' },
];

export default function TransactionModal({ open, onClose, onSave, transaction }: TransactionModalProps) {
  const [type, setType] = useState<'income' | 'expense'>(transaction?.type || 'expense');
  const [amount, setAmount] = useState(transaction?.amount.toString() || '');
  const [description, setDescription] = useState(transaction?.description || '');
  const [category, setCategory] = useState(transaction?.category || '');
  const [date, setDate] = useState(transaction?.date || new Date().toISOString().split('T')[0]);
  const [recurrence, setRecurrence] = useState<RecurrenceType>(transaction?.recurrence || 'none');

  const handleSave = () => {
    onSave({
      id: transaction?.id,
      type,
      amount: parseFloat(amount),
      description,
      category,
      date,
      recurrence,
      recurrenceGroupId: transaction?.recurrenceGroupId,
    });
    onClose();
  };

  const filteredCategories = CATEGORIES.filter(c => c.type === type);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg" data-testid="dialog-transaction">
        <DialogHeader>
          <DialogTitle>{transaction ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex gap-2">
            <Button
              variant={type === 'expense' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setType('expense')}
              data-testid="button-type-expense"
            >
              Despesa
            </Button>
            <Button
              variant={type === 'income' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setType('income')}
              data-testid="button-type-income"
            >
              Receita
            </Button>
          </div>

          <div>
            <Label htmlFor="amount">Valor</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              data-testid="input-amount"
              className="text-right tabular-nums"
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Mercado da semana"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-testid="input-description"
            />
          </div>

          <div>
            <Label>Categoria</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {filteredCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setCategory(cat.name)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors ${
                      category === cat.name
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover-elevate'
                    }`}
                    data-testid={`button-category-${cat.name.toLowerCase()}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs text-center">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              data-testid="input-date"
            />
          </div>

          <div>
            <Label htmlFor="recurrence">Recorrência</Label>
            <Select value={recurrence} onValueChange={(v) => setRecurrence(v as RecurrenceType)}>
              <SelectTrigger id="recurrence" data-testid="select-recurrence">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RECURRENCE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1" data-testid="button-cancel">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1" data-testid="button-save">
              {transaction ? 'Salvar' : 'Adicionar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
