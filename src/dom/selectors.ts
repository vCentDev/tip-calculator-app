export function getElementByIdOrThrow<T extends HTMLElement>(
  id: string,
  expectedType: typeof HTMLElement,
): T {
  const element = document.getElementById(id);

  if (!(element instanceof expectedType)) {
    throw new Error(`Expected element "${id}" to be a ${expectedType.name}`);
  }

  return element as T;
}

export interface CalculatorElements {
  billForm: HTMLFormElement;
  billAmountInput: HTMLInputElement;
  tipPercentageRadioButtons: NodeListOf<HTMLInputElement>;
  tipCustomInput: HTMLInputElement;
  peopleInput: HTMLInputElement;
  tipAmountOutput: HTMLOutputElement;
  totalAmountOutput: HTMLOutputElement;
  resetButton: HTMLButtonElement;
  peopleError: HTMLSpanElement;
}

export function queryCalculatorElements(): CalculatorElements {
  return {
    billForm: getElementByIdOrThrow<HTMLFormElement>('bill-form', HTMLFormElement),
    billAmountInput: getElementByIdOrThrow<HTMLInputElement>(
      'bill-amount',
      HTMLInputElement,
    ),
    tipPercentageRadioButtons: document.querySelectorAll<HTMLInputElement>(
      '.form__tip-percentage',
    ),
    tipCustomInput: getElementByIdOrThrow<HTMLInputElement>(
      'tip-custom',
      HTMLInputElement,
    ),
    peopleInput: getElementByIdOrThrow<HTMLInputElement>('people', HTMLInputElement),
    tipAmountOutput: getElementByIdOrThrow<HTMLOutputElement>(
      'tip-amount-output',
      HTMLOutputElement,
    ),
    totalAmountOutput: getElementByIdOrThrow<HTMLOutputElement>(
      'total-amount-output',
      HTMLOutputElement,
    ),
    resetButton: getElementByIdOrThrow<HTMLButtonElement>(
      'reset-btn',
      HTMLButtonElement,
    ),
    peopleError: getElementByIdOrThrow<HTMLSpanElement>(
      'people-error',
      HTMLSpanElement,
    ),
  };
}
