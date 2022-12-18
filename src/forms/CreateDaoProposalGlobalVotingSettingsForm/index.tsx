import React, {
  useState,
  useMemo,
  useCallback,
  useContext,
  useEffect,
} from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { AnimatePresence } from "framer-motion"

import StepsControllerContext from "context/StepsControllerContext"
import { FundDaoCreatingContext } from "context/FundDaoCreatingContext"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import { DefaultProposalStep } from "common"
import CreateDaoProposalGeneralForm from "forms/CreateDaoProposalGeneralForm"
import { useGovPoolCreateProposalChangeSettings } from "hooks/dao/proposals"
import { EExecutor } from "interfaces/contracts/IGovPoolSettings"
import { hideTapBar, showTabBar } from "state/application/actions"

import * as S from "./styled"

enum STEPS {
  globalVotingSettings = "globalVotingSettings",
  basicInfo = "basicInfo",
}

const CreateDaoProposalGlobalVotingSettings: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { daoAddress } = useParams<"daoAddress">()
  const createProposal = useGovPoolCreateProposalChangeSettings({
    daoPoolAddress: daoAddress ?? "",
  })
  const { defaultProposalSettingForm } = useContext(FundDaoCreatingContext)
  const { proposalName, proposalDescription } = useContext(
    GovProposalCreatingContext
  )

  useEffect(() => {
    dispatch(hideTapBar())

    return () => {
      dispatch(showTabBar())
    }
  }, [dispatch])

  const [currentStep, setCurrentStep] = useState<STEPS>(
    STEPS.globalVotingSettings
  )

  const totalStepsCount = useMemo(() => Object.values(STEPS).length + 1, [])
  const currentStepNumber = useMemo(
    () => Object.values(STEPS).indexOf(currentStep) + 2,
    [currentStep]
  )

  const handleCreateProposal = useCallback(() => {
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
    } = defaultProposalSettingForm

    createProposal({
      proposalInfo: {
        proposalName: proposalName.get,
        proposalDescription: proposalDescription.get,
      },
      settingId: EExecutor.DEFAULT,
      setting: {
        earlyCompletion: earlyCompletion.get,
        delegatedVotingAllowed: delegatedVotingAllowed.get,
        validatorsVote: validatorsVote.get,
        duration: duration.get,
        quorum: quorum.get,
        minVotesForVoting: minVotesForVoting.get,
        minVotesForCreating: minVotesForCreating.get,
        rewardToken: rewardToken.get,
        creationReward: creationReward.get,
        executionReward: executionReward.get,
        voteRewardsCoefficient: voteRewardsCoefficient.get,
        executorDescription: executorDescription.get,
        durationValidators: durationValidators.get,
        quorumValidators: quorumValidators.get,
      },
    })
  }, [
    createProposal,
    proposalName,
    proposalDescription,
    defaultProposalSettingForm,
  ])

  const handlePrevStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.globalVotingSettings: {
        if (daoAddress) {
          navigate(`/dao/${daoAddress}/create-proposal/change-voting-settings`)
        }
        break
      }
      case STEPS.basicInfo: {
        setCurrentStep(STEPS.globalVotingSettings)
        break
      }
      default:
        break
    }
  }, [currentStep, daoAddress, navigate])

  const handleNextStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.globalVotingSettings: {
        setCurrentStep(STEPS.basicInfo)
        break
      }
      case STEPS.basicInfo: {
        handleCreateProposal()
        break
      }
      default:
        break
    }
  }, [currentStep, handleCreateProposal])

  return (
    <StepsControllerContext
      totalStepsAmount={totalStepsCount}
      currentStepNumber={currentStepNumber}
      prevCb={handlePrevStep}
      nextCb={handleNextStep}
    >
      <AnimatePresence>
        {currentStep === STEPS.globalVotingSettings && (
          <S.StepsContainer>
            <DefaultProposalStep isCreatingProposal />
          </S.StepsContainer>
        )}
        {currentStep === STEPS.basicInfo && (
          <S.StepsContainer>
            <CreateDaoProposalGeneralForm />
          </S.StepsContainer>
        )}
      </AnimatePresence>
    </StepsControllerContext>
  )
}

export default CreateDaoProposalGlobalVotingSettings
