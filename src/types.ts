export type TipSource = 'radio' | 'custom' | null;

export interface RawFormInputs {
  bill: string;
  tipCustom: string;
  selectedRadio?: HTMLInputElement;
  people: string;
}

export interface TipSelection {
  value: number;
  source: TipSource;
}

export interface FormValues {
  bill: number | null;
  tipPercent: number;
  people: number | null;
}

export interface ValidCalculationInputs {
  bill: number;
  tipPercent: number;
  people: number;
}

export interface PerPersonAmounts {
  tipPerPerson: string;
  totalPerPerson: string;
}

export interface CalculationReadiness {
  canCalculate: boolean;
  hasPeopleError: boolean;
}
