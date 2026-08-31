import { business } from "@/data/business";

/** Current time in the cafe's timezone (Asia/Dubai), regardless of visitor location. */
export function getBusinessNow(): Date {
  const now = new Date();
  const localeString = now.toLocaleString("en-US", { timeZone: business.hours.timezone });
  return new Date(localeString);
}

/**
 * Whether the cafe is currently open, given hours that cross midnight
 * (15:00 -> 01:00 the next day).
 */
export function isOpenNow(date: Date = getBusinessNow()): boolean {
  const minutesNow = date.getHours() * 60 + date.getMinutes();
  const openMinutes = business.hours.openHour * 60 + business.hours.openMinute;
  const closeMinutes = business.hours.closeHour * 60 + business.hours.closeMinute;

  if (openMinutes > closeMinutes) {
    // Window crosses midnight: open if at/after opening OR before closing.
    return minutesNow >= openMinutes || minutesNow < closeMinutes;
  }
  return minutesNow >= openMinutes && minutesNow < closeMinutes;
}
