import JSBI from "jsbi"
import { Interface } from "@ethersproject/abi"
import { ERC20 } from "abi"
import { CurrencyAmount } from "lib/entities/fractions/currencyAmount"
import { useMemo } from "react"
import { useMultipleContractSingleData } from "state/multicall/hooks"
import { isAddress } from "utils"
import { Currency, Token } from "lib/entities"

const ERC20_INTERFACE = new Interface(ERC20)

export const useTokenBalancesWithLoadingIndicator = (
  address?: string | null,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }, boolean] => {
  const validatedTokens: Token[] = useMemo(
    () =>
      tokens?.filter(
        (t?: Token): t is Token => isAddress(t?.address) !== false
      ) ?? [],
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
