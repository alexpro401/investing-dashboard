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

import CreateDaoProposalGeneralForm from "forms/CreateDaoProposalGeneralForm"
import { DefaultProposalStep } from "common"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import { GovPoolFormContext } from "context/govPool/GovPoolFormContext"
import {
  useGovPoolCreateProposalChangeSettings,
  useGovPoolExecutorToSettings,
} from "hooks/dao"
import { hideTapBar, showTabBar } from "state/application/actions"
import { useBreakpoints } from "hooks"

import * as S from "common/FormSteps/styled"

enum STEPS {
  customSettings = "customSettings",
  basicInfo = "basicInfo",
}

const STEPS_TITLES: Record<STEPS, string> = {
  [STEPS.customSettings]: "Change custom settings",
  [STEPS.basicInfo]: "Basic Info",
}

const CreateDaoProposalChangeCustomSettingsForm: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { daoAddress, executorAddress } = useParams<
    "daoAddress" | "executorAddress"
  >()
  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.customSettings)
  const { defaultProposalSettingForm } = useContext(GovPoolFormContext)
  const { proposalName, proposalDescription } = useContext(
    GovProposalCreatingContext
  )

  const { isMobile } = useBreakpoints()

  useEffect(() => {
    dispatch(hideTapBar())

    return () => {
      dispatch(showTabBar())
    }
  }, [dispatch])

  const createProposal = useGovPoolCreateProposalChangeSettings({
    daoPoolAddress: daoAddress ?? "",
  })
  const [settingId] = useGovPoolExecutorToSettings(daoAddress, executorAddress)

  const totalStepsCount = useMemo(() => Object.values(STEPS).length + 1, [])
  const currentStepNumber = useMemo(
    () => Object.values(STEPS).indexOf(currentStep) + 2,
    [currentStep]
  )

  const handleCreateProposal = useCallback(() => {
    if (!settingId) return

    const {
      earlyCompletion,
      delegatedVotingAllowed,
      validatorsVote,
      duration,
      quorum,
      minVotesForVoting,
      minVotesForCreating,
      rewardToken,
      creationReward,
      executionReward,
      voteRewardsCoefficient,
      executorDescription,
      durationValidators,
      quorumValidators,
    } = defaultProposalSettingForm

    createProposal({
      proposalInfo: {
        proposalName: proposalName.get,
        proposalDescription: proposalDescription.get,
      },
      settingId,
      setting: {
        earlyCompletion: earlyCompletion.get,
        delegatedVotingAllowed: delegatedVotingAllowed.get,
        validatorsVote: validatorsVote.get,
        duration: duration.get,
        quorum: quorum.get,
        minVotesForVoting: minVotesForVoting.get,
        minVotesForCreating: minVotesForCreating.get,
        rewardToken: rewardToken.get,
        creationReward: creationReward.get,
        executionReward: executionReward.get,
        voteRewardsCoefficient: voteRewardsCoefficient.get,
        executorDescription: executorDescription.get,
        durationValidators: durationValidators.get,
        quorumValidators: quorumValidators.get,
      },
    })
  }, [
    createProposal,
    proposalName,
    proposalDescription,
    defaultProposalSettingForm,
    settingId,
  ])

  const handlePrevStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.customSettings: {
        if (daoAddress) {
          navigate(`/dao/${daoAddress}/create-proposal/change-voting-settings`)
        }
        break
      }
      case STEPS.basicInfo: {
        setCurrentStep(STEPS.customSettings)
        break
      }
      default:
        break
    }
  }, [currentStep, daoAddress, navigate])

  const handleNextStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.customSettings: {
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
          {currentStep === STEPS.customSettings && (
            <S.StepsContainer>
              <DefaultProposalStep isCreatingProposal />
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
              steps={[{ number: 0, title: "Select proposal type" }].concat(
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

export default CreateDaoProposalChangeCustomSettingsForm
