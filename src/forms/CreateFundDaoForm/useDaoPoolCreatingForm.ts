import { useState } from "react"

export const useInternalProposalForm = () => {
  const [earlyCompletion, setEarlyCompletion] = useState()
  const [delegatedVotingAllowed, setDelegatedVotingAllowed] = useState()
  const [validatorsVote, setValidatorsVote] = useState()
  const [duration, setDuration] = useState()
  const [durationValidators, setDurationValidators] = useState()
  const [quorum, setQuorum] = useState()
  const [quorumValidators, setQuorumValidators] = useState()
  const [minTokenBalance, setMinTokenBalance] = useState()
  const [minNftBalance, setMinNftBalance] = useState()
  const [rewardToken, setRewardToken] = useState()
  const [creationRewards, setCreationRewards] = useState()
  const [executionReward, setExecutionReward] = useState()
  const [voteRewardsCoefficient, setVoteRewardsCoefficient] = useState()
  const [executorDescription, setExecutorDescription] = useState()

  return {
    earlyCompletion: {
      get: earlyCompletion,
      set: setEarlyCompletion,
    },
    delegatedVotingAllowed: {
      get: delegatedVotingAllowed,
      set: setDelegatedVotingAllowed,
    },
    validatorsVote: {
      get: validatorsVote,
      set: setValidatorsVote,
    },
    duration: {
      get: duration,
      set: setDuration,
    },
    durationValidators: {
      get: durationValidators,
      set: setDurationValidators,
    },
    quorum: {
      get: quorum,
      set: setQuorum,
    },
    quorumValidators: {
      get: quorumValidators,
      set: setQuorumValidators,
    },
    minTokenBalance: {
      get: minTokenBalance,
      set: setMinTokenBalance,
    },
    minNftBalance: {
      get: minNftBalance,
      set: setMinNftBalance,
    },
    rewardToken: {
      get: rewardToken,
      set: setRewardToken,
    },
    creationRewards: {
      get: creationRewards,
      set: setCreationRewards,
    },
    executionReward: {
      get: executionReward,
      set: setExecutionReward,
    },
    voteRewardsCoefficient: {
      get: voteRewardsCoefficient,
      set: setVoteRewardsCoefficient,
    },
    executorDescription: {
      get: executorDescription,
      set: setExecutorDescription,
    },
  }
}

export const useDistributionProposalSettingsForm = () => {
  const [earlyCompletion, setEarlyCompletion] = useState()
  const [delegatedVotingAllowed, setDelegatedVotingAllowed] = useState()
  const [validatorsVote, setValidatorsVote] = useState()
  const [duration, setDuration] = useState()
  const [durationValidators, setDurationValidators] = useState()
  const [quorum, setQuorum] = useState()
  const [quorumValidators, setQuorumValidators] = useState()
  const [minTokenBalance, setMinTokenBalance] = useState()
  const [minNftBalance, setMinNftBalance] = useState()
  const [rewardToken, setRewardToken] = useState()
  const [creationRewards, setCreationRewards] = useState()
  const [executionReward, setExecutionReward] = useState()
  const [voteRewardsCoefficient, setVoteRewardsCoefficient] = useState()
  const [executorDescription, setExecutorDescription] = useState()

  return {
    earlyCompletion: {
      get: earlyCompletion,
      set: setEarlyCompletion,
    },
    delegatedVotingAllowed: {
      get: delegatedVotingAllowed,
      set: setDelegatedVotingAllowed,
    },
    validatorsVote: {
      get: validatorsVote,
      set: setValidatorsVote,
    },
    duration: {
      get: duration,
      set: setDuration,
    },
    durationValidators: {
      get: durationValidators,
      set: setDurationValidators,
    },
    quorum: {
      get: quorum,
      set: setQuorum,
    },
    quorumValidators: {
      get: quorumValidators,
      set: setQuorumValidators,
    },
    minTokenBalance: {
      get: minTokenBalance,
      set: setMinTokenBalance,
    },
    minNftBalance: {
      get: minNftBalance,
      set: setMinNftBalance,
    },
    rewardToken: {
      get: rewardToken,
      set: setRewardToken,
    },
    creationRewards: {
      get: creationRewards,
      set: setCreationRewards,
    },
    executionReward: {
      get: executionReward,
      set: setExecutionReward,
    },
    voteRewardsCoefficient: {
      get: voteRewardsCoefficient,
      set: setVoteRewardsCoefficient,
    },
    executorDescription: {
      get: executorDescription,
      set: setExecutorDescription,
    },
  }
}

