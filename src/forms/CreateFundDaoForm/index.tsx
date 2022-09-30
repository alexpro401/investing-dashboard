import { FC, useCallback, useMemo, useState } from "react"
import * as S from "./styled"
import { TitlesStep, IsDaoValidatorStep, InternalProposalStep } from "./steps"

import { useForm } from "hooks/useForm"
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { opacityVariants } from "motion/variants"

enum STEPS {
  titles = "titles",
  isValidatorSelecting = "is-validator-selecting",
  internalProposal = "internal-proposal",
  distributionProposalSettings = "distribution-proposal-settings",
  isCustomVoteSelecting = "is-custom-vote-selecting",
  validatorsBalancesSettings = "validators-balances-settings",
  isTokenDistributionSettings = "",
  defaultProposalSetting = "default-proposal-setting",
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

  const handleNextStep = () => {
    switch (currentStep) {
      case STEPS.titles:
        setCurrentStep(STEPS.isValidatorSelecting)
        break
      case STEPS.isValidatorSelecting:
        // TODO: check isValidatorSelected
        setCurrentStep(STEPS.internalProposal)
        break
      case STEPS.internalProposal:
        setCurrentStep(STEPS.distributionProposalSettings)
        break
      case STEPS.distributionProposalSettings:
        setCurrentStep(STEPS.validatorsBalancesSettings)
        break
      case STEPS.validatorsBalancesSettings:
        setCurrentStep(STEPS.defaultProposalSetting)
        break
      case STEPS.defaultProposalSetting:
        submit()
    }
  }

  const handlePrevStep = () => {
    switch (currentStep) {
      case STEPS.defaultProposalSetting:
        setCurrentStep(STEPS.validatorsBalancesSettings)
        break
      case STEPS.validatorsBalancesSettings:
        setCurrentStep(STEPS.distributionProposalSettings)
        break
      case STEPS.distributionProposalSettings:
        setCurrentStep(STEPS.internalProposal)
        break
      case STEPS.internalProposal:
        setCurrentStep(STEPS.isValidatorSelecting)
        break
      case STEPS.isValidatorSelecting:
        setCurrentStep(STEPS.titles)
        break
      case STEPS.titles:
        navigate("/create-fund")
    }
  }

  const submit = useCallback(() => {
    formController.disableForm()
    try {
    } catch (error) {
      console.error(error)
    }
    formController.enableForm()
  }, [formController])

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
        ) : currentStep === STEPS.isValidatorSelecting ? (
          <S.StepsContainer>
            <IsDaoValidatorStep />
          </S.StepsContainer>
        ) : currentStep === STEPS.internalProposal ? (
          <S.StepsContainer>
            <InternalProposalStep />
          </S.StepsContainer>
        ) : currentStep === STEPS.distributionProposalSettings ? (
          <S.StepsContainer>3</S.StepsContainer>
        ) : currentStep === STEPS.validatorsBalancesSettings ? (
          <S.StepsContainer>4</S.StepsContainer>
        ) : currentStep === STEPS.defaultProposalSetting ? (
          <S.StepsContainer>5</S.StepsContainer>
        ) : (
          <></>
        )}
      </AnimatePresence>
    </S.Container>
  )
}

export default CreateFundDaoForm
