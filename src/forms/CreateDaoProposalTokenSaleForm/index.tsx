import React, { useEffect, useState, useMemo, useCallback } from "react"
import { useDispatch } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

import { hideTapBar, showTabBar } from "state/application/actions"
import { useBreakpoints } from "hooks"
import {
  SettingsStep,
  VestingParamsStep,
  WhitelistStep,
  BeforeYouStart,
} from "./steps"
import SideBarNavigation from "./SideBarNavigation"
import TokenSaleProposalsNavigation from "./TokenSaleProposalsNavigation"
import AddTokenSaleButton from "./AddTokenSaleButton"

import * as S from "common/FormSteps/styled"

enum STEPS {
  beforeYouStart = "beforeYouStart",
  settings = "settings",
  vestingParams = "vestingParams",
  whitelist = "whitelist",
}

const CreateDaoProposalTokenSaleForm: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { daoAddress } = useParams<"daoAddress">()
  const { isMobile } = useBreakpoints()

  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.beforeYouStart)

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
      case STEPS.beforeYouStart: {
        if (daoAddress) {
          navigate(`/dao/${daoAddress}/create-proposal`)
        }
        break
      }
      case STEPS.settings: {
        setCurrentStep(STEPS.beforeYouStart)
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
      case STEPS.beforeYouStart: {
        setCurrentStep(STEPS.settings)
        break
      }
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

  const TokenSaleProposalsNavigationHeader = useMemo(() => {
    if (isMobile)
      return (
        <>
          <TokenSaleProposalsNavigation />
          <AddTokenSaleButton />
        </>
      )

    return null
  }, [isMobile])

  return (
    <S.StepsFormContainer
      totalStepsAmount={totalStepsCount}
      currentStepNumber={currentStepNumber}
      setStep={(v) => setCurrentStep(Object.values(STEPS)[v])}
      prevCb={handlePrevStep}
      nextCb={handleNextStep}
    >
      <AnimatePresence>
        <S.StepsWrapper>
          {currentStep === STEPS.beforeYouStart && (
            <S.StepsContainer>
              <BeforeYouStart />
            </S.StepsContainer>
          )}
          {currentStep === STEPS.settings && (
            <S.StepsContainer>
              {TokenSaleProposalsNavigationHeader}
              <SettingsStep />
            </S.StepsContainer>
          )}
          {currentStep === STEPS.vestingParams && (
            <S.StepsContainer>
              {TokenSaleProposalsNavigationHeader}
              <VestingParamsStep />
            </S.StepsContainer>
          )}
          {currentStep === STEPS.whitelist && (
            <S.StepsContainer>
              {TokenSaleProposalsNavigationHeader}
              <WhitelistStep />
            </S.StepsContainer>
          )}
          {!isMobile && <SideBarNavigation />}
        </S.StepsWrapper>
      </AnimatePresence>
    </S.StepsFormContainer>
  )
}

export default CreateDaoProposalTokenSaleForm
