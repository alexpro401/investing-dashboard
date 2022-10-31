import { parseEther } from "@ethersproject/units"
import { Token } from "lib/entities"
import { CurrencyAmount } from "lib/entities/fractions/currencyAmount"
import { useMemo } from "react"
import { normalizeBigNumber } from "utils"
import { multiplyBignumbers } from "utils/formulas"
import * as S from "./styled"

export const Price = ({
  balance,
  price,
}: {
  balance?: CurrencyAmount<Token>
  price?: CurrencyAmount<Token>
}) => {
  const tokensPrice = useMemo(() => {
    const _tokenPrice = multiplyBignumbers(
      [parseEther(balance?.toSignificant(4) || "1"), 18],
      [parseEther(price?.toSignificant(4) || "1"), 18]
    )

    if (_tokenPrice.isZero()) return null

    return normalizeBigNumber(_tokenPrice, 18, 2)
  }, [balance, price])

  return <S.TokenPrice>{tokensPrice && `$${tokensPrice}`}</S.TokenPrice>
}
