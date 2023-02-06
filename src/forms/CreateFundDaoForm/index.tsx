import { FC, useCallback, useMemo, useState, useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useEffectOnce } from "react-use"

import {
  DefaultProposalStep,
  IsCustomVotingStep,
  IsDaoValidatorStep,
  IsDistributionProposalStep,
  SuccessStep,
  TitlesStep,
} from "common"
import Modal from "components/Modal"

import { useForm, useBreakpoints } from "hooks"
import { AnimatePresence } from "framer-motion"
import { useCreateDAO } from "hooks/dao"
import { hideTapBar, showTabBar } from "state/application/actions"

import * as SForms from "common/FormSteps/styled"

const STEPS = {
  titles: {
    title: "Basic DAO Settings",
    number: 1,
  },
  isDaoValidator: {
    title: "Validator settings",
    number: 2,
  },
  defaultProposalSetting: {
    title: "General voting settings",
    number: 3,
  },
  isCustomVoteSelecting: {
    title: "Changing voting settings",
    number: 4,
  },
  isTokenDistributionSettings: {
    title: "Distribution proposal settings",
    number: 5,
  },
  success: {
    title: "Summary",
    number: 6,
  },
}

const CreateFundDaoForm: FC = () => {
  const [currentStep, setCurrentStep] = useState(STEPS.titles.number)
  const [isSuccessModalShown, setIsSuccessModalShown] = useState(false)
  const stepsWrapperRef = useRef<HTMLDivElement>(null)

  const totalStepsCount = useMemo(() => Object.values(STEPS).length, [])

  const { isMobile } = useBreakpoints()

  const formController = useForm()

  const navigate = useNavigate()

  const dispatch = useDispatch()

  useEffectOnce(() => {
    dispatch(hideTapBar())

    return () => {
      dispatch(showTabBar())
    }
  })

  useEffect(() => {
    if (stepsWrapperRef.current) {
      stepsWrapperRef.current.scrollIntoView({
        behavior: "smooth",
      })
    }
  }, [currentStep, stepsWrapperRef])

  const createDaoCb = useCreateDAO()

  const submit = useCallback(async () => {
    formController.disableForm()
    try {
      await createDaoCb()

      if (isMobile) {
        setCurrentStep(STEPS.success.number)
      } else {
        setIsSuccessModalShown(true)
      }
    } catch (error) {
      console.error(error)
    }
    formController.enableForm()
  }, [createDaoCb, formController, isMobile])

  const handleNextStep = () => {
    switch (currentStep) {
      case STEPS.titles.number:
        setCurrentStep(STEPS.isDaoValidator.number)
        break
      case STEPS.isDaoValidator.number:
        setCurrentStep(STEPS.defaultProposalSetting.number)
        break
      case STEPS.defaultProposalSetting.number:
        setCurrentStep(STEPS.isCustomVoteSelecting.number)
        break
      case STEPS.isCustomVoteSelecting.number:
        setCurrentStep(STEPS.isTokenDistributionSettings.number)
        break
      case STEPS.isTokenDistributionSettings.number:
        submit()
        break
    }
  }

  const handlePrevStep = () => {
    switch (currentStep) {
      case STEPS.titles.number:
        navigate("/create-fund")
        break
      case STEPS.isDaoValidator.number:
        setCurrentStep(STEPS.titles.number)
        break
      case STEPS.defaultProposalSetting.number:
        setCurrentStep(STEPS.isDaoValidator.number)
        break
      case STEPS.isCustomVoteSelecting.number:
        setCurrentStep(STEPS.defaultProposalSetting.number)
        break
      case STEPS.isTokenDistributionSettings.number:
        setCurrentStep(STEPS.isCustomVoteSelecting.number)
        break
    }
  }

  return (
    <SForms.StepsFormContainer
      steps={Object.values(STEPS).slice(0, Object.values(STEPS).length - 1)}
      totalStepsAmount={totalStepsCount}
      currentStepNumber={currentStep}
      prevCb={handlePrevStep}
      nextCb={handleNextStep}
    >
      <AnimatePresence>
        <SForms.StepsWrapper ref={stepsWrapperRef}>
          {currentStep === STEPS.titles.number ? (
            <SForms.StepsContainer isWithPaddings={true}>
              <TitlesStep />
            </SForms.StepsContainer>
          ) : currentStep === STEPS.isDaoValidator.number ? (
            <SForms.StepsContainer isWithPaddings={true}>
              <IsDaoValidatorStep />
            </SForms.StepsContainer>
          ) : currentStep === STEPS.defaultProposalSetting.number ? (
            <SForms.StepsContainer isWithPaddings={true}>
              <DefaultProposalStep />
            </SForms.StepsContainer>
          ) : currentStep === STEPS.isCustomVoteSelecting.number ? (
            <SForms.StepsContainer isWithPaddings={true}>
              <IsCustomVotingStep />
            </SForms.StepsContainer>
          ) : currentStep === STEPS.isTokenDistributionSettings.number ? (
            <SForms.StepsContainer isWithPaddings={true}>
              <IsDistributionProposalStep />
            </SForms.StepsContainer>
          ) : currentStep === STEPS.success.number ? (
            <SForms.StepsContainer>
              <SuccessStep />
            </SForms.StepsContainer>
          ) : (
            <></>
          )}
          {!isMobile && (
            <SForms.SideStepsNavigationBarWrp
              steps={Object.values(STEPS).slice(
                0,
                Object.values(STEPS).length - 1
              )}
              currentStep={currentStep}
            />
          )}
        </SForms.StepsWrapper>
      </AnimatePresence>
      <Modal
        isOpen={isSuccessModalShown}
        isShowCloseBtn={false}
        onClose={() => setIsSuccessModalShown(false)}
        title=""
        maxWidth="450px"
      >
        <SuccessStep />
      </Modal>
    </SForms.StepsFormContainer>
  )
}

export default CreateFundDaoForm
