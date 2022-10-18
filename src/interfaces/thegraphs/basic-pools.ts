import { BigNumber } from "@ethersproject/bignumber"

export interface RiskyPositionProposalData {
  token: string
  basicPool: {
    id: string
    baseToken: string
  }
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

export interface IRiskyPosition {
  id: string
  isClosed: boolean
  totalBaseOpenVolume: BigNumber
  totalBaseCloseVolume: BigNumber
  totalPositionOpenVolume: BigNumber
  totalPositionCloseVolume: BigNumber
  totalUSDOpenVolume: BigNumber
  totalUSDCloseVolume: BigNumber
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
