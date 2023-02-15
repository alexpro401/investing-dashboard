import { IInvestProposalInfo } from "interfaces/contracts/ITraderPoolInvestProposal"
import { IInvestProposal } from "interfaces/thegraphs/invest-pools"

export type InvestProposalUtilityIds = {
  proposalId: number
  proposalEntityId: string
  investPoolAddress: string
  proposalContractAddress: string
  investPoolBaseTokenAddress: string
}

export type WrappedInvestProposalView = {
  id: string
  payloadQuery: IInvestProposal
  payloadContract: IInvestProposalInfo[0]
  utilityIds: InvestProposalUtilityIds
}

export type InvestProposalMetadata = {
  ticker: string
  description: string
}
