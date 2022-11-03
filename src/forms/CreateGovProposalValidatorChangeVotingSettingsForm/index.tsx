import React, { useMemo, useState, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

import { VotingSettings } from "./steps"
import StepsControllerContext from "context/StepsControllerContext"
import CreateDaoProposalGeneralForm from "forms/CreateDaoProposalGeneralForm"

import * as S from "./styled"

enum STEPS {
  votingSettings = "votingSettings",
  basicInfo = "basicInfo",
}

const CreateGovProposalValidatorChangeVotingSettingsForm: React.FC = () => {
  const navigate = useNavigate()
  const { daoAddress } = useParams<"daoAddress">()
  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.votingSettings)

  const totalStepsCount = useMemo(() => Object.values(STEPS).length, [])
  const currentStepNumber = useMemo(
    () => Object.values(STEPS).indexOf(currentStep) + 1,
    [currentStep]
  )

  const handlePrevStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.votingSettings: {
        if (daoAddress) {
          navigate(`/dao/${daoAddress}/create-validator-proposal`)
        }
        break
      }
      case STEPS.basicInfo: {
        setCurrentStep(STEPS.votingSettings)
        break
      }
      default:
        break
    }
  }, [navigate, daoAddress, setCurrentStep, currentStep])

  const handleNextStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.votingSettings: {
        setCurrentStep(STEPS.basicInfo)
        break
      }
      case STEPS.basicInfo: {
        //TODO handle create proposal
        break
      }
      default:
        break
    }
  }, [currentStep])

  return (
    <StepsControllerContext
      totalStepsAmount={totalStepsCount}
      currentStepNumber={currentStepNumber}
      prevCb={handlePrevStep}
      nextCb={handleNextStep}
    >
      <AnimatePresence>
        {currentStep === STEPS.votingSettings && (
          <S.StepsContainer>
            <VotingSettings />
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

export default CreateGovProposalValidatorChangeVotingSettingsForm
