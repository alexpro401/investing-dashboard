import { useState } from "react"
import { useGovPool } from "hooks/dao"
import { IGovPool } from "interfaces/typechain/GovPool"

export const useGovPoolProposals = (govPoolAddress: string) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoadFailed, setIsLoadFailed] = useState(false)

  const [proposalViews, setProposalViews] = useState<
    IGovPool.ProposalViewStructOutput[]
  >([])

  const { govPoolContract } = useGovPool(govPoolAddress)

  const loadProposals = async () => {
    try {
      const data = await govPoolContract?.getProposals(0, 10)
      console.log(data)

      if (data) {
        setProposalViews(data)
      }
    } catch (error) {
      setIsLoadFailed(true)
    }
    setIsLoaded(true)
  }

  return {
    isLoaded,
    isLoadFailed,

    proposalViews,

    loadProposals,
  }
}
