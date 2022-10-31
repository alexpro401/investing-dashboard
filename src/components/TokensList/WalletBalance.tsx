import { Token } from "lib/entities"
import { CurrencyAmount } from "lib/entities/fractions/currencyAmount"
import { useMemo } from "react"
import { Price } from "./Price"
import * as S from "./styled"

export const WalletBalance = ({
  balance,
}: {
  balance?: CurrencyAmount<Token>
}) => {
  return useMemo(
    () => (
      <S.BalanceInfo>
        {balance ? (
          <S.TokenBalance>{balance.toSignificant(4)}</S.TokenBalance>
        ) : null}
        <Price balance={balance} />
      </S.BalanceInfo>
    ),
    [balance]
  )
}
