import { clearSelectedRadio } from '../dom/form';
import type { CalculatorElements } from '../dom/selectors';

export function bindEvents(
  elements: CalculatorElements,
  onStateChange: () => void,
): void {
  const {
    billForm,
    billAmountInput,
    tipCustomInput,
    tipPercentageRadioButtons,
    peopleInput,
    resetButton,
  } = elements;

  resetButton.addEventListener('click', () => {
    billAmountInput.value = '';
    tipCustomInput.value = '';
    peopleInput.value = '';
    clearSelectedRadio(tipPercentageRadioButtons);
    onStateChange();
  });

  tipCustomInput.addEventListener('input', () => {
    clearSelectedRadio(tipPercentageRadioButtons);
    onStateChange();
  });

  tipPercentageRadioButtons.forEach((radio) => {
    radio.addEventListener('change', () => {
      tipCustomInput.value = '';
      onStateChange();
    });
  });

  billForm.addEventListener('input', onStateChange);
}
