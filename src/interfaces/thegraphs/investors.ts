import { BigNumberish } from "@ethersproject/bignumber"

export interface IInvestorClaims {
  amountDividendsTokens: string[]
  dividendsTokens: string[]
  id: string
  timestamp: string
}

export interface Insurance {
  stakeUSD: BigNumberish
  id: string
  day: string
  stake: string
  claimedAmount: string
  investor: { id: string }
}

export interface InvestorPoolPosition {
  id: string
  pool: { id: string; token: string }
  investor: { id: string }
  isClosed: boolean
  totalBaseInvestVolume: string
  totalBaseDivestVolume: string
  totalLPInvestVolume: string
  totalLPDivestVolume: string
  totalUSDInvestVolume: string
  totalUSDDivestVolume: string
}

export interface InvestorPoolHistory {
  id: string
  day: string
  currentLpAmount: string
}
export interface InvestorPoolPositionWithHistory extends InvestorPoolPosition {
  lpHistory: InvestorPoolHistory[]
}

export interface InvestorRiskyVest {
  id: string
  hash: string
  isInvest: boolean
  timestamp: string
  baseVolume: string
  lpVolume: string
  lp2Volume: string
  usdVolume: string
}

export interface InvestorRiskyPosition {
  id: string
  isClosed: boolean
  proposalId: string
  totalBaseOpenVolume: string
  totalBaseCloseVolume: string
  totalLPOpenVolume: string
  totalLPCloseVolume: string
  totalLP2OpenVolume: string
  totalLP2CloseVolume: string
  totalUSDOpenVolume: string
  totalUSDCloseVolume: string
  proposalContract: { id: string }
  investor: { id: string }
}

export interface InvestorRiskyPositionWithVests extends InvestorRiskyPosition {
  vests: InvestorRiskyVest[]
}

export interface InvestorPoolQuery {
  id: string
  proposalContract: string
  type: string
  token: string
}

export interface IInvestorQuery {
  id: string
  activePools: InvestorPoolQuery[]
  allPools: InvestorPoolQuery[]
}

export interface InvestorVest {
  id: string
  hash: string
  isInvest: boolean
  timestamp: string
  volumeBase: BigNumberish
  volumeLP: BigNumberish
  volumeUSD: BigNumberish
  volumeBTC: BigNumberish
  volumeNative: BigNumberish
}

export interface InvestorRiskyProposal {
  id: string
  basicPool: {
    id: string
  }
}
