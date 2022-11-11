import { BigNumberish } from "@ethersproject/bignumber"
import { useCallback } from "react"
import { useGovPoolContract } from "contracts"

const useGovPoolVote = (daoPoolAddress?: string) => {
  const govPool = useGovPoolContract(daoPoolAddress)

  const vote = useCallback(
    async (
      proposalId: BigNumberish,
      depositAmount: BigNumberish,
      depositNfts: BigNumberish[],
      voteAmount: BigNumberish,
      voteNftIds: BigNumberish[]
    ) => {
      if (!govPool) return

      try {
        const tx = await govPool.vote(
          proposalId,
          depositAmount,
          depositNfts,
          voteAmount,
          voteNftIds
        )
      } catch (error) {}
    },
    [govPool]
  )

  const voteDelegated = useCallback(
    async (
      proposalId: BigNumberish,
      voteAmount: BigNumberish,
      voteNftIds: BigNumberish[]
    ) => {
      if (!govPool) return

      try {
        const tx = await govPool.voteDelegated(
          proposalId,
          voteAmount,
          voteNftIds
        )
      } catch (error) {}
    },
    [govPool]
  )

  return { vote, voteDelegated }
}

export default useGovPoolVote
