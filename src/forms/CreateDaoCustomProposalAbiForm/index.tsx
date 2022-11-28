import React, { useState, useMemo, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

import StepsControllerContext from "context/StepsControllerContext"
import CreateDaoProposalGeneralForm from "forms/CreateDaoProposalGeneralForm"
import { AbiStep } from "./steps"

import * as S from "./styled"
import AdvancedABIContextProvider from "context/govPool/proposals/custom/AdvancedABIContext"

enum STEPS {
  abiInfo = "abiInfo",
  basicInfo = "basicInfo",
}

const CreateDaoCustomProposalAbiForm: React.FC = () => {
  const navigate = useNavigate()
  const { daoAddress, executorAddress } = useParams<
    "daoAddress" | "executorAddress"
  >()

  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.abiInfo)

  const totalStepsCount = useMemo(() => Object.values(STEPS).length + 1, [])
  const currentStepNumber = useMemo(
    () => Object.values(STEPS).indexOf(currentStep) + 2,
    [currentStep]
  )

  const handlePrevStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.abiInfo: {
        if (daoAddress) {
          navigate(
            `/dao/${daoAddress}/create-custom-proposal/${executorAddress}`
          )
        }
        break
      }
      case STEPS.basicInfo: {
        setCurrentStep(STEPS.abiInfo)
        break
      }
      default:
        break
    }
  }, [currentStep, daoAddress, executorAddress, navigate])

  const handleNextStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.abiInfo: {
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
        {currentStep === STEPS.abiInfo && (
          <S.StepsContainer>
            <AdvancedABIContextProvider>
              <AbiStep />
            </AdvancedABIContextProvider>
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

export default CreateDaoCustomProposalAbiForm
