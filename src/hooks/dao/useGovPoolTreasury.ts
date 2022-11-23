import { useCallback, useEffect, useState } from "react"

import { useAPI } from "api"
import { useActiveWeb3React } from "hooks"
import { ITreasuryTokensList } from "api/token/types"

const useGovPoolTreasury = (
  govPoolAddress: string | undefined
): [ITreasuryTokensList | undefined, boolean, () => void] => {
  const { TokenAPI } = useAPI()
  const { chainId } = useActiveWeb3React()

  const [treasury, setTreasury] = useState<undefined | ITreasuryTokensList>()
  const [loading, setLoading] = useState<boolean>(false)

  const setupGovPoolTreasuryTokens = useCallback(async () => {
    if (!chainId || !govPoolAddress || loading) return

    setLoading(true)

    try {
      const result = await TokenAPI.getWalletBalances(
        56,
        //TODO: govPoolAddress
        "0x05c12E9fAC51646710C4de014Bef33cFe158c08d"
      )

      setTreasury(result)
    } catch (error) {
      console.log(error)
      setTreasury(undefined)
    } finally {
      setLoading(false)
    }
  }, [chainId, govPoolAddress, loading, TokenAPI])

  useEffect(() => {
    if (chainId && govPoolAddress) {
      setupGovPoolTreasuryTokens()
    }
  }, [chainId, govPoolAddress])

  const update = useCallback(() => {
    setupGovPoolTreasuryTokens()
  }, [setupGovPoolTreasuryTokens])

  return [treasury, loading, update]
}

export default useGovPoolTreasury
