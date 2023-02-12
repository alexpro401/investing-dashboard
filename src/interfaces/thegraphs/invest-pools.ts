import { BigNumber } from "@ethersproject/bignumber"
import { IRiskyPosition } from "interfaces/thegraphs/basic-pools"

export interface IInvestProposal {
  id: string
  proposalId?: string
  timestampLimit: BigNumber
  investLPLimit: BigNumber
  leftTokens: string[]
  leftAmounts: BigNumber[]
  totalUSDSupply: BigNumber
  firstSupplyTimestamp: BigNumber
  APR: BigNumber
  lastSupply: {
    id: string
    timestamp: BigNumber
    dividendsTokens: string[]
    amountDividendsTokens: BigNumber[]
  }
  lastWithdraw: {
    id: string
    timestamp: BigNumber
    amountBase: BigNumber
  }
  investPool: {
    id: string
    baseToken: string
  }
}

export interface IInvestProposalQuery {
  id: string
  baseToken: string
  proposals: IInvestProposal[]
}

export interface InvestorPositionVest {
  id: string
  isInvest: boolean
  timestamp: string
  volumeBase: BigNumber
  volumeLP: BigNumber
  volumeUSD: BigNumber
}

export interface InvestorPosition {
  id: string
  isClosed: boolean
  totalBaseInvestVolume: BigNumber
  totalBaseDivestVolume: BigNumber
  totalLPInvestVolume: BigNumber
  totalLPDivestVolume: BigNumber
  totalUSDInvestVolume: BigNumber
  totalUSDDivestVolume: BigNumber
  pool: {
    id: string
    type: string
    token: string
  }
  vest?: InvestorPositionVest[]
}

// Investor proposals
interface IInvestorInvestedPool {
  id: string
}
export interface IInvestorInvestedPools {
  activePools: IInvestorInvestedPool[]
}

export interface IInvestorRiskyProposal {
  id: string
  token: string
  timestampLimit: number
  investLPLimit: BigNumber
  maxTokenPriceLimit: BigNumber
  basicPool: {
    id: string
    baseToken: string
  }
  positions?: any[]
}

export interface IInvestorRiskyPosition {
  id: string
  isClosed: boolean
  totalBaseOpenVolume: BigNumber
  totalBaseCloseVolume: BigNumber
  totalPositionOpenVolume: BigNumber
  totalPositionCloseVolume: BigNumber
  totalUSDOpenVolume: BigNumber
  totalUSDCloseVolume: BigNumber
}

export interface IInvestorRiskyPositions {
  id: string
  token: string
  basicPool: {
    id: string
    baseToken: string
  }
  positions: IRiskyPosition[]
}

export interface IInvestorInvestProposal {
  id: string
  timestampLimit: BigNumber
  investLPLimit: BigNumber
  leftTokens: BigNumber
  leftAmounts: string[]
  totalUSDSupply: BigNumber
  firstSupplyTimestamp: BigNumber
  APR: BigNumber
  lastSupply: {
    id: string
    timestamp: BigNumber
    dividendsTokens: string[]
    amountDividendsTokens: BigNumber[]
  }
  lastWithdraw: {
    id: string
    timestamp: BigNumber
    amountBase: BigNumber
  }
  investPool: {
    id: string
    baseToken: string
  }
}

interface InvestProposalLimits {
  timestampLimit: BigNumber
  investLPLimit: BigNumber
}

interface InvestProposalInfo {
  descriptionURL: string
  proposalLimits: InvestProposalLimits
  lpLocked: BigNumber
  investedBase: BigNumber
  newInvestedBase: BigNumber
}

export interface InvestProposal {
  id: any
  closed: any
  proposalInfo: InvestProposalInfo
  totalInvestors: BigNumber
}

export interface IInvestProposalWithdraw {
  id: string
  timestamp: string
  amountBase: string
}

export interface IInvestProposalSupply {
  id: string
  hash: string
  timestamp: string
  dividendsTokens: string[]
  amountDividendsTokens: string[]
}
