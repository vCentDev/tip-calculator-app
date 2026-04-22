import type { FormValues } from '../types';

export function updatePeopleErrorState(
  peopleError: HTMLElement,
  peopleInput: HTMLInputElement,
  errorMessage: string,
  hasError: boolean,
): void {
  peopleError.textContent = hasError ? errorMessage : '';
  peopleError.hidden = !hasError;

  peopleInput.classList.toggle('input-error-outline', hasError);
  peopleInput.setAttribute('aria-invalid', hasError ? 'true' : 'false');
}

export function renderPerPersonAmounts(
  tipAmountOutput: HTMLOutputElement,
  totalAmountOutput: HTMLOutputElement,
  tipPerPerson: string,
  totalPerPerson: string,
): void {
  tipAmountOutput.textContent = `$${tipPerPerson}`;
  totalAmountOutput.textContent = `$${totalPerPerson}`;
}

export function updateResetButton(
  resetButton: HTMLButtonElement,
  { bill, tipPercent, people }: FormValues,
): void {
  resetButton.disabled = !((bill ?? 0) > 0 || tipPercent > 0 || (people ?? 0) > 0);
}
