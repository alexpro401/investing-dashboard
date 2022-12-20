import { FC, useCallback, useMemo, useState } from "react"
import * as S from "./styled"
import {
  DefaultProposalStep,
  IsCustomVotingStep,
  IsDaoValidatorStep,
  IsDistributionProposalStep,
  SideStepsNavigationBar,
  SuccessStep,
  TitlesStep,
} from "common"

import { useForm } from "hooks/useForm"
import { useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { useCreateDAO } from "hooks/dao"
import { useDispatch } from "react-redux"
import { hideTapBar, showTabBar } from "state/application/actions"
import { useEffectOnce, useWindowSize } from "react-use"
import Modal from "../../components/Modal"

enum STEPS {
  titles = "titles",
  isDaoValidator = "is-dao-validator",
  defaultProposalSetting = "default-proposal-setting",
  isCustomVoteSelecting = "is-custom-vote-selecting",
  isTokenDistributionSettings = "is-token-distribution-settings",
  success = "success",
}

const STEPS_TITLES: Record<STEPS, string> = {
  [STEPS.titles]: "Basic DAO Settings",
  [STEPS.isDaoValidator]: "Validator settings",
  [STEPS.defaultProposalSetting]: "General voting settings",
  [STEPS.isCustomVoteSelecting]: "Changing voting settings",
  [STEPS.isTokenDistributionSettings]: "Distribution proposal settings",
  [STEPS.success]: "Summary",
}

const CreateFundDaoForm: FC = () => {
  const { width: windowWidth } = useWindowSize()

  const [currentStep, setCurrentStep] = useState(STEPS.titles)
  const [isSuccessModalShown, setIsSuccessModalShown] = useState(false)

  const totalStepsCount = useMemo(() => Object.values(STEPS).length, [])
  const currentStepNumber = useMemo(
    () => Object.values(STEPS).indexOf(currentStep) + 1,
    [currentStep]
  )
  const isMobile = useMemo(() => windowWidth < 768, [windowWidth])

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
        setCurrentStep(STEPS.success)
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
        <S.StepsWrapper>
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
          {!isMobile ? (
            <SideStepsNavigationBar
              steps={Object.values(STEPS)
                .slice(0, Object.values(STEPS).length - 1)
                .map((step) => ({
                  number: Object.values(STEPS).indexOf(step),
                  title: STEPS_TITLES[step],
                }))}
              currentStep={Object.values(STEPS).indexOf(currentStep)}
            />
          ) : (
            <></>
          )}
        </S.StepsWrapper>
      </AnimatePresence>
      <Modal
        isOpen={isSuccessModalShown}
        isShowCloseBtn={false}
        toggle={() => setIsSuccessModalShown(!isSuccessModalShown)}
        title=""
        maxWidth="450px"
      >
        <SuccessStep />
      </Modal>
    </S.Container>
  )
}

export default CreateFundDaoForm
