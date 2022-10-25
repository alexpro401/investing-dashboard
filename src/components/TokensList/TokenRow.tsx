import { CSSProperties, FC, MouseEvent, useCallback, useMemo } from "react"

import TokenIcon from "components/TokenIcon"
import { Currency, Token } from "lib/entities"
import { useWeb3React } from "@web3-react/core"

import * as S from "./styled"
import { Flex } from "theme"
import { Icon } from "common"
import { ICON_NAMES } from "constants/icon-names"
import { useRemoveUserAddedToken } from "state/user/hooks"
import { Balance } from "./Balance"
import { CurrencyAmount } from "lib/entities/fractions/currencyAmount"

interface Props {
  address: string
  balance?: CurrencyAmount<Token>
  currency: Currency
  isUserAdded: boolean
  isRisky: boolean
  style: CSSProperties
  onClick: (token: Currency) => void
}

const iconStyle = {
  fill: "#EDA249",
  transform: "translate(0, -2px)",
}

const TokenRow: FC<Props> = ({
  address,
  balance,
  currency,
  isUserAdded,
  isRisky,
  style,
  onClick,
}) => {
  const { symbol, name } = currency
  const { chainId } = useWeb3React()
  const removeToken = useRemoveUserAddedToken()

  const token = useMemo(
    () => (currency.isToken ? currency : undefined),
    [currency]
  )

  const handleRemoveToken = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation()
      if (!chainId) return
      removeToken(chainId, currency.wrapped.address)
    },
    [chainId, currency.wrapped.address, removeToken]
  )

  return (
    <S.TokenContainer style={style} onClick={() => onClick(currency)}>
      <TokenIcon address={address} size={32} />
      <S.TokenInfo>
        <Flex gap="4">
          {(isUserAdded || isRisky) && (
            <Icon name={ICON_NAMES.warn} style={iconStyle} />
          )}
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
      <Balance token={token} balance={balance} />
    </S.TokenContainer>
  )
}

export default TokenRow
