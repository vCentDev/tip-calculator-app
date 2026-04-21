type TipSource = 'radio' | 'custom' | null;

interface RawFormInputs {
  bill: string;
  tipCustom: string;
  selectedRadio?: HTMLInputElement;
  people: string;
}

interface TipSelection {
  value: number;
  source: TipSource;
}

interface FormValues {
  bill: number | null;
  tipPercent: number;
  people: number | null;
}

interface ValidCalculationInputs {
  bill: number;
  tipPercent: number;
  people: number;
}

interface PerPersonAmounts {
  tipPerPerson: string;
  totalPerPerson: string;
}

interface CalculationReadiness {
  canCalculate: boolean;
  hasPeopleError: boolean;
}

const PEOPLE_ERROR_MESSAGE = "Can't be zero";
const DEFAULT_RESULT = '0.00';

function getElementByIdOrThrow<T extends HTMLElement>(
  id: string,
  expectedType: typeof HTMLElement,
): T {
  const element = document.getElementById(id);

  if (!(element instanceof expectedType)) {
    throw new Error(`Expected element "${id}" to be a ${expectedType.name}`);
  }

  return element as T;
}

const billForm = getElementByIdOrThrow<HTMLFormElement>('bill-form', HTMLFormElement);
const billAmountInput = getElementByIdOrThrow<HTMLInputElement>(
  'bill-amount',
  HTMLInputElement,
);
const tipPercentageRadioButtons = document.querySelectorAll<HTMLInputElement>(
  '.form__tip-percentage',
);
const tipCustomInput = getElementByIdOrThrow<HTMLInputElement>(
  'tip-custom',
  HTMLInputElement,
);
const peopleInput = getElementByIdOrThrow<HTMLInputElement>('people', HTMLInputElement);
const tipAmountOutput = getElementByIdOrThrow<HTMLOutputElement>(
  'tip-amount-output',
  HTMLOutputElement,
);
const totalAmountOutput = getElementByIdOrThrow<HTMLOutputElement>(
  'total-amount-output',
  HTMLOutputElement,
);
const resetButton = getElementByIdOrThrow<HTMLButtonElement>(
  'reset-btn',
  HTMLButtonElement,
);
const peopleError = getElementByIdOrThrow<HTMLSpanElement>(
  'people-error',
  HTMLSpanElement,
);

//* ====== HELPER FUNCTIONS ====== */

function parseNumber(input: string): number | null {
  const hasValue = input.trim() !== '';
  return hasValue ? Number(input) : null;
}

function getSelectedRadio(): HTMLInputElement | undefined {
  return Array.from(tipPercentageRadioButtons).find((radio) => radio.checked);
}

function clearSelectedRadio(): void {
  const selectedRadio = getSelectedRadio();
  if (selectedRadio) selectedRadio.checked = false;
}

//* ===== PARSING FUNCTIONS ===== */

function readFormInputs(): RawFormInputs {
  return {
    bill: billAmountInput.value,
    tipCustom: tipCustomInput.value,
    selectedRadio: getSelectedRadio(),
    people: peopleInput.value,
  };
}

function resolveTipSelection(inputs: RawFormInputs): TipSelection {
  const { tipCustom, selectedRadio } = inputs;
  const hasCustomInput = tipCustom.trim() !== '';
  const customTipValue = parseNumber(tipCustom);
  const radioTipValue = selectedRadio ? Number(selectedRadio.value) : null;

  if (hasCustomInput) {
    return { value: customTipValue ?? 0, source: 'custom' };
  }
  if (radioTipValue !== null) {
    return { value: radioTipValue, source: 'radio' };
  }

  return { value: 0, source: null };
}

function getFormValues(): FormValues {
  const parsed = readFormInputs();
  const tipSelection = resolveTipSelection(parsed);

  return {
    bill: parseNumber(parsed.bill),
    tipPercent: tipSelection.value,
    people: parseNumber(parsed.people),
  };
}

//* ===== VALIDATION FUNCTIONS ===== */

function isCalculableValue(value: number | null): value is number {
  return value !== null && Number.isFinite(value);
}

function isReadyToCalculate(values: FormValues): values is ValidCalculationInputs {
  const { bill, people, tipPercent } = values;

  return (
    isCalculableValue(bill) &&
    bill >= 0 &&
    isCalculableValue(people) &&
    people > 0 &&
    Number.isFinite(tipPercent) &&
    values.tipPercent >= 0
  );
}

function getCalculationState(values: FormValues): CalculationReadiness {
  return {
    canCalculate: isReadyToCalculate(values),
    hasPeopleError: values.people === 0,
  };
}

//* ===== CALCULATION FUNCTIONS ===== */

function calculatePerPersonAmounts({
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

//* ===== UI UPDATE FUNCTIONS ===== */

function updatePeopleErrorState(hasError: boolean): void {
  peopleError.textContent = hasError ? PEOPLE_ERROR_MESSAGE : '';
  peopleError.hidden = !hasError;

  peopleInput.classList.toggle('input-error-outline', hasError);
  peopleInput.setAttribute('aria-invalid', hasError ? 'true' : 'false');
}

function renderPerPersonAmounts(tipPerPerson: string, totalPerPerson: string): void {
  tipAmountOutput.textContent = `$${tipPerPerson}`;
  totalAmountOutput.textContent = `$${totalPerPerson}`;
}

function updateResetButton({ bill, tipPercent, people }: FormValues): void {
  resetButton.disabled = !((bill ?? 0) > 0 || tipPercent > 0 || (people ?? 0) > 0);
}

//* ===== FORM HANDLING ===== */

function updateCalculatorState(): void {
  const formValues = getFormValues();
  const readiness = getCalculationState(formValues);

  updatePeopleErrorState(readiness.hasPeopleError);

  if (isReadyToCalculate(formValues)) {
    const { tipPerPerson, totalPerPerson } = calculatePerPersonAmounts(formValues);
    renderPerPersonAmounts(tipPerPerson, totalPerPerson);
  } else {
    renderPerPersonAmounts(DEFAULT_RESULT, DEFAULT_RESULT);
  }

  updateResetButton(formValues);
}

//* ===== EVENT LISTENERS ===== */

resetButton.addEventListener('click', () => {
  billAmountInput.value = '';
  tipCustomInput.value = '';
  peopleInput.value = '';
  clearSelectedRadio();
  updateCalculatorState();
});

tipCustomInput.addEventListener('input', () => {
  clearSelectedRadio();
  updateCalculatorState();
});

tipPercentageRadioButtons.forEach((radio) => {
  radio.addEventListener('change', () => {
    tipCustomInput.value = '';
    updateCalculatorState();
  });
});

billForm.addEventListener('input', updateCalculatorState);
