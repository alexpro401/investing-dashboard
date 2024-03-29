import React, { useEffect, useMemo } from "react"
import { useParams, useLocation } from "react-router-dom"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import GovPoolFormContextProvider from "context/govPool/GovPoolFormContext"
import CreateDaoProposalGlobalVotingSettingsForm from "forms/CreateDaoProposalGlobalVotingSettingsForm"
import { useBreakpoints } from "hooks"
import { useGovPoolSetting, useGovPoolValidatorsCount } from "hooks/dao"
import { EExecutor } from "interfaces/contracts/IGovPoolSettings"
import { INITIAL_DAO_PROPOSAL } from "consts/dao"
import { ZERO_ADDR } from "consts"
import Skeleton from "components/Skeleton"
import FormStepsLoaderWrapper from "common/FormSteps/FormStepsLoaderWrapper"
import { GovPoolFormOptions } from "types"

import * as S from "../styled"

const GlobalVotingSettings: React.FC = () => {
  const location = useLocation()
  const { daoAddress } = useParams<"daoAddress">()

  const { isMobile } = useBreakpoints()
  const [daoSettings, loading] = useGovPoolSetting({
    daoAddress: daoAddress ?? "",
    settingsId: EExecutor.DEFAULT,
  })
  const [validatorsCount] = useGovPoolValidatorsCount(daoAddress)

  useEffect(() => {
    localStorage.removeItem("creating-proposal-global-voting-settings")

    return () => {
      localStorage.removeItem("creating-proposal-global-voting-settings")
    }
  }, [location])

  const loader = useMemo(
    () => (
      <FormStepsLoaderWrapper>
        <S.SkeletonLoader>
          {!isMobile && (
            <>
              <Skeleton variant={"text"} w={"300px"} h={"40px"} />
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

  if (loading || !daoSettings || validatorsCount === null)
    return (
      <>
        <Header>Create proposal</Header>
        {loader}
      </>
    )

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

  const govPoolFormOptions = {
    ...INITIAL_DAO_PROPOSAL,
    _isValidator: validatorsCount > 0,
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
              customLSKey={"creating-proposal-global-voting-settings"}
              govPoolFormOptions={govPoolFormOptions}
            >
              <CreateDaoProposalGlobalVotingSettingsForm />
            </GovPoolFormContextProvider>
          </GovProposalCreatingContextProvider>
        </S.PageHolder>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default GlobalVotingSettings
