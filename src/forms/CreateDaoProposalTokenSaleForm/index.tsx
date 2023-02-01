import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useContext,
  useRef,
} from "react"
import { useDispatch } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { parseUnits } from "@ethersproject/units"

import { hideTapBar, showTabBar } from "state/application/actions"
import { useBreakpoints } from "hooks"
import { useGovPoolCreateTokenSaleProposal } from "hooks/dao/proposals"
import { TokenSaleCreatingContext } from "context/govPool/proposals/TokenSaleContext"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import CreateDaoProposalGeneralForm from "forms/CreateDaoProposalGeneralForm"
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
  basicInfo = "basicInfo",
  settings = "settings",
  vestingParams = "vestingParams",
  whitelist = "whitelist",
}

const CreateDaoProposalTokenSaleForm: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { daoAddress } = useParams<"daoAddress">()
  const { isMobile } = useBreakpoints()
  const stepsWrapperRef = useRef<HTMLDivElement>(null)

  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.beforeYouStart)
  const { tokenSaleProposals } = useContext(TokenSaleCreatingContext)
  const { proposalName, proposalDescription } = useContext(
    GovProposalCreatingContext
  )

  const createProposal = useGovPoolCreateTokenSaleProposal({
    govPoolAddress: daoAddress,
  })

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

  useEffect(() => {
    if (stepsWrapperRef.current) {
      stepsWrapperRef.current.scrollIntoView({
        behavior: "smooth",
      })
    }
  }, [currentStep, stepsWrapperRef])

  const handleCreateProposal = useCallback(() => {
    createProposal({
      proposalName: proposalName.get,
      proposalDescription: proposalDescription.get,
      tiers: tokenSaleProposals.map((proposal) => ({
        metadata: {
          name: proposal.proposalName,
          description: proposal.proposalDescription,
        },
        saleEndTime: proposal.sellEndDate.toString(),
        saleStartTime: proposal.sellStartDate.toString(),
        vestingSettings: {
          cliffPeriod: proposal.cliffDuration.toString(),
          unlockStep: proposal.unlockStepDuration.toString(),
          vestingDuration: proposal.lockedDuration.toString(),
          vestingPercentage: parseUnits(
            proposal.lockedPercent.toString(),
            25
          ).toString(),
        },
        minAllocationPerUser: parseUnits(proposal.minAllocation, 18).toString(),
        maxAllocationPerUser: parseUnits(proposal.maxAllocation, 18).toString(),
        saleTokenAddress:
          proposal.selectedTreasuryToken?.contract_address ?? "",
        totalTokenProvided: parseUnits(proposal.tokenAmount, 18).toString(),
        purchaseTokenAddresses: proposal.sellPairs.map((el) => el.tokenAddress),
        exchangeRates: proposal.sellPairs.map((el) =>
          parseUnits(el.amount, 25).toString()
        ),
      })),
    })
  }, [createProposal, tokenSaleProposals, proposalName, proposalDescription])

  const handlePrevStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.beforeYouStart: {
        if (daoAddress) {
          navigate(`/dao/${daoAddress}/create-proposal`)
        }
        break
      }
      case STEPS.basicInfo: {
        setCurrentStep(STEPS.beforeYouStart)
        break
      }
      case STEPS.settings: {
        setCurrentStep(STEPS.basicInfo)
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
        setCurrentStep(STEPS.basicInfo)
        break
      }
      case STEPS.basicInfo: {
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
      case STEPS.whitelist: {
        handleCreateProposal()
        break
      }
    }
  }, [currentStep, handleCreateProposal])

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
        <S.StepsWrapper ref={stepsWrapperRef}>
          {currentStep === STEPS.beforeYouStart && (
            <S.StepsContainer>
              <BeforeYouStart />
            </S.StepsContainer>
          )}
          {currentStep === STEPS.basicInfo && (
            <S.StepsContainer>
              <CreateDaoProposalGeneralForm nextLabel={"Continue"} />
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
