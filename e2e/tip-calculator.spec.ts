import { test, expect } from '@playwright/test';

test.describe('tip-calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('all correct values have an expected result', async ({ page }) => {
    await page.fill('#bill-amount', '142.55');
    await page.getByText('15%', { exact: true }).click();
    await page.fill('#people', '5');

    const tiPerPerson = page.locator('#tip-amount-output');
    const totalPerPerson = page.locator('#total-amount-output');

    await expect(tiPerPerson).toHaveText('$4.28');
    await expect(totalPerPerson).toHaveText('$32.79');
  });

  test('custom tip is prioritary over radio buttons', async ({ page }) => {
    await page.fill('#bill-amount', '142.55');
    await page.getByText('15%', { exact: true }).click();
    await page.fill('#tip-custom', '12');
    await page.fill('#people', '5');

    const tipPerPerson = page.locator('#tip-amount-output');
    const totalPerPerson = page.locator('#total-amount-output');

    await expect(tipPerPerson).toHaveText('$3.42');
    await expect(totalPerPerson).toHaveText('$31.93');
  });

  test('when people equal 0 shows an error', async ({ page }) => {
    await page.fill('#bill-amount', '142.55');
    await page.fill('#tip-custom', '15');
    await page.fill('#people', '0');

    const peopleError = page.locator('#people-error');
    const peopleInput = page.locator('#people');

    await expect(peopleError).toHaveText("Can't be zero");
    await expect(peopleInput).toHaveAttribute('aria-invalid', 'true');
  });

  test('error element has accessibility attributes role=alert and aria-live', async ({
    page,
  }) => {
    await page.fill('#bill-amount', '100');
    await page.fill('#people', '0');

    const peopleError = page.locator('#people-error');

    await expect(peopleError).toHaveAttribute('role', 'alert');
    await expect(peopleError).toHaveAttribute('aria-live', 'polite');
  });

  test('when user clicks the reset button, reset all form values', async ({ page }) => {
    await page.fill('#bill-amount', '142.55');
    const resetBtn = page.locator('#reset-btn');
    await resetBtn.click();

    const billAmount = page.locator('#bill-amount');
    const tipCustom = page.locator('#tip-custom');
    const tipPercentageRadioButtons = page.locator('.form__tip-percentage:checked');
    const people = page.locator('#people');
    const tipAmountOutput = page.locator('#tip-amount-output');
    const totalAmountOutput = page.locator('#total-amount-output');

    await expect(billAmount).toHaveValue('');
    await expect(tipCustom).toHaveValue('');
    await expect(people).toHaveValue('');
    await expect(tipPercentageRadioButtons).toHaveCount(0);
    await expect(tipAmountOutput).toHaveText('$0.00');
    await expect(totalAmountOutput).toHaveText('$0.00');
    await expect(resetBtn).toBeDisabled();
  });
});
