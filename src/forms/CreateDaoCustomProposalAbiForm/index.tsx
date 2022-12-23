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

import CreateDaoProposalGeneralForm from "forms/CreateDaoProposalGeneralForm"
import { AdvancedABIContext } from "context/govPool/proposals/custom/AdvancedABIContext"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import { useBreakpoints } from "hooks"
import { useGovPoolCreateCustomProposalManual } from "hooks/dao"
import { hideTapBar, showTabBar } from "state/application/actions"
import { AbiStep } from "./steps"

import * as S from "common/FormSteps/styled"

enum STEPS {
  abiInfo = "abiInfo",
  basicInfo = "basicInfo",
}

const STEPS_TITLES: Record<STEPS, string> = {
  [STEPS.abiInfo]: "Abi info",
  [STEPS.basicInfo]: "Basic Info",
}

const CreateDaoCustomProposalAbiForm: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { daoAddress, executorAddress } = useParams<
    "daoAddress" | "executorAddress"
  >()
  const { isMobile } = useBreakpoints()
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
    <S.StepsFormContainer
      totalStepsAmount={totalStepsCount}
      currentStepNumber={currentStepNumber}
      prevCb={handlePrevStep}
      nextCb={handleNextStep}
    >
      <AnimatePresence>
        <S.StepsWrapper>
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
          {!isMobile && (
            <S.SideStepsNavigationBarWrp
              title={"Create proposal"}
              steps={[{ number: 0, title: "Select creation method" }].concat(
                Object.values(STEPS).map((step) => ({
                  number: Object.values(STEPS).indexOf(step) + 1,
                  title: STEPS_TITLES[step],
                }))
              )}
              currentStep={Object.values(STEPS).indexOf(currentStep) + 1}
            />
          )}
        </S.StepsWrapper>
      </AnimatePresence>
    </S.StepsFormContainer>
  )
}

export default CreateDaoCustomProposalAbiForm
