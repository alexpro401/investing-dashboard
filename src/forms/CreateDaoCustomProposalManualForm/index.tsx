import React, {
  useState,
  useMemo,
  useCallback,
  useContext,
  useEffect,
} from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { AnimatePresence } from "framer-motion"
import { parseEther } from "@ethersproject/units"

import { ManualStep } from "./steps"
import CreateDaoProposalGeneralForm from "forms/CreateDaoProposalGeneralForm"
import { AdvancedManualContext } from "context/govPool/proposals/custom/AdvancedManualContext"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import { useBreakpoints } from "hooks"
import { useGovPoolCreateCustomProposalManual } from "hooks/dao"
import { hideTapBar, showTabBar } from "state/application/actions"

import * as S from "common/FormSteps/styled"

enum STEPS {
  manualInfo = "manualInfo",
  basicInfo = "basicInfo",
}

const STEPS_TITLES: Record<STEPS, string> = {
  [STEPS.manualInfo]: "Manual info",
  [STEPS.basicInfo]: "Basic Info",
}

const CreateDaoCustomProposalManualForm: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { daoAddress, executorAddress } = useParams<
    "daoAddress" | "executorAddress"
  >()
  const { isMobile } = useBreakpoints()
  const { contracts, executorContract } = useContext(AdvancedManualContext)
  const { proposalName, proposalDescription } = useContext(
    GovProposalCreatingContext
  )

  useEffect(() => {
    dispatch(hideTapBar())

    return () => {
      dispatch(showTabBar())
    }
  }, [dispatch])

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
      misc: "",
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
    <S.StepsFormContainer
      totalStepsAmount={totalStepsCount}
      currentStepNumber={currentStepNumber}
      prevCb={handlePrevStep}
      nextCb={handleNextStep}
    >
      <AnimatePresence>
        <S.StepsWrapper>
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

export default CreateDaoCustomProposalManualForm
