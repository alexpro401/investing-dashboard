import { useCallback, useEffect, useState } from "react"

import { useAPI } from "api"
import { useActiveWeb3React } from "hooks"
import { ITreasuryTokensList } from "api/kattana/types"

const useGovPoolTreasury = (
  govPoolAddress: string | undefined
): [ITreasuryTokensList | undefined, boolean, () => void] => {
  const {
    kattana: {
      treasury: { getGovPoolTreasuryTokensList },
    },
  } = useAPI()
  const { chainId } = useActiveWeb3React()

  const [treasury, setTreasury] = useState<undefined | ITreasuryTokensList>()
  const [loading, setLoading] = useState<boolean>(false)

  const setupGovPoolTreasuryTokens = useCallback(async () => {
    if (!chainId || !govPoolAddress || loading) return

    setLoading(true)

    try {
      const result = await getGovPoolTreasuryTokensList(chainId, govPoolAddress)

      setTreasury(result?.data ?? undefined)
    } catch (error) {
      console.log(error)
      setTreasury(undefined)
    } finally {
      setLoading(false)
    }
  }, [chainId, govPoolAddress, getGovPoolTreasuryTokensList, loading])

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
