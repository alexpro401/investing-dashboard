import { CSSProperties, FC } from "react"
import { useWeb3React } from "@web3-react/core"
import { Currency } from "lib/entities"
import { Icon } from "common"
import theme, { Flex } from "theme"

import { ICON_NAMES } from "constants/icon-names"

import TokenIcon from "components/TokenIcon"

import { useCurrencyBalance } from "hooks/useBalance"

import * as S from "./styled"

interface Props {
  address: string
  currency: Currency
  style: CSSProperties
  onClick: (token: Currency) => void
}

const iconStyle = {
  fill: theme.statusColors.error,
  transform: "translate(0, -2px)",
}

const BlacklistToken: FC<Props> = ({ address, currency, style, onClick }) => {
  const { symbol, name } = currency
  const { account } = useWeb3React()

  const token = currency.isToken ? currency : undefined
  const balance = useCurrencyBalance(account ?? undefined, token)

  return (
    <S.TokenContainer disabled style={style} onClick={() => onClick(currency)}>
      <TokenIcon address={address} size={32} />
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
      <S.BalanceInfo>
        {balance && <S.TokenBalance>{balance.toSignificant(4)}</S.TokenBalance>}
      </S.BalanceInfo>
    </S.TokenContainer>
  )
}

export default BlacklistToken
