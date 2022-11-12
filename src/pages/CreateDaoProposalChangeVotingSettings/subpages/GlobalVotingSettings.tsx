import React from "react"
import { useParams } from "react-router-dom"
import { formatUnits, formatEther } from "@ethersproject/units"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import FundDaoCreatingContextProvider from "context/FundDaoCreatingContext"
import CreateDaoProposalGlobalVotingSettingsForm from "forms/CreateDaoProposalGlobalVotingSettingsForm"
import { useGovPoolSetting } from "hooks/dao"
import { EExecutor } from "interfaces/contracts/IGovPoolSettings"
import { cutStringZeroes } from "utils"
import { INITIAL_DAO_PROPOSAL } from "constants/dao"
import { ZERO_ADDR } from "constants/index"

import * as S from "../styled"

const GlobalVotingSettings: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()

  const [daoSettings, loading] = useGovPoolSetting({
    daoAddress: daoAddress ?? "",
    settingsId: EExecutor.DEFAULT,
  })

  if (loading || !daoSettings) return null

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
  } = daoSettings

  return (
    <>
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation daoPoolAddress={daoAddress ?? ""}>
        <S.PageHolder>
          <GovProposalCreatingContextProvider>
            <FundDaoCreatingContextProvider
              customLSKey={"creating-proposal-global-voting-settings"}
              daoProposal={{
                ...INITIAL_DAO_PROPOSAL,
                _defaultProposalSettingForm: {
                  ...INITIAL_DAO_PROPOSAL._defaultProposalSettingForm,
                  earlyCompletion,
                  delegatedVotingAllowed,
                  validatorsVote,
                  duration: duration.toNumber(),
                  quorum: cutStringZeroes(formatUnits(quorum, 25)),
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
              <CreateDaoProposalGlobalVotingSettingsForm />
            </FundDaoCreatingContextProvider>
          </GovProposalCreatingContextProvider>
        </S.PageHolder>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default GlobalVotingSettings
