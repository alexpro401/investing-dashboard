import { OverlapInputField } from "fields"

import { FC, HTMLAttributes, ReactNode, useCallback } from "react"

import * as S from "./styled"

import { readFromClipboard } from "utils/clipboard"
import { isAddress } from "utils"

interface Props extends HTMLAttributes<HTMLDivElement> {
  onFilledNodeLeft: ReactNode

  addressValue: string
  updateAddressValue: (value: string) => void

  balanceValue?: string
  updateBalanceValue?: (value: string) => void

  tokenSymbol?: string
}

const AddressBalanceField: FC<Props> = ({
  onFilledNodeLeft,

  addressValue,
  updateAddressValue,

  balanceValue,
  updateBalanceValue,

  tokenSymbol,
  ...rest
}) => {
  const pasteAddress = useCallback(async () => {
    const textFromClipboard = await readFromClipboard()

    if (!textFromClipboard || !isAddress(textFromClipboard)) return

    updateAddressValue(textFromClipboard)
  }, [updateAddressValue])

  return (
    <S.FieldContainer {...rest}>
      <OverlapInputField
        value={addressValue}
        nodeLeft={
          addressValue ? (
            onFilledNodeLeft
          ) : (
            <S.NodeLeftBtn onClick={pasteAddress}>Paste Address</S.NodeLeftBtn>
          )
        }
        nodeRight={
          addressValue && updateBalanceValue ? (
            <S.BalanceInputWrp>
              <S.BalanceInput
                value={balanceValue}
                onInput={(e) => updateBalanceValue(e.currentTarget.value)}
                type="number"
                placeholder="0,00"
              />
              {tokenSymbol ? (
                <S.BalanceTokenSymbol>{tokenSymbol}</S.BalanceTokenSymbol>
              ) : (
                <></>
              )}
            </S.BalanceInputWrp>
          ) : (
            <></>
          )
        }
      />
    </S.FieldContainer>
  )
}

export default AddressBalanceField
