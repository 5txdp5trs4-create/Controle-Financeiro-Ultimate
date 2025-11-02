export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'semiannual' | 'annual';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  recurrence: RecurrenceType;
  recurrenceGroupId?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface SalaryData {
  grossSalary: number;
  mealVoucher: number;
  foodVoucher: number;
  bonus: number;
  otherBenefits: number;
  deductions: { name: string; value: number; isPercentage: boolean }[];
}

export interface Investment {
  id: string;
  name: string;
  type: string;
  amount: number;
  returnType: 'percentage' | 'fixed';
  returnValue: number;
  date: string;
}

export interface UserData {
  name: string;
  email: string;
  photoURL?: string;
  authProvider: 'google' | 'email';
}

const STORAGE_KEYS = {
  transactions: 'cfu_transactions',
  goals: 'cfu_goals',
  salary: 'cfu_salary',
  investments: 'cfu_investments',
  user: 'cfu_user',
};

export const storage = {
  getTransactions: (): Transaction[] => {
    const data = localStorage.getItem(STORAGE_KEYS.transactions);
    return data ? JSON.parse(data) : [];
  },
  
  saveTransactions: (transactions: Transaction[]) => {
    localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
  },
  
  getGoals: (): Goal[] => {
    const data = localStorage.getItem(STORAGE_KEYS.goals);
    return data ? JSON.parse(data) : [];
  },
  
  saveGoals: (goals: Goal[]) => {
    localStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(goals));
  },
  
  getSalary: (): SalaryData | null => {
    const data = localStorage.getItem(STORAGE_KEYS.salary);
    return data ? JSON.parse(data) : null;
  },
  
  saveSalary: (salary: SalaryData) => {
    localStorage.setItem(STORAGE_KEYS.salary, JSON.stringify(salary));
  },
  
  getInvestments: (): Investment[] => {
    const data = localStorage.getItem(STORAGE_KEYS.investments);
    return data ? JSON.parse(data) : [];
  },
  
  saveInvestments: (investments: Investment[]) => {
    localStorage.setItem(STORAGE_KEYS.investments, JSON.stringify(investments));
  },
  
  getUser: (): UserData | null => {
    const data = localStorage.getItem(STORAGE_KEYS.user);
    return data ? JSON.parse(data) : null;
  },
  
  saveUser: (user: UserData) => {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  },
  
  clearUser: () => {
    localStorage.removeItem(STORAGE_KEYS.user);
  },
  
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  },
};
