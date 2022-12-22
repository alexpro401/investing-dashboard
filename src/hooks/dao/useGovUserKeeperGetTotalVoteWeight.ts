import { useEffect, useCallback, useState } from "react"
import { BigNumber } from "ethers"

import { useGovUserKeeperContract } from "contracts"

export const useGovUserKeeperGetTotalVoteWeight = (
  daoPoolAddress: string
): BigNumber | null => {
  const userKeeperContract = useGovUserKeeperContract(daoPoolAddress)
  const [totalVoteWeight, setTotalVoteWeight] = useState<BigNumber | null>(null)

  const setupTotalVoteWeight = useCallback(async () => {
    if (!userKeeperContract) return

    try {
      const _totalVoteWeight = await userKeeperContract.getTotalVoteWeight()
      setTotalVoteWeight(_totalVoteWeight)
    } catch (error) {
      console.log(error)
    }
  }, [userKeeperContract])

  useEffect(() => {
    setupTotalVoteWeight()
  }, [setupTotalVoteWeight])

  return totalVoteWeight
}

export default useGovUserKeeperGetTotalVoteWeight
