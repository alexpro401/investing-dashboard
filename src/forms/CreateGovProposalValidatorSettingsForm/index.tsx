import React, {
  useState,
  useMemo,
  useCallback,
  useContext,
  useEffect,
} from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import { AnimatePresence } from "framer-motion"
import { parseEther } from "@ethersproject/units"

import StepsControllerContext from "context/StepsControllerContext"
import { ValidatorsListContext } from "context/govPool/proposals/ValidatorsListContext"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import CreateDaoProposalGeneralForm from "forms/CreateDaoProposalGeneralForm"
import { ValidatorsSettingsStep } from "./steps"
import { useBreakpoints } from "hooks"
import useGovPoolCreateProposalValidators from "hooks/dao/proposals/useGovPoolCreateProposalValidators"
import { hideTapBar, showTabBar } from "state/application/actions"

import * as S from "common/FormSteps/styled"

enum STEPS {
  validators = "validators",
  basicInfo = "basicInfo",
}

const STEPS_TITLES: Record<STEPS, string> = {
  [STEPS.validators]: "Validators",
  [STEPS.basicInfo]: "Basic Info",
}

const CreateGovProposalValidatorSettingsForm: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { daoAddress } = useParams<"daoAddress">()
  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.validators)
  const createProposal = useGovPoolCreateProposalValidators(daoAddress ?? "")

  useEffect(() => {
    dispatch(hideTapBar())

    return () => {
      dispatch(showTabBar())
    }
  }, [dispatch])

  const totalStepsCount = useMemo(() => Object.values(STEPS).length, [])
  const currentStepNumber = useMemo(
    () => Object.values(STEPS).indexOf(currentStep) + 1,
    [currentStep]
  )

  const { balances, validators, hiddenIdxs } = useContext(ValidatorsListContext)
  const { proposalName, proposalDescription } = useContext(
    GovProposalCreatingContext
  )

  const handleCreateProposal = useCallback(() => {
    const _balances = balances
      .filter((_, idx) => !hiddenIdxs.includes(idx))
      .map((balance) => parseEther(balance).toString())
    const _validators = validators.filter((_, idx) => !hiddenIdxs.includes(idx))

    createProposal({
      balances: _balances,
      users: _validators,
      proposalDescription: proposalDescription.get,
      proposalName: proposalName.get,
    })
  }, [
    balances,
    validators,
    hiddenIdxs,
    createProposal,
    proposalName,
    proposalDescription,
  ])

  const handlePrevStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.validators: {
        if (daoAddress) {
          navigate(`/dao/${daoAddress}/create-proposal`)
        }
        break
      }
      case STEPS.basicInfo: {
        setCurrentStep(STEPS.validators)
        break
      }
      default:
        break
    }
  }, [navigate, daoAddress, setCurrentStep, currentStep])

  const handleNextStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.validators: {
        setCurrentStep(STEPS.basicInfo)
        break
      }
      case STEPS.basicInfo: {
        handleCreateProposal()
        break
      }
      default:
        break
    }
  }, [currentStep, handleCreateProposal])

  const { isMobile } = useBreakpoints()

  return (
    <S.StepsFormContainer
      totalStepsAmount={totalStepsCount}
      currentStepNumber={currentStepNumber}
      prevCb={handlePrevStep}
      nextCb={handleNextStep}
    >
      <AnimatePresence>
        <S.StepsWrapper>
          {currentStep === STEPS.validators && (
            <S.StepsContainer>
              <ValidatorsSettingsStep />
            </S.StepsContainer>
          )}
          {currentStep === STEPS.basicInfo && (
            <S.StepsContainer>
              <CreateDaoProposalGeneralForm />
            </S.StepsContainer>
          )}
          {!isMobile && (
            <S.SideStepsNavigationBarWrp
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

export default CreateGovProposalValidatorSettingsForm
