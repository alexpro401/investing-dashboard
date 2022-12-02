import { useERC20 } from "hooks/useERC20"
import { useNativeToken } from "hooks/useNativeToken"
import { useMemo } from "react"

export const useDistributionProposalToken = (address: string | undefined) => {
  const [, tokenData] = useERC20(address)
  const nativeToken = useNativeToken()

  const isNativeToken = useMemo(
    () => address === nativeToken.address,
    [address, nativeToken]
  )

  const name = useMemo(
    () => (isNativeToken ? nativeToken.name : tokenData?.name),
    [isNativeToken, nativeToken.name, tokenData]
  )

  const symbol = useMemo(
    () => (isNativeToken ? nativeToken.symbol : tokenData?.symbol),
    [isNativeToken, nativeToken.symbol, tokenData]
  )

  const decimals = useMemo(
    () => (isNativeToken ? nativeToken.decimals : tokenData?.decimals),
    [isNativeToken, nativeToken.decimals, tokenData]
  )

  return {
    isNativeToken,

    name,
    symbol,
    decimals,
  }
}
