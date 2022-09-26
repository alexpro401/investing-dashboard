export interface IInvestorClaims {
  amountDividendsTokens: string[]
  dividendsTokens: string[]
  id: string
  timestamp: string
}

export interface Insurance {
  id: string
  day: string
  stake: string
  claimedAmount: string
  investor: { id: string }
}
