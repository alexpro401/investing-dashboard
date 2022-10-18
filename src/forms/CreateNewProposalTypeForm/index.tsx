import React, { useState, useMemo, useCallback, useContext } from "react"
import { AnimatePresence } from "framer-motion"
import { useNavigate, useParams } from "react-router-dom"

import StepsControllerContext from "context/StepsControllerContext"
import CreateDaoProposalGeneralForm from "forms/CreateDaoProposalGeneralForm"
import { DefaultProposalStep } from "forms/CreateFundDaoForm/steps"
import { DaoProposalCreatingContext } from "context/DaoProposalCreatingContext"
import { FundDaoCreatingContext } from "context/FundDaoCreatingContext"
import useCreateDaoProposalType from "hooks/useCreateDaoProposalType"

import * as S from "./styled"

enum STEPS {
  generalVotingSettings = "generalVotingSettings",
  basicInfo = "basicInfo",
}

const CreateNewProposalTypeForm: React.FC = () => {
  const navigate = useNavigate()
  const { daoAddress } = useParams<"daoAddress">()
  const createDaoProposalType = useCreateDaoProposalType({
    daoPoolAddress: daoAddress ?? "",
  })

  const daoProposalCreatingInfo = useContext(DaoProposalCreatingContext)
  const firstStepSettings = useContext(FundDaoCreatingContext)

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
      contractAddress,
      proposalDescription,
      proposalName,
      proposalTypeName,
      proposalTypeDescription,
    } = daoProposalCreatingInfo

    const {
      defaultProposalSettingForm: {
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
      },
    } = firstStepSettings

    createDaoProposalType({
      proposalInfo: {
        contractAddress: contractAddress.get,
        proposalDescription: proposalDescription.get,
        proposalName: proposalName.get,
        proposalTypeName: proposalTypeName.get,
        proposalTypeDescription: proposalTypeDescription.get,
      },
      proposalSettings: {
        earlyCompletion: earlyCompletion.get,
        delegatedVotingAllowed: delegatedVotingAllowed.get,
        duration: duration.get,
        quorum: quorum.get,
        minVotesForVoting: minVotesForVoting.get,
        minVotesForCreating: minVotesForCreating.get,
        rewardToken: rewardToken.get,
        creationReward: creationReward.get,
        executionReward: executionReward.get,
        voteRewardsCoefficient: voteRewardsCoefficient.get,
      },
    })
  }, [createDaoProposalType, daoProposalCreatingInfo, firstStepSettings])

  const handlePrevStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.generalVotingSettings: {
        if (daoAddress) {
          navigate(`/dao/${daoAddress}/create-proposal`)
        }
        break
      }
      case STEPS.basicInfo: {
        setCurrentStep(STEPS.generalVotingSettings)
        break
      }
      default:
        break
    }
  }, [currentStep, daoAddress, navigate])

  const handleNextStep = useCallback(() => {
    switch (currentStep) {
      case STEPS.generalVotingSettings: {
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
            <DefaultProposalStep />
          </S.StepsContainer>
        )}
        {currentStep === STEPS.basicInfo && (
          <S.StepsContainer>
            <CreateDaoProposalGeneralForm
              withContractName
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
