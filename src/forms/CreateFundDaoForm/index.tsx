import { FC, useCallback, useContext, useMemo, useState } from "react"
import * as S from "./styled"
import {
  TitlesStep,
  IsDaoValidatorStep,
  IsCustomVotingStep,
  DefaultProposalStep,
  IsDistributionProposalStep,
  SuccessStep,
} from "common"

import { useForm } from "hooks/useForm"
import { useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { FundDaoCreatingContext } from "context/FundDaoCreatingContext"
import { useCreateDAO } from "hooks/dao"

enum STEPS {
  titles = "titles",
  isDaoValidator = "is-dao-validator",
  defaultProposalSetting = "default-proposal-setting",
  isCustomVoteSelecting = "is-custom-vote-selecting",
  isTokenDistributionSettings = "is-token-distribution-settings",
  success = "success",
}

const CreateFundDaoForm: FC = () => {
  const [currentStep, setCurrentStep] = useState(STEPS.titles)

  const totalStepsCount = useMemo(() => Object.values(STEPS).length, [])
  const currentStepNumber = useMemo(
    () => Object.values(STEPS).indexOf(currentStep) + 1,
    [currentStep]
  )

  const formController = useForm()

  const navigate = useNavigate()

  const { isCustomVoting, isDistributionProposal } = useContext(
    FundDaoCreatingContext
  )

  const createDaoCb = useCreateDAO()

  const submit = useCallback(async () => {
    formController.disableForm()
    try {
      await createDaoCb()
      setCurrentStep(STEPS.success)
    } catch (error) {
      console.error(error)
    }
    formController.enableForm()
  }, [createDaoCb, formController])

  const handleNextStep = () => {
    switch (currentStep) {
      case STEPS.titles:
        setCurrentStep(STEPS.isDaoValidator)
        break
      case STEPS.isDaoValidator:
        setCurrentStep(STEPS.defaultProposalSetting)
        break
      case STEPS.defaultProposalSetting:
        setCurrentStep(STEPS.isCustomVoteSelecting)
        break
      case STEPS.isCustomVoteSelecting:
        setCurrentStep(STEPS.isTokenDistributionSettings)
        break
      case STEPS.isTokenDistributionSettings:
        submit()
        break
    }
  }

  const handlePrevStep = () => {
    switch (currentStep) {
      case STEPS.titles:
        navigate("/create-fund")
        break
      case STEPS.isDaoValidator:
        setCurrentStep(STEPS.titles)
        break
      case STEPS.defaultProposalSetting:
        setCurrentStep(STEPS.isDaoValidator)
        break
      case STEPS.isCustomVoteSelecting:
        setCurrentStep(STEPS.defaultProposalSetting)
        break
      case STEPS.isTokenDistributionSettings:
        setCurrentStep(STEPS.isCustomVoteSelecting)
        break
    }
  }

  return (
    <S.Container
      totalStepsAmount={totalStepsCount}
      currentStepNumber={currentStepNumber}
      prevCb={handlePrevStep}
      nextCb={handleNextStep}
    >
      <AnimatePresence>
        {currentStep === STEPS.titles ? (
          <S.StepsContainer>
            <TitlesStep />
          </S.StepsContainer>
        ) : currentStep === STEPS.isDaoValidator ? (
          <S.StepsContainer>
            <IsDaoValidatorStep />
          </S.StepsContainer>
        ) : currentStep === STEPS.defaultProposalSetting ? (
          <S.StepsContainer>
            <DefaultProposalStep />
          </S.StepsContainer>
        ) : currentStep === STEPS.isCustomVoteSelecting ? (
          <S.StepsContainer>
            <IsCustomVotingStep />
          </S.StepsContainer>
        ) : currentStep === STEPS.isTokenDistributionSettings ? (
          <S.StepsContainer>
            <IsDistributionProposalStep />
          </S.StepsContainer>
        ) : currentStep === STEPS.success ? (
          <S.StepsContainer>
            <SuccessStep />
          </S.StepsContainer>
        ) : (
          <></>
        )}
      </AnimatePresence>
    </S.Container>
  )
}

export default CreateFundDaoForm
