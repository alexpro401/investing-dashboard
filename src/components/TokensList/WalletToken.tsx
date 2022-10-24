import { CSSProperties, FC, MouseEvent, useCallback, useMemo } from "react"

import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { normalizeBigNumber } from "utils"

import TokenIcon from "components/TokenIcon"
import { Currency } from "lib/entities"
import { useWeb3React } from "@web3-react/core"
import { useCurrencyBalance } from "hooks/useBalance"
import { parseEther } from "@ethersproject/units"

import * as S from "./styled"
import { Flex } from "theme"
import { Icon } from "common"
import { ICON_NAMES } from "constants/icon-names"
import { useRemoveUserAddedToken } from "state/user/hooks"

interface Props {
  address: string
  currency: Currency
  style: CSSProperties
  onClick: (token: Currency) => void
  isUserAdded: boolean
}

const iconStyle = {
  fill: "#EDA249",
  transform: "translate(0, -2px)",
}

const Token: FC<Props> = ({
  address,
  currency,
  style,
  isUserAdded,
  onClick,
}) => {
  const { symbol, name } = currency
  const { account, chainId } = useWeb3React()

  const token = currency.isToken ? currency : undefined
  const balance = useCurrencyBalance(account ?? undefined, token)
  const removeToken = useRemoveUserAddedToken()

  const usdPriceParams = useMemo(
    () => ({
      tokenAddress: address,
      amount: parseEther(balance?.toSignificant(4) || "1"),
    }),
    [address, balance]
  )

  const handleRemoveToken = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation()
      if (!chainId) return
      removeToken(chainId, currency.wrapped.address)
    },
    [chainId, currency.wrapped.address, removeToken]
  )

  const price = useTokenPriceOutUSD(usdPriceParams)

  return (
    <S.TokenContainer style={style} onClick={() => onClick(currency)}>
      <TokenIcon address={address} size={32} />
      <S.TokenInfo>
        <Flex gap="4">
          {isUserAdded && <Icon name={ICON_NAMES.warn} style={iconStyle} />}
          <S.Symbol>{symbol}</S.Symbol>
        </Flex>
        <Flex gap="4">
          <S.Name>{isUserAdded ? "Added by user" : name}</S.Name>
          {isUserAdded && (
            <S.RemoveButton
              onClick={handleRemoveToken}
              type="button"
              color="default"
              size="x-small"
              text="Remove"
            />
          )}
        </Flex>
      </S.TokenInfo>
      <S.BalanceInfo>
        {balance && <S.TokenBalance>{balance.toSignificant(4)}</S.TokenBalance>}
        {!price.isZero() && (
          <S.TokenPrice>${normalizeBigNumber(price, 18, 2)}</S.TokenPrice>
        )}
      </S.BalanceInfo>
    </S.TokenContainer>
  )
}

export default Token
