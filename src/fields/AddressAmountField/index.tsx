import { InputFieldProps, OverlapInputField } from "fields"

import * as S from "./styled"
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useMemo,
} from "react"
import { cropAddress, isAddress } from "utils"

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
  ...rest
}: Props) {
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
                {cropAddress(value as string)}
              </S.OverlapCroppedAddress>
            </S.OverlapLeft>
          ) : null
        }
        overlapNodeRight={
          isValidAddress ? (
            <S.InternalInputWrp>
              <S.InternalInput
                value={secondValue}
                onInput={handleSecondInput}
              />
              {internalNodeRight}
            </S.InternalInputWrp>
          ) : null
        }
      />
    </S.Root>
  )
}

export default AddressAmountField
