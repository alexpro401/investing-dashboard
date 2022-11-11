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
