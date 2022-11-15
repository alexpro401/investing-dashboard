export interface IGovPoolVoter {
  id: string
  receivedDelegation: string
  receivedNFTDelegation: string[]
  totalDPClaimed: string
  totalClaimedUSD: string
}

export interface IGovPoolSettings {
  id: string
  settingsId: string
  executorDescription: string
}

export interface IGovPoolExecutor {
  id: string
  executorAddress: string
  settings: IGovPoolSettings
}

export interface IGovPoolQuery {
  id: string
  name: string
  votersCount: string
  creationTime: string
  creationBlock: string
  voters: IGovPoolVoter[]
  settings: IGovPoolSettings[]
  executors: IGovPoolExecutor[]
}

export interface IGovPoolDelegationHistoryQuery {
  id: string
  pool: {
    id: string
  }
  timestamp: string
  from: {
    id: string
  }
  to: {
    id: string
  }
  isDelegate: boolean
  amount: string
  nfts: string[]
}
