import { BigNumber } from "@ethersproject/bignumber"

/*
   # Contract TraderPoolInvestProposal
*/

// method: getActiveInvestmentsInfo()
export interface IInvestProposalInvestmentsInfo {
  baseInvested: BigNumber
  lp2Balance: BigNumber
  lpInvested: BigNumber
  proposalId: BigNumber
}

interface IReception {
  amounts: BigNumber[]
  tokens: string[]
}

// method: getRewards()
export interface IInvestProposalRewards {
  totalUsdAmount: BigNumber
  totalBaseAmount: BigNumber
  baseAmountFromRewards: BigNumber
  rewards: IReception[]
}
