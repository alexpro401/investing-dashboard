import { InputField, InputFieldProps, OverlapInputField } from "fields"

import * as S from "./styled"
import { Dispatch, SetStateAction, useMemo } from "react"
import { isAddress } from "utils"
import { AppButton } from "common"

interface Props<V extends string | number> extends InputFieldProps<V> {
  secondValue: V
  setSecondValue: Dispatch<SetStateAction<V>>
}

function AddressAmountField<V extends string | number>({
  value,
  setValue,
  secondValue,
  setSecondValue,
  ...rest
}: Props<V>) {
  const isValidAddress = useMemo(() => isAddress(value), [value])

  return (
    <S.Root {...rest}>
      <OverlapInputField
        value={value}
        setValue={setValue}
        overlapNodeLeft={
          isValidAddress ? (
            <>
              <AppButton />
            </>
          ) : null
        }
        overlapNodeRight={
          isValidAddress ? (
            <InputField value={secondValue} setValue={setSecondValue} />
          ) : null
        }
      />
    </S.Root>
  )
}

export default AddressAmountField
