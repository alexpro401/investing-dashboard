import React, { useState, useMemo, useCallback } from "react"
import { AnimatePresence } from "framer-motion"
import { useNavigate, useParams } from "react-router-dom"

import StepsControllerContext from "context/StepsControllerContext"
import CreateDaoProposalGeneralForm from "forms/CreateDaoProposalGeneralForm"
import { ChangeDAOSettings } from "./steps"

import * as S from "./styled"

enum STEPS {
  daoSettings = "daoSettings",
  basicInfo = "basicInfo",
}

const CreateProposalChangeDAOSettingsForm: React.FC = () => {
  const navigate = useNavigate()
  const { daoAddress } = useParams<"daoAddress">()

  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.daoSettings)

  const totalStepsCount = useMemo(() => Object.values(STEPS).length, [])
  const currentStepNumber = useMemo(
    () => Object.values(STEPS).indexOf(currentStep) + 1,
    [currentStep]
  )

  const handleCreateChangeDaoSettingsProposal = useCallback(() => {
    console.log("TO DO")
  }, [])

  const handlePrevStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.daoSettings: {
        if (daoAddress) {
          navigate(`/dao/${daoAddress}/create-proposal`)
        }
        break
      }
      case STEPS.basicInfo: {
        setCurrentStep(STEPS.daoSettings)
        break
      }
      default:
        break
    }
  }, [currentStep, daoAddress, navigate])

  const handleNextStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.daoSettings: {
        setCurrentStep(STEPS.basicInfo)
        break
      }
      case STEPS.basicInfo: {
        //TODO handle create change settings DAO proposal
        handleCreateChangeDaoSettingsProposal()
        break
      }
      default:
        break
    }
  }, [currentStep, handleCreateChangeDaoSettingsProposal])

  return (
    <StepsControllerContext
      totalStepsAmount={totalStepsCount}
      currentStepNumber={currentStepNumber}
      prevCb={handlePrevStep}
      nextCb={handleNextStep}
    >
      <AnimatePresence>
        {currentStep === STEPS.daoSettings && (
          <S.StepsContainer>
            <ChangeDAOSettings />
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

export default CreateProposalChangeDAOSettingsForm
