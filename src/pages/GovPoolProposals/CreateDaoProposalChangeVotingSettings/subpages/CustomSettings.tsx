import React, { useEffect, useMemo } from "react"
import { useParams, useLocation } from "react-router-dom"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import GovPoolFormContextProvider from "context/govPool/GovPoolFormContext"
import CreateDaoProposalChangeCustomSettingsForm from "forms/CreateDaoProposalChangeCustomSettingsForm"
import { INITIAL_DAO_PROPOSAL } from "consts/dao"
import { useBreakpoints } from "hooks"
import {
  useGovPoolExecutorSettings,
  useGovPoolValidatorsCount,
} from "hooks/dao"
import Skeleton from "components/Skeleton"
import FormStepsLoaderWrapper from "common/FormSteps/FormStepsLoaderWrapper"
import { GovPoolFormOptions } from "types"
import { ZERO_ADDR } from "consts"

import * as S from "../styled"

const CustomSettings: React.FC = () => {
  const location = useLocation()
  const { daoAddress, executorAddress } = useParams<
    "daoAddress" | "executorAddress"
  >()
  const { isMobile } = useBreakpoints()
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
      <FormStepsLoaderWrapper>
        <S.SkeletonLoader>
          {!isMobile && (
            <>
              <Skeleton variant={"text"} w={"300px"} h={"40px"} />
              <Skeleton variant={"text"} w={"400px"} h={"20px"} />
              <Skeleton variant={"text"} w={"400px"} h={"20px"} />
            </>
          )}
          {isMobile && (
            <Skeleton variant={"rect"} w={"calc(100%)"} h={"80px"} />
          )}
          <Skeleton variant={"rect"} w={"calc(100%)"} h={"80px"} />
          <Skeleton variant={"rect"} w={"calc(100%)"} h={"80px"} />
          <Skeleton variant={"rect"} w={"calc(100%)"} h={"80px"} />
        </S.SkeletonLoader>
      </FormStepsLoaderWrapper>
    ),
    [isMobile]
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
