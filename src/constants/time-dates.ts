const dateYear = new Date('2025').getFullYear()
export const thisYear = new Date(dateYear, 0, 1)
export const thisYearString = thisYear.getUTCFullYear().toLocaleString()

export const MILLISECOND_TO_CENTISECOND = 1/10
export const MILLISECOND_TO_DECISECOND = 1/100
export const MILLISECOND_TO_SECONDS = 1/1000

export const MILLISECOND_PER_CENTISECOND = 10
export const MILLISECOND_PER_DECISECOND = 100
export const MILLISECOND_PER_SECOND = 1000
export const SECONDS_PER_MINUTE = 60
export const MINUTES_PER_HOURS = 60
