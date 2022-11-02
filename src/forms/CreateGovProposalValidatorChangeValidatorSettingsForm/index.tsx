import React, { useCallback, useContext, useMemo, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { useNavigate, useParams } from "react-router-dom"
import { parseEther } from "@ethersproject/units"

import StepsControllerContext from "context/StepsControllerContext"
import CreateDaoProposalGeneralForm from "forms/CreateDaoProposalGeneralForm"
import { DaoProposalCreatingContext } from "context/DaoProposalCreatingContext"
import { ValidatorsListContext } from "context/ValidatorsListContext"
import { ValidatorsStep } from "./steps"
import useGovPoolCreateValidatorInternalProposal from "hooks/useGovPoolCreateValidatorInternalProposal"

import * as S from "./styled"

enum STEPS {
  validators = "validators",
  basicInfo = "basicInfo",
}

const CreateGovProposalValidatorChangeValidatorSettingsForm: React.FC = () => {
  const navigate = useNavigate()
  const { daoAddress } = useParams<"daoAddress">()
  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.validators)
  const createInternalProposal = useGovPoolCreateValidatorInternalProposal({
    daoAddress: daoAddress ?? "",
  })
  const { balances, validators, hiddenIdxs } = useContext(ValidatorsListContext)
  const { proposalName, proposalDescription } = useContext(
    DaoProposalCreatingContext
  )

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
          navigate(`/dao/${daoAddress}/create-validator-proposal`)
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
            <ValidatorsStep />
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

export default CreateGovProposalValidatorChangeValidatorSettingsForm
