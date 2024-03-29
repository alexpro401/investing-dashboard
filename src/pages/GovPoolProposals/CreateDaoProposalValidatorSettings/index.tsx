import React, { useMemo } from "react"
import { useParams } from "react-router-dom"
import { formatEther } from "@ethersproject/units"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import GovPoolFormContextProvider from "context/govPool/GovPoolFormContext"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import ValidatorsListContextProvider from "context/govPool/proposals/ValidatorsListContext"
import { useBreakpoints } from "hooks"
import {
  useGovPoolValidators,
  useGovValidatorsValidatorsToken,
  useGovPoolSetting,
} from "hooks/dao"
import CreateGovProposalValidatorSettingsForm from "forms/CreateGovProposalValidatorSettingsForm"
import { INITIAL_DAO_PROPOSAL } from "consts/dao"
import FormStepsLoaderWrapper from "common/FormSteps/FormStepsLoaderWrapper"
import { cutStringZeroes } from "utils"
import { EExecutor } from "interfaces/contracts/IGovPoolSettings"
import Skeleton from "components/Skeleton"
import { GovPoolFormOptions } from "types"

import * as S from "../styled"

const CreateDaoProposalValidatorSettings: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()

  const { isMobile } = useBreakpoints()
  const [validatorsFromGraph, validatorsFromGraphLoading] =
    useGovPoolValidators(daoAddress ?? "")
  const [, tokenData] = useGovValidatorsValidatorsToken(daoAddress ?? "")
  const [validatorDaoSettings, validatorSettingsLoading] = useGovPoolSetting({
    daoAddress: daoAddress ?? "",
    settingsId: EExecutor.VALIDATORS,
  })

  const balances = useMemo<string[]>(
    () =>
      validatorsFromGraph.length !== 0
        ? validatorsFromGraph.map((validator) =>
            cutStringZeroes(formatEther(validator.balance))
          )
        : [""],
    [validatorsFromGraph]
  )

  const validators = useMemo<string[]>(
    () =>
      validatorsFromGraph.length !== 0
        ? validatorsFromGraph.map((validator) => validator.id.substring(0, 42))
        : [""],
    [validatorsFromGraph]
  )

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
            <Skeleton variant={"rect"} w={"calc(100%)"} h={"100px"} />
          )}
          <Skeleton variant={"rect"} w={"calc(100%)"} h={"100px"} />
        </S.SkeletonLoader>
      </FormStepsLoaderWrapper>
    ),
    [isMobile]
  )

  const govPoolFormOptions = {
    ...INITIAL_DAO_PROPOSAL,
    _validatorsBalancesSettingsForm: {
      ...INITIAL_DAO_PROPOSAL._validatorsBalancesSettingsForm,
      earlyCompletion: validatorDaoSettings?.earlyCompletion,
      delegatedVotingAllowed: validatorDaoSettings?.delegatedVotingAllowed,
      validatorsVote: validatorDaoSettings?.validatorsVote,
      duration: validatorDaoSettings?.duration,
      durationValidators: validatorDaoSettings?.durationValidators,
      quorum: validatorDaoSettings?.quorum,
      quorumValidators: validatorDaoSettings?.quorumValidators,
      minVotesForVoting: validatorDaoSettings?.minVotesForVoting,
      minVotesForCreating: validatorDaoSettings?.minVotesForCreating,
      rewardToken: validatorDaoSettings?.rewardToken,
      creationReward: validatorDaoSettings?.creationReward,
      executionReward: validatorDaoSettings?.executionReward,
      voteRewardsCoefficient: validatorDaoSettings?.voteRewardsCoefficient,
      executorDescription: validatorDaoSettings?.executorDescription,
    },
  } as GovPoolFormOptions

  return (
    <>
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation
        daoPoolAddress={daoAddress ?? ""}
        loader={loader}
      >
        {(validatorsFromGraphLoading || validatorSettingsLoading) && loader}
        {!validatorsFromGraphLoading &&
          !validatorSettingsLoading &&
          validatorDaoSettings && (
            <S.PageHolder>
              <S.PageContent>
                <GovPoolFormContextProvider
                  customLSKey="creating-new-dao-proposal-validator-settings"
                  govPoolFormOptions={govPoolFormOptions}
                >
                  <GovProposalCreatingContextProvider>
                    <ValidatorsListContextProvider
                      initialForm={{
                        balances: balances,
                        validators: validators,
                        validatorTokenSymbol: tokenData
                          ? tokenData.symbol ?? null
                          : null,
                      }}
                    >
                      <CreateGovProposalValidatorSettingsForm />
                    </ValidatorsListContextProvider>
                  </GovProposalCreatingContextProvider>
                </GovPoolFormContextProvider>
              </S.PageContent>
            </S.PageHolder>
          )}
      </WithGovPoolAddressValidation>
    </>
  )
}

export default CreateDaoProposalValidatorSettings
