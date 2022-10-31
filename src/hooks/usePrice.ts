import { usePriceFeedContract } from "contracts"
import { Token } from "lib/entities"
import { useMemo } from "react"
import { useSingleContractMultipleData } from "state/multicall/hooks"
import { isAddress } from "utils"
import { parseUnits } from "@ethersproject/units"
import JSBI from "jsbi"
import { CurrencyAmount } from "lib/entities/fractions/currencyAmount"
import { useWeb3React } from "@web3-react/core"
import { useAllTokens } from "./useToken"

export const useTokenPricesWithLoadingIndicator = (
  address?: string | null,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }, boolean] => {
  const priceFeed = usePriceFeedContract()
  const validatedTokens: Token[] = useMemo(
    () =>
      tokens?.filter(
        (t?: Token): t is Token => isAddress(t?.address) !== false
      ) ?? [],
    [tokens]
  )
  const validatedTokensMap = useMemo(
    () =>
      validatedTokens.map((vt) => [
        vt.address,
        parseUnits("1", 18).toHexString(),
      ]),
    [validatedTokens]
  )

  const prices = useSingleContractMultipleData(
    priceFeed,
    "getNormalizedPriceOutUSD",
    validatedTokensMap
  )

  const anyLoading: boolean = useMemo(
    () => prices.some((callState) => callState.loading),
    [prices]
  )

  return useMemo(
    () => [
      address && validatedTokens.length > 0
        ? validatedTokens.reduce<{
            [tokenAddress: string]: CurrencyAmount<Token> | undefined
          }>((memo, token, i) => {
            const value = prices?.[i]?.result?.[0]
            const amount = value ? JSBI.BigInt(value.toString()) : undefined
            if (amount) {
              memo[token.address] = CurrencyAmount.fromRawAmount(token, amount)
            }
            return memo
          }, {})
        : {},
      anyLoading,
    ],
    [address, validatedTokens, anyLoading, prices]
  )
}

export function useAllTokenPrices(): [
  { [tokenAddress: string]: CurrencyAmount<Token> | undefined },
  boolean
] {
  const { account } = useWeb3React()
  const allTokens = useAllTokens()
  const allTokensArray = useMemo(
    () => Object.values(allTokens ?? {}),
    [allTokens]
  )
  const [prices, pricesIsLoading] = useTokenPricesWithLoadingIndicator(
    account ?? undefined,
    allTokensArray
  )
  return [prices ?? {}, pricesIsLoading]
}
