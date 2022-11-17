import { useCallback, useState } from "react"
import { useGovPool } from "hooks/dao"
import { IGovPool } from "interfaces/typechain/GovPool"

export const useGovPoolProposals = (govPoolAddress: string) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoadFailed, setIsLoadFailed] = useState(false)

  const [proposalViews, setProposalViews] = useState<
    (IGovPool.ProposalViewStructOutput & { id: string })[]
  >([])

  const { govPoolContract } = useGovPool(govPoolAddress)

  const loadProposals = useCallback(
    async (offset = 0, limit = 15) => {
      try {
        const data = await govPoolContract?.getProposals(offset, limit)

        if (data) {
          setProposalViews(
            data.map(
              (el, i) =>
                ({
                  id: offset + i + 1,
                  ...el,
                } as unknown as IGovPool.ProposalViewStructOutput & {
                  id: string
                })
            )
          )
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

enum ExecutorType {
  DEFAULT = "0",
  INTERNAL = "1",
  DISTRIBUTION = "2",
  VALIDATORS = "3",
}

const govPoolProposals = {
  [ExecutorType.INTERNAL]: {
    changeInternalDuration: "change-internal-duration",
    changeInternalQuorum: "change-internal-quorum",
    changeInternalDurationAndQuorum: "change-internal-duration-and-quorum",
    changeInternalBalances: "change-internal-balances",
  },
}
