import { InputFieldProps, OverlapInputField } from "fields"

import * as S from "./styled"
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react"
import { isAddress, shortenAddress } from "utils"

interface Props extends InputFieldProps<string | number> {
  value: string | number
  setValue: Dispatch<SetStateAction<string | number>>
  secondValue: string | number
  setSecondValue: Dispatch<SetStateAction<string | number>>
  overlapNodeLeft?: ReactNode
  internalNodeRight?: ReactNode
}

function AddressAmountField({
  value,
  setValue,
  secondValue,
  setSecondValue,
  overlapNodeLeft,
  internalNodeRight,
  label,
  labelNodeRight,
  errorMessage,
  ...rest
}: Props) {
  const internalInputElement = useRef<HTMLInputElement | null>(null)

  const [isSecondValueFocused, setIsSecondValueFocused] = useState(false)

  const isValidAddress = useMemo(() => isAddress(value), [value])

  const handleSecondInput = useCallback(
    (e) => {
      const currentValue = e.currentTarget.value

      setSecondValue(currentValue)
    },
    [setSecondValue]
  )

  return (
    <S.Root {...rest}>
      <OverlapInputField
        label={label}
        labelNodeRight={labelNodeRight}
        value={value}
        setValue={setValue}
        overlapNodeLeft={
          isValidAddress ? (
            <S.OverlapLeft>
              {overlapNodeLeft}
              <S.OverlapCroppedAddress>
                {shortenAddress(value as string)}
              </S.OverlapCroppedAddress>
            </S.OverlapLeft>
          ) : null
        }
        overlapNodeRight={
          isValidAddress ? (
            <>
              <S.InternalInputWrp>
                {!!secondValue || isSecondValueFocused ? (
                  <S.InternalInput
                    value={secondValue}
                    onInput={handleSecondInput}
                    ref={internalInputElement}
                    onBlur={() => setIsSecondValueFocused(false)}
                  />
                ) : (
                  <S.InternalInputPlaceholder
                    onClick={() => {
                      setIsSecondValueFocused(true)
                      setTimeout(() => {
                        internalInputElement.current?.focus()
                      }, 500)
                    }}
                  >
                    + 0,00
                  </S.InternalInputPlaceholder>
                )}
                {internalNodeRight}
              </S.InternalInputWrp>
            </>
          ) : null
        }
        errorMessage={errorMessage}
      />
    </S.Root>
  )
}

export default AddressAmountField