export const useValidatorsBalancesSettingsForm = () => {
  const [earlyCompletion, setEarlyCompletion] = useState()
  const [delegatedVotingAllowed, setDelegatedVotingAllowed] = useState()
  const [validatorsVote, setValidatorsVote] = useState()
  const [duration, setDuration] = useState()
  const [durationValidators, setDurationValidators] = useState()
  const [quorum, setQuorum] = useState()
  const [quorumValidators, setQuorumValidators] = useState()
  const [minTokenBalance, setMinTokenBalance] = useState()
  const [minNftBalance, setMinNftBalance] = useState()
  const [rewardToken, setRewardToken] = useState()
  const [creationRewards, setCreationRewards] = useState()
  const [executionReward, setExecutionReward] = useState()
  const [voteRewardsCoefficient, setVoteRewardsCoefficient] = useState()
  const [executorDescription, setExecutorDescription] = useState()

  return {
    earlyCompletion: {
      get: earlyCompletion,
      set: setEarlyCompletion,
    },
    delegatedVotingAllowed: {
      get: delegatedVotingAllowed,
      set: setDelegatedVotingAllowed,
    },
    validatorsVote: {
      get: validatorsVote,
      set: setValidatorsVote,
    },
    duration: {
      get: duration,
      set: setDuration,
    },
    durationValidators: {
      get: durationValidators,
      set: setDurationValidators,
    },
    quorum: {
      get: quorum,
      set: setQuorum,
    },
    quorumValidators: {
      get: quorumValidators,
      set: setQuorumValidators,
    },
    minTokenBalance: {
      get: minTokenBalance,
      set: setMinTokenBalance,
    },
    minNftBalance: {
      get: minNftBalance,
      set: setMinNftBalance,
    },
    rewardToken: {
      get: rewardToken,
      set: setRewardToken,
    },
    creationRewards: {
      get: creationRewards,
      set: setCreationRewards,
    },
    executionReward: {
      get: executionReward,
      set: setExecutionReward,
    },
    voteRewardsCoefficient: {
      get: voteRewardsCoefficient,
      set: setVoteRewardsCoefficient,
    },
    executorDescription: {
      get: executorDescription,
      set: setExecutorDescription,
    },
  }
}

export const useDefaultProposalSettingForm = () => {
  const [earlyCompletion, setEarlyCompletion] = useState()
  const [delegatedVotingAllowed, setDelegatedVotingAllowed] = useState()
  const [validatorsVote, setValidatorsVote] = useState()
  const [duration, setDuration] = useState()
  const [durationValidators, setDurationValidators] = useState()
  const [quorum, setQuorum] = useState()
  const [quorumValidators, setQuorumValidators] = useState()
  const [minTokenBalance, setMinTokenBalance] = useState()
  const [minNftBalance, setMinNftBalance] = useState()
  const [rewardToken, setRewardToken] = useState()
  const [creationRewards, setCreationRewards] = useState()
  const [executionReward, setExecutionReward] = useState()
  const [voteRewardsCoefficient, setVoteRewardsCoefficient] = useState()
  const [executorDescription, setExecutorDescription] = useState()

  return {
    earlyCompletion: {
      get: earlyCompletion,
      set: setEarlyCompletion,
    },
    delegatedVotingAllowed: {
      get: delegatedVotingAllowed,
      set: setDelegatedVotingAllowed,
    },
    validatorsVote: {
      get: validatorsVote,
      set: setValidatorsVote,
    },
    duration: {
      get: duration,
      set: setDuration,
    },
    durationValidators: {
      get: durationValidators,
      set: setDurationValidators,
    },
    quorum: {
      get: quorum,
      set: setQuorum,
    },
    quorumValidators: {
      get: quorumValidators,
      set: setQuorumValidators,
    },
    minTokenBalance: {
      get: minTokenBalance,
      set: setMinTokenBalance,
    },
    minNftBalance: {
      get: minNftBalance,
      set: setMinNftBalance,
    },
    rewardToken: {
      get: rewardToken,
      set: setRewardToken,
    },
    creationRewards: {
      get: creationRewards,
      set: setCreationRewards,
    },
    executionReward: {
      get: executionReward,
      set: setExecutionReward,
    },
    voteRewardsCoefficient: {
      get: voteRewardsCoefficient,
      set: setVoteRewardsCoefficient,
    },
    executorDescription: {
      get: executorDescription,
      set: setExecutorDescription,
    },
  }
}

export const useDaoPoolCreatingForm = () => {
  return {}
}
