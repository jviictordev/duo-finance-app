import { Income, IncomeFrequency, IncomeType } from '../../models';

export const INCOMES: Income[] = [
  {
    id: 'inc1',
    personId: 'p1',
    type: IncomeType.SALARIO,
    frequency: IncomeFrequency.FIXA,
    name: 'Salário CLT',
    grossAmountCents: 950000,
    dependents: 0,
    payrollDeductions: [{ name: 'Vale transporte', amountCents: 15000 }],
    receivedDay: 5,
  },
  {
    id: 'inc2',
    personId: 'p2',
    type: IncomeType.SALARIO,
    frequency: IncomeFrequency.FIXA,
    name: 'Salário CLT',
    grossAmountCents: 620000,
    dependents: 0,
    payrollDeductions: [],
    receivedDay: 5,
  },
  {
    id: 'inc3',
    personId: 'p2',
    type: IncomeType.FREELA,
    frequency: IncomeFrequency.VARIAVEL,
    name: 'Aulas particulares',
    fixedNetAmountCents: 80000,
    receivedDay: 20,
  },
];
