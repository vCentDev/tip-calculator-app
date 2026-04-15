const billForm = document.getElementById('bill-form');
const billAmountInput = document.getElementById('bill-amount');
const tipPercentageRadioButtons = document.querySelectorAll('.form__tip-percentage');
const tipCustomInput = document.getElementById('tip-custom');
const peopleInput = document.getElementById('people');
const tipAmountOutput = document.getElementById('tip-amount-output');
const totalAmountOutput = document.getElementById('total-amount-output');
const resetButton = document.getElementById('reset-btn');

//* ----- FUNCTIONS ----- */
function getSelectedRadio() {
  return Array.from(tipPercentageRadioButtons).find((radio) => radio.checked);
}

function clearSelectedRadio() {
  const selectedRadio = getSelectedRadio();
  if (selectedRadio) selectedRadio.checked = false;
}

function updateResetButton({ bill, tipPercent, people }) {
  if (bill > 0 || tipPercent > 0 || people > 1) {
    resetButton.disabled = false;
  } else {
    resetButton.disabled = true;
  }
}

function updateResults(tipPerPerson, totalPerPerson) {
  tipAmountOutput.textContent = `$${tipPerPerson}`;
  totalAmountOutput.textContent = `$${totalPerPerson}`;
}

function calculateResults({ bill, tipPercent, people }) {
  const tipPerPerson = (bill * tipPercent) / 100 / people;
  const totalPerPerson = (bill + (bill * tipPercent) / 100) / people;

  return {
    tipPerPerson: tipPerPerson.toFixed(2),
    totalPerPerson: totalPerPerson.toFixed(2),
  };
}

function getFormValues() {
  const bill = Math.max(parseFloat(billAmountInput.value) || 0, 0);

  const tipCustom = parseFloat(tipCustomInput.value);
  const selectedTipPercentage = getSelectedRadio();
  const selectedTipPercentageValue = Number(selectedTipPercentage?.value) ?? null;
  const tipPercent = tipCustom || selectedTipPercentageValue || 0;

  const people = parseFloat(peopleInput.value) || 1;

  return { bill, tipPercent, people };
}

function handleCalculation() {
  const formValues = getFormValues();
  const { tipPerPerson, totalPerPerson } = calculateResults(formValues);
  updateResults(tipPerPerson, totalPerPerson);
  updateResetButton(formValues);
}

//* ----- LISTENERS ----- */
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
