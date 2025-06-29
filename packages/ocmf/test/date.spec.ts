import { describe, expect, it } from '@jest/globals';
import { formatDate, InvalidDateError, parseDate } from '../src';

describe('formatDate', () => {
  it('formats dates to OCMF spec', () => {
    const date = new Date(2025, 6, 29, 8, 12, 34, 15);
    const actual = formatDate(date, 'S');
    expect(actual).toMatch(/^2025-07-29T08:12:34,015[+-][0-9]{4} S$/);
    console.log(actual);
  });
});

describe('parseDate', () => {
  it('parses OCMF formatted dates', () => {
    const [date, type] = parseDate('2025-07-29T08:12:34,015+0100 S');
    expect(date).toEqual(new Date(Date.parse('2025-07-29T08:12:34.015+0100')));
    expect(type).toEqual('S');
  });

  it('throws an error if the type is missing', () => {
    expect(() => parseDate('2025-07-29T08:12:34,015+0100')).toThrow(
      InvalidDateError
    );
  });

  it('throws an error if the date is wrongly formatted', () => {
    expect(() => parseDate('2025-07-29/08:12:34,015+0100 S')).toThrow(
      InvalidDateError
    );
  });
});
