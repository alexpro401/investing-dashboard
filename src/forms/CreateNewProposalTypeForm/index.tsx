import React, {
  useState,
  useMemo,
  useCallback,
  useContext,
  useEffect,
} from "react"
import { AnimatePresence } from "framer-motion"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch } from "react-redux"

import CreateDaoProposalGeneralForm from "forms/CreateDaoProposalGeneralForm"
import { DefaultProposalStep } from "common"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import { GovPoolFormContext } from "context/govPool/GovPoolFormContext"
import { createCustomProposalTypeContext } from "context/govPool/proposals/regular/CreateCustomProposalType"
import { useBreakpoints } from "hooks"
import { useGovPoolCreateProposalType } from "hooks/dao"
import { ExecutorsStep } from "./steps"
import { hideTapBar, showTabBar } from "state/application/actions"

import * as S from "common/FormSteps/styled"

enum STEPS {
  generalVotingSettings = "generalVotingSettings",
  executors = "executors",
  basicInfo = "basicInfo",
}

const STEPS_TITLES: Record<STEPS, string> = {
  [STEPS.generalVotingSettings]: "Setup custom voting settings",
  [STEPS.executors]: "Executors",
  [STEPS.basicInfo]: "Basic info",
}

const CreateNewProposalTypeForm: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { daoAddress } = useParams<"daoAddress">()
  const { isMobile } = useBreakpoints()
  const createDaoProposalType = useGovPoolCreateProposalType({
    daoPoolAddress: daoAddress ?? "",
  })

  useEffect(() => {
    dispatch(hideTapBar())

    return () => {
      dispatch(showTabBar())
    }
  }, [dispatch])

  const daoProposalCreatingInfo = useContext(GovProposalCreatingContext)
  const firstStepSettings = useContext(GovPoolFormContext)
  const { executorAddresses } = useContext(createCustomProposalTypeContext)

  const [currentStep, setCurrentStep] = useState<STEPS>(
    STEPS.generalVotingSettings
  )

  const totalStepsCount = useMemo(() => Object.values(STEPS).length, [])
  const currentStepNumber = useMemo(
    () => Object.values(STEPS).indexOf(currentStep) + 1,
    [currentStep]
  )

  const handleCreateDaoProposalType = useCallback(() => {
    const {
      proposalDescription,
      proposalName,
      proposalTypeName,
      proposalTypeDescription,
    } = daoProposalCreatingInfo

    const {
      defaultProposalSettingForm: {
        validatorsVote,
        earlyCompletion,
        delegatedVotingAllowed,
        duration,
        quorum,
        minVotesForVoting,
        minVotesForCreating,
        rewardToken,
        creationReward,
        executionReward,
        voteRewardsCoefficient,
        durationValidators,
        quorumValidators,
      },
    } = firstStepSettings

    createDaoProposalType({
      proposalInfo: {
        executors: executorAddresses.get.map((el) => el.address),
        proposalDescription: proposalDescription.get,
        proposalName: proposalName.get,
        proposalTypeName: proposalTypeName.get,
        proposalTypeDescription: proposalTypeDescription.get,
      },
      proposalSettings: {
        earlyCompletion: earlyCompletion.get,
        delegatedVotingAllowed: delegatedVotingAllowed.get,
        validatorsVote: validatorsVote.get,
        duration: duration.get,
        durationValidators: durationValidators.get,
        quorum: quorum.get,
        quorumValidators: quorumValidators.get,
        minVotesForVoting: minVotesForVoting.get,
        minVotesForCreating: minVotesForCreating.get,
        rewardToken: rewardToken.get,
        creationReward: creationReward.get,
        executionReward: executionReward.get,
        voteRewardsCoefficient: voteRewardsCoefficient.get,
      },
    })
  }, [
    createDaoProposalType,
    daoProposalCreatingInfo,
    firstStepSettings,
    executorAddresses,
  ])

  const handlePrevStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.generalVotingSettings: {
        if (daoAddress) {
          navigate(`/dao/${daoAddress}/create-proposal`)
        }
        break
      }
      case STEPS.executors: {
        setCurrentStep(STEPS.generalVotingSettings)
        break
      }
      case STEPS.basicInfo: {
        setCurrentStep(STEPS.executors)
        break
      }
      default:
        break
    }
  }, [currentStep, daoAddress, navigate])

  const handleNextStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.generalVotingSettings: {
        setCurrentStep(STEPS.executors)
        break
      }
      case STEPS.executors: {
        setCurrentStep(STEPS.basicInfo)
        break
      }
      case STEPS.basicInfo: {
        handleCreateDaoProposalType()
        break
      }
      default:
        break
    }
  }, [currentStep, handleCreateDaoProposalType])

  return (
    <S.StepsFormContainer
      totalStepsAmount={totalStepsCount}
      currentStepNumber={currentStepNumber}
      prevCb={handlePrevStep}
      nextCb={handleNextStep}
    >
      <AnimatePresence>
        <S.StepsWrapper>
          {currentStep === STEPS.generalVotingSettings && (
            <S.StepsContainer>
              <DefaultProposalStep isCreatingProposal />
            </S.StepsContainer>
          )}
          {currentStep === STEPS.executors && (
            <S.StepsContainer>
              <ExecutorsStep />
            </S.StepsContainer>
          )}
          {currentStep === STEPS.basicInfo && (
            <S.StepsContainer>
              <CreateDaoProposalGeneralForm
                withProposalTypeName
                withProposalTypeDescription
              />
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

export default CreateNewProposalTypeForm
