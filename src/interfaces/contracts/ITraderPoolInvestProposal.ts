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
