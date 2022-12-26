import React, { useEffect, useMemo } from "react"
import { useParams, useLocation } from "react-router-dom"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import GovPoolFormContextProvider from "context/govPool/GovPoolFormContext"
import CreateDaoProposalChangeTokenDistributionForm from "forms/CreateDaoProposalChangeTokenDistributionForm"
import { useBreakpoints } from "hooks"
import { useGovPoolSetting, useGovPoolValidatorsCount } from "hooks/dao"
import { EExecutor } from "interfaces/contracts/IGovPoolSettings"
import { INITIAL_DAO_PROPOSAL } from "constants/dao"
import Skeleton from "components/Skeleton"
import FormStepsLoaderWrapper from "common/FormSteps/FormStepsLoaderWrapper"
import { Flex } from "theme"
import { GovPoolFormOptions } from "types"
import { ZERO_ADDR } from "constants/index"

import * as S from "../styled"

const TokenDistribution: React.FC = () => {
  const location = useLocation()
  const { daoAddress } = useParams<"daoAddress">()

  const { isMobile } = useBreakpoints()
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

  const loader = useMemo(
    () => (
      <FormStepsLoaderWrapper>
        <Flex
          gap={"24"}
          full
          m="16px 0 0 0"
          dir="column"
          ai={"flex-start"}
          jc={"flex-start"}
        >
          {!isMobile && (
            <>
              <Skeleton variant={"text"} w={"300px"} h={"40px"} />
              <Skeleton variant={"text"} w={"400px"} h={"20px"} />
              <Skeleton variant={"text"} w={"400px"} h={"20px"} />
            </>
          )}
          {isMobile && (
            <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
          )}
          <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
          <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
          <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
        </Flex>
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
    _isValidator: Boolean(validatorsCount > 0),
    _isDistributionProposal: true,
    _distributionProposalSettingsForm: {
      ...INITIAL_DAO_PROPOSAL._distributionProposalSettingsForm,
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
              customLSKey={"creating-proposal-change-token-distribution"}
              govPoolFormOptions={govPoolFormOptions}
            >
              <CreateDaoProposalChangeTokenDistributionForm />
            </GovPoolFormContextProvider>
          </GovProposalCreatingContextProvider>
        </S.PageHolder>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default TokenDistribution
