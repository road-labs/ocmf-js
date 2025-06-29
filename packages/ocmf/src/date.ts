import { format, parse } from 'date-fns';
import { InvalidDateError } from './errors';

const dateFormat = `yyyy-MM-dd'T'HH:mm:ss,SSSxxxx`;

export type TimeType =
  | 'U' // Unknown, unsynchronized
  | 'I' // Informative
  | 'S' // Synchronized
  | 'R'; // Relative time

export function formatDate(date: Date, type: TimeType): string {
  return `${format(date, dateFormat)} ${type}`;
}

export function parseDate(str: string): [Date, TimeType] {
  const parts = str.split(' ');
  if (parts.length !== 2) {
    throw new InvalidDateError('Time string must be in format "[date] [type]"');
  }
  const date = parse(parts[0], dateFormat, new Date());
  if (isNaN(date.getTime())) {
    throw new InvalidDateError('Failed to parse date');
  }
  return [date, parts[1] as TimeType];
}
