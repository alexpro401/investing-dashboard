import React, { useEffect, useState, useMemo, useCallback } from "react"
import { useDispatch } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

import { hideTapBar, showTabBar } from "state/application/actions"
import { useBreakpoints } from "hooks"
import { SettingsStep, VestingParamsStep, WhitelistStep } from "./steps"

import * as S from "common/FormSteps/styled"

enum STEPS {
  settings = "settings",
  vestingParams = "vestingParams",
  whitelist = "whitelist",
}

const STEPS_TITLES: Record<STEPS, string> = {
  [STEPS.settings]: "Налаштування",
  [STEPS.vestingParams]: "Параметри вестінга",
  [STEPS.whitelist]: "Вайтліст",
}

const CreateDaoProposalTokenSaleForm: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { daoAddress } = useParams<"daoAddress">()
  const { isMobile } = useBreakpoints()

  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.settings)

  const totalStepsCount = useMemo(() => Object.values(STEPS).length, [])
  const currentStepNumber = useMemo(
    () => Object.values(STEPS).indexOf(currentStep) + 1,
    [currentStep]
  )

  useEffect(() => {
    dispatch(hideTapBar())

    return () => {
      dispatch(showTabBar())
    }
  }, [dispatch])

  const handlePrevStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.settings: {
        if (daoAddress) {
          navigate(`/dao/${daoAddress}/create-proposal`)
        }
        break
      }
      case STEPS.vestingParams: {
        setCurrentStep(STEPS.settings)
        break
      }
      case STEPS.whitelist: {
        setCurrentStep(STEPS.vestingParams)
        break
      }
      default:
        break
    }
  }, [navigate, currentStep, daoAddress])

  const handleNextStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.settings: {
        setCurrentStep(STEPS.vestingParams)
        break
      }
      case STEPS.vestingParams: {
        setCurrentStep(STEPS.whitelist)
        break
      }
      case STEPS.vestingParams: {
        //TODO create proposal here
        break
      }
    }
  }, [currentStep])

  return (
    <S.StepsFormContainer
      totalStepsAmount={totalStepsCount}
      currentStepNumber={currentStepNumber}
      prevCb={handlePrevStep}
      nextCb={handleNextStep}
    >
      <AnimatePresence>
        <S.StepsWrapper>
          {currentStep === STEPS.settings && (
            <S.StepsContainer>
              <SettingsStep />
            </S.StepsContainer>
          )}
          {currentStep === STEPS.vestingParams && (
            <S.StepsContainer>
              <VestingParamsStep />
            </S.StepsContainer>
          )}
          {currentStep === STEPS.whitelist && (
            <S.StepsContainer>
              <WhitelistStep />
            </S.StepsContainer>
          )}
          {!isMobile && (
            <S.SideStepsNavigationBarWrp
              title={"Create proposal"}
              steps={Object.values(STEPS).map((step) => ({
                number: Object.values(STEPS).indexOf(step),
                title: STEPS_TITLES[step],
              }))}
              currentStep={Object.values(STEPS).indexOf(currentStep)}
            />
          )}
        </S.StepsWrapper>
      </AnimatePresence>
    </S.StepsFormContainer>
  )
}

export default CreateDaoProposalTokenSaleForm
