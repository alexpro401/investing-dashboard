import { BigNumber } from "ethers"

export interface RiskyProposalLimitsRequest {
  timestampLimit: BigNumber
  investLPLimit: BigNumber
  maxTokenPriceLimit: BigNumber
}

export interface InvestProposalLimitsRequest {
  timestampLimit: BigNumber
  investLPLimit: BigNumber
}
