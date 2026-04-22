import type { RawFormInputs } from '../types';
import type { CalculatorElements } from './selectors';

export function getSelectedRadio(
  radios: NodeListOf<HTMLInputElement>,
): HTMLInputElement | undefined {
  return Array.from(radios).find((radio) => radio.checked);
}

export function clearSelectedRadio(radios: NodeListOf<HTMLInputElement>): void {
  const selectedRadio = getSelectedRadio(radios);
  if (selectedRadio) selectedRadio.checked = false;
}

export function readFormInputs(elements: CalculatorElements): RawFormInputs {
  return {
    bill: elements.billAmountInput.value,
    tipCustom: elements.tipCustomInput.value,
    tipRadio: getSelectedRadio(elements.tipPercentageRadioButtons)?.value,
    people: elements.peopleInput.value,
  };
}
