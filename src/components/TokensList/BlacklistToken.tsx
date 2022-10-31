import { CSSProperties, FC } from "react"
import { Currency, Token } from "lib/entities"
import { Icon } from "common"
import theme, { Flex } from "theme"

import { ICON_NAMES } from "constants/icon-names"

import TokenIcon from "components/TokenIcon"

import * as S from "./styled"
import { Balance } from "./Balance"
import { CurrencyAmount } from "lib/entities/fractions/currencyAmount"

interface Props {
  address: string
  balance?: CurrencyAmount<Token>
  currency: Currency
  style: CSSProperties
  onClick: (token: Currency) => void
}

const iconStyle = {
  fill: theme.statusColors.error,
  transform: "translate(0, -2px)",
}

const BlacklistToken: FC<Props> = ({
  address,
  balance,
  currency,
  style,
  onClick,
}) => {
  const { symbol, name } = currency

  const token = currency.isToken ? currency : undefined

  return (
    <S.TokenContainer disabled style={style} onClick={() => onClick(currency)}>
      <TokenIcon m="0 8px 0 0" address={address} size={32} />
      <S.TokenInfo>
        <Flex gap="4">
          <Icon name={ICON_NAMES.warn} style={iconStyle} />
          <S.Symbol>{symbol}</S.Symbol>
        </Flex>
        <Flex gap="4">
          <S.Name>{name}</S.Name>
          <S.Blacklist>Blacklist</S.Blacklist>
        </Flex>
      </S.TokenInfo>
      <Balance balance={balance} />
    </S.TokenContainer>
  )
}

export default BlacklistToken
