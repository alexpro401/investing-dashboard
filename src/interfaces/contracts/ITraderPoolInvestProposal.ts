import { TraderPoolInvestProposal } from "interfaces/typechain"

export type IInvestProposalInfo = Awaited<
  ReturnType<TraderPoolInvestProposal["getProposalInfos"]>
>
export type IInvestProposalActiveInvestmentsInfo = Awaited<
  ReturnType<TraderPoolInvestProposal["getActiveInvestmentsInfo"]>
>
export type IInvestProposalRewards = Awaited<
  ReturnType<TraderPoolInvestProposal["getRewards"]>
>
