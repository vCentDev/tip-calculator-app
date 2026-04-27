import { beforeEach, describe, expect, it } from 'vitest';
import { bootstrap } from './app';

describe('bootstrap', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="bill-form">
        <input type="number" id="bill-amount" />
        
        <input type="radio" class="form__tip-percentage" id="tip-15" name="tip" value="15" />
        <label for="tip-15">15%</label>
        <input type="number" id="tip-custom" />
        
        <span id="people-error" hidden></span>
        <input type="number" id="people" />
        
        <output id="tip-amount-output"></output>
        <output id="total-amount-output"></output>
        <button id="reset-btn"></button>
      </form>
    `;

    bootstrap();
  });

  it('shows the tip amount per person and total per person when user introduces valid values', () => {
    const form = document.querySelector<HTMLFormElement>('#bill-form');
    document.querySelector<HTMLInputElement>('#bill-amount')!.value = '142.55';
    document.querySelector<HTMLInputElement>('.form__tip-percentage')!.checked = true;
    document.querySelector<HTMLInputElement>('#people')!.value = '5';
    form!.dispatchEvent(new Event('input', { bubbles: true }));

    expect(
      document.querySelector<HTMLOutputElement>('#tip-amount-output')!.textContent,
    ).toBe('$4.28');
    expect(
      document.querySelector<HTMLOutputElement>('#total-amount-output')!.textContent,
    ).toBe('$32.79');
  });

  it('shows the error when people is 0', () => {
    const form = document.querySelector<HTMLFormElement>('#bill-form');

    document.querySelector<HTMLInputElement>('#bill-amount')!.value = '142.55';
    document.querySelector<HTMLInputElement>('.form__tip-percentage')!.checked = true;
    document.querySelector<HTMLInputElement>('#people')!.value = '0';
    form!.dispatchEvent(new Event('input', { bubbles: true }));

    expect(document.querySelector<HTMLSpanElement>('#people-error')!.textContent).toBe(
      "Can't be zero",
    );
    expect(
      document
        .querySelector<HTMLInputElement>('#people')!
        .classList.contains('input-error-outline'),
    ).toBe(true);
    expect(
      document.querySelector<HTMLInputElement>('#people')!.getAttribute('aria-invalid'),
    ).toBe('true');
    expect(document.querySelector<HTMLSpanElement>('#people-error')!.hidden).toBe(false);
  });

  it('resets the form values when Reset button is clicked', () => {
    const form = document.querySelector<HTMLFormElement>('#bill-form');
    const resetBtn = document.querySelector<HTMLButtonElement>('#reset-btn');

    document.querySelector<HTMLInputElement>('#bill-amount')!.value = '142.55';
    document.querySelector<HTMLInputElement>('.form__tip-percentage')!.checked = true;
    document.querySelector<HTMLInputElement>('#people')!.value = '5';

    form!.dispatchEvent(new Event('input', { bubbles: true }));
    resetBtn!.dispatchEvent(new Event('click'));

    expect(document.querySelector<HTMLInputElement>('#bill-amount')!.value).toBe('');
    expect(
      document.querySelector<HTMLInputElement>('.form__tip-percentage')!.checked,
    ).toBe(false);
    expect(document.querySelector<HTMLInputElement>('#tip-custom')!.value).toBe('');
    expect(document.querySelector<HTMLInputElement>('#people')!.value).toBe('');
    expect(
      document.querySelector<HTMLOutputElement>('#tip-amount-output')!.textContent,
    ).toBe('$0.00');
    expect(
      document.querySelector<HTMLOutputElement>('#total-amount-output')!.textContent,
    ).toBe('$0.00');
    expect(resetBtn!.disabled).toBe(true);
  });
});
