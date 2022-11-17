import {
  format as _externalFormat,
  formatISO,
  getUnixTime,
  fromUnixTime,
} from "date-fns"

export class DateUtil {
  static toISO(date: Date | number) {
    return formatISO(date)
  }

  static toTimestamp(date: Date | number) {
    return getUnixTime(date)
  }

  static fromTimestamp(unixTime: number, format?: string) {
    if (format) {
      return this.format(fromUnixTime(unixTime), format)
    } else {
      return fromUnixTime(unixTime)
    }
  }

  static format(date: Date | number, format: string) {
    return _externalFormat(date, format)
  }
}
