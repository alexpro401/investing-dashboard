import React, {
  useState,
  useMemo,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react"
import { AnimatePresence } from "framer-motion"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import CreateDaoProposalGeneralForm from "forms/CreateDaoProposalGeneralForm"
import {
  useGovPoolCreateProposalChangeDaoSettings,
  useBreakpoints,
} from "hooks"
import { GovPoolFormContext } from "context/govPool/GovPoolFormContext"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import { hideTapBar, showTabBar } from "state/application/actions"
import { TitlesStep } from "common"

import * as S from "common/FormSteps/styled"

enum STEPS {
  daoSettings = "daoSettings",
  basicInfo = "basicInfo",
}

const STEPS_TITLES: Record<STEPS, string> = {
  [STEPS.daoSettings]: "DAO Settings",
  [STEPS.basicInfo]: "Basic Info",
}

const CreateProposalChangeDAOSettingsForm: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { daoAddress } = useParams<"daoAddress">()
  const createProposal = useGovPoolCreateProposalChangeDaoSettings(
    daoAddress ?? ""
  )
  const { isMobile } = useBreakpoints()
  const { proposalName, proposalDescription } = useContext(
    GovProposalCreatingContext
  )
  const stepsWrapperRef = useRef<HTMLDivElement>(null)
  const {
    avatarUrl,
    daoName,
    description,
    documents,
    socialLinks,
    websiteUrl,
  } = useContext(GovPoolFormContext)

  useEffect(() => {
    dispatch(hideTapBar())

    return () => {
      dispatch(showTabBar())
    }
  }, [dispatch])

  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.daoSettings)

  const totalStepsCount = useMemo(() => Object.values(STEPS).length, [])
  const currentStepNumber = useMemo(
    () => Object.values(STEPS).indexOf(currentStep) + 1,
    [currentStep]
  )

  useEffect(() => {
    if (stepsWrapperRef.current) {
      stepsWrapperRef.current.scrollIntoView({
        behavior: "smooth",
      })
    }
  }, [currentStep, stepsWrapperRef])

  const handleCreateChangeDaoSettingsProposal = useCallback(() => {
    createProposal({
      proposalName: proposalName.get,
      proposalDescription: proposalDescription.get,
      avatarUrl: avatarUrl.get,
      daoName: daoName.get,
      description: description.get,
      documents: documents.get,
      socialLinks: socialLinks.get,
      websiteUrl: websiteUrl.get,
    })
  }, [
    createProposal,
    proposalName,
    proposalDescription,
    avatarUrl,
    daoName,
    description,
    documents,
    socialLinks,
    websiteUrl,
  ])

  const handlePrevStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.daoSettings: {
        if (daoAddress) {
          navigate(`/dao/${daoAddress}/create-proposal`)
        }
        break
      }
      case STEPS.basicInfo: {
        setCurrentStep(STEPS.daoSettings)
        break
      }
      default:
        break
    }
  }, [currentStep, daoAddress, navigate])

  const handleNextStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.daoSettings: {
        setCurrentStep(STEPS.basicInfo)
        break
      }
      case STEPS.basicInfo: {
        handleCreateChangeDaoSettingsProposal()
        break
      }
      default:
        break
    }
  }, [currentStep, handleCreateChangeDaoSettingsProposal])

  return (
    <S.StepsFormContainer
      totalStepsAmount={totalStepsCount}
      currentStepNumber={currentStepNumber}
      prevCb={handlePrevStep}
      nextCb={handleNextStep}
    >
      <AnimatePresence>
        <S.StepsWrapper ref={stepsWrapperRef}>
          {currentStep === STEPS.daoSettings && (
            <S.StepsContainer>
              <TitlesStep isCreatingProposal />
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

export default CreateProposalChangeDAOSettingsForm
