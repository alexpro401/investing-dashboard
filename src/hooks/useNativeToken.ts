import { ChainMainTokenData } from "consts/chains"
import { useActiveWeb3React } from "hooks"
import { Token } from "interfaces"
import { useMemo } from "react"

export const useNativeToken = () => {
  const { chainId } = useActiveWeb3React()

  const tokenData = useMemo(
    () => (chainId ? ChainMainTokenData[chainId] : ChainMainTokenData[56]),
    [chainId]
  ) as unknown as Token

  return tokenData
}
