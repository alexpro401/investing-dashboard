import React, { useEffect, useMemo } from "react"
import { useParams, useLocation } from "react-router-dom"
import { formatUnits, formatEther } from "@ethersproject/units"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import CreateCustomProposalTypeContextProvider from "context/govPool/proposals/regular/CreateCustomProposalType"
import FundDaoCreatingContextProvider from "context/FundDaoCreatingContext"
import CreateNewProposalTypeForm from "forms/CreateNewProposalTypeForm"
import { useGovPoolSetting, useGovPoolValidatorsCount } from "hooks/dao"
import { EExecutor } from "interfaces/contracts/IGovPoolSettings"
import { INITIAL_DAO_PROPOSAL } from "constants/dao"
import { ZERO_ADDR } from "constants/index"
import { cutStringZeroes } from "utils"
import Skeleton from "components/Skeleton"
import { Flex } from "theme"

import * as S from "./styled"

const CreateDaoProposalType: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()
  const [daoSettings, loading] = useGovPoolSetting({
    daoAddress: daoAddress ?? "",
    settingsId: EExecutor.DEFAULT,
  })
  const [validatorsCount] = useGovPoolValidatorsCount(daoAddress)
  const location = useLocation()

  useEffect(() => {
    return () => {
      localStorage.removeItem("creating-new-dao-proposal-type")
    }
  }, [location])

  const loader = useMemo(
    () => (
      <Flex gap={"24"} full m="16px 0 0 0" dir="column" ai={"center"}>
        <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"40px"} />
        <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"40px"} />
        <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
        <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
      </Flex>
    ),
    []
  )

  if (loading || !daoSettings || validatorsCount === null)
    return (
      <>
        <Header>Create Proposal</Header>
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
    durationValidators,
    quorumValidators,
  } = daoSettings

  return (
    <>
      <Header>Create Proposal</Header>
      <WithGovPoolAddressValidation
        daoPoolAddress={daoAddress ?? ""}
        loader={loader}
      >
        <S.CreateNewDaoProposalTypePageHolder
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <FundDaoCreatingContextProvider
            customLSKey={"creating-new-dao-proposal-type"}
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
              },
            }}
          >
            <CreateCustomProposalTypeContextProvider>
              <GovProposalCreatingContextProvider>
                <CreateNewProposalTypeForm />
              </GovProposalCreatingContextProvider>
            </CreateCustomProposalTypeContextProvider>
          </FundDaoCreatingContextProvider>
        </S.CreateNewDaoProposalTypePageHolder>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default CreateDaoProposalType
