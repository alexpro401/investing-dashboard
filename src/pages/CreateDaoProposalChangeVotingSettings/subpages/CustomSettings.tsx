import React, { useEffect, useMemo } from "react"
import { useParams, useLocation } from "react-router-dom"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import GovPoolFormContextProvider from "context/govPool/GovPoolFormContext"
import CreateDaoProposalChangeCustomSettingsForm from "forms/CreateDaoProposalChangeCustomSettingsForm"
import { INITIAL_DAO_PROPOSAL } from "constants/dao"
import {
  useGovPoolExecutorSettings,
  useGovPoolValidatorsCount,
} from "hooks/dao"
import Skeleton from "components/Skeleton"
import { Flex } from "theme"
import { GovPoolFormOptions } from "types"
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
      <Flex
        gap={"24"}
        full
        m="16px 0 0 0"
        dir="column"
        ai={"center"}
        jc={"flex-start"}
      >
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

  const govPoolFormOptions = {
    ...INITIAL_DAO_PROPOSAL,
    _isValidator: Boolean(validatorsCount > 0),
    _defaultProposalSettingForm: {
      ...INITIAL_DAO_PROPOSAL._defaultProposalSettingForm,
      earlyCompletion,
      delegatedVotingAllowed,
      validatorsVote,
      duration,
      durationValidators,
      quorum,
      quorumValidators,
      minVotesForVoting,
      minVotesForCreating,
      rewardToken: rewardToken === ZERO_ADDR ? "" : rewardToken,
      creationReward,
      executionReward,
      voteRewardsCoefficient,
      executorDescription,
    },
  } as GovPoolFormOptions

  return (
    <>
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation
        daoPoolAddress={daoAddress ?? ""}
        loader={loader}
      >
        <S.PageHolder>
          <GovProposalCreatingContextProvider>
            <GovPoolFormContextProvider
              customLSKey={`proposal-change-custom-settings-${executorAddress}`}
              govPoolFormOptions={govPoolFormOptions}
            >
              <CreateDaoProposalChangeCustomSettingsForm />
            </GovPoolFormContextProvider>
          </GovProposalCreatingContextProvider>
        </S.PageHolder>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default CustomSettings
