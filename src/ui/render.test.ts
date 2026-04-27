import { describe, expect, it } from 'vitest';
import {
  renderPerPersonAmounts,
  updatePeopleErrorState,
  updateResetButton,
} from './render';

describe('renderPerPersonAmounts', () => {
  it('renders the per person amounts correctly', () => {
    document.body.innerHTML = `
      <output id="tip-amount-output"></output>
      <output id="total-amount-output"></output>
    `;
    const tipAmountOutput =
      document.querySelector<HTMLOutputElement>('#tip-amount-output');
    const totalAmountOutput =
      document.querySelector<HTMLOutputElement>('#total-amount-output');

    renderPerPersonAmounts(tipAmountOutput!, totalAmountOutput!, '4.27', '32.79');

    expect(tipAmountOutput!.textContent).toBe('$4.27');
    expect(totalAmountOutput!.textContent).toBe('$32.79');
  });
});

describe('updatePeopleErrorState', () => {
  it('shows the error when hasError is true', () => {
    document.body.innerHTML = `
      <span id="people-error" class="form__people-error hidden"></span>
      <input id="people" class="form__people-input" aria-invalid="false" />
    `;
    const span = document.querySelector<HTMLSpanElement>('#people-error');
    const input = document.querySelector<HTMLInputElement>('#people');

    updatePeopleErrorState(span!, input!, "Can't be zero", true);

    expect(span!.textContent).toBe("Can't be zero");
    expect(span!.hidden).toBe(false);
    expect(input!.classList.contains('input-error-outline')).toBe(true);
    expect(input!.getAttribute('aria-invalid')).toBe('true');
  });

  it('clears the error when hasError is false', () => {
    document.body.innerHTML = `
      <span id="people-error" class="form__people-error">Can't be zero</span>
      <input id="people" class="form__people-input input-error-outline" aria-invalid="true" />
    `;
    const span = document.querySelector<HTMLSpanElement>('#people-error');
    const input = document.querySelector<HTMLInputElement>('#people');

    updatePeopleErrorState(span!, input!, '', false);

    expect(span!.textContent).toBe('');
    expect(span!.hidden).toBe(true);
    expect(input!.classList.contains('input-error-outline')).toBe(false);
    expect(input!.getAttribute('aria-invalid')).toBe('false');
  });
});

describe('updateResetButton', () => {
  it('enables the reset button when some of the form values are higher than 0', () => {
    const values = {
      bill: 142.55,
      tipPercent: 0,
      people: null,
    };
    document.body.innerHTML = `
      <button id="reset-btn" disabled>RESET</button>
    `;

    const resetBtn = document.querySelector<HTMLButtonElement>('#reset-btn');
    updateResetButton(resetBtn!, values);

    expect(resetBtn!.disabled).toBe(false);
  });

  it('disables the reset button when all the form values are 0 or null', () => {
    const values = {
      bill: 0,
      tipPercent: 0,
      people: null,
    };
    document.body.innerHTML = `
      <button id="reset-btn">RESET</button>
    `;

    const resetBtn = document.querySelector<HTMLButtonElement>('#reset-btn');
    updateResetButton(resetBtn!, values);

    expect(resetBtn!.disabled).toBe(true);
  });
});
