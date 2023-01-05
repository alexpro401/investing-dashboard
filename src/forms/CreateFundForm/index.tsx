import React, { useMemo, useEffect, useState, useCallback } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

import { hideTapBar, showTabBar } from "state/application/actions"
import { ROUTE_PATHS } from "consts/routes"
import { useBreakpoints } from "hooks"
import { useCreateFund } from "hooks/pool"
import { useUserAgreement } from "state/user/hooks"
import { BasicFundSettings, AdditionalSettings, WithdrawalFee } from "./steps"

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

interface ICreateFundFormProps {
  presettedFundType: "basic" | "investment"
}

const CreateFundForm: React.FC<ICreateFundFormProps> = ({
  presettedFundType,
}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.basicFundSettings)
  const { isMobile } = useBreakpoints()
  const [{ agreed }, { setShowAgreement }] = useUserAgreement()
  const { createFund, StepperModal, SuccessModal } = useCreateFund({
    presettedFundType,
  })

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

  const handleCreateFund = useCallback(() => {
    createFund()
  }, [createFund])

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
        if (agreed) {
          handleCreateFund()
        } else {
          setShowAgreement(true)
        }
        break
      }
      default:
        break
    }
  }, [currentStep, setCurrentStep, agreed, setShowAgreement, handleCreateFund])

  return (
    <>
      {StepperModal}
      {SuccessModal}
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
            {currentStep === STEPS.additionalSettings && (
              <SForms.StepsContainer>
                <AdditionalSettings />
              </SForms.StepsContainer>
            )}
            {currentStep === STEPS.comission && (
              <SForms.StepsContainer>
                <WithdrawalFee />
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
    </>
  )
}

export default CreateFundForm
