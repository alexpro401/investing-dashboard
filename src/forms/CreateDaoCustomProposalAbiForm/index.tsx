import React, {
  useState,
  useMemo,
  useCallback,
  useContext,
  useEffect,
} from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { parseEther } from "@ethersproject/units"
import { useDispatch } from "react-redux"

import StepsControllerContext from "context/StepsControllerContext"
import CreateDaoProposalGeneralForm from "forms/CreateDaoProposalGeneralForm"
import { AdvancedABIContext } from "context/govPool/proposals/custom/AdvancedABIContext"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import { useGovPoolCreateCustomProposalManual } from "hooks/dao"
import { hideTapBar, showTabBar } from "state/application/actions"
import { AbiStep } from "./steps"

import * as S from "./styled"

enum STEPS {
  abiInfo = "abiInfo",
  basicInfo = "basicInfo",
}

const CreateDaoCustomProposalAbiForm: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { daoAddress, executorAddress } = useParams<
    "daoAddress" | "executorAddress"
  >()
  const { proposalName, proposalDescription } = useContext(
    GovProposalCreatingContext
  )
  const {
    contractAdresses,
    contractValues,
    executorSelectedAddress,
    executorValue,
    encodedMethods,
  } = useContext(AdvancedABIContext)

  useEffect(() => {
    dispatch(hideTapBar())

    return () => {
      dispatch(showTabBar())
    }
  }, [dispatch])

  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.abiInfo)

  const totalStepsCount = useMemo(() => Object.values(STEPS).length + 1, [])
  const currentStepNumber = useMemo(
    () => Object.values(STEPS).indexOf(currentStep) + 2,
    [currentStep]
  )
  const createProposal = useGovPoolCreateCustomProposalManual(daoAddress)

  const handeCreateProposal = useCallback(() => {
    const executors = contractAdresses.get
      .map((el) => el[1])
      .concat([executorSelectedAddress.get])

    const values = contractValues.get
      .map((el) => (isNaN(Number(el)) ? "0" : parseEther(el).toString()))
      .concat(
        isNaN(Number(executorValue.get))
          ? "0"
          : parseEther(executorValue.get).toString()
      )

    const data = executors.map((el) => encodedMethods.get[el][1])

    createProposal({
      executors,
      values,
      data,
      proposalName: proposalName.get,
      proposalDescription: proposalDescription.get,
      misc: "",
    })
  }, [
    createProposal,
    proposalName,
    proposalDescription,
    contractAdresses,
    contractValues,
    executorSelectedAddress,
    executorValue,
    encodedMethods,
  ])

  const handlePrevStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.abiInfo: {
        if (daoAddress) {
          navigate(
            `/dao/${daoAddress}/create-custom-proposal/${executorAddress}`
          )
        }
        break
      }
      case STEPS.basicInfo: {
        setCurrentStep(STEPS.abiInfo)
        break
      }
      default:
        break
    }
  }, [currentStep, daoAddress, executorAddress, navigate])

  const handleNextStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.abiInfo: {
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
        {currentStep === STEPS.abiInfo && (
          <S.StepsContainer>
            <AbiStep />
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

export default CreateDaoCustomProposalAbiForm
