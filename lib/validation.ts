// UAE mobile numbers: accepts +971/00971/0 prefix followed by a 5x network
// code and 7 more digits (spaces/dashes ignored). Matches the format used in
// data/business.ts ("+971 54 300 0909").
const UAE_MOBILE_PATTERN = /^(?:\+971|00971|0)?5\d{8}$/;

export function isValidUaeMobile(input: string): boolean {
  const digitsOnly = input.replace(/[\s-]/g, "");
  return UAE_MOBILE_PATTERN.test(digitsOnly);
}

export function isNonEmpty(input: string): boolean {
  return input.trim().length > 0;
}
