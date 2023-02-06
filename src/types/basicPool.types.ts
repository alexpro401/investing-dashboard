import { BigNumber } from "@ethersproject/bignumber"

import {
  IRiskyProposalInfo,
  IRiskyProposalInvestmentsInfo,
} from "interfaces/contracts/ITraderPoolRiskyProposal"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"

export type RiskyProposalUtilityIds = {
  proposalId: number
  proposalEntityId: string
  basicPoolAddress: string
  proposalContractAddress: string
  proposalTokenAddress: string
}

export type WrappedRiskyProposalView = {
  id: string
  proposal: IRiskyProposalInfo[0]
  utilityIds: RiskyProposalUtilityIds
  userActiveInvestmentsInfo: IRiskyProposalInvestmentsInfo[0]
  proposalTokenMarkPrice: BigNumber
  poolInfo?: IPoolInfo
}
