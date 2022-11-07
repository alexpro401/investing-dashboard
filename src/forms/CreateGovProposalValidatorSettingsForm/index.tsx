import React, { useState, useMemo, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

import StepsControllerContext from "context/StepsControllerContext"
import CreateDaoProposalGeneralForm from "forms/CreateDaoProposalGeneralForm"
import { ValidatorsSettingsStep } from "./steps"

import * as S from "./styled"

enum STEPS {
  validators = "validators",
  basicInfo = "basicInfo",
}

const CreateGovProposalValidatorSettingsForm: React.FC = () => {
  const navigate = useNavigate()
  const { daoAddress } = useParams<"daoAddress">()
  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.validators)

  const totalStepsCount = useMemo(() => Object.values(STEPS).length, [])
  const currentStepNumber = useMemo(
    () => Object.values(STEPS).indexOf(currentStep) + 1,
    [currentStep]
  )

  const handlePrevStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.validators: {
        if (daoAddress) {
          navigate(`/dao/${daoAddress}/create-proposal`)
        }
        break
      }
      case STEPS.basicInfo: {
        setCurrentStep(STEPS.validators)
        break
      }
      default:
        break
    }
  }, [navigate, daoAddress, setCurrentStep, currentStep])

  const handleNextStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.validators: {
        setCurrentStep(STEPS.basicInfo)
        break
      }
      case STEPS.basicInfo: {
        //TODO
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
        {currentStep === STEPS.validators && (
          <S.StepsContainer>
            <ValidatorsSettingsStep />
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

export default CreateGovProposalValidatorSettingsForm
