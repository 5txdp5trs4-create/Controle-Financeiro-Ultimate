import { useState } from "react";
import { Plus, Pencil, Trash2, Briefcase } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { formatCurrency } from "@/lib/currency";
import type { Salary } from "@/lib/storage";

interface SalaryManagerProps {
  salaries: Salary[];
  onSave: (salaries: Salary[]) => void;
}

export default function SalaryManager({ salaries, onSave }: SalaryManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [grossSalary, setGrossSalary] = useState('');
  const [mealVoucher, setMealVoucher] = useState('');
  const [foodVoucher, setFoodVoucher] = useState('');
  const [bonus, setBonus] = useState('');
  const [otherBenefits, setOtherBenefits] = useState('');
  const [deductions, setDeductions] = useState<{ name: string; value: number; isPercentage: boolean }[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const resetForm = () => {
    setName('');
    setGrossSalary('');
    setMealVoucher('');
    setFoodVoucher('');
    setBonus('');
    setOtherBenefits('');
    setDeductions([]);
    setDate(new Date().toISOString().split('T')[0]);
    setEditingId(null);
    setShowForm(false);
  };

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

  const handleSave = () => {
    const salary: Salary = {
      id: editingId || Date.now().toString(),
      name,
      grossSalary: parseFloat(grossSalary) || 0,
      mealVoucher: parseFloat(mealVoucher) || 0,
      foodVoucher: parseFloat(foodVoucher) || 0,
      bonus: parseFloat(bonus) || 0,
      otherBenefits: parseFloat(otherBenefits) || 0,
      deductions,
      date,
    };

    if (editingId) {
      onSave(salaries.map(sal => sal.id === editingId ? salary : sal));
    } else {
      onSave([...salaries, salary]);
    }
    resetForm();
  };

  const handleEdit = (salary: Salary) => {
    setName(salary.name);
    setGrossSalary(salary.grossSalary.toString());
    setMealVoucher(salary.mealVoucher.toString());
    setFoodVoucher(salary.foodVoucher.toString());
    setBonus(salary.bonus.toString());
    setOtherBenefits(salary.otherBenefits.toString());
    setDeductions(salary.deductions);
    setDate(salary.date);
    setEditingId(salary.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    onSave(salaries.filter(sal => sal.id !== id));
  };

  const calculateNetSalary = (salary: Salary) => {
    const totalDeductions = salary.deductions.reduce((sum, d) => {
      return sum + (d.isPercentage ? (salary.grossSalary * d.value) / 100 : d.value);
    }, 0);
    return salary.grossSalary - totalDeductions;
  };

  const calculateTotalIncome = (salary: Salary) => {
    const netSalary = calculateNetSalary(salary);
    return netSalary + salary.mealVoucher + salary.foodVoucher + salary.bonus + salary.otherBenefits;
  };

  const currentGrossSalary = parseFloat(grossSalary) || 0;
  const totalDeductions = deductions.reduce((sum, d) => {
    return sum + (d.isPercentage ? (currentGrossSalary * d.value) / 100 : d.value);
  }, 0);
  const currentNetSalary = currentGrossSalary - totalDeductions;
  const currentTotalIncome = currentNetSalary + (parseFloat(mealVoucher) || 0) + 
                            (parseFloat(foodVoucher) || 0) + (parseFloat(bonus) || 0) + 
                            (parseFloat(otherBenefits) || 0);

  return (
    <Card className="p-4 md:p-6" data-testid="card-salary-manager">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Salários</h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)} data-testid="button-toggle-salary-form">
          <Plus className="w-4 h-4 mr-1" />
          Novo Salário
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-muted rounded-lg space-y-3">
          <div>
            <Label htmlFor="salary-name">Nome do Salário</Label>
            <Input
              id="salary-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Empresa Principal, Freelance"
              data-testid="input-salary-name"
            />
          </div>

          <div>
            <Label htmlFor="gross-salary">Salário Bruto</Label>
            <Input
              id="gross-salary"
              type="number"
              step="0.01"
              value={grossSalary}
              onChange={(e) => setGrossSalary(e.target.value)}
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
                onChange={(e) => setMealVoucher(e.target.value)}
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
                onChange={(e) => setFoodVoucher(e.target.value)}
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
                onChange={(e) => setBonus(e.target.value)}
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
                onChange={(e) => setOtherBenefits(e.target.value)}
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
                    className="w-24 md:w-32 text-right tabular-nums"
                    data-testid={`input-deduction-value-${index}`}
                  />
                  <Select
                    value={deduction.isPercentage ? 'percentage' : 'fixed'}
                    onValueChange={(v) => updateDeduction(index, 'isPercentage', v === 'percentage')}
                  >
                    <SelectTrigger className="w-16 md:w-24" data-testid={`select-deduction-type-${index}`}>
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

          <div>
            <Label htmlFor="salary-date">Data de Referência</Label>
            <Input
              id="salary-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              data-testid="input-salary-date"
            />
          </div>

          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total de Descontos:</span>
              <span className="font-medium tabular-nums" data-testid="text-total-deductions">
                {formatCurrency(totalDeductions)}
              </span>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span>Salário Líquido:</span>
              <span className="tabular-nums text-chart-2" data-testid="text-net-salary">
                {formatCurrency(currentNetSalary)}
              </span>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span>Renda Total:</span>
              <span className="tabular-nums text-primary" data-testid="text-total-income">
                {formatCurrency(currentTotalIncome)}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={resetForm} className="flex-1" data-testid="button-cancel-salary">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1" data-testid="button-save-salary">
              {editingId ? 'Atualizar' : 'Adicionar'}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {salaries.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum salário cadastrado
          </p>
        ) : (
          salaries.map((salary) => {
            const netSalary = calculateNetSalary(salary);
            const totalIncome = calculateTotalIncome(salary);
            return (
              <div
                key={salary.id}
                className="flex items-center justify-between p-3 rounded-lg border hover-elevate group"
                data-testid={`salary-${salary.id}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-chart-2/10 text-chart-2">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{salary.name}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-muted-foreground">
                      <span>Líquido: {formatCurrency(netSalary)}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>Total: {formatCurrency(totalIncome)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => handleEdit(salary)}
                    data-testid={`button-edit-salary-${salary.id}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => handleDelete(salary.id)}
                    data-testid={`button-delete-salary-${salary.id}`}
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
