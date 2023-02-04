import { IRiskyProposalInfo } from "../interfaces/contracts/ITraderPoolRiskyProposal"

export type RiskyProposalUtilityIds = {
  proposalId: number
  proposalEntityId?: string
  basicPoolAddress: string
  proposalContractAddress: string
}

export type WrappedRiskyProposalView = {
  id: string
  proposal: IRiskyProposalInfo[0]
  utilityIds: RiskyProposalUtilityIds
}
