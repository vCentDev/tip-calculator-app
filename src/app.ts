import { DEFAULT_RESULT, PEOPLE_ERROR_MESSAGE } from './constants';
import { calculatePerPersonAmounts } from './core/calculator';
import { toFormValues } from './core/parsers';
import { getCalculationState, isReadyToCalculate } from './core/validators';
import { readFormInputs } from './dom/form';
import { queryCalculatorElements, type CalculatorElements } from './dom/selectors';
import { bindEvents } from './ui/events';
import {
  renderPerPersonAmounts,
  updatePeopleErrorState,
  updateResetButton,
} from './ui/render';

export function updateCalculatorState(elements: CalculatorElements): void {
  const rawInputs = readFormInputs(elements);
  const formValues = toFormValues(rawInputs);
  const readiness = getCalculationState(formValues);

  updatePeopleErrorState(
    elements.peopleError,
    elements.peopleInput,
    PEOPLE_ERROR_MESSAGE,
    readiness.hasPeopleError,
  );

  if (isReadyToCalculate(formValues)) {
    const { tipPerPerson, totalPerPerson } = calculatePerPersonAmounts(formValues);
    renderPerPersonAmounts(
      elements.tipAmountOutput,
      elements.totalAmountOutput,
      tipPerPerson,
      totalPerPerson,
    );
  } else {
    renderPerPersonAmounts(
      elements.tipAmountOutput,
      elements.totalAmountOutput,
      DEFAULT_RESULT,
      DEFAULT_RESULT,
    );
  }

  updateResetButton(elements.resetButton, formValues);
}

export function bootstrap(): void {
  const elements = queryCalculatorElements();
  bindEvents(elements, () => updateCalculatorState(elements));
  updateCalculatorState(elements);
}
