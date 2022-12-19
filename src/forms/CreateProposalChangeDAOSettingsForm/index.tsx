import React, {
  useState,
  useMemo,
  useCallback,
  useContext,
  useEffect,
} from "react"
import { AnimatePresence } from "framer-motion"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import StepsControllerContext from "context/StepsControllerContext"
import CreateDaoProposalGeneralForm from "forms/CreateDaoProposalGeneralForm"
import { ChangeDAOSettings } from "./steps"
import { useGovPoolCreateProposalChangeDaoSettings } from "hooks/dao/proposals"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import { ChangeGovSettingsContext } from "context/govPool/proposals/regular/ChangeGovSettingsContext"
import { hideTapBar, showTabBar } from "state/application/actions"

import * as S from "./styled"

enum STEPS {
  daoSettings = "daoSettings",
  basicInfo = "basicInfo",
}

const CreateProposalChangeDAOSettingsForm: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { daoAddress } = useParams<"daoAddress">()
  const createProposal = useGovPoolCreateProposalChangeDaoSettings(
    daoAddress ?? ""
  )
  const { proposalName, proposalDescription } = useContext(
    GovProposalCreatingContext
  )
  const {
    avatarUrl,
    daoName,
    description,
    documents,
    socialLinks,
    websiteUrl,
  } = useContext(ChangeGovSettingsContext)

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
    <StepsControllerContext
      totalStepsAmount={totalStepsCount}
      currentStepNumber={currentStepNumber}
      prevCb={handlePrevStep}
      nextCb={handleNextStep}
    >
      <AnimatePresence>
        {currentStep === STEPS.daoSettings && (
          <S.StepsContainer>
            <ChangeDAOSettings />
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

export default CreateProposalChangeDAOSettingsForm
