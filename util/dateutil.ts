
// dateutil.ts
// module containing utility functions for bitpacking dates, and other
// date & time releated functions
// @kalrnlo
// 25/03/2024

// ported from: https://github.com/bubshurb/libraries/blob/main/src/dateUtil/methods/daysInMonth.luau
export function days_in_month(month: number, year: number) {
	if (month === 4 || month === 6 || month === 9 || month === 11) {
		return 30
	} else if (month === 2) {
		if (year % 4 === 0 && year % 100 !== 0) {
			return 29
		} else {
			return 28
		}
	} else {
		return 31
	}
}

export function days_between_dates(date1: Date, date2 = new Date()) {
	const y2 = date2.getUTCFullYear(),
		m2 = date2.getUTCMonth(),
		d2 = date2.getUTCDay();
	let y1 = date1.getUTCFullYear(),
		m1 = date1.getUTCMonth(),
		d1 = date1.getUTCDay();
	let days = 0

	while (d1 < d2 || m1 < m2 || y1 < y1) {
		if (d1++ > days_in_month(m1, y1)) {
			d1 = 1
			m1++

			if (m1 > 12) {
				m1 = 1
				y1++
			}
		}
		days++
	}
	return days
}

export function pack_date(date = new Date) {
   return date.getUTCFullYear() << 9 | date.getUTCMonth() << 5 | date.getUTCDay()
}

export function unpack_date(u32date: number) {
	return new Date(u32date >> 9, (u32date >> 5) & 0xF, u24date & 0x1F)
}
