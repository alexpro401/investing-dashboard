import { useCallback, useEffect, useState } from "react"

import { useAPI } from "api"
import { useActiveWeb3React } from "hooks"
import { ITreasuryTokensList } from "api/kattana/types"

const useGovPoolTreasury = (govPoolAddress: string | undefined) => {
  const {
    kattana: {
      treasury: { getGovPoolTreasuryTokensList },
    },
  } = useAPI()
  const { chainId } = useActiveWeb3React()

  const [treasury, setTreasury] = useState<undefined | ITreasuryTokensList>()
  const [loading, setLoading] = useState<boolean>(false)

  const setupGovPoolTreasuryTokens = useCallback(async () => {
    if (!chainId || !govPoolAddress) return

    setLoading(true)

    try {
      const result = await getGovPoolTreasuryTokensList(
        56,
        //govPoolAddress
        "0x05c12E9fAC51646710C4de014Bef33cFe158c08d"
      )

      setTreasury(result?.data ?? undefined)
    } catch (error) {
      console.log(error)
      setTreasury(undefined)
    } finally {
      setLoading(false)
    }
  }, [chainId, govPoolAddress, getGovPoolTreasuryTokensList])

  useEffect(() => {
    setupGovPoolTreasuryTokens()
  }, [setupGovPoolTreasuryTokens])

  const update = useCallback(() => {
    setupGovPoolTreasuryTokens()
  }, [setupGovPoolTreasuryTokens])

  return [treasury, loading, update]
}

export default useGovPoolTreasury
