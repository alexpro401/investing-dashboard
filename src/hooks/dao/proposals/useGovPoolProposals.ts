import { useCallback, useState } from "react"
import { useGovPool } from "hooks/dao"
import { IGovPool } from "interfaces/typechain/GovPool"

export const useGovPoolProposals = (govPoolAddress: string) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoadFailed, setIsLoadFailed] = useState(false)

  const [proposalViews, setProposalViews] = useState<
    IGovPool.ProposalViewStructOutput[]
  >([])

  const { govPoolContract } = useGovPool(govPoolAddress)

  const loadProposals = useCallback(
    async (offset = 0, limit = 15) => {
      try {
        const data = await govPoolContract?.getProposals(offset, limit)

        if (data) {
          setProposalViews(data)
        }
      } catch (error) {
        setIsLoadFailed(true)
      }
      setIsLoaded(true)
    },
    [govPoolContract]
  )

  return {
    isLoaded,
    isLoadFailed,

    proposalViews,

    loadProposals,
  }
}
