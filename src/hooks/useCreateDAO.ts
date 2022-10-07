import { useCallback, useMemo } from "react"
import { parseEther, parseUnits } from "@ethersproject/units"

import { usePoolFactoryContract } from "contracts"
import useGasTracker from "state/gas/hooks"

const useCreateDAO = () => {
  const factory = usePoolFactoryContract()

  const [gasTrackerResponse] = useGasTracker()

  const transactionOptions = useMemo(() => {
    if (!gasTrackerResponse) return

    return {
      gasPrice: parseUnits(gasTrackerResponse.ProposeGasPrice, "gwei"),
    }
  }, [gasTrackerResponse])

  const createPool = useCallback(async () => {
    if (!factory) return

    const OWNER = "0x8eFf9Efd56581bb5B8Ac5F5220faB9A7349160e3"
    const ZERO = "0x0000000000000000000000000000000000000000"
    const POOL_PARAMETERS = {
      settingsParams: {
        internalProposalSettings: {
          earlyCompletion: true,
          delegatedVotingAllowed: true,
          validatorsVote: false,
          duration: 500,
          durationValidators: 600,
          quorum: parseUnits("51", 25),
          quorumValidators: parseUnits("61", 25),
          minVotesForVoting: parseEther("10"),
          minVotesForCreating: parseEther("5"),
          rewardToken: ZERO,
          creationReward: 0,
          executionReward: 0,
          voteRewardsCoefficient: 0,
          executorDescription: "internal",
        },
        distributionProposalSettings: {
          earlyCompletion: false,
          delegatedVotingAllowed: false,
          validatorsVote: false,
          duration: 500,
          durationValidators: 600,
          quorum: parseUnits("51", 25),
          quorumValidators: parseUnits("61", 25),
          minVotesForVoting: parseEther("10"),
          minVotesForCreating: parseEther("5"),
          rewardToken: ZERO,
          creationReward: 0,
          executionReward: 0,
          voteRewardsCoefficient: 0,
          executorDescription: "DP",
        },
        validatorsBalancesSettings: {
          earlyCompletion: true,
          delegatedVotingAllowed: false,
          validatorsVote: true,
          duration: 500,
          durationValidators: 600,
          quorum: parseUnits("51", 25),
          quorumValidators: parseUnits("61", 25),
          minVotesForVoting: parseEther("10"),
          minVotesForCreating: parseEther("5"),
          rewardToken: ZERO,
          creationReward: 0,
          executionReward: 0,
          voteRewardsCoefficient: 0,
          executorDescription: "validators",
        },
        defaultProposalSettings: {
          earlyCompletion: false,
          delegatedVotingAllowed: true,
          validatorsVote: true,
          duration: 700,
          durationValidators: 800,
          quorum: parseUnits("71", 25),
          quorumValidators: parseUnits("100", 25),
          minVotesForVoting: parseEther("20"),
          minVotesForCreating: parseEther("5"),
          rewardToken: ZERO,
          creationReward: 0,
          executionReward: 0,
          voteRewardsCoefficient: 0,
          executorDescription: "default",
        },
      },
      validatorsParams: {
        name: "Validator Token",
        symbol: "VT",
        duration: 500,
        quorum: parseUnits("51", 25),
        validators: [OWNER],
        balances: [parseEther("100")],
      },
      userKeeperParams: {
        tokenAddress: "0x8a9424745056eb399fd19a0ec26a14316684e274",
        nftAddress: ZERO,
        totalPowerInTokens: parseEther("33000"),
        nftsTotalSupply: 33,
      },
      descriptionURL: "example.com",
    }

    try {
      const response = await factory.deployGovPool(
        POOL_PARAMETERS,
        transactionOptions
      )

      console.log(response)
    } catch (e) {
      console.log(e)
    }
  }, [factory, transactionOptions])
}

export default useCreateDAO
