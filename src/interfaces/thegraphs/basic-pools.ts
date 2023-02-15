import { BigNumber } from "@ethersproject/bignumber"

export interface RiskyPositionProposalData {
  id: string
  token: string
  basicPool: {
    id: string
    baseToken: string
  }
  proposalId: string
  exchanges?: IRiskyPositionExchange[]
}

export interface IRiskyPositionExchange {
  id: string
  timestamp: string
  fromToken: string
  toToken: string
  fromVolume: BigNumber
  toVolume: BigNumber
  usdVolume: BigNumber
}

export interface RiskyPositionPayload {
  id: string
  isClosed: boolean
  totalBaseOpenVolume: BigNumber
  totalBaseCloseVolume: BigNumber
  totalPositionOpenVolume: BigNumber
  totalPositionCloseVolume: BigNumber
  totalUSDOpenVolume: BigNumber
  totalUSDCloseVolume: BigNumber
}

export interface IRiskyPosition extends RiskyPositionPayload {
  proposal: RiskyPositionProposalData
}

export interface IRiskyProposal {
  token: string
  basicPool: {
    id: string
    baseToken: string
  }
  positions: IRiskyPosition[]
}

export interface IRiskyProposalQuery {
  proposals: IRiskyProposal[]
}

export interface WrappedPoolRiskyProposalPositionViewUtilityIds {
  proposalId?: number
  proposalEntityId: string
  proposalTokenAddress: string
  poolAddress: string
  poolBaseTokenAddress: string
}

export interface WrappedPoolRiskyProposalPositionView {
  id: string
  position: RiskyPositionPayload
  utilityIds: WrappedPoolRiskyProposalPositionViewUtilityIds
}
