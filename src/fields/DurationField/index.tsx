import { useCallback, useMemo, useState } from "react"
import { useEffectOnce } from "react-use"

import { InputFieldProps, InputField } from "fields"
import { AppButton } from "common"
import { ISepataredDuration } from "utils/time"
import {
  parseSeconds,
  parseDuration,
  parseDurationString,
  parseDurationShortString,
} from "utils/time"

import * as S from "./styled"

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
  borderColor,
  ...rest
}: Props<V>) {
  const [localValue, setLocalValue] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const parsedDuration = useMemo(() => {
    const unparsedString = localValue
      ? localValue.toLowerCase()
      : parseSeconds(value)

    return parseDuration(unparsedString)
  }, [localValue, value])

  const convertToSeconds = useCallback((duration: ISepataredDuration) => {
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

  const parsedDurationString = useMemo(() => {
    const { years, months, weeks, days, hours, minutes, seconds } =
      parsedDuration

    return parseDurationString({
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
    })
  }, [parsedDuration])

  const fillLocalInputResult = useCallback(() => {
    const { years, months, weeks, days, hours, minutes, seconds } =
      parsedDuration

    setLocalValue(
      parseDurationShortString({
        years,
        months,
        weeks,
        days,
        hours,
        minutes,
        seconds,
      })
    )
  }, [parsedDuration])

  const handleSelectDuration = useCallback(() => {
    if (setValue) {
      setValue(convertToSeconds(parsedDuration) as V)
      fillLocalInputResult()
      setIsDropdownOpen(false)
    }
  }, [convertToSeconds, fillLocalInputResult, parsedDuration, setValue])

  const handleInput = useCallback(
    (e) => {
      if (setValue) {
        setValue("" as V)
      }
      setIsDropdownOpen(!!e.currentTarget.value)
    },
    [setValue]
  )

  useEffectOnce(() => {
    if (value) {
      fillLocalInputResult()
    }
  })

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
        borderColor={borderColor}
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
