export function safeParseInt(value: string | number | undefined): number {
  if (typeof value === 'number') return Math.floor(value);
  if (typeof value === 'string') return parseInt(value, 10) || 0;
  return 0;
}

export function safeParseFloat(value: string | number | undefined): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || 0;
  return 0;
}
