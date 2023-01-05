import React, {
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react"
import { AnimatePresence } from "framer-motion"
import { useDispatch } from "react-redux"
import { generatePath, useNavigate, useParams } from "react-router-dom"
import { parseEther } from "@ethersproject/units"

import CreateDaoProposalGeneralForm from "forms/CreateDaoProposalGeneralForm"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import { ValidatorsListContext } from "context/govPool/proposals/ValidatorsListContext"
import { ValidatorsStep } from "./steps"
import { useBreakpoints } from "hooks"
import { useGovPoolCreateValidatorInternalProposal } from "hooks/dao"
import { hideTapBar, showTabBar } from "state/application/actions"

import * as S from "common/FormSteps/styled"
import { ROUTE_PATHS } from "consts"

enum STEPS {
  validators = "validators",
  basicInfo = "basicInfo",
}

const STEPS_TITLES: Record<STEPS, string> = {
  [STEPS.validators]: "Validators",
  [STEPS.basicInfo]: "Basic Info",
}

const CreateGovProposalValidatorChangeValidatorSettingsForm: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { daoAddress } = useParams<"daoAddress">()
  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.validators)
  const { isMobile } = useBreakpoints()
  const createInternalProposal = useGovPoolCreateValidatorInternalProposal({
    daoAddress: daoAddress ?? "",
  })
  const { balances, validators, hiddenIdxs } = useContext(ValidatorsListContext)
  const { proposalName, proposalDescription } = useContext(
    GovProposalCreatingContext
  )

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

  const handleCreateProposal = useCallback(() => {
    const _balances = balances
      .filter((_, idx) => !hiddenIdxs.includes(idx))
      .map((balance) => parseEther(balance).toString())
    const _validators = validators.filter((_, idx) => !hiddenIdxs.includes(idx))

    createInternalProposal({
      internalProposalType: 3,
      users: _validators,
      values: _balances,
      proposalName: proposalName.get,
      proposalDescription: proposalDescription.get,
    })
  }, [
    createInternalProposal,
    proposalName,
    proposalDescription,
    balances,
    validators,
    hiddenIdxs,
  ])

  const handlePrevStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.validators: {
        if (daoAddress) {
          navigate(
            generatePath(
              ROUTE_PATHS.daoProposalCreateInternalValidatorsSelectType,
              { daoAddress }
            )
          )
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
              <ValidatorsStep />
            </S.StepsContainer>
          )}
          {currentStep === STEPS.basicInfo && (
            <S.StepsContainer>
              <CreateDaoProposalGeneralForm />
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

export default CreateGovProposalValidatorChangeValidatorSettingsForm
