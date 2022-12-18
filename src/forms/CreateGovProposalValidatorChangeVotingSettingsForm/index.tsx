import React, {
  useMemo,
  useState,
  useCallback,
  useContext,
  useEffect,
} from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import { AnimatePresence } from "framer-motion"
import { parseUnits } from "@ethersproject/units"

import { VotingSettings } from "./steps"
import StepsControllerContext from "context/StepsControllerContext"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import { ChangeVotingSettingsContext } from "context/govPool/proposals/validators/ChangeVotingSettingsContext"
import CreateDaoProposalGeneralForm from "forms/CreateDaoProposalGeneralForm"
import { useGovPoolCreateValidatorInternalProposal } from "hooks/dao"
import { hideTapBar, showTabBar } from "state/application/actions"

import * as S from "./styled"

enum STEPS {
  votingSettings = "votingSettings",
  basicInfo = "basicInfo",
}

const CreateGovProposalValidatorChangeVotingSettingsForm: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { daoAddress } = useParams<"daoAddress">()
  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.votingSettings)
  const { proposalName, proposalDescription } = useContext(
    GovProposalCreatingContext
  )
  const { duration, quorum, initialForm } = useContext(
    ChangeVotingSettingsContext
  )

  useEffect(() => {
    dispatch(hideTapBar())

    return () => {
      dispatch(showTabBar())
    }
  }, [dispatch])

  const createProposal = useGovPoolCreateValidatorInternalProposal({
    daoAddress: daoAddress ?? "",
  })

  const totalStepsCount = useMemo(() => Object.values(STEPS).length, [])
  const currentStepNumber = useMemo(
    () => Object.values(STEPS).indexOf(currentStep) + 1,
    [currentStep]
  )

  const handleCreateProposal = useCallback(() => {
    const durationChanged = initialForm.duration !== duration.get
    const quorumChanged = initialForm.quorum !== quorum.get

    let internalProposalType = 0
    const values: (number | string)[] = []

    if (durationChanged && quorumChanged) {
      internalProposalType = 2
      values.push(duration.get, parseUnits(String(quorum.get), 25).toString())
    } else if (durationChanged) {
      internalProposalType = 0
      values.push(duration.get)
    } else if (quorumChanged) {
      internalProposalType = 1
      values.push(parseUnits(String(quorum.get), 25).toString())
    }

    createProposal({
      internalProposalType: internalProposalType,
      values,
      users: [],
      proposalName: proposalName.get,
      proposalDescription: proposalDescription.get,
    })
  }, [
    createProposal,
    proposalName,
    proposalDescription,
    initialForm,
    duration,
    quorum,
  ])

  const handlePrevStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.votingSettings: {
        if (daoAddress) {
          navigate(`/dao/${daoAddress}/create-validator-proposal`)
        }
        break
      }
      case STEPS.basicInfo: {
        setCurrentStep(STEPS.votingSettings)
        break
      }
      default:
        break
    }
  }, [navigate, daoAddress, setCurrentStep, currentStep])

  const handleNextStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.votingSettings: {
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
        {currentStep === STEPS.votingSettings && (
          <S.StepsContainer>
            <VotingSettings />
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

export default CreateGovProposalValidatorChangeVotingSettingsForm
