export interface IPoolMetadata {
  assets: string[]
  description: string
  strategy: string
  account: string
}

export interface IUserMetadata {
  hash: string
  assets: string[]
  name: string
  timestamp: number
  account: string
}

export interface IInvestProposalMetadata {
  timestamp: number
  account: string
  description: string
  ticker: string
}

export interface InsuranceAccidentMetadata {
  hash: string
  pool: string
  created: number
  timestamp: number
  block: number
}
