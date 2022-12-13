import React, { useEffect, useMemo } from "react"
import { useParams, useLocation } from "react-router-dom"
import { formatUnits, formatEther } from "@ethersproject/units"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import FundDaoCreatingContextProvider from "context/FundDaoCreatingContext"
import CreateDaoProposalChangeCustomSettingsForm from "forms/CreateDaoProposalChangeCustomSettingsForm"
import { INITIAL_DAO_PROPOSAL } from "constants/dao"
import {
  useGovPoolExecutorSettings,
  useGovPoolValidatorsCount,
} from "hooks/dao"
import Skeleton from "components/Skeleton"
import { Flex } from "theme"
import { cutStringZeroes } from "utils"
import { ZERO_ADDR } from "constants/index"

import * as S from "../styled"

const CustomSettings: React.FC = () => {
  const location = useLocation()
  const { daoAddress, executorAddress } = useParams<
    "daoAddress" | "executorAddress"
  >()
  const [executorSettings] = useGovPoolExecutorSettings(
    daoAddress,
    executorAddress
  )
  const [validatorsCount] = useGovPoolValidatorsCount(daoAddress)

  useEffect(() => {
    localStorage.removeItem(
      `proposal-change-custom-settings-${executorAddress}`
    )

    return () => {
      localStorage.removeItem(
        `proposal-change-custom-settings-${executorAddress}`
      )
    }
  }, [location, executorAddress])

  const loader = useMemo(
    () => (
      <Flex gap={"24"} full m="16px 0 0 0" dir="column" ai={"center"}>
        <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
        <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
        <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
        <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
      </Flex>
    ),
    []
  )

  if (!executorSettings || validatorsCount === null)
    return (
      <>
        <Header>Create proposal</Header>
        {loader}
      </>
    )

  const {
    creationReward,
    delegatedVotingAllowed,
    duration,
    durationValidators,
    earlyCompletion,
    executionReward,
    executorDescription,
    minVotesForCreating,
    minVotesForVoting,
    quorum,
    quorumValidators,
    rewardToken,
    validatorsVote,
    voteRewardsCoefficient,
  } = executorSettings

  return (
    <>
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation
        daoPoolAddress={daoAddress ?? ""}
        loader={loader}
      >
        <S.PageHolder>
          <GovProposalCreatingContextProvider>
            <FundDaoCreatingContextProvider
              customLSKey={`proposal-change-custom-settings-${executorAddress}`}
              daoProposal={{
                ...INITIAL_DAO_PROPOSAL,
                _isValidator: validatorsCount > 0,
                _defaultProposalSettingForm: {
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
              <CreateDaoProposalChangeCustomSettingsForm />
            </FundDaoCreatingContextProvider>
          </GovProposalCreatingContextProvider>
        </S.PageHolder>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default CustomSettings
