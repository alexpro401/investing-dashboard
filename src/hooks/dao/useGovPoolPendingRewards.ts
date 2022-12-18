import { useCallback } from "react"
import { BigNumber } from "ethers"

import { useGovPoolContract } from "contracts"

const useGovPoolPendingRewards = (daoAddress?: string) => {
  const govPoolContract = useGovPoolContract(daoAddress)

  const pendingRewards = useCallback(
    async ({
      proposalId,
      account,
    }: {
      proposalId: string
      account: string
    }) => {
      if (!account || !govPoolContract) return

      try {
        const rewardsAmount = await govPoolContract?.pendingRewards(
          proposalId,
          account
        )
        return rewardsAmount
      } catch (error) {}

      return BigNumber.from("0")
    },
    [govPoolContract]
  )

  return { pendingRewards }
}

export default useGovPoolPendingRewards
