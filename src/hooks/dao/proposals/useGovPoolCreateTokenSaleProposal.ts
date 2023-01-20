import { useCallback } from "react"
import { BigNumber } from "@ethersproject/bignumber"

import { useDistributionProposalContract } from "contracts"

interface ITier {
  metadata: {
    name: string
    description: string
  }
  totalTokenProvided: BigNumber
  saleStartTime: string
  saleEndTime: string
  saleTokenAddress: string
  purchaseTokenAddresses: string[]
  exchangeRates: BigNumber[]
  minAllocationPerUser: BigNumber
  maxAllocationPerUser: BigNumber
  vestingSettings: {
    vestingPercentage: BigNumber
    vestingDuration: string
    cliffPeriod: string
    unlockStep: string
  }
}

interface ICreateProposalArgs {
  tiers: ITier[]
}

const useGovPoolCreateTokenSaleProposal = () => {
  const createProposal = useCallback((args: ICreateProposalArgs) => {
    const { tiers } = args
  }, [])

  return createProposal
}

export default useGovPoolCreateTokenSaleProposal
