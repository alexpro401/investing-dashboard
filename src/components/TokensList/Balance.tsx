import { Token } from "lib/entities"
import { CurrencyAmount } from "lib/entities/fractions/currencyAmount"
import { useMemo } from "react"
import { Price } from "./Price"
import * as S from "./styled"

export const Balance = ({
  balance,
  price,
}: {
  balance?: CurrencyAmount<Token>
  price?: CurrencyAmount<Token>
}) => {
  return useMemo(
    () => (
      <S.BalanceInfo>
        {balance ? (
          <S.TokenBalance>{balance.toSignificant(4)}</S.TokenBalance>
        ) : null}
        <Price price={price} balance={balance} />
      </S.BalanceInfo>
    ),
    [balance, price]
  )
}
