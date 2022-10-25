import { parseEther } from "@ethersproject/units"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { useMemo } from "react"
import { normalizeBigNumber } from "utils"
import * as S from "./styled"

export const Price = ({ address, balance }) => {
  const usdPriceParams = useMemo(
    () => ({
      tokenAddress: address,
      amount: parseEther(balance?.toSignificant(4) || "1"),
    }),
    [address, balance]
  )

  const price = useTokenPriceOutUSD(usdPriceParams)

  return useMemo(
    () =>
      !price.isZero() ? (
        <S.TokenPrice>${normalizeBigNumber(price, 18, 2)}</S.TokenPrice>
      ) : null,
    [price]
  )
}
