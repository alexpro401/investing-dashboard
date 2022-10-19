import { CSSProperties, FC } from "react"

import TokenIcon from "components/TokenIcon"
import { Currency } from "lib/entities"
import { useWeb3React } from "@web3-react/core"
import { useFundBalance } from "hooks/useBalance"

import * as S from "./styled"

interface Props {
  poolAddress?: string
  address: string
  currency: Currency
  style: CSSProperties
  onClick: (token: Currency) => void
}

const BlacklistToken: FC<Props> = ({
  poolAddress,
  address,
  currency,
  style,
  onClick,
}) => {
  const { symbol, name } = currency
  const { account } = useWeb3React()

  const token = currency.isToken ? currency : undefined
  const balance = useFundBalance(poolAddress, account ?? undefined, token)

  return (
    <S.TokenContainer style={style} onClick={() => onClick(currency)}>
      <TokenIcon address={address} size={30} />
      <S.TokenInfo>
        <S.Symbol>{symbol}</S.Symbol>
        <S.Name>{name}</S.Name>
      </S.TokenInfo>
      <S.BalanceInfo>
        {balance && <S.TokenBalance>{balance.toSignificant(4)}</S.TokenBalance>}
      </S.BalanceInfo>
    </S.TokenContainer>
  )
}

export default BlacklistToken
