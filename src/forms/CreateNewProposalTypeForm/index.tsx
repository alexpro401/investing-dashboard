import React, { useState, useMemo, useCallback } from "react"
import { AnimatePresence } from "framer-motion"
import { useNavigate, useParams } from "react-router-dom"

import StepsControllerContext from "context/StepsControllerContext"
import CreateDaoProposalGeneralForm from "forms/CreateDaoProposalGeneralForm"
import { DefaultProposalStep } from "forms/CreateFundDaoForm/steps"

import * as S from "./styled"

enum STEPS {
  generalVotingSettings = "generalVotingSettings",
  basicInfo = "basicInfo",
}

const CreateNewProposalTypeForm: React.FC = () => {
  const navigate = useNavigate()
  const { daoAddress } = useParams<"daoAddress">()

  const [currentStep, setCurrentStep] = useState<STEPS>(
    STEPS.generalVotingSettings
  )

  const totalStepsCount = useMemo(() => Object.values(STEPS).length, [])
  const currentStepNumber = useMemo(
    () => Object.values(STEPS).indexOf(currentStep) + 1,
    [currentStep]
  )

  const handlePrevStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.generalVotingSettings: {
        if (daoAddress) {
          navigate(`/dao/${daoAddress}/create-proposal`)
        }
        break
      }
      case STEPS.basicInfo: {
        setCurrentStep(STEPS.generalVotingSettings)
        break
      }
      default:
        break
    }
  }, [currentStep, daoAddress, navigate])

  const handleNextStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.generalVotingSettings: {
        setCurrentStep(STEPS.basicInfo)
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
        {currentStep === STEPS.generalVotingSettings && (
          <S.StepsContainer>
            <DefaultProposalStep />
          </S.StepsContainer>
        )}
        {currentStep === STEPS.basicInfo && (
          <S.StepsContainer>
            <CreateDaoProposalGeneralForm withContractName />
          </S.StepsContainer>
        )}
      </AnimatePresence>
    </StepsControllerContext>
  )
}

export default CreateNewProposalTypeForm
