import { BigNumber } from "@ethersproject/bignumber"

export interface IRiskyPosition {
  id: string
  isClosed: boolean
  totalBaseOpenVolume: BigNumber
  totalBaseCloseVolume: BigNumber
  totalPositionOpenVolume: BigNumber
  totalPositionCloseVolume: BigNumber
  totalUSDOpenVolume: BigNumber
  totalUSDCloseVolume: BigNumber
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

export interface IRiskyPositionCard extends IRiskyPosition {
  token?: string
  proposal?: string
  pool: {
    id: string
    baseToken: string
  }
  exchanges: IRiskyPositionExchange[]
}
