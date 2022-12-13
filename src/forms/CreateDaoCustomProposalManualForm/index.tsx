import React, { useState, useMemo, useCallback, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { parseEther } from "@ethersproject/units"

import { ManualStep } from "./steps"
import CreateDaoProposalGeneralForm from "forms/CreateDaoProposalGeneralForm"
import StepsControllerContext from "context/StepsControllerContext"
import { AdvancedManualContext } from "context/govPool/proposals/custom/AdvancedManualContext"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import { useGovPoolCreateCustomProposalManual } from "hooks/dao"

import * as S from "./styled"

enum STEPS {
  manualInfo = "manualInfo",
  basicInfo = "basicInfo",
}

const CreateDaoCustomProposalManualForm: React.FC = () => {
  const navigate = useNavigate()
  const { daoAddress, executorAddress } = useParams<
    "daoAddress" | "executorAddress"
  >()
  const { contracts, executorContract } = useContext(AdvancedManualContext)
  const { proposalName, proposalDescription } = useContext(
    GovProposalCreatingContext
  )

  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.manualInfo)
  const createProposal = useGovPoolCreateCustomProposalManual(daoAddress)

  const totalStepsCount = useMemo(() => Object.values(STEPS).length + 1, [])
  const currentStepNumber = useMemo(
    () => Object.values(STEPS).indexOf(currentStep) + 2,
    [currentStep]
  )

  const handeCreateProposal = useCallback(() => {
    createProposal({
      executors: contracts.get
        .map((el) => el.contractAddress)
        .concat(executorContract.get.contractAddress),
      values: contracts.get
        .map((el) =>
          isNaN(Number(el.value)) ? "0" : parseEther(el.value).toString()
        )
        .concat(
          isNaN(Number(executorContract.get.value))
            ? "0"
            : parseEther(executorContract.get.value).toString()
        ),
      data: contracts.get
        .map((el) => el.transactionData)
        .concat(executorContract.get.transactionData),
      proposalName: proposalName.get,
      proposalDescription: proposalDescription.get,
    })
  }, [
    createProposal,
    contracts,
    proposalName,
    proposalDescription,
    executorContract,
  ])

  const handlePrevStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.manualInfo: {
        if (daoAddress) {
          navigate(
            `/dao/${daoAddress}/create-custom-proposal/${executorAddress}`
          )
        }
        break
      }
      case STEPS.basicInfo: {
        setCurrentStep(STEPS.manualInfo)
        break
      }
      default:
        break
    }
  }, [currentStep, daoAddress, executorAddress, navigate])

  const handleNextStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.manualInfo: {
        setCurrentStep(STEPS.basicInfo)
        break
      }
      case STEPS.basicInfo: {
        handeCreateProposal()
        break
      }
      default:
        break
    }
  }, [currentStep, handeCreateProposal])

  return (
    <StepsControllerContext
      totalStepsAmount={totalStepsCount}
      currentStepNumber={currentStepNumber}
      prevCb={handlePrevStep}
      nextCb={handleNextStep}
    >
      <AnimatePresence>
        {currentStep === STEPS.manualInfo && (
          <S.StepsContainer>
            <ManualStep />
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

export default CreateDaoCustomProposalManualForm
