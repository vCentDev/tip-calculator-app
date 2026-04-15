const billForm = document.getElementById('bill-form');
const billAmountInput = document.getElementById('bill-amount');
const tipPercentageRadioButtons = document.querySelectorAll('.form__tip-percentage');
const tipCustomInput = document.getElementById('tip-custom');
const peopleInput = document.getElementById('people');
const tipAmountOutput = document.getElementById('tip-amount-output');
const totalAmountOutput = document.getElementById('total-amount-output');
const resetButton = document.getElementById('reset-btn');

//* ===== HELPER FUNCTIONS ===== */

/**
 * Converts a string input to a number if it has content.
 * Returns null for empty strings to distinguish between "no input" and "zero".
 * @param {string} input - The input string value
 * @returns {number|null} - Parsed number or null if empty
 */
function parseNumber(input) {
  const hasValue = input.trim() !== '';
  return hasValue ? Number(input) : null;
}

/**
 * Gets the currently selected radio button for tip percentage.
 * @returns {HTMLInputElement|undefined} - The checked radio or undefined if none selected
 */
function getSelectedRadio() {
  return Array.from(tipPercentageRadioButtons).find((radio) => radio.checked);
}

/**
 * Clears any selected radio button in the tip percentage group.
 */
function clearSelectedRadio() {
  const selectedRadio = getSelectedRadio();
  if (selectedRadio) selectedRadio.checked = false;
}

//* ===== PARSING FUNCTIONS ===== */

/**
 * Parses all form inputs and returns their raw values.
 * @returns {Object} - Object containing raw input values
 */
function parseInputs() {
  return {
    bill: billAmountInput.value,
    tipCustom: tipCustomInput.value,
    selectedRadio: getSelectedRadio(),
    people: peopleInput.value,
  };
}

/**
 * Resolves the tip percentage value based on priority:
 * 1. Custom input value (if not empty)
 * 2. Selected radio button value
 * 3. Default to 0 if neither is set
 * @param {Object} parsed - Parsed input values
 * @returns {Object} - { value: number, source: 'custom'|'radio'|null }
 */
function validateAndResolveTip(parsed) {
  const { tipCustom, selectedRadio } = parsed;
  const hasCustomInput = tipCustom.trim() !== '';
  const tipInput = parseNumber(tipCustom);
  const tipRadio = selectedRadio ? Number(selectedRadio.value) : null;

  if (hasCustomInput) {
    return { value: tipInput, source: 'custom' };
  } else if (tipRadio) {
    return { value: tipRadio, source: 'radio' };
  } else {
    return { value: 0, source: null };
  }
}

/**
 * Gets all form values parsed and ready for calculation.
 * @returns {Object} - { bill: number|null, tipPercent: number, people: number|null }
 */
function getFormValues() {
  const parsed = parseInputs();
  const tipData = validateAndResolveTip(parsed);

  return {
    bill: parseNumber(parsed.bill),
    tipPercent: tipData.value,
    people: parseNumber(parsed.people),
  };
}

//* ===== VALIDATION FUNCTIONS ===== */

/**
 * Validates if the form values are sufficient for calculation.
 * @param {Object} params - { bill, tipPercent, people }
 * @returns {Object} - { canCalculate: boolean, hasPeopleError: boolean }
 */
function validateForCalculation({ bill, tipPercent, people }) {
  const hasPeopleError = people === 0;

  const canCalculate =
    Number.isFinite(bill) &&
    bill >= 0 &&
    Number.isFinite(people) &&
    people > 0 &&
    Number.isFinite(tipPercent) &&
    tipPercent >= 0;

  return {
    canCalculate,
    hasPeopleError,
  };
}

//* ===== CALCULATION FUNCTIONS ===== */

/**
 * Calculates tip and total amounts per person.
 * @param {Object} params - { bill, tipPercent, people }
 * @returns {Object} - { tipPerPerson: string, totalPerPerson: string } formatted to 2 decimals
 */
function calculateResults({ bill, tipPercent, people }) {
  const tipPerPerson = (bill * tipPercent) / 100 / people;
  const totalPerPerson = (bill + (bill * tipPercent) / 100) / people;

  return {
    tipPerPerson: tipPerPerson.toFixed(2),
    totalPerPerson: totalPerPerson.toFixed(2),
  };
}

//* ===== UI UPDATE FUNCTIONS ===== */

/**
 * Updates the displayed results in the UI.
 * @param {string} tipPerPerson - Tip amount per person (formatted)
 * @param {string} totalPerPerson - Total amount per person (formatted)
 */
function updateResults(tipPerPerson, totalPerPerson) {
  tipAmountOutput.textContent = `$${tipPerPerson}`;
  totalAmountOutput.textContent = `$${totalPerPerson}`;
}

/**
 * Enables or disables the reset button based on form state.
 * @param {Object} params - { bill, tipPercent, people }
 */
function updateResetButton({ bill, tipPercent, people }) {
  if (bill > 0 || tipPercent > 0 || people > 0) {
    resetButton.disabled = false;
  } else {
    resetButton.disabled = true;
  }
}

//* ===== FORM HANDLING ===== */

/**
 * Main calculation handler - orchestrates parsing, validation, calculation and rendering.
 */
function handleCalculation() {
  const formValues = getFormValues();

  const validation = validateForCalculation(formValues);
  const { canCalculate } = validation;
  if (canCalculate) {
    const { tipPerPerson, totalPerPerson } = calculateResults(formValues);
    updateResults(tipPerPerson, totalPerPerson);
  } else {
    updateResults('0.00', '0.00');
  }

  updateResetButton(formValues);
}

//* ===== EVENT LISTENERS ===== */

resetButton.addEventListener('click', () => {
  billAmountInput.value = '';
  tipCustomInput.value = '';
  peopleInput.value = '';
  clearSelectedRadio();
  handleCalculation();
});

tipCustomInput.addEventListener('input', () => {
  clearSelectedRadio();
  updateResetButton(getFormValues());
});

tipPercentageRadioButtons.forEach((radio) => {
  radio.addEventListener('click', () => {
    tipCustomInput.value = '';
    updateResetButton(getFormValues());
  });
});

billForm.addEventListener('input', handleCalculation);
