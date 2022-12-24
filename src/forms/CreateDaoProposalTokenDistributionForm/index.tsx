import React, {
  useContext,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { AnimatePresence } from "framer-motion"

import { useBreakpoints } from "hooks"
import { useGovPoolCreateDistributionProposal } from "hooks/dao"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import { TokenDistributionCreatingContext } from "context/govPool/proposals/TokenDistributionContext"
import CreateDaoProposalGeneralForm from "forms/CreateDaoProposalGeneralForm"
import { TokenDistributionStep } from "./steps"
import { hideTapBar, showTabBar } from "state/application/actions"

import * as S from "common/FormSteps/styled"

enum STEPS {
  tokenDistribution = "tokenDistribution",
  basicInfo = "basicInfo",
}

const STEPS_TITLES: Record<STEPS, string> = {
  [STEPS.tokenDistribution]: "Token Distribution",
  [STEPS.basicInfo]: "Basic Info",
}

const CreateDaoProposalTokenDistributionForm: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { daoAddress } = useParams<"daoAddress">()

  const createProposal = useGovPoolCreateDistributionProposal(daoAddress ?? "")
  const { proposalName, proposalDescription } = useContext(
    GovProposalCreatingContext
  )
  const { selectedTreasuryToken, tokenAmount } = useContext(
    TokenDistributionCreatingContext
  )

  const { isMobile } = useBreakpoints()

  useEffect(() => {
    dispatch(hideTapBar())

    return () => {
      dispatch(showTabBar())
    }
  }, [dispatch])

  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.tokenDistribution)

  const totalStepsCount = useMemo(() => Object.values(STEPS).length, [])
  const currentStepNumber = useMemo(
    () => Object.values(STEPS).indexOf(currentStep) + 1,
    [currentStep]
  )

  const handleCreateProposal = useCallback(() => {
    if (!selectedTreasuryToken.get) return

    createProposal({
      proposalName: proposalName.get,
      proposalDescription: proposalDescription.get,
      tokenAddress: selectedTreasuryToken.get.contract_address,
      tokenDecimals: selectedTreasuryToken.get.contract_decimals,
      tokenAmount: tokenAmount.get,
    })
  }, [
    createProposal,
    proposalName,
    proposalDescription,
    selectedTreasuryToken,
    tokenAmount,
  ])

  const handlePrevStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.tokenDistribution: {
        if (daoAddress) {
          navigate(`/dao/${daoAddress}/create-proposal`)
        }
        break
      }
      case STEPS.basicInfo: {
        setCurrentStep(STEPS.tokenDistribution)
        break
      }
      default:
        break
    }
  }, [currentStep, daoAddress, navigate])

  const handleNextStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.tokenDistribution: {
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
          {currentStep === STEPS.tokenDistribution && (
            <S.StepsContainer>
              <TokenDistributionStep />
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

export default CreateDaoProposalTokenDistributionForm
