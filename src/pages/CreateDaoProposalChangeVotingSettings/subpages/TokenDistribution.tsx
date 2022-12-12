import React, { useEffect } from "react"
import { useParams, useLocation } from "react-router-dom"
import { formatUnits, formatEther } from "@ethersproject/units"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import FundDaoCreatingContextProvider from "context/FundDaoCreatingContext"
import CreateDaoProposalChangeTokenDistributionForm from "forms/CreateDaoProposalChangeTokenDistributionForm"
import { useGovPoolSetting, useGovPoolValidatorsCount } from "hooks/dao"
import { EExecutor } from "interfaces/contracts/IGovPoolSettings"
import { cutStringZeroes } from "utils"
import { INITIAL_DAO_PROPOSAL } from "constants/dao"
import { ZERO_ADDR } from "constants/index"

import * as S from "../styled"

const TokenDistribution: React.FC = () => {
  const location = useLocation()
  const { daoAddress } = useParams<"daoAddress">()

  const [daoSettings, loading] = useGovPoolSetting({
    daoAddress: daoAddress ?? "",
    settingsId: EExecutor.DISTRIBUTION,
  })
  const [validatorsCount] = useGovPoolValidatorsCount(daoAddress)

  useEffect(() => {
    localStorage.removeItem("creating-proposal-change-token-distribution")

    return () => {
      localStorage.removeItem("creating-proposal-change-token-distribution")
    }
  }, [location])

  if (loading || !daoSettings || validatorsCount === null) return null

  const {
    earlyCompletion,
    delegatedVotingAllowed,
    validatorsVote,
    duration,
    quorum,
    minVotesForVoting,
    minVotesForCreating,
    rewardToken,
    creationReward,
    executionReward,
    voteRewardsCoefficient,
    executorDescription,
    durationValidators,
    quorumValidators,
  } = daoSettings

  return (
    <>
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation daoPoolAddress={daoAddress ?? ""}>
        <S.PageHolder>
          <GovProposalCreatingContextProvider>
            <FundDaoCreatingContextProvider
              customLSKey={"creating-proposal-change-token-distribution"}
              daoProposal={{
                ...INITIAL_DAO_PROPOSAL,
                _isValidator: validatorsCount > 0,
                _isDistributionProposal: true,
                _distributionProposalSettingsForm: {
                  ...INITIAL_DAO_PROPOSAL._defaultProposalSettingForm,
                  earlyCompletion,
                  delegatedVotingAllowed,
                  validatorsVote,
                  duration: duration.toNumber(),
                  durationValidators: durationValidators.toNumber(),
                  quorum: cutStringZeroes(formatUnits(quorum, 25)),
                  quorumValidators: cutStringZeroes(
                    formatUnits(quorumValidators, 25)
                  ),
                  minVotesForVoting: cutStringZeroes(
                    formatEther(minVotesForVoting)
                  ),
                  minVotesForCreating: cutStringZeroes(
                    formatEther(minVotesForCreating)
                  ),
                  rewardToken: rewardToken === ZERO_ADDR ? "" : rewardToken,
                  creationReward: cutStringZeroes(
                    formatUnits(creationReward, 18)
                  ),
                  executionReward: cutStringZeroes(
                    formatUnits(executionReward, 18)
                  ),
                  voteRewardsCoefficient: cutStringZeroes(
                    formatUnits(voteRewardsCoefficient, 18)
                  ),
                  executorDescription,
                },
              }}
            >
              <CreateDaoProposalChangeTokenDistributionForm />
            </FundDaoCreatingContextProvider>
          </GovProposalCreatingContextProvider>
        </S.PageHolder>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default TokenDistribution
