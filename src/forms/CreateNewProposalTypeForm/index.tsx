import React, { useState, useMemo, useCallback, useContext } from "react"
import { AnimatePresence } from "framer-motion"
import { useNavigate, useParams } from "react-router-dom"

import StepsControllerContext from "context/StepsControllerContext"
import CreateDaoProposalGeneralForm from "forms/CreateDaoProposalGeneralForm"
import { DefaultProposalStep } from "common"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import { FundDaoCreatingContext } from "context/FundDaoCreatingContext"
import { createCustomProposalTypeContext } from "context/govPool/proposals/regular/CreateCustomProposalType"
import { useGovPoolCreateProposalType } from "hooks/dao"
import { ExecutorsStep } from "./steps"

import * as S from "./styled"

enum STEPS {
  generalVotingSettings = "generalVotingSettings",
  executors = "executors",
  basicInfo = "basicInfo",
}

const CreateNewProposalTypeForm: React.FC = () => {
  const navigate = useNavigate()
  const { daoAddress } = useParams<"daoAddress">()
  const createDaoProposalType = useGovPoolCreateProposalType({
    daoPoolAddress: daoAddress ?? "",
  })

  const daoProposalCreatingInfo = useContext(GovProposalCreatingContext)
  const firstStepSettings = useContext(FundDaoCreatingContext)
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
    <StepsControllerContext
      totalStepsAmount={totalStepsCount}
      currentStepNumber={currentStepNumber}
      prevCb={handlePrevStep}
      nextCb={handleNextStep}
    >
      <AnimatePresence>
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
      </AnimatePresence>
    </StepsControllerContext>
  )
}

export default CreateNewProposalTypeForm
