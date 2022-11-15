export interface Exchange {
  id: string
  pool: string
  fromToken: string
  toToken: string
  fromVolume: string
  toVolume: string
}

export interface Vest {
  id: string
  pool: string
  baseAmount: string
  lpAmount: string
}

export interface Transaction {
  id: string
  timestamp: string
  block: string
  type: string[]
  user: string
  interactionsCount: string
  exchange: Array<Pick<Exchange, "id" | "fromToken" | "toToken">>
  vest: Array<Pick<Vest, "id" | "pool" | "baseAmount">>
  poolCreate: { id: string }[]
  proposalEdit: { id: string }[]
  riskyProposalCreate: { id: string }[]
  riskyProposalExchange: { id: string }[]
  riskyProposalVest: { id: string }[]
  investProposalClaimSupply: { id: string }[]
  investProposalCreate: { id: string }[]
  investProposalWithdraw: { id: string }[]
  investProposalConvertToDividends: { id: string }[]
  insuranceStake: { id: string }[]
  getPerfomanceFee: { id: string }[]
  onlyPool: { id: string }[]
}
