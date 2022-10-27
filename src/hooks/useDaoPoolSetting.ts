import { useCallback, useEffect, useState } from "react"
import { BigNumber } from "@ethersproject/bignumber"

import { useGovPoolContract, useGovSettingsContract } from "contracts"

interface IUseDaoPoolSetting {
  daoAddress: string
  settingsId: number
}

interface IDaoSettings {
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

const useDaoPoolSetting = ({
  daoAddress,
  settingsId,
}: IUseDaoPoolSetting): [IDaoSettings | undefined, boolean, boolean] => {
  const govPoolContract = useGovPoolContract(daoAddress)

  const [govSettingsAddress, setGovSettingsAddress] = useState<string>("")
  const govSettingsContract = useGovSettingsContract(govSettingsAddress)

  const [result, setResult] = useState<IDaoSettings | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  const getGovSettings = useCallback(async () => {
    if (!govPoolContract || !govSettingsContract) return

    try {
      setLoading(true)
      setError(false)
      const _result = await govSettingsContract.settings(settingsId)

      setResult(_result)
    } catch (error) {
      console.log(error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [govPoolContract, govSettingsContract, settingsId])

  useEffect(() => {
    const setupGovSettingsAddress = async () => {
      if (!govPoolContract) return

      try {
        setLoading(true)
        setError(false)
        const _govSettingsAddress = await govPoolContract.govSetting()
        setGovSettingsAddress(_govSettingsAddress)
      } catch (error) {
        console.log(error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    setupGovSettingsAddress()
  }, [govPoolContract])

  useEffect(() => {
    getGovSettings()
  }, [getGovSettings])

  return [result, loading, error]
}

export default useDaoPoolSetting
