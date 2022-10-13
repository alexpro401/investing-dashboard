import { useCallback, useMemo, useState } from "react"
import { InputFieldProps, InputField } from "fields"
import { AppButton } from "common"
import * as S from "./styled"

type Duration = {
  years: number
  months: number
  weeks: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface Props<V extends string | number> extends InputFieldProps<V> {}

function DurationField<V extends string | number>({
  value,
  setValue,
  label,
  labelNodeRight,
  placeholder = " ",
  errorMessage,
  disabled,
  readonly,
  tabindex,
  onChange,
  nodeLeft,
  nodeRight,
  ...rest
}: Props<V>) {
  const [localValue, setLocalValue] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const parsedDuration = useMemo(() => {
    const unparsedString = localValue.toLowerCase()

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
  }, [localValue])

  const convertToSeconds = useCallback((duration: Duration) => {
    const { years, months, weeks, days, hours, minutes, seconds } = duration

    return (
      seconds +
      minutes * 60 +
      hours * 60 * 60 +
      days * 60 * 60 * 24 +
      weeks * 60 * 60 * 24 * 7 +
      months * 60 * 60 * 24 * 30 +
      years * 60 * 60 * 24 * 365
    )
  }, [])

  const parseSeconds = useCallback((seconds: number | string) => {
    // TODO: Implement
  }, [])

  const parsedDurationString = useMemo(() => {
    const { years, months, weeks, days, hours, minutes, seconds } =
      parsedDuration

    return [
      ...(years ? [`${years}Year(s)`] : []),
      ...(months ? [`${months}Month(s)`] : []),
      ...(weeks ? [`${weeks}Week(s)`] : []),
      ...(days ? [`${days}Day(s)`] : []),
      ...(hours ? [`${hours}Hour(s)`] : []),
      ...(minutes ? [`${minutes}Minute(s)`] : []),
      ...(seconds ? [`${seconds}Second(s)`] : []),
    ].join(" ")
  }, [parsedDuration])

  const handleSelectDuration = useCallback(() => {
    if (setValue) {
      const { years, months, weeks, days, hours, minutes, seconds } =
        parsedDuration

      setValue(convertToSeconds(parsedDuration) as V)
      setLocalValue(
        [
          ...(years ? [`${years}Y`] : []),
          ...(months ? [`${months}Mon`] : []),
          ...(weeks ? [`${weeks}W`] : []),
          ...(days ? [`${days}D`] : []),
          ...(hours ? [`${hours}H`] : []),
          ...(minutes ? [`${minutes}Min`] : []),
          ...(seconds ? [`${seconds}S`] : []),
        ].join("/")
      )
      setIsDropdownOpen(false)
    }
  }, [convertToSeconds, parsedDuration, setValue])

  const handleInput = useCallback(
    (e) => {
      if (setValue) {
        setValue("" as V)
      }
      setIsDropdownOpen(!!e.currentTarget.value)
    },
    [setValue]
  )

  return (
    <S.Root {...rest}>
      <InputField
        value={localValue}
        setValue={setLocalValue}
        onInput={handleInput}
        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
        label={label}
        labelNodeRight={labelNodeRight}
        placeholder={placeholder}
        errorMessage={errorMessage}
        disabled={disabled}
        readonly={readonly}
        tabindex={tabindex}
        onChange={onChange}
        nodeLeft={nodeLeft}
        nodeRight={nodeRight}
      />
      <S.DropdownParsedVariants isOpen={isDropdownOpen && !!parsedDuration}>
        <AppButton
          text={parsedDurationString || "No results"}
          onClick={handleSelectDuration}
          color="default"
        />
      </S.DropdownParsedVariants>
    </S.Root>
  )
}

export default DurationField
