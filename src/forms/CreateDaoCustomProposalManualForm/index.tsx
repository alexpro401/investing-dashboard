import React, { useState, useMemo, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

import { ManualStep } from "./steps"
import CreateDaoProposalGeneralForm from "forms/CreateDaoProposalGeneralForm"
import StepsControllerContext from "context/StepsControllerContext"

import * as S from "./styled"

enum STEPS {
  manualInfo = "manualInfo",
  basicInfo = "basicInfo",
}

const CreateDaoCustomProposalManualForm: React.FC = () => {
  const navigate = useNavigate()
  const { daoAddress, executorAddress } = useParams<
    "daoAddress" | "executorAddress"
  >()

  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.manualInfo)

  const totalStepsCount = useMemo(() => Object.values(STEPS).length + 1, [])
  const currentStepNumber = useMemo(
    () => Object.values(STEPS).indexOf(currentStep) + 2,
    [currentStep]
  )

  const handlePrevStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.manualInfo: {
        if (daoAddress) {
          navigate(
            `/dao/${daoAddress}/create-custom-proposal/${executorAddress}`
          )
        }
        break
      }
      case STEPS.basicInfo: {
        setCurrentStep(STEPS.manualInfo)
        break
      }
      default:
        break
    }
  }, [currentStep, daoAddress, executorAddress, navigate])

  const handleNextStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.manualInfo: {
        setCurrentStep(STEPS.basicInfo)
        break
      }
      case STEPS.basicInfo: {
        //TODO handle create proposal here
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
        {currentStep === STEPS.manualInfo && (
          <S.StepsContainer>
            <ManualStep />
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

export default CreateDaoCustomProposalManualForm
