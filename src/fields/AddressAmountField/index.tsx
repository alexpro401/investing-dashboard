import { InputFieldProps, OverlapInputField } from "fields"

import * as S from "./styled"
import { Dispatch, SetStateAction } from "react"

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
  return (
    <S.Root {...rest}>
      <OverlapInputField value={value} setValue={setValue} />
    </S.Root>
  )
}

export default AddressAmountField
