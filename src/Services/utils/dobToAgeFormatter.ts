import { DateTime, Interval } from 'luxon'

const dobToAgeFormatter = (date: string) => {
  const today = DateTime.now()
  const dateParsed = DateTime.fromISO(date)

  return Math.trunc(Interval.fromDateTimes(dateParsed, today).length('years'))
}

export default dobToAgeFormatter
