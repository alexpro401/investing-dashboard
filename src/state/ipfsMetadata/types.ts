import { SUPPORTED_SOCIALS } from "consts"

export interface IPoolMetadata {
  assets: string[]
  description: string
  strategy: string
  account: string
  timestamp: number
  socialLinks: [SUPPORTED_SOCIALS, string][]
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
