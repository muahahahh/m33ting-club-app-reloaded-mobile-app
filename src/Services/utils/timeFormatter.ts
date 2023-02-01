import { DateTime, Interval } from 'luxon'
import { dateTimeFormatPattern } from '@/Services/consts/consts'

const timeFormatter = (date: string) => {
  const today = DateTime.now()
  const dateParsed = DateTime.fromISO(date)

  const diff = Interval.fromDateTimes(dateParsed, today)
  switch (true) {
    case Math.abs(diff.length('days')) < 3:
      return dateParsed.toRelative()
    default:
      return dateParsed.toFormat(dateTimeFormatPattern)
  }
}

export default timeFormatter
