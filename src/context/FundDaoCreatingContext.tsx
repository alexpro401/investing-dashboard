import { createContext } from "react"

export interface FundDaoPoolParameters {
  earlyCompletion: {
    get: string
    set: (value: string) => void
  }
  delegatedVotingAllowed: {
    get: boolean
    set: (value: boolean) => void
  }
  validatorsVote: {
    get: string
    set: (value: string) => void
  }
  duration: {
    get: string
    set: (value: string) => void
  }
  durationValidators: {
    get: string
    set: (value: string) => void
  }
  quorum: {
    get: string
    set: (value: string) => void
  }
  quorumValidators: {
    get: string
    set: (value: string) => void
  }
  minTokenBalance: {
    get: string
    set: (value: string) => void
  }
  minNftBalance: {
    get: string
    set: (value: string) => void
  }
  rewardToken: {
    get: string
    set: (value: string) => void
  }
  creationRewards: {
    get: string
    set: (value: string) => void
  }
  executionReward: {
    get: string
    set: (value: string) => void
  }
  voteRewardsCoefficient: {
    get: string
    set: (value: string) => void
  }
  executorDescription: {
    get: string
    set: (value: string) => void
  }
}

interface FundDaoCreatingContext {
  validatorsParams:
    | {
        name: {
          get: string
          set: (value: string) => void
        }
        symbol: {
          get: string
          set: (value: string) => void
        }
        duration: {
          get: number
          set: (value: number) => void
        }
        quorum: {
          get: string
          set: (value: string) => void
        }
        validators: {
          get: string[]
          set: (value: string[]) => void
        }
        balances: {
          get: string[]
          set: (value: string[]) => void
        }
      }
    | undefined
  userKeeperParams:
    | {
        tokenAddress: {
          get: string
          set: (value: string) => void
        }
        nftAddress: {
          get: string
          set: (value: string) => void
        }
        totalPowerInTokens: {
          get: string
          set: (value: string) => void
        }
        nftsTotalSupply: {
          get: number
          set: (value: number) => void
        }
      }
    | undefined
  internalProposalForm: FundDaoPoolParameters | undefined
  distributionProposalSettingsForm: FundDaoPoolParameters | undefined
  validatorsBalancesSettingsForm: FundDaoPoolParameters | undefined
  defaultProposalSettingForm: FundDaoPoolParameters | undefined
}

export const FundDaoCreatingContext = createContext<FundDaoCreatingContext>({
  internalProposalForm: undefined,
  distributionProposalSettingsForm: undefined,
  validatorsBalancesSettingsForm: undefined,
  defaultProposalSettingForm: undefined,
  userKeeperParams: undefined,
  validatorsParams: undefined,
})
