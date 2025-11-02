import SalaryCalculator from "../SalaryCalculator";

export default function SalaryCalculatorExample() {
  return (
    <div className="bg-background p-4">
      <SalaryCalculator
        onSave={(data) => console.log('Salário salvo:', data)}
      />
    </div>
  );
}
