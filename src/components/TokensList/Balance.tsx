import { useMemo } from "react"
import { Price } from "./Price"
import * as S from "./styled"

export const Balance = ({ token, balance }) => {
  return useMemo(
    () => (
      <S.BalanceInfo>
        {balance ? (
          <S.TokenBalance>{balance.toSignificant(4)}</S.TokenBalance>
        ) : null}
        <Price address={token.address} balance={balance} />
      </S.BalanceInfo>
    ),
    [balance, token.address]
  )
}
