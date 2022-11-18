import { useCallback, useEffect, useState } from "react"
import { BigNumber } from "@ethersproject/bignumber"

import { useGovPoolContract, useGovSettingsContract } from "contracts"

interface IUseGovPoolSetting {
  daoAddress: string
  settingsId: number
}

interface IGovSettings {
  earlyCompletion: boolean
  delegatedVotingAllowed: boolean
  validatorsVote: boolean
  duration: BigNumber
  durationValidators: BigNumber
  quorum: BigNumber
  quorumValidators: BigNumber
  minVotesForVoting: BigNumber
  minVotesForCreating: BigNumber
  rewardToken: string
  creationReward: BigNumber
  executionReward: BigNumber
  voteRewardsCoefficient: BigNumber
  executorDescription: string
}

const useGovPoolSetting = ({
  daoAddress,
  settingsId,
}: IUseGovPoolSetting): [IGovSettings | undefined, boolean, boolean] => {
  const daoSettingsContract = useGovSettingsContract(daoAddress)

  const [result, setResult] = useState<IGovSettings | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  const getGovSettings = useCallback(async () => {
    if (!daoSettingsContract) return

    try {
      setLoading(true)
      setError(false)
      const _result = await daoSettingsContract.settings(settingsId)

      setResult(_result)
    } catch (error) {
      console.log(error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [daoSettingsContract, settingsId])

  useEffect(() => {
    getGovSettings()
  }, [getGovSettings])

  return [result, loading, error]
}

export default useGovPoolSetting
