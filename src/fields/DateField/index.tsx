import React, { useState, useEffect, useCallback } from "react"
import { format } from "date-fns"

import { OverlapInputField } from "fields"
import DatePicker from "components/DatePicker"
import { Flex } from "theme"

import { ICON_NAMES } from "consts/icon-names"
import { expandTimestamp } from "utils"

import * as S from "./styled"
import { Icon } from "common"

interface IDateFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  date: number | undefined
  setDate: (v: number) => void
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  minDate?: Date
}

const DateField: React.FC<IDateFieldProps> = ({
  date,
  setDate,
  placeholder,
  disabled = false,
  readonly = false,
  minDate,
  ...rest
}) => {
  const [isCalendarOpened, setIsCalendarOpened] = useState<boolean>(false)

  useEffect(() => {
    if (readonly || disabled) {
      setIsCalendarOpened(false)
    }
  }, [readonly, disabled])

  const handleOpenCalendar = useCallback(() => {
    if (readonly || disabled) return

    setIsCalendarOpened(true)
  }, [readonly, disabled])

  const handleToggleCalendar = useCallback(() => {
    setIsCalendarOpened((v) => !v)
  }, [])

  return (
    <S.Root {...rest}>
      <OverlapInputField
        value={!date ? "" : " "}
        setValue={() => {}}
        readonly={true}
        disabled={disabled}
        onClick={handleOpenCalendar}
        label={!date ? undefined : placeholder}
        labelNodeRight={
          date ? <S.SuccessLabelIcon name={ICON_NAMES.greenCheck} /> : <></>
        }
        nodeLeft={
          <Flex ai="center" gap="16">
            <Icon name={ICON_NAMES.calendar} />
            {!date || date === 0 ? (
              <S.Placeholder>{placeholder}</S.Placeholder>
            ) : null}
            {date && date !== 0 ? (
              <S.Value>{format(date, "HH:mm MM.dd.yyyy")}</S.Value>
            ) : null}
          </Flex>
        }
      />
      <DatePicker
        isOpen={isCalendarOpened}
        timestamp={date ?? 0}
        toggle={handleToggleCalendar}
        onChange={(time: number) => setDate(expandTimestamp(time))}
        minDate={minDate}
      />
    </S.Root>
  )
}

export default DateField
