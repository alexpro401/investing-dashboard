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
import useGovPoolCreateProposalValidators from "hooks/dao/proposals/useGovPoolCreateProposalValidators"
import { hideTapBar, showTabBar } from "state/application/actions"

import * as S from "./styled"

enum STEPS {
  validators = "validators",
  basicInfo = "basicInfo",
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

  return (
    <StepsControllerContext
      totalStepsAmount={totalStepsCount}
      currentStepNumber={currentStepNumber}
      prevCb={handlePrevStep}
      nextCb={handleNextStep}
    >
      <AnimatePresence>
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
      </AnimatePresence>
    </StepsControllerContext>
  )
}

export default CreateGovProposalValidatorSettingsForm
