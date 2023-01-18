import React, { useCallback } from "react"

import { AppButton, TokenChip } from "common"
import { useBreakpoints, useERC20 } from "hooks"
import { isAddress } from "utils"
import { readFromClipboard } from "utils/clipboard"
import { Flex } from "theme"
import OverlapInputField from "../OverlapInputField"

import * as S from "./styled"

interface ITokenSalPairFieldProps {
  tokenAddress?: string
  setTokenAddress: (v: string) => void
  amount?: string
  setAmount: (v: string) => void
  onDelete: () => void
  errorMessage?: string
}

const TokenSalePairField: React.FC<ITokenSalPairFieldProps> = ({
  tokenAddress = "",
  setTokenAddress,
  amount = "",
  setAmount,
  onDelete,
  errorMessage,
}) => {
  const { isMediumTablet } = useBreakpoints()
  const [, tokenData] = useERC20(tokenAddress)

  const handlePasteTokenAddress = useCallback(async () => {
    try {
      const address = await readFromClipboard()

      if (isAddress(address)) {
        setTokenAddress(address)
      }
    } catch (error) {
      console.log(error)
    }
  }, [setTokenAddress])

  const handleChangeTokenInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isNaN(Number(event.currentTarget.value))) return

      setAmount(event.currentTarget.value)
    },
    [setAmount]
  )

  if (isMediumTablet) {
    return (
      <S.DektopFieldContainer>
        <S.DesktopLeftInput
          value={""}
          readonly
          nodeLeft={
            !isAddress(tokenAddress) ? (
              <AppButton
                color="default"
                size="no-paddings"
                text="Paste Token Address"
                onClick={handlePasteTokenAddress}
              />
            ) : (
              <Flex ai="center">
                <S.TrashIconHolder onClick={onDelete}>
                  <S.TrashIcon />
                </S.TrashIconHolder>
                {tokenData && tokenData?.name && tokenData?.symbol ? (
                  <TokenChip name={tokenData.name} symbol={tokenData.symbol} />
                ) : (
                  <S.TokenUnknownValue>
                    {tokenAddress.slice(0, 6)}
                  </S.TokenUnknownValue>
                )}
              </Flex>
            )
          }
          errorMessage={errorMessage}
        />
        <S.DesktopRightInput
          type={"number"}
          inputMode={"decimal"}
          value={amount}
          onChange={handleChangeTokenInput}
          placeholder={"Amount of token"}
          nodeRight={
            <S.TokenPlaceholder>{tokenData?.name ?? "XXX"}</S.TokenPlaceholder>
          }
        />
      </S.DektopFieldContainer>
    )
  }

  return (
    <OverlapInputField
      value={" "}
      readonly
      nodeLeft={
        !isAddress(tokenAddress) ? (
          <AppButton
            color="default"
            size="no-paddings"
            text="+ Paste token address"
            onClick={handlePasteTokenAddress}
          />
        ) : (
          <Flex ai="center">
            <S.TrashIconHolder onClick={onDelete}>
              <S.TrashIcon />
            </S.TrashIconHolder>
            {tokenData && tokenData?.name && tokenData?.symbol ? (
              <TokenChip name={tokenData.name} symbol={tokenData.symbol} />
            ) : (
              <S.TokenUnknownValue>
                {tokenAddress.slice(0, 6)}
              </S.TokenUnknownValue>
            )}
          </Flex>
        )
      }
      nodeRight={
        !isAddress(tokenAddress) ? (
          <></>
        ) : (
          <S.TokenInput
            value={amount}
            type={"number"}
            inputMode={"decimal"}
            onChange={handleChangeTokenInput}
            placeholder={"Price"}
          />
        )
      }
    />
  )
}

export default TokenSalePairField
