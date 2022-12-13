import React, { useMemo } from "react"
import { useParams } from "react-router-dom"
import { formatEther, formatUnits } from "@ethersproject/units"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import FundDaoCreatingContextProvider from "context/FundDaoCreatingContext"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import ValidatorsListContextProvider from "context/govPool/proposals/ValidatorsListContext"
import {
  useGovPoolValidators,
  useGovValidatorsValidatorsToken,
  useGovPoolSetting,
} from "hooks/dao"
import CreateGovProposalValidatorSettingsForm from "forms/CreateGovProposalValidatorSettingsForm"
import { INITIAL_DAO_PROPOSAL } from "constants/dao"
import { ZERO_ADDR } from "constants/index"
import { cutStringZeroes } from "utils"
import { EExecutor } from "interfaces/contracts/IGovPoolSettings"
import Skeleton from "components/Skeleton"
import { Flex } from "theme"

import * as S from "./styled"

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
      <Flex gap={"24"} full m="16px 0 0 0" dir="column" ai={"center"}>
        <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
        <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"100px"} />
        <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
      </Flex>
    ),
    []
  )

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
                <FundDaoCreatingContextProvider
                  customLSKey="creating-new-dao-proposal-validator-settings"
                  daoProposal={{
                    ...INITIAL_DAO_PROPOSAL,
                    _validatorsBalancesSettingsForm: {
                      earlyCompletion: validatorDaoSettings.earlyCompletion,
                      delegatedVotingAllowed:
                        validatorDaoSettings.delegatedVotingAllowed,
                      validatorsVote: validatorDaoSettings.validatorsVote,
                      duration: validatorDaoSettings.duration.toNumber(),
                      durationValidators:
                        validatorDaoSettings.durationValidators.toNumber(),
                      quorum: cutStringZeroes(
                        formatUnits(validatorDaoSettings.quorum, 25)
                      ),
                      quorumValidators: cutStringZeroes(
                        formatUnits(validatorDaoSettings.quorumValidators, 25)
                      ),
                      minVotesForVoting: cutStringZeroes(
                        formatEther(validatorDaoSettings.minVotesForVoting)
                      ),
                      minVotesForCreating: cutStringZeroes(
                        formatEther(validatorDaoSettings.minVotesForCreating)
                      ),
                      rewardToken:
                        validatorDaoSettings.rewardToken === ZERO_ADDR
                          ? ""
                          : validatorDaoSettings.rewardToken,
                      creationReward: cutStringZeroes(
                        formatUnits(validatorDaoSettings.creationReward, 18)
                      ),
                      executionReward: cutStringZeroes(
                        formatUnits(validatorDaoSettings.executionReward, 18)
                      ),
                      voteRewardsCoefficient: cutStringZeroes(
                        formatUnits(
                          validatorDaoSettings.voteRewardsCoefficient,
                          18
                        )
                      ),
                      executorDescription:
                        validatorDaoSettings.executorDescription,
                    },
                  }}
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
                </FundDaoCreatingContextProvider>
              </S.PageContent>
            </S.PageHolder>
          )}
      </WithGovPoolAddressValidation>
    </>
  )
}

export default CreateDaoProposalValidatorSettings
