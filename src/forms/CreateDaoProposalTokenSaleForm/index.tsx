import React, { useEffect, useState, useMemo, useCallback } from "react"
import { useDispatch } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

import { hideTapBar, showTabBar } from "state/application/actions"
import { useBreakpoints } from "hooks"
import {
  SettingsStep,
  TokenSaleStep,
  VestingParamsStep,
  WhitelistStep,
} from "./steps"

import * as S from "common/FormSteps/styled"

enum STEPS {
  settings = "settings",
  vestingParams = "vestingParams",
  tokenSale = "tokenSale",
  whitelist = "whitelist",
  basicInfo = "basicInfo",
}

const STEPS_TITLES: Record<STEPS, string> = {
  [STEPS.settings]: "Налаштування",
  [STEPS.vestingParams]: "Параметри вестінга",
  [STEPS.tokenSale]: "Продаж токену",
  [STEPS.whitelist]: "Вайтліст",
  [STEPS.basicInfo]: "Basic info",
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
      case STEPS.tokenSale: {
        setCurrentStep(STEPS.vestingParams)
        break
      }
      case STEPS.whitelist: {
        setCurrentStep(STEPS.tokenSale)
        break
      }
      case STEPS.basicInfo: {
        setCurrentStep(STEPS.whitelist)
        break
      }
      default:
        break
    }
  }, [navigate, currentStep, daoAddress])

  const handleNextStep = useCallback(() => {}, [])

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
          {currentStep === STEPS.tokenSale && (
            <S.StepsContainer>
              <TokenSaleStep />
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
