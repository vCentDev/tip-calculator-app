import type { PerPersonAmounts, ValidCalculationInputs } from '../types';

export function calculatePerPersonAmounts({
  bill,
  tipPercent,
  people,
}: ValidCalculationInputs): PerPersonAmounts {
  const tipPerPerson = (bill * tipPercent) / 100 / people;
  const totalPerPerson = (bill + (bill * tipPercent) / 100) / people;

  return {
    tipPerPerson: tipPerPerson.toFixed(2),
    totalPerPerson: totalPerPerson.toFixed(2),
  };
}
