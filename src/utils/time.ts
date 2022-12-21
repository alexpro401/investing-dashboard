export interface ISepataredDuration {
  years: number
  months: number
  weeks: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

export const parseSeconds = (seconds: number | string): string => {
  const _seconds = Number(seconds)
  if (_seconds < 1) {
    return "0"
  }

  const oneMinute = 60
  const oneHour = oneMinute * 60
  const oneDay = oneHour * 24
  const oneWeek = oneDay * 7
  const oneMonth = oneDay * 30
  const oneYear = oneDay * 365

  const years = Math.floor(_seconds / oneYear)
  const months = Math.floor((_seconds - oneYear * years) / oneMonth)
  const weeks = Math.floor(
    (_seconds - oneYear * years - oneMonth * months) / oneWeek
  )
  const days = Math.floor(
    (_seconds - oneYear * years - oneMonth * months - oneWeek * weeks) / oneDay
  )
  const hours = Math.floor(
    (_seconds -
      oneYear * years -
      oneMonth * months -
      oneWeek * weeks -
      oneDay * days) /
      oneHour
  )
  const minutes = Math.floor(
    (_seconds -
      oneYear * years -
      oneMonth * months -
      oneWeek * weeks -
      oneDay * days -
      oneHour * hours) /
      oneMinute
  )
  const sec = Math.floor(
    _seconds -
      oneYear * years -
      oneMonth * months -
      oneWeek * weeks -
      oneDay * days -
      oneHour * hours -
      oneMinute * minutes
  )
  const times = {
    year: years,
    month: months,
    week: weeks,
    day: days,
    hour: hours,
    minute: minutes,
    second: sec,
  }
  const qualifier = (num) => (num > 1 ? "s" : "")
  const numToStr = (num, unit) =>
    num > 0 ? `${num}${unit}${qualifier(num)}` : ""
  return Object.entries(times).reduce(
    (acc, [unit, num]) => acc + numToStr(num, unit),
    ""
  )
}

export const parseDuration = (unparsedString: string): ISepataredDuration => {
  const years = unparsedString.match(/(\d+)y|year|years/)
  const months = unparsedString.match(/(\d+)mon|month|months/)
  const weeks = unparsedString.match(/(\d+)w|week|weeks/)
  const days = unparsedString.match(/(\d+)d|day|days/)
  const hours = unparsedString.match(/(\d+)h|hour|hours/)
  const minutes = unparsedString.match(/(\d+)min|minute|minutes/)
  const seconds = unparsedString.match(/(\d+)s|second|seconds/)

  return {
    years: years ? parseInt(years[1]) : 0,
    months: months ? parseInt(months[1]) : 0,
    weeks: weeks ? parseInt(weeks[1]) : 0,
    days: days ? parseInt(days[1]) : 0,
    hours: hours ? parseInt(hours[1]) : 0,
    minutes: minutes ? parseInt(minutes[1]) : 0,
    seconds: seconds ? parseInt(seconds[1]) : 0,
  }
}

export const parseDurationString = ({
  years,
  months,
  weeks,
  days,
  hours,
  minutes,
  seconds,
}: ISepataredDuration): string => {
  return [
    ...(years ? [`${years}Year(s)`] : []),
    ...(months ? [`${months}Month(s)`] : []),
    ...(weeks ? [`${weeks}Week(s)`] : []),
    ...(days ? [`${days}Day(s)`] : []),
    ...(hours ? [`${hours}Hour(s)`] : []),
    ...(minutes ? [`${minutes}Minute(s)`] : []),
    ...(seconds ? [`${seconds}Second(s)`] : []),
  ].join(" ")
}

export const parseDurationShortString = (
  { years, months, weeks, days, hours, minutes, seconds }: ISepataredDuration,
  separator?: string
) => {
  return [
    ...(years ? [`${years}Y`] : []),
    ...(months ? [`${months}Mon`] : []),
    ...(weeks ? [`${weeks}W`] : []),
    ...(days ? [`${days}D`] : []),
    ...(hours ? [`${hours}H`] : []),
    ...(minutes ? [`${minutes}Min`] : []),
    ...(seconds ? [`${seconds}S`] : []),
  ].join(separator || "/")
}
