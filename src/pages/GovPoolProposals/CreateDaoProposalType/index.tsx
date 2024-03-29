import React, { useEffect, useMemo } from "react"
import { useParams, useLocation } from "react-router-dom"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import CreateCustomProposalTypeContextProvider from "context/govPool/proposals/regular/CreateCustomProposalType"
import GovPoolFormContextProvider from "context/govPool/GovPoolFormContext"
import CreateNewProposalTypeForm from "forms/CreateNewProposalTypeForm"
import { useGovPoolSetting, useGovPoolValidatorsCount } from "hooks/dao"
import { EExecutor } from "interfaces/contracts/IGovPoolSettings"
import { INITIAL_DAO_PROPOSAL } from "consts/dao"
import { SkeletonGlobalLoader } from "./components"
import { ZERO_ADDR } from "consts"
import { GovPoolFormOptions } from "types"

import * as S from "../styled"

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

  const loader = useMemo(() => <SkeletonGlobalLoader />, [])

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

  const govPoolFormOptions = {
    ...INITIAL_DAO_PROPOSAL,
    _isValidator: Boolean(validatorsCount > 0),
    _defaultProposalSettingForm: {
      ...INITIAL_DAO_PROPOSAL._defaultProposalSettingForm,
      earlyCompletion,
      delegatedVotingAllowed,
      validatorsVote,
      duration,
      quorum,
      minVotesForVoting,
      minVotesForCreating,
      rewardToken: rewardToken === ZERO_ADDR ? "" : rewardToken,
      creationReward,
      executionReward,
      voteRewardsCoefficient,
      durationValidators,
      quorumValidators,
    },
  } as GovPoolFormOptions

  return (
    <>
      <Header>Create Proposal</Header>
      <WithGovPoolAddressValidation
        daoPoolAddress={daoAddress ?? ""}
        loader={loader}
      >
        <S.PageHolder
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <GovPoolFormContextProvider
            customLSKey={"creating-new-dao-proposal-type"}
            govPoolFormOptions={govPoolFormOptions}
          >
            <CreateCustomProposalTypeContextProvider>
              <GovProposalCreatingContextProvider>
                <CreateNewProposalTypeForm />
              </GovProposalCreatingContextProvider>
            </CreateCustomProposalTypeContextProvider>
          </GovPoolFormContextProvider>
        </S.PageHolder>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default CreateDaoProposalType
