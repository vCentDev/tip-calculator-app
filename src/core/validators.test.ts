import { describe, it, expect } from 'vitest';
import { getCalculationState, isReadyToCalculate } from './validators';

describe('isReadyToCalculate', () => {
  it('returns true if values are right', () => {
    const values = {
      bill: 142.55,
      tipPercent: 15,
      people: 5,
    };

    const isCalculable = isReadyToCalculate(values);

    expect(isCalculable).toBe(true);
  });

  it.each([
    { bill: -1, tipPercent: 15, people: 5 },
    { bill: null, tipPercent: 15, people: 5 },
    { bill: NaN, tipPercent: 15, people: 5 },
    { bill: 142.55, tipPercent: 15, people: NaN },
    { bill: 142.55, tipPercent: 15, people: null },
    { bill: 142.55, tipPercent: 15, people: 0 },
    { bill: 142.55, tipPercent: 15, people: -1 },
    { bill: 142.55, tipPercent: -1, people: 5 },
    { bill: 142.55, tipPercent: NaN, people: 5 },
    { bill: 142.55, tipPercent: Infinity, people: 5 },
  ])(
    'returns false if bill: $bill, tip: $tipPercent, people: $people is invalid',
    ({ bill, tipPercent, people }) => {
      const values = { bill, tipPercent, people };
      const isCalculable = isReadyToCalculate(values);
      expect(isCalculable).toBe(false);
    },
  );
});

describe('getCalculationState', () => {
  it('is ready to calculate', () => {
    const values = {
      bill: 142.55,
      tipPercent: 15,
      people: 5,
    };

    const calculationState = getCalculationState(values);

    expect(calculationState).toEqual({ canCalculate: true, hasPeopleError: false });
  });

  it('has not a valid bill to calculate', () => {
    const values = {
      bill: -1,
      tipPercent: 15,
      people: 5,
    };

    const calculationState = getCalculationState(values);

    expect(calculationState).toEqual({
      canCalculate: false,
      hasPeopleError: false,
    });
  });

  it('has people error', () => {
    const values = {
      bill: 142.55,
      tipPercent: 15,
      people: 0,
    };

    const calculationState = getCalculationState(values);

    expect(calculationState).toEqual({ canCalculate: false, hasPeopleError: true });
  });
});
