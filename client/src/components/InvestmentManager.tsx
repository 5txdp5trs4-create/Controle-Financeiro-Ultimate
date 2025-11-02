import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { formatCurrency } from "@/lib/currency";
import type { Investment } from "@/lib/storage";

interface InvestmentManagerProps {
  investments: Investment[];
  onSave: (investments: Investment[]) => void;
}

export default function InvestmentManager({ investments, onSave }: InvestmentManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [returnType, setReturnType] = useState<'percentage' | 'fixed'>('percentage');
  const [returnValue, setReturnValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const resetForm = () => {
    setName('');
    setType('');
    setAmount('');
    setReturnValue('');
    setDate(new Date().toISOString().split('T')[0]);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = () => {
    const investment: Investment = {
      id: editingId || Date.now().toString(),
      name,
      type,
      amount: parseFloat(amount),
      returnType,
      returnValue: parseFloat(returnValue),
      date,
    };

    if (editingId) {
      onSave(investments.map(inv => inv.id === editingId ? investment : inv));
    } else {
      onSave([...investments, investment]);
    }
    resetForm();
  };

  const handleEdit = (investment: Investment) => {
    setName(investment.name);
    setType(investment.type);
    setAmount(investment.amount.toString());
    setReturnType(investment.returnType);
    setReturnValue(investment.returnValue.toString());
    setDate(investment.date);
    setEditingId(investment.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    onSave(investments.filter(inv => inv.id !== id));
  };

  const calculateReturn = (inv: Investment) => {
    if (inv.returnType === 'percentage') {
      return (inv.amount * inv.returnValue) / 100;
    }
    return inv.returnValue;
  };

  return (
    <Card className="p-6" data-testid="card-investment-manager">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Investimentos</h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)} data-testid="button-toggle-investment-form">
          <Plus className="w-4 h-4 mr-1" />
          Novo Investimento
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-muted rounded-lg space-y-3">
          <div>
            <Label htmlFor="inv-name">Nome do Investimento</Label>
            <Input
              id="inv-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Tesouro Direto"
              data-testid="input-investment-name"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="inv-type">Tipo</Label>
              <Input
                id="inv-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Ex: Renda Fixa"
                data-testid="input-investment-type"
              />
            </div>
            <div>
              <Label htmlFor="inv-amount">Valor Investido</Label>
              <Input
                id="inv-amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                data-testid="input-investment-amount"
                className="text-right tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="inv-return">Rendimento</Label>
              <Input
                id="inv-return"
                type="number"
                step="0.01"
                value={returnValue}
                onChange={(e) => setReturnValue(e.target.value)}
                data-testid="input-investment-return"
                className="text-right tabular-nums"
              />
            </div>
            <div>
              <Label htmlFor="inv-return-type">Tipo de Rendimento</Label>
              <Select value={returnType} onValueChange={(v: 'percentage' | 'fixed') => setReturnType(v)}>
                <SelectTrigger id="inv-return-type" data-testid="select-return-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentual (%)</SelectItem>
                  <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="inv-date">Data do Aporte</Label>
            <Input
              id="inv-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              data-testid="input-investment-date"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={resetForm} className="flex-1" data-testid="button-cancel-investment">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1" data-testid="button-save-investment">
              {editingId ? 'Atualizar' : 'Adicionar'}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {investments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum investimento cadastrado
          </p>
        ) : (
          investments.map((inv) => {
            const monthlyReturn = calculateReturn(inv);
            return (
              <div
                key={inv.id}
                className="flex items-center justify-between p-3 rounded-lg border hover-elevate group"
                data-testid={`investment-${inv.id}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{inv.name}</p>
                    <span className="text-xs text-muted-foreground">• {inv.type}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(inv.amount)} • Rendimento mensal: {formatCurrency(monthlyReturn)}
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => handleEdit(inv)}
                    data-testid={`button-edit-investment-${inv.id}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => handleDelete(inv.id)}
                    data-testid={`button-delete-investment-${inv.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
