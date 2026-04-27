import { describe, expect, it } from 'vitest';
import { parseNumber, resolveTipSelection } from './parsers';

describe('parseNumber', () => {
  it('returns null for empty string', () => {
    const inputValue = '';

    const parsedValue = parseNumber(inputValue);

    expect(parsedValue).toBeNull();
  });

  it('returns a positive number', () => {
    const inputValue = '5';

    const parsedValue = parseNumber(inputValue);

    expect(parsedValue).toBe(5);
  });

  it('returns a negative number', () => {
    const inputValue = '-5';

    const parsedValue = parseNumber(inputValue);

    expect(parsedValue).toBe(-5);
  });
});

describe('resolveTipSelection', () => {
  it('returns a selected tipCustom value', () => {
    const rawFormInputs = {
      bill: '',
      tipCustom: '12',
      tipRadio: '',
      people: '',
    };

    const tipSelected = resolveTipSelection(rawFormInputs);

    expect(tipSelected).toEqual({ value: 12, source: 'custom' });
  });

  it('returns a selected tipRadio value', () => {
    const rawFormInputs = {
      bill: '',
      tipCustom: '',
      tipRadio: '15',
      people: '',
    };

    const tipSelected = resolveTipSelection(rawFormInputs);

    expect(tipSelected).toEqual({ value: 15, source: 'radio' });
  });

  it('returns value 0 and source null because no tip has been selected', () => {
    const rawFormInputs = {
      bill: '',
      tipCustom: '',
      tipRadio: undefined,
      people: '',
    };

    const tipSelected = resolveTipSelection(rawFormInputs);

    expect(tipSelected).toEqual({ value: 0, source: null });
  });
});
