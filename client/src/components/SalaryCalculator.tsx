import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { formatCurrency } from "@/lib/currency";
import type { SalaryData } from "@/lib/storage";

interface SalaryCalculatorProps {
  initialData?: SalaryData;
  onSave: (data: SalaryData) => void;
}

export default function SalaryCalculator({ initialData, onSave }: SalaryCalculatorProps) {
  const [grossSalary, setGrossSalary] = useState(initialData?.grossSalary || 0);
  const [mealVoucher, setMealVoucher] = useState(initialData?.mealVoucher || 0);
  const [foodVoucher, setFoodVoucher] = useState(initialData?.foodVoucher || 0);
  const [bonus, setBonus] = useState(initialData?.bonus || 0);
  const [otherBenefits, setOtherBenefits] = useState(initialData?.otherBenefits || 0);
  const [deductions, setDeductions] = useState(initialData?.deductions || []);

  const addDeduction = () => {
    setDeductions([...deductions, { name: '', value: 0, isPercentage: false }]);
  };

  const updateDeduction = (index: number, field: string, value: any) => {
    const updated = [...deductions];
    updated[index] = { ...updated[index], [field]: value };
    setDeductions(updated);
  };

  const removeDeduction = (index: number) => {
    setDeductions(deductions.filter((_, i) => i !== index));
  };

  const totalDeductions = deductions.reduce((sum, d) => {
    return sum + (d.isPercentage ? (grossSalary * d.value) / 100 : d.value);
  }, 0);

  const netSalary = grossSalary - totalDeductions;
  const totalIncome = netSalary + mealVoucher + foodVoucher + bonus + otherBenefits;

  const handleSave = () => {
    onSave({
      grossSalary,
      mealVoucher,
      foodVoucher,
      bonus,
      otherBenefits,
      deductions,
    });
  };

  return (
    <Card className="p-6" data-testid="card-salary-calculator">
      <h3 className="text-lg font-semibold mb-4">Calculadora de Salário</h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor="gross-salary">Salário Bruto</Label>
          <Input
            id="gross-salary"
            type="number"
            step="0.01"
            value={grossSalary}
            onChange={(e) => setGrossSalary(parseFloat(e.target.value) || 0)}
            data-testid="input-gross-salary"
            className="text-right tabular-nums"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="meal-voucher">Vale Refeição</Label>
            <Input
              id="meal-voucher"
              type="number"
              step="0.01"
              value={mealVoucher}
              onChange={(e) => setMealVoucher(parseFloat(e.target.value) || 0)}
              data-testid="input-meal-voucher"
              className="text-right tabular-nums"
            />
          </div>
          <div>
            <Label htmlFor="food-voucher">Vale Alimentação</Label>
            <Input
              id="food-voucher"
              type="number"
              step="0.01"
              value={foodVoucher}
              onChange={(e) => setFoodVoucher(parseFloat(e.target.value) || 0)}
              data-testid="input-food-voucher"
              className="text-right tabular-nums"
            />
          </div>
          <div>
            <Label htmlFor="bonus">Bônus</Label>
            <Input
              id="bonus"
              type="number"
              step="0.01"
              value={bonus}
              onChange={(e) => setBonus(parseFloat(e.target.value) || 0)}
              data-testid="input-bonus"
              className="text-right tabular-nums"
            />
          </div>
          <div>
            <Label htmlFor="other-benefits">Outros Benefícios</Label>
            <Input
              id="other-benefits"
              type="number"
              step="0.01"
              value={otherBenefits}
              onChange={(e) => setOtherBenefits(parseFloat(e.target.value) || 0)}
              data-testid="input-other-benefits"
              className="text-right tabular-nums"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Descontos</Label>
            <Button size="sm" variant="outline" onClick={addDeduction} data-testid="button-add-deduction">
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
          </div>
          
          <div className="space-y-2">
            {deductions.map((deduction, index) => (
              <div key={index} className="flex gap-2" data-testid={`deduction-${index}`}>
                <Input
                  placeholder="Nome do desconto"
                  value={deduction.name}
                  onChange={(e) => updateDeduction(index, 'name', e.target.value)}
                  className="flex-1"
                  data-testid={`input-deduction-name-${index}`}
                />
                <Input
                  type="number"
                  step="0.01"
                  value={deduction.value}
                  onChange={(e) => updateDeduction(index, 'value', parseFloat(e.target.value) || 0)}
                  className="w-32 text-right tabular-nums"
                  data-testid={`input-deduction-value-${index}`}
                />
                <Select
                  value={deduction.isPercentage ? 'percentage' : 'fixed'}
                  onValueChange={(v) => updateDeduction(index, 'isPercentage', v === 'percentage')}
                >
                  <SelectTrigger className="w-24" data-testid={`select-deduction-type-${index}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">R$</SelectItem>
                    <SelectItem value="percentage">%</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeDeduction(index)}
                  data-testid={`button-remove-deduction-${index}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total de Descontos:</span>
            <span className="font-medium tabular-nums" data-testid="text-total-deductions">
              {formatCurrency(totalDeductions)}
            </span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>Salário Líquido:</span>
            <span className="tabular-nums text-chart-2" data-testid="text-net-salary">
              {formatCurrency(netSalary)}
            </span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>Renda Total:</span>
            <span className="tabular-nums text-primary" data-testid="text-total-income">
              {formatCurrency(totalIncome)}
            </span>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full" data-testid="button-save-salary">
          Salvar Configuração de Salário
        </Button>
      </div>
    </Card>
  );
}
