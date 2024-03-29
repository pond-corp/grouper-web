// dateutil.ts
// module containing utility functions for bitpacking dates, and other
// date & time releated functions
// @kalrnlo
// 29/03/2024

/**
 * Gets the amount of days in the given month for that year
 *
 * Ported from: https://github.com/bubshurb/libraries/blob/main/src/dateUtil/methods/daysInMonth.luau
 * @param month: number
 * @param year: number
 * @returns number
 */
export function days_in_month(month: number, year: number) {
  if (month === 4 || month === 6 || month === 9 || month === 11) {
    return 30;
  } else if (month === 2) {
    if (year % 4 === 0 && year % 100 !== 0) {
      return 29;
    } else {
      return 28;
    }
  } else {
    return 31;
  }
}

/**
 * Gets the amount of days that have occured betwen 2 dates
 * @param date1: Date
 * @param date2: Date
 * @returns number
 */
export function days_between_dates(date1: Date, date2 = new Date()): number {
  const y2 = date2.getUTCFullYear(),
    m2 = date2.getUTCMonth(),
    d2 = date2.getUTCDay();
  let y1 = date1.getUTCFullYear(),
    m1 = date1.getUTCMonth(),
    d1 = date1.getUTCDay();
  let days = 0;

  while (d1 < d2 || m1 < m2 || y1 < y1) {
    if (d1++ > days_in_month(m1, y1)) {
      d1 = 1;
      m1++;

      if (m1 > 12) {
        m1 = 1;
        y1++;
      }
    }
    days++;
  }
  return days;
}

/**
 * Unpacks a bigint date into a date with the dates minutes, hours, day, month, and full year filled in.
 * @param date_bigint: bigint
 * @returns Date
 */
export function unpack_date_bigint(date_bigint: bigint): Date {
  return new Date(
    Number(date_bigint >> 21n),
    Number(((date_bigint >> 17n) & 0b111n) + 1n),
    Number((date_bigint >> 12n) & 0b11111n),
    Number((date_bigint >> 6n) & 0b111111n),
    Number(date_bigint & 0b111111n),
  );
}

/**
 * Packs the given dates minutes, hours, day, month, and full year into a bigint
 * @param date: Date?
 * @returns bigint
 */
export function pack_date_bigint(date = new Date()): bigint {
  return (
    BigInt(date.getUTCMinutes()) |
    (BigInt(date.getUTCHours()) << 6n) |
    (BigInt(date.getUTCDay()) << 12n) |
    (BigInt(date.getUTCMonth() - 1) << 17n) |
    (BigInt(date.getUTCFullYear()) << 21n)
  );
}

/**
 * Packs the given dates day, month, and full year into a number
 * @param date: Date?
 * @returns number
 */
export function pack_date_u32(date = new Date()): number {
  return (
    (date.getUTCFullYear() << 9) | (date.getUTCMonth() << 5) | date.getUTCDay()
  );
}

/**
 * Unpacks a u32 date into a date with the dates day, month, and full year filled in
 * @param date_u32: number
 * @returns Date
 */
export function unpack_date_u32(date_u32: number): Date {
  return new Date(date_u32 >> 9, (date_u32 >> 5) & 0xf, date_u32 & 0x1f);
}
