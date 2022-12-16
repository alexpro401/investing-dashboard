import React, { useState, useMemo, useCallback, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

import StepsControllerContext from "context/StepsControllerContext"
import CreateDaoProposalGeneralForm from "forms/CreateDaoProposalGeneralForm"
import { DefaultProposalStep } from "common"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import { GovPoolFormContext } from "context/govPool/GovPoolFormContext"
import {
  useGovPoolCreateProposalChangeSettings,
  useGovPoolExecutorToSettings,
} from "hooks/dao"

import * as S from "./styled"

enum STEPS {
  customSettings = "customSettings",
  basicInfo = "basicInfo",
}

const CreateDaoProposalChangeCustomSettingsForm: React.FC = () => {
  const navigate = useNavigate()
  const { daoAddress, executorAddress } = useParams<
    "daoAddress" | "executorAddress"
  >()
  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.customSettings)
  const { defaultProposalSettingForm } = useContext(GovPoolFormContext)
  const { proposalName, proposalDescription } = useContext(
    GovProposalCreatingContext
  )
  const createProposal = useGovPoolCreateProposalChangeSettings({
    daoPoolAddress: daoAddress ?? "",
  })
  const [settingId] = useGovPoolExecutorToSettings(daoAddress, executorAddress)

  const totalStepsCount = useMemo(() => Object.values(STEPS).length + 1, [])
  const currentStepNumber = useMemo(
    () => Object.values(STEPS).indexOf(currentStep) + 2,
    [currentStep]
  )

  const handleCreateProposal = useCallback(() => {
    if (!settingId) return

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
      settingId,
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
    settingId,
  ])

  const handlePrevStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.customSettings: {
        if (daoAddress) {
          navigate(`/dao/${daoAddress}/create-proposal/change-voting-settings`)
        }
        break
      }
      case STEPS.basicInfo: {
        setCurrentStep(STEPS.customSettings)
        break
      }
      default:
        break
    }
  }, [currentStep, daoAddress, navigate])

  const handleNextStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.customSettings: {
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
        {currentStep === STEPS.customSettings && (
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

export default CreateDaoProposalChangeCustomSettingsForm
