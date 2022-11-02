import JSBI from "jsbi"
import { Interface } from "@ethersproject/abi"
import { ERC20, TraderPool } from "abi"
import { CurrencyAmount } from "lib/entities/fractions/currencyAmount"
import { useMemo } from "react"
import { useMultipleContractSingleData } from "state/multicall/hooks"
import { isAddress } from "utils"
import { Currency, Token } from "lib/entities"
import { ZERO } from "constants/index"
import { useWeb3React } from "@web3-react/core"
import { useAllTokens } from "./useToken"

const ERC20_INTERFACE = new Interface(ERC20)
const TRADER_POOL_INTERFACE = new Interface(TraderPool)

export const usePoolBalancesWithLoadingIndicator = (
  poolAddress?: string,
  account?: string | null,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }, boolean] => {
  const validatedTokens: Token[] = useMemo(
    () =>
      tokens?.filter((t?: Token): t is Token => isAddress(t?.address)) ?? [],
    [tokens]
  )

  const poolInfo = useMultipleContractSingleData(
    useMemo(() => [poolAddress], [poolAddress]),
    TRADER_POOL_INTERFACE,
    "getPoolInfo",
    useMemo(() => undefined, [])
  )

  const anyLoading: boolean = useMemo(
    () => poolInfo.some((callState) => callState.loading),
    [poolInfo]
  )

  return useMemo(() => {
    const result = poolInfo?.[0]?.result?.[0]
    const balances = result ? result.baseAndPositionBalances : []
    const positions = result
      ? [result.parameters.baseToken, ...result.openPositions].map((t) =>
          t.toLocaleLowerCase()
        )
      : []

    return [
      account && validatedTokens.length > 0
        ? validatedTokens.reduce<{
            [tokenAddress: string]: CurrencyAmount<Token> | undefined
          }>((memo, token, i) => {
            const tokenAddress = token.address.toLocaleLowerCase()
            const positionIndex = positions.indexOf(tokenAddress)

            const value = positionIndex !== -1 ? balances[positionIndex] : ZERO
            const amount = value ? JSBI.BigInt(value.toString()) : undefined

            if (amount) {
              memo[token.address] = CurrencyAmount.fromRawAmount(token, amount)
            }

            return memo
          }, {})
        : {},
      anyLoading,
    ]
  }, [account, validatedTokens, anyLoading, poolInfo])
}

export const useTokenBalancesWithLoadingIndicator = (
  address?: string | null,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }, boolean] => {
  const validatedTokens: Token[] = useMemo(
    () =>
      tokens?.filter((t?: Token): t is Token => isAddress(t?.address)) ?? [],
    [tokens]
  )
  const validatedTokenAddresses = useMemo(
    () => validatedTokens.map((vt) => vt.address),
    [validatedTokens]
  )

  const balances = useMultipleContractSingleData(
    validatedTokenAddresses,
    ERC20_INTERFACE,
    "balanceOf",
    useMemo(() => [address || undefined], [address])
  )

  const anyLoading: boolean = useMemo(
    () => balances.some((callState) => callState.loading),
    [balances]
  )

  return useMemo(
    () => [
      address && validatedTokens.length > 0
        ? validatedTokens.reduce<{
            [tokenAddress: string]: CurrencyAmount<Token> | undefined
          }>((memo, token, i) => {
            const value = balances?.[i]?.result?.[0]
            const amount = value ? JSBI.BigInt(value.toString()) : undefined
            if (amount) {
              memo[token.address] = CurrencyAmount.fromRawAmount(token, amount)
            }
            return memo
          }, {})
        : {},
      anyLoading,
    ],
    [address, validatedTokens, anyLoading, balances]
  )
}

export const useTokenBalances = (
  address?: string | null,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: CurrencyAmount<Token> | undefined } => {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0]
}

export const useCurrencyBalances = (
  account?: string | null,
  currencies?: (Token | undefined)[]
): (CurrencyAmount<Currency> | undefined)[] => {
  const tokens = useMemo(
    () =>
      currencies?.filter(
        (currency): currency is Token => currency?.isToken ?? false
      ) ?? [],
    [currencies]
  )

  const tokenBalances = useTokenBalances(account, tokens)

  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!account || !currency) return undefined
        if (currency.isToken) return tokenBalances[currency.address]
        return undefined
      }) ?? [],
    [account, currencies, tokenBalances]
  )
}

export const useCurrencyBalance = (
  account?: string | null,
  currency?: Token
): CurrencyAmount<Currency> | undefined => {
  return useCurrencyBalances(
    account,
    useMemo(() => [currency], [currency])
  )[0]
}

export const usePoolBalances = (
  poolAddress?: string,
  account?: string | null,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: CurrencyAmount<Token> | undefined } => {
  return usePoolBalancesWithLoadingIndicator(poolAddress, account, tokens)[0]
}

export const useFundBalances = (
  poolAddress?: string,
  account?: string | null,
  currencies?: (Token | undefined)[]
): (CurrencyAmount<Currency> | undefined)[] => {
  const tokens = useMemo(
    () =>
      currencies?.filter(
        (currency): currency is Token => currency?.isToken ?? false
      ) ?? [],
    [currencies]
  )

  const tokenBalances = usePoolBalances(poolAddress, account, tokens)

  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!account || !currency) return undefined
        if (currency.isToken) return tokenBalances[currency.address]
        return undefined
      }) ?? [],
    [account, currencies, tokenBalances]
  )
}

export function useAllTokenBalances(): [
  { [tokenAddress: string]: CurrencyAmount<Token> | undefined },
  boolean
] {
  const { account } = useWeb3React()
  const allTokens = useAllTokens()
  const allTokensArray = useMemo(
    () => Object.values(allTokens ?? {}),
    [allTokens]
  )
  const [balances, balancesIsLoading] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    allTokensArray
  )
  return [balances ?? {}, balancesIsLoading]
}

export function useAllTokenFundBalances(
  poolAddress: string | undefined
): [{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }, boolean] {
  const { account } = useWeb3React()
  const allTokens = useAllTokens()
  const allTokensArray = useMemo(
    () => Object.values(allTokens ?? {}),
    [allTokens]
  )
  const [balances, balancesIsLoading] = usePoolBalancesWithLoadingIndicator(
    poolAddress,
    account ?? undefined,
    allTokensArray
  )
  return [balances ?? {}, balancesIsLoading]
}

export const useFundBalance = (
  poolAddress?: string,
  account?: string | null,
  currency?: Token
): CurrencyAmount<Currency> | undefined => {
  return useFundBalances(
    poolAddress,
    account,
    useMemo(() => [currency], [currency])
  )[0]
}
