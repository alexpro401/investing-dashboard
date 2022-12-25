import { FC, useCallback, useMemo, useState } from "react"
import * as S from "./styled"
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
import { useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { useCreateDAO } from "hooks/dao"
import { useDispatch } from "react-redux"
import { hideTapBar, showTabBar } from "state/application/actions"
import { useEffectOnce } from "react-use"

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
    <S.Container
      steps={Object.values(STEPS).slice(0, Object.values(STEPS).length - 1)}
      totalStepsAmount={totalStepsCount}
      currentStepNumber={currentStep}
      prevCb={handlePrevStep}
      nextCb={handleNextStep}
    >
      <AnimatePresence>
        <S.StepsWrapper>
          {currentStep === STEPS.titles.number ? (
            <S.StepsContainer>
              <TitlesStep />
            </S.StepsContainer>
          ) : currentStep === STEPS.isDaoValidator.number ? (
            <S.StepsContainer>
              <IsDaoValidatorStep />
            </S.StepsContainer>
          ) : currentStep === STEPS.defaultProposalSetting.number ? (
            <S.StepsContainer>
              <DefaultProposalStep />
            </S.StepsContainer>
          ) : currentStep === STEPS.isCustomVoteSelecting.number ? (
            <S.StepsContainer>
              <IsCustomVotingStep />
            </S.StepsContainer>
          ) : currentStep === STEPS.isTokenDistributionSettings.number ? (
            <S.StepsContainer>
              <IsDistributionProposalStep />
            </S.StepsContainer>
          ) : currentStep === STEPS.success.number ? (
            <S.StepsContainer>
              <SuccessStep />
            </S.StepsContainer>
          ) : (
            <></>
          )}
          {!isMobile ? (
            <S.SideStepsNavigationBarWrp
              steps={Object.values(STEPS).slice(
                0,
                Object.values(STEPS).length - 1
              )}
              currentStep={currentStep}
            />
          ) : (
            <></>
          )}
        </S.StepsWrapper>
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
    </S.Container>
  )
}

export default CreateFundDaoForm
