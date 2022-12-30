import React, { useMemo, useEffect, useState, useCallback } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

import { hideTapBar, showTabBar } from "state/application/actions"
import { ROUTE_PATHS } from "constants/index"
import { useBreakpoints } from "hooks"
import { BasicFundSettings } from "./steps"

import * as SForms from "common/FormSteps/styled"

enum STEPS {
  basicFundSettings = "basicFundSettings",
  additionalSettings = "additionalSettings",
  comission = "comission",
}

const STEPS_TITLES: Record<STEPS, string> = {
  [STEPS.basicFundSettings]: "Basic fund settings",
  [STEPS.additionalSettings]: "Additional settings",
  [STEPS.comission]: "Comission",
}

const CreateFundFormNew: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.basicFundSettings)
  const { isMobile } = useBreakpoints()

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
      case STEPS.basicFundSettings: {
        navigate(ROUTE_PATHS.createFund)
        break
      }
      case STEPS.additionalSettings: {
        setCurrentStep(STEPS.basicFundSettings)
        break
      }
      case STEPS.comission: {
        setCurrentStep(STEPS.additionalSettings)
        break
      }
      default:
        break
    }
  }, [navigate, setCurrentStep, currentStep])

  const handleNextStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.basicFundSettings: {
        setCurrentStep(STEPS.additionalSettings)
        break
      }
      case STEPS.additionalSettings: {
        setCurrentStep(STEPS.comission)
        break
      }
      case STEPS.comission: {
        //TODO handle create fund
        break
      }
      default:
        break
    }
  }, [currentStep, setCurrentStep])

  return (
    <SForms.StepsFormContainer
      totalStepsAmount={totalStepsCount}
      currentStepNumber={currentStepNumber}
      prevCb={handlePrevStep}
      nextCb={handleNextStep}
    >
      <AnimatePresence>
        <SForms.StepsWrapper>
          {currentStep === STEPS.basicFundSettings && (
            <SForms.StepsContainer>
              <BasicFundSettings />
            </SForms.StepsContainer>
          )}
          {!isMobile && (
            <SForms.SideStepsNavigationBarWrp
              title={"Create standart fund"}
              steps={Object.values(STEPS).map((step) => ({
                number: Object.values(STEPS).indexOf(step),
                title: STEPS_TITLES[step],
              }))}
              currentStep={Object.values(STEPS).indexOf(currentStep)}
            />
          )}
        </SForms.StepsWrapper>
      </AnimatePresence>
    </SForms.StepsFormContainer>
  )
}

export default CreateFundFormNew
