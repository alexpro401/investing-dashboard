import { CSSProperties, FC, MouseEvent, useCallback, useMemo } from "react"

import TokenIcon from "components/TokenIcon"
import { Currency, Token } from "lib/entities"
import { useWeb3React } from "@web3-react/core"

import * as S from "./styled"
import { Flex } from "theme"
import { Icon } from "common"
import { ICON_NAMES } from "consts/icon-names"
import { useRemoveUserAddedToken } from "state/user/hooks"
import { Balance } from "./Balance"
import { CurrencyAmount } from "lib/entities/fractions/currencyAmount"

interface Props {
  whitelistOnly?: boolean
  address: string
  balance?: CurrencyAmount<Token>
  price?: CurrencyAmount<Token>
  currency: Currency
  isUserAdded: boolean
  isRisky: boolean
  style: CSSProperties
  onClick: (token: Currency, isRisky: boolean) => void
}

const iconStyle = {
  fill: "#EDA249",
  transform: "translate(0, -2px)",
}

const TokenRow: FC<Props> = ({
  whitelistOnly,
  address,
  balance,
  price,
  currency,
  isUserAdded,
  isRisky,
  style,
  onClick,
}) => {
  const { symbol, name } = currency
  const { chainId } = useWeb3React()
  const removeToken = useRemoveUserAddedToken()

  const handleRemoveToken = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation()
      if (!chainId) return
      removeToken(chainId, currency.wrapped.address)
    },
    [chainId, currency.wrapped.address, removeToken]
  )

  const handleSelect = useCallback(() => {
    onClick(currency, isRisky)
  }, [currency, isRisky, onClick])

  const tokenIcon = useMemo(
    () => <TokenIcon address={address} size={32} m="0 8px 0 0" />,
    [address]
  )

  return (
    <S.TokenContainer
      disabled={isRisky && whitelistOnly}
      style={style}
      onClick={handleSelect}
    >
      {tokenIcon}
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
      <Balance balance={balance} price={price} />
    </S.TokenContainer>
  )
}

export default TokenRow
