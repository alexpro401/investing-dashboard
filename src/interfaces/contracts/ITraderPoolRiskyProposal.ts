import { TraderPoolRiskyProposal } from "interfaces/typechain"

export type IRiskyProposalInfo = Awaited<
  ReturnType<TraderPoolRiskyProposal["getProposalInfos"]>
>

export type IRiskyProposalExchangeAmount = Awaited<
  ReturnType<TraderPoolRiskyProposal["getExchangeAmount"]>
>

export type IRiskyProposalInvestmentsInfo = Awaited<
  ReturnType<TraderPoolRiskyProposal["getActiveInvestmentsInfo"]>
>

export type IRiskyProposalInvestTokens = Awaited<
  ReturnType<TraderPoolRiskyProposal["getInvestTokens"]>
>

export type IDivestAmounts = Awaited<
  ReturnType<TraderPoolRiskyProposal["getDivestAmounts"]>
>
