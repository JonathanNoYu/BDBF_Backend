const dateYear = new Date('2025').getFullYear()
export const thisYear = new Date(dateYear, 0, 1)
export const thisYearString = thisYear.getUTCFullYear().toLocaleString()