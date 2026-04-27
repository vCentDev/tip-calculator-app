import type { FormValues, RawFormInputs, TipSelection } from '../types';

export function parseNumber(input: string): number | null {
  const hasValue = input.trim() !== '';
  return hasValue ? Number(input) : null;
}

export function resolveTipSelection(inputs: RawFormInputs): TipSelection {
  const { tipCustom, tipRadio } = inputs;
  const hasCustomInput = tipCustom.trim() !== '';
  const customTipValue = parseNumber(tipCustom);
  const hasRadioInput = (tipRadio?.trim() ?? '') !== '';
  const radioTipValue = parseNumber(tipRadio ?? '');

  if (hasCustomInput) {
    return { value: customTipValue ?? 0, source: 'custom' };
  }
  if (hasRadioInput) {
    return { value: radioTipValue ?? 0, source: 'radio' };
  }

  return { value: 0, source: null };
}

export function toFormValues(inputs: RawFormInputs): FormValues {
  const tipSelection = resolveTipSelection(inputs);

  return {
    bill: parseNumber(inputs.bill),
    tipPercent: tipSelection.value,
    people: parseNumber(inputs.people),
  };
}
