import type { CalculationReadiness, FormValues, ValidCalculationInputs } from '../types';

export function isCalculableValue(value: number | null): value is number {
  return value !== null && Number.isFinite(value);
}

export function isReadyToCalculate(
  values: FormValues,
): values is ValidCalculationInputs {
  const { bill, people, tipPercent } = values;

  return (
    isCalculableValue(bill) &&
    bill >= 0 &&
    isCalculableValue(people) &&
    people > 0 &&
    Number.isFinite(tipPercent) &&
    tipPercent >= 0
  );
}

export function getCalculationState(values: FormValues): CalculationReadiness {
  return {
    canCalculate: isReadyToCalculate(values),
    hasPeopleError: values.people === 0,
  };
}
