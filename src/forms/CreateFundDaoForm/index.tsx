import { FC, useCallback, useMemo, useState } from "react"
import * as S from "./styled"
import {
  TitlesStep,
  IsDaoValidatorStep,
  InternalProposalStep,
  IsCustomVotingStep,
  DefaultProposalStep,
  IsDistributionProposalStep,
  DistributionProposalStep,
} from "./steps"

import { useForm } from "hooks/useForm"
import { useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

enum STEPS {
  titles = "titles",
  IsDaoValidator = "is-dao-validator",
  defaultProposalSetting = "default-proposal-setting",
  isCustomVoteSelecting = "is-custom-vote-selecting",
  internalProposal = "internal-proposal",
  validatorsBalancesSettings = "validators-balances-settings",
  isTokenDistributionSettings = "is-token-distribution-settings",
  distributionProposalSettings = "distribution-proposal-settings",
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
        setCurrentStep(STEPS.IsDaoValidator)
        break
      case STEPS.IsDaoValidator:
        setCurrentStep(STEPS.defaultProposalSetting)
        break
      case STEPS.defaultProposalSetting:
        setCurrentStep(STEPS.isCustomVoteSelecting)
        break
      case STEPS.isCustomVoteSelecting:
        setCurrentStep(STEPS.internalProposal)
        break
      case STEPS.internalProposal:
        setCurrentStep(STEPS.isTokenDistributionSettings)
        break
      case STEPS.isTokenDistributionSettings:
        setCurrentStep(STEPS.distributionProposalSettings)
        break
      case STEPS.distributionProposalSettings:
        submit()
    }
  }

  const handlePrevStep = () => {
    switch (currentStep) {
      case STEPS.titles:
        navigate("/create-fund")
        break
      case STEPS.IsDaoValidator:
        setCurrentStep(STEPS.titles)
        break
      case STEPS.defaultProposalSetting:
        setCurrentStep(STEPS.IsDaoValidator)
        break
      case STEPS.isCustomVoteSelecting:
        setCurrentStep(STEPS.defaultProposalSetting)
        break
      case STEPS.internalProposal:
        setCurrentStep(STEPS.isCustomVoteSelecting)
        break
      case STEPS.isTokenDistributionSettings:
        setCurrentStep(STEPS.internalProposal)
        break
      case STEPS.distributionProposalSettings:
        setCurrentStep(STEPS.isTokenDistributionSettings)
    }
  }

  const submit = useCallback(() => {
    formController.disableForm()
    try {
      console.log("submit")
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
            {/*UserKeeperParams and descriptionURL*/}
            <TitlesStep />
          </S.StepsContainer>
        ) : currentStep === STEPS.IsDaoValidator ? (
          <S.StepsContainer>
            {/*validatorsParams*/}
            <IsDaoValidatorStep />
          </S.StepsContainer>
        ) : currentStep === STEPS.defaultProposalSetting ? (
          <S.StepsContainer>
            {/*defaultProposalSettings*/}
            <DefaultProposalStep />
          </S.StepsContainer>
        ) : currentStep === STEPS.isCustomVoteSelecting ? (
          <S.StepsContainer>
            <IsCustomVotingStep />
          </S.StepsContainer>
        ) : currentStep === STEPS.internalProposal ? (
          <S.StepsContainer>
            {/*internalProposalSettings*/}
            <InternalProposalStep />
          </S.StepsContainer>
        ) : currentStep === STEPS.isTokenDistributionSettings ? (
          <S.StepsContainer>
            {/*isTokenDistributionSettingsStep*/}
            <IsDistributionProposalStep />
          </S.StepsContainer>
        ) : currentStep === STEPS.distributionProposalSettings ? (
          <S.StepsContainer>
            {/*distributionProposalSettingsForm*/}
            <DistributionProposalStep />
          </S.StepsContainer>
        ) : (
          <></>
        )}
      </AnimatePresence>
    </S.Container>
  )
}

export default CreateFundDaoForm
