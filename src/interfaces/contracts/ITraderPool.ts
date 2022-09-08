import { BigNumber } from "@ethersproject/bignumber"

/*
   # Contract TraderPool
*/

// method: getDivestAmountsAndCommissions()
export interface IDivestAmountsAndCommissions {
  comissions: {
    dexeBaseCommission: BigNumber
    dexeDexeCommission: BigNumber
    traderBaseCommission: BigNumber
  }
  receptions: {
    baseAmount: BigNumber
    givenAmounts: BigNumber[]
    lpAmount: BigNumber
    positions: string[]
    receivedAmounts: BigNumber[]
  }
}

// method: getInvestTokens()
export interface IPoolInvestTokens {
  baseAmount: BigNumber
  givenAmounts: BigNumber[]
  lpAmount: BigNumber
  positions: string[]
  receivedAmounts: BigNumber[]
}

// method: getPoolInfo()
export interface IPoolInfo {
  baseAndPositionBalances: BigNumber[]
  lpLockedInProposals: BigNumber
  lpSupply: BigNumber
  name: string
  openPositions: string[]
  ticker: string
  totalInvestors: BigNumber
  totalPoolBase: BigNumber
  totalPoolUSD: BigNumber
  traderBase: BigNumber
  traderLPBalance: BigNumber
  traderUSD: BigNumber
  parameters: IPoolParameters
}
interface IPoolParameters {
  baseToken: string
  trader: string
  baseTokenDecimals: BigNumber
  commissionPercentage: BigNumber
  commissionPeriod: number
  descriptionURL: string
  minimalInvestment: BigNumber
  privatePool: boolean
  totalLPEmission: BigNumber
}

// method: getLeverageInfo()
export interface ILeverageInfo {
  totalPoolUSDWithProposals: BigNumber
  freeLeverageBase: BigNumber
  freeLeverageUSD: BigNumber
  traderLeverageUSDTokens: BigNumber
}

// method: getUsersInfo()
export interface IUserFeeInfo {
  commissionUnlockTimestamp: BigNumber
  poolLPBalance: BigNumber
  investedBase: BigNumber
  poolUSDShare: BigNumber
  poolBaseShare: BigNumber
  owedBaseCommission: BigNumber
  owedLPCommission: BigNumber
}
