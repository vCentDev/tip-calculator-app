import { describe, it, expect } from 'vitest';
import { calculatePerPersonAmounts } from './calculator';

describe('calculatePerPersonAmounts', () => {
  it('calculates tip and total per person correctly', () => {
    const validCalculationInputs = {
      bill: 100,
      tipPercent: 10,
      people: 5,
    };

    const perPersonResults = calculatePerPersonAmounts(validCalculationInputs);

    expect(perPersonResults).toEqual({ tipPerPerson: '2.00', totalPerPerson: '22.00' });
  });

  it('rounds results to two decimals', () => {
    const validCalculationInputs = {
      bill: 142.55,
      tipPercent: 15,
      people: 5,
    };

    const perPersonResults = calculatePerPersonAmounts(validCalculationInputs);

    expect(perPersonResults).toEqual({ tipPerPerson: '4.28', totalPerPerson: '32.79' });
  });
});
