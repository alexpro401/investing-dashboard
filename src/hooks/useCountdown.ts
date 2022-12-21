import { useMemo, useState } from "react"
import { DateUtil } from "../utils"
import {
  ISepataredDuration,
  parseDuration,
  parseDurationShortString,
  parseSeconds,
} from "../utils/time"
import { useInterval } from "react-use"

export const useCountdown = (date: Date | number) => {
  const [countDown, setCountDown] = useState<ISepataredDuration>()

  const isPast = useMemo(() => {
    return DateUtil.isDatePast(date)
  }, [date])

  const parsedCountDown = useMemo(() => {
    return countDown ? parseDurationShortString(countDown, ":") : ""
  }, [countDown])

  useInterval(
    () => {
      setCountDown(parseDuration(parseSeconds(DateUtil.timeFromNow(date) * -1)))
    },
    isPast ? null : 1000
  )

  return {
    countDown,
    parsedCountDown,
  }
}
