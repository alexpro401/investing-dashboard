import { Interface } from "@ethersproject/abi"
import ERC20 from "abi/erc20.json"
import { Token } from "interfaces"
import { useMemo } from "react"
import { useMultipleContractSingleData } from "state/multicall/hooks"

const ERC20_INTERFACE = new Interface(ERC20)

export const useTokenBalancesWithLoadingIndicator = (
  address?: string | null,
  tokens?: (Token | undefined)[]
) => {
  const validatedTokenAddresses =
    tokens?.map((token) => token?.address.toLocaleLowerCase()) || []

  const balances = useMultipleContractSingleData(
    validatedTokenAddresses,
    ERC20_INTERFACE,
    "balanceOf",
    useMemo(() => [address || undefined], [address])
  )

  console.log(balances)
  return balances
}

export const useTokenBalances = (
  account?: string | null,
  tokens?: (Token | undefined)[]
) => {
  return useTokenBalancesWithLoadingIndicator(account, tokens)
}

export const useCurrencyBalances = (
  account?: string | null,
  tokens?: (Token | undefined)[]
) => {
  const tokenBalances = useTokenBalances(account, tokens)
  return tokenBalances
}

export const useCurrencyBalance = (account?: string | null, token?: Token) => {
  return useCurrencyBalances(account, [token])[0]
}
