import React, { useMemo } from "react"
import { useParams } from "react-router-dom"
import { formatEther } from "@ethersproject/units"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import GovPoolFormContextProvider from "context/govPool/GovPoolFormContext"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import ValidatorsListContextProvider from "context/govPool/proposals/ValidatorsListContext"
import {
  useGovPoolValidators,
  useGovValidatorsValidatorsToken,
  useGovPoolSetting,
} from "hooks/dao"
import CreateGovProposalValidatorSettingsForm from "forms/CreateGovProposalValidatorSettingsForm"
import { INITIAL_DAO_PROPOSAL } from "constants/dao"
import { cutStringZeroes } from "utils"
import { EExecutor } from "interfaces/contracts/IGovPoolSettings"
import Skeleton from "components/Skeleton"
import { Flex } from "theme"

import * as S from "./styled"
import { GovPoolFormOptions } from "types"

const CreateDaoProposalValidatorSettings: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()

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
      <Flex
        gap={"24"}
        full
        m="16px 0 0 0"
        dir="column"
        ai={"center"}
        jc={"flex-start"}
      >
        <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
        <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"100px"} />
        <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
      </Flex>
    ),
    []
  )

  const {
    earlyCompletion,
    delegatedVotingAllowed,
    validatorsVote,
    duration,
    durationValidators,
    quorum,
    quorumValidators,
    minVotesForVoting,
    minVotesForCreating,
    rewardToken,
    creationReward,
    executionReward,
    voteRewardsCoefficient,
    executorDescription,
  } = validatorDaoSettings!

  const govPoolFormOptions = {
    ...INITIAL_DAO_PROPOSAL,
    _validatorsBalancesSettingsForm: {
      ...INITIAL_DAO_PROPOSAL._validatorsBalancesSettingsForm,
      earlyCompletion,
      delegatedVotingAllowed,
      validatorsVote,
      duration,
      durationValidators,
      quorum,
      quorumValidators,
      minVotesForVoting,
      minVotesForCreating,
      rewardToken,
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
