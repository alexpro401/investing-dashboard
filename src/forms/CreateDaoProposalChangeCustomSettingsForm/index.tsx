import React, { useState, useMemo, useCallback, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

import StepsControllerContext from "context/StepsControllerContext"
import CreateDaoProposalGeneralForm from "forms/CreateDaoProposalGeneralForm"
import { DefaultProposalStep } from "common"

import * as S from "./styled"

enum STEPS {
  customSettings = "customSettings",
  basicInfo = "basicInfo",
}

const CreateDaoProposalChangeCustomSettingsForm: React.FC = () => {
  const navigate = useNavigate()
  const { daoAddress } = useParams<"daoAddress">()
  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.customSettings)

  const totalStepsCount = useMemo(() => Object.values(STEPS).length + 1, [])
  const currentStepNumber = useMemo(
    () => Object.values(STEPS).indexOf(currentStep) + 2,
    [currentStep]
  )

  const handleCreateProposal = useCallback(() => {
    //TODO
  }, [])

  const handlePrevStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.customSettings: {
        if (daoAddress) {
          navigate(`/dao/${daoAddress}/create-proposal-change-voting-settings`)
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
