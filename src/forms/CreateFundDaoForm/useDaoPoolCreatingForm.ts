import { useState } from "react"
import { FundDaoStep } from "./FundDaoCreatingContext"

export const useDaoPoolCreatingForm = (): {
  validatorsParams: {
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
  userKeeperParams: {
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
  internalProposalForm: FundDaoStep
  distributionProposalSettingsForm: FundDaoStep
  validatorsBalancesSettingsForm: FundDaoStep
  defaultProposalSettingForm: FundDaoStep
} => {
  const validatorsParams = {
    name: useState(""),
    symbol: useState(""),
    duration: useState(500),
    quorum: useState(""),
    validators: useState<string[]>([]),
    balances: useState<string[]>([]),
  }
  const userKeeperParams = {
    tokenAddress: useState(""),
    nftAddress: useState(""),
    totalPowerInTokens: useState(""),
    nftsTotalSupply: useState(0),
  }

  const internalProposalForm = {
    earlyCompletion: useState(""),
    delegatedVotingAllowed: useState(""),
    validatorsVote: useState(""),
    duration: useState(""),
    durationValidators: useState(""),
    quorum: useState(""),
    quorumValidators: useState(""),
    minTokenBalance: useState(""),
    minNftBalance: useState(""),
    rewardToken: useState(""),
    creationRewards: useState(""),
    executionReward: useState(""),
    voteRewardsCoefficient: useState(""),
    executorDescription: useState(""),
  }
  const distributionProposalSettingsForm = {
    earlyCompletion: useState(""),
    delegatedVotingAllowed: useState(""),
    validatorsVote: useState(""),
    duration: useState(""),
    durationValidators: useState(""),
    quorum: useState(""),
    quorumValidators: useState(""),
    minTokenBalance: useState(""),
    minNftBalance: useState(""),
    rewardToken: useState(""),
    creationRewards: useState(""),
    executionReward: useState(""),
    voteRewardsCoefficient: useState(""),
    executorDescription: useState(""),
  }
  const validatorsBalancesSettingsForm = {
    earlyCompletion: useState(""),
    delegatedVotingAllowed: useState(""),
    validatorsVote: useState(""),
    duration: useState(""),
    durationValidators: useState(""),
    quorum: useState(""),
    quorumValidators: useState(""),
    minTokenBalance: useState(""),
    minNftBalance: useState(""),
    rewardToken: useState(""),
    creationRewards: useState(""),
    executionReward: useState(""),
    voteRewardsCoefficient: useState(""),
    executorDescription: useState(""),
  }
  const defaultProposalSettingForm = {
    earlyCompletion: useState(""),
    delegatedVotingAllowed: useState(""),
    validatorsVote: useState(""),
    duration: useState(""),
    durationValidators: useState(""),
    quorum: useState(""),
    quorumValidators: useState(""),
    minTokenBalance: useState(""),
    minNftBalance: useState(""),
    rewardToken: useState(""),
    creationRewards: useState(""),
    executionReward: useState(""),
    voteRewardsCoefficient: useState(""),
    executorDescription: useState(""),
  }

  return {
    validatorsParams: {
      name: {
        get: validatorsParams.name[0],
        set: validatorsParams.name[1],
      },
      symbol: {
        get: validatorsParams.symbol[0],
        set: validatorsParams.symbol[1],
      },
      duration: {
        get: validatorsParams.duration[0],
        set: validatorsParams.duration[1],
      },
      quorum: {
        get: validatorsParams.quorum[0],
        set: validatorsParams.quorum[1],
      },
      validators: {
        get: validatorsParams.validators[0],
        set: validatorsParams.validators[1],
      },
      balances: {
        get: validatorsParams.balances[0],
        set: validatorsParams.balances[1],
      },
    },
    userKeeperParams: {
      tokenAddress: {
        get: userKeeperParams.tokenAddress[0],
        set: userKeeperParams.tokenAddress[1],
      },
      nftAddress: {
        get: userKeeperParams.nftAddress[0],
        set: userKeeperParams.nftAddress[1],
      },
      totalPowerInTokens: {
        get: userKeeperParams.totalPowerInTokens[0],
        set: userKeeperParams.totalPowerInTokens[1],
      },
      nftsTotalSupply: {
        get: userKeeperParams.nftsTotalSupply[0],
        set: userKeeperParams.nftsTotalSupply[1],
      },
    },

    internalProposalForm: {
      earlyCompletion: {
        get: internalProposalForm.earlyCompletion[0],
        set: internalProposalForm.earlyCompletion[1],
      },
      delegatedVotingAllowed: {
        get: internalProposalForm.delegatedVotingAllowed[0],
        set: internalProposalForm.delegatedVotingAllowed[1],
      },
      validatorsVote: {
        get: internalProposalForm.validatorsVote[0],
        set: internalProposalForm.validatorsVote[1],
      },
      duration: {
        get: internalProposalForm.duration[0],
        set: internalProposalForm.duration[1],
      },
      durationValidators: {
        get: internalProposalForm.durationValidators[0],
        set: internalProposalForm.durationValidators[1],
      },
      quorum: {
        get: internalProposalForm.quorum[0],
        set: internalProposalForm.quorum[1],
      },
      quorumValidators: {
        get: internalProposalForm.quorumValidators[0],
        set: internalProposalForm.quorumValidators[1],
      },
      minTokenBalance: {
        get: internalProposalForm.minTokenBalance[0],
        set: internalProposalForm.minTokenBalance[1],
      },
      minNftBalance: {
        get: internalProposalForm.minNftBalance[0],
        set: internalProposalForm.minNftBalance[1],
      },
      rewardToken: {
        get: internalProposalForm.rewardToken[0],
        set: internalProposalForm.rewardToken[1],
      },
      creationRewards: {
        get: internalProposalForm.creationRewards[0],
        set: internalProposalForm.creationRewards[1],
      },
      executionReward: {
        get: internalProposalForm.executionReward[0],
        set: internalProposalForm.executionReward[1],
      },
      voteRewardsCoefficient: {
        get: internalProposalForm.voteRewardsCoefficient[0],
        set: internalProposalForm.voteRewardsCoefficient[1],
      },
      executorDescription: {
        get: internalProposalForm.executorDescription[0],
        set: internalProposalForm.executorDescription[1],
      },
    },
    distributionProposalSettingsForm: {
      earlyCompletion: {
        get: distributionProposalSettingsForm.earlyCompletion[0],
        set: distributionProposalSettingsForm.earlyCompletion[1],
      },
      delegatedVotingAllowed: {
        get: distributionProposalSettingsForm.delegatedVotingAllowed[0],
        set: distributionProposalSettingsForm.delegatedVotingAllowed[1],
      },
      validatorsVote: {
        get: distributionProposalSettingsForm.validatorsVote[0],
        set: distributionProposalSettingsForm.validatorsVote[1],
      },
      duration: {
        get: distributionProposalSettingsForm.duration[0],
        set: distributionProposalSettingsForm.duration[1],
      },
      durationValidators: {
        get: distributionProposalSettingsForm.durationValidators[0],
        set: distributionProposalSettingsForm.durationValidators[1],
      },
      quorum: {
        get: distributionProposalSettingsForm.quorum[0],
        set: distributionProposalSettingsForm.quorum[1],
      },
      quorumValidators: {
        get: distributionProposalSettingsForm.quorumValidators[0],
        set: distributionProposalSettingsForm.quorumValidators[1],
      },
      minTokenBalance: {
        get: distributionProposalSettingsForm.minTokenBalance[0],
        set: distributionProposalSettingsForm.minTokenBalance[1],
      },
      minNftBalance: {
        get: distributionProposalSettingsForm.minNftBalance[0],
        set: distributionProposalSettingsForm.minNftBalance[1],
      },
      rewardToken: {
        get: distributionProposalSettingsForm.rewardToken[0],
        set: distributionProposalSettingsForm.rewardToken[1],
      },
      creationRewards: {
        get: distributionProposalSettingsForm.creationRewards[0],
        set: distributionProposalSettingsForm.creationRewards[1],
      },
      executionReward: {
        get: distributionProposalSettingsForm.executionReward[0],
        set: distributionProposalSettingsForm.executionReward[1],
      },
      voteRewardsCoefficient: {
        get: distributionProposalSettingsForm.voteRewardsCoefficient[0],
        set: distributionProposalSettingsForm.voteRewardsCoefficient[1],
      },
      executorDescription: {
        get: distributionProposalSettingsForm.executorDescription[0],
        set: distributionProposalSettingsForm.executorDescription[1],
      },
    },
    validatorsBalancesSettingsForm: {
      earlyCompletion: {
        get: validatorsBalancesSettingsForm.earlyCompletion[0],
        set: validatorsBalancesSettingsForm.earlyCompletion[1],
      },
      delegatedVotingAllowed: {
        get: validatorsBalancesSettingsForm.delegatedVotingAllowed[0],
        set: validatorsBalancesSettingsForm.delegatedVotingAllowed[1],
      },
      validatorsVote: {
        get: validatorsBalancesSettingsForm.validatorsVote[0],
        set: validatorsBalancesSettingsForm.validatorsVote[1],
      },
      duration: {
        get: validatorsBalancesSettingsForm.duration[0],
        set: validatorsBalancesSettingsForm.duration[1],
      },
      durationValidators: {
        get: validatorsBalancesSettingsForm.durationValidators[0],
        set: validatorsBalancesSettingsForm.durationValidators[1],
      },
      quorum: {
        get: validatorsBalancesSettingsForm.quorum[0],
        set: validatorsBalancesSettingsForm.quorum[1],
      },
      quorumValidators: {
        get: validatorsBalancesSettingsForm.quorumValidators[0],
        set: validatorsBalancesSettingsForm.quorumValidators[1],
      },
      minTokenBalance: {
        get: validatorsBalancesSettingsForm.minTokenBalance[0],
        set: validatorsBalancesSettingsForm.minTokenBalance[1],
      },
      minNftBalance: {
        get: validatorsBalancesSettingsForm.minNftBalance[0],
        set: validatorsBalancesSettingsForm.minNftBalance[1],
      },
      rewardToken: {
        get: validatorsBalancesSettingsForm.rewardToken[0],
        set: validatorsBalancesSettingsForm.rewardToken[1],
      },
      creationRewards: {
        get: validatorsBalancesSettingsForm.creationRewards[0],
        set: validatorsBalancesSettingsForm.creationRewards[1],
      },
      executionReward: {
        get: validatorsBalancesSettingsForm.executionReward[0],
        set: validatorsBalancesSettingsForm.executionReward[1],
      },
      voteRewardsCoefficient: {
        get: validatorsBalancesSettingsForm.voteRewardsCoefficient[0],
        set: validatorsBalancesSettingsForm.voteRewardsCoefficient[1],
      },
      executorDescription: {
        get: validatorsBalancesSettingsForm.executorDescription[0],
        set: validatorsBalancesSettingsForm.executorDescription[1],
      },
    },
    defaultProposalSettingForm: {
      earlyCompletion: {
        get: defaultProposalSettingForm.earlyCompletion[0],
        set: defaultProposalSettingForm.earlyCompletion[1],
      },
      delegatedVotingAllowed: {
        get: defaultProposalSettingForm.delegatedVotingAllowed[0],
        set: defaultProposalSettingForm.delegatedVotingAllowed[1],
      },
      validatorsVote: {
        get: defaultProposalSettingForm.validatorsVote[0],
        set: defaultProposalSettingForm.validatorsVote[1],
      },
      duration: {
        get: defaultProposalSettingForm.duration[0],
        set: defaultProposalSettingForm.duration[1],
      },
      durationValidators: {
        get: defaultProposalSettingForm.durationValidators[0],
        set: defaultProposalSettingForm.durationValidators[1],
      },
      quorum: {
        get: defaultProposalSettingForm.quorum[0],
        set: defaultProposalSettingForm.quorum[1],
      },
      quorumValidators: {
        get: defaultProposalSettingForm.quorumValidators[0],
        set: defaultProposalSettingForm.quorumValidators[1],
      },
      minTokenBalance: {
        get: defaultProposalSettingForm.minTokenBalance[0],
        set: defaultProposalSettingForm.minTokenBalance[1],
      },
      minNftBalance: {
        get: defaultProposalSettingForm.minNftBalance[0],
        set: defaultProposalSettingForm.minNftBalance[1],
      },
      rewardToken: {
        get: defaultProposalSettingForm.rewardToken[0],
        set: defaultProposalSettingForm.rewardToken[1],
      },
      creationRewards: {
        get: defaultProposalSettingForm.creationRewards[0],
        set: defaultProposalSettingForm.creationRewards[1],
      },
      executionReward: {
        get: defaultProposalSettingForm.executionReward[0],
        set: defaultProposalSettingForm.executionReward[1],
      },
      voteRewardsCoefficient: {
        get: defaultProposalSettingForm.voteRewardsCoefficient[0],
        set: defaultProposalSettingForm.voteRewardsCoefficient[1],
      },
      executorDescription: {
        get: defaultProposalSettingForm.executorDescription[0],
        set: defaultProposalSettingForm.executorDescription[1],
      },
    },
  }
}
