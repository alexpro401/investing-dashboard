import { BigNumber } from "@ethersproject/bignumber"

/*
   # Contract TraderPoolRiskyProposal
*/

// method: getInvestTokens()
export interface IProposalInvestTokens {
  baseAmount: BigNumber
  lp2Amount: BigNumber
  positionAmount: BigNumber
}

// method: getDivestAmounts()
export interface IDivestAmounts {
  baseAmount: BigNumber
  givenAmount: BigNumber[]
  positions: string[]
  receivedAmounts: BigNumber[]
}

// method: getActiveInvestmentsInfo()
export interface IRiskyProposalInvestmentsInfo {
  baseInvested: BigNumber
  baseShare: BigNumber
  lp2Balance: BigNumber
  lpInvested: BigNumber
  positionShare: BigNumber
  proposalId: BigNumber
}

// method: getProposalInfos()
export interface IRiskyProposal {
  lp2Supply: BigNumber
  proposalInfo: RiskyProposalInfo
  positionTokenPrice: BigNumber
  totalProposalBase: BigNumber
  totalProposalUSD: BigNumber
  totalInvestors: BigNumber
}
interface RiskyProposalInfo {
  balanceBase: BigNumber
  balancePosition: BigNumber
  lpLocked: BigNumber
  proposalLimits: RiskyProposalLimits
  token: string
  tokenDecimals: BigNumber
}
interface RiskyProposalLimits {
  investLPLimit: BigNumber
  maxTokenPriceLimit: BigNumber
  timestampLimit: BigNumber
}
