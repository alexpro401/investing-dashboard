import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import Header from "components/Header/Layout"
import TutorialCard from "components/TutorialCard"
import { SelectableCard, Icon, Collapse } from "common"
import { ICON_NAMES } from "constants/icon-names"

import tutorialImageSrc from "assets/others/create-fund-docs.png"
import * as S from "./styled"
import { usePoolFactoryContract } from "contracts"
import { parseEther, parseUnits } from "@ethersproject/units"

enum EProposalType {
  daoProfileModification = "daoProfileModification",
  chaningVotingSettings = "chaningVotingSettings",
  tokenDistribution = "tokenDistribution",
  validatorSettings = "validatorSettings",
  changeTokenPrice = "changeTokenPrice",
}

interface IProposalType {
  type: EProposalType
  iconName: ICON_NAMES
  title: string
  description: JSX.Element
  guide?: JSX.Element
}

const CreateProposalSelectType: React.FC = () => {
  const navigate = useNavigate()
  const [selectedProposalType, setSelectedProposalType] =
    useState<EProposalType>(EProposalType.daoProfileModification)

  const factory = usePoolFactoryContract()

  const createPool = async () => {
    if (!factory) return

    console.log(factory)

    const OWNER = "0x8eFf9Efd56581bb5B8Ac5F5220faB9A7349160e3"
    const ZERO = "0x0000000000000000000000000000000000000000"
    const POOL_PARAMETERS = {
      settingsParams: {
        internalProposalSettings: {
          earlyCompletion: true,
          delegatedVotingAllowed: true,
          validatorsVote: false,
          duration: 500,
          durationValidators: 600,
          quorum: parseUnits("51", 25),
          quorumValidators: parseUnits("61", 25),
          minVotesForVoting: parseEther("10"),
          minVotesForCreating: parseEther("5"),
          rewardToken: ZERO,
          creationReward: 0,
          executionReward: 0,
          voteRewardsCoefficient: 0,
          executorDescription: "internal",
        },
        distributionProposalSettings: {
          earlyCompletion: false,
          delegatedVotingAllowed: false,
          validatorsVote: false,
          duration: 500,
          durationValidators: 600,
          quorum: parseUnits("51", 25),
          quorumValidators: parseUnits("61", 25),
          minVotesForVoting: parseEther("10"),
          minVotesForCreating: parseEther("5"),
          rewardToken: ZERO,
          creationReward: 0,
          executionReward: 0,
          voteRewardsCoefficient: 0,
          executorDescription: "DP",
        },
        validatorsBalancesSettings: {
          earlyCompletion: true,
          delegatedVotingAllowed: false,
          validatorsVote: true,
          duration: 500,
          durationValidators: 600,
          quorum: parseUnits("51", 25),
          quorumValidators: parseUnits("61", 25),
          minVotesForVoting: parseEther("10"),
          minVotesForCreating: parseEther("5"),
          rewardToken: ZERO,
          creationReward: 0,
          executionReward: 0,
          voteRewardsCoefficient: 0,
          executorDescription: "validators",
        },
        defaultProposalSettings: {
          earlyCompletion: false,
          delegatedVotingAllowed: true,
          validatorsVote: true,
          duration: 700,
          durationValidators: 800,
          quorum: parseUnits("71", 25),
          quorumValidators: parseUnits("100", 25),
          minVotesForVoting: parseEther("20"),
          minVotesForCreating: parseEther("5"),
          rewardToken: ZERO,
          creationReward: 0,
          executionReward: 0,
          voteRewardsCoefficient: 0,
          executorDescription: "default",
        },
      },
      validatorsParams: {
        name: "Validator Token",
        symbol: "VT",
        duration: 500,
        quorum: parseUnits("51", 25),
        validators: [OWNER],
        balances: [parseEther("100")],
      },
      userKeeperParams: {
        tokenAddress: "0x8a9424745056eb399fd19a0ec26a14316684e274",
        nftAddress: ZERO,
        totalPowerInTokens: parseEther("33000"),
        nftsTotalSupply: 33,
      },
      descriptionURL: "example.com",
    }

    try {
      const response = await factory.deployGovPool(POOL_PARAMETERS)

      console.log(response)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    createPool()
  }, [factory])

  const proceedToNextStep = useCallback(() => {
    //TODO NAVIGATE to path related to selected proposal type
    const nextProposalTypePath = {
      [EProposalType.daoProfileModification]: "/",
      [EProposalType.chaningVotingSettings]: "/",
      [EProposalType.tokenDistribution]: "/",
      [EProposalType.validatorSettings]: "/",
      [EProposalType.changeTokenPrice]: "/",
    }[selectedProposalType]

    navigate(nextProposalTypePath)
  }, [navigate, selectedProposalType])

  const proposalTypes = useMemo<IProposalType[]>(
    () => [
      {
        type: EProposalType.daoProfileModification,
        title: "DAO profile modification",
        description: (
          <>
            <p>
              Change DAO name, description, social links, and profile picture.
            </p>
          </>
        ),
        iconName: ICON_NAMES.fileDock,
      },
      {
        type: EProposalType.chaningVotingSettings,
        title: "Changing voting settings",
        description: (
          <>
            <p>
              Change the settings of proposals on voting, delegation, rewards,
              etc.
            </p>
          </>
        ),
        iconName: ICON_NAMES.fileDock,
      },
      {
        type: EProposalType.tokenDistribution,
        title: "Token distribution",
        description: (
          <>
            <p>
              Create proposals to distribute DAO treasury tokens: airdrops,
              rewards, etc.
            </p>
          </>
        ),
        guide: (
          <>
            <S.ProposalTypeGuideItem>
              Create proposals to distribute DAO treasury tokens: airdrops,
              rewards, etc.
            </S.ProposalTypeGuideItem>
            <S.ProposalTypeGuideItem>
              For example, you want to distribute all the assets earned by your
              DAO in this quarter among all DAO members. Indicate the asset and
              how much to distribute. Once the proposal passes, all who voted
              can claim their share of the distribution proportionate to how
              many tokens they voted with.
            </S.ProposalTypeGuideItem>
          </>
        ),
        iconName: ICON_NAMES.dollarOutline,
      },
      {
        type: EProposalType.validatorSettings,
        title: "Validator settings",
        description: (
          <>
            <p>Configure validators and validator voting.</p>
          </>
        ),
        iconName: ICON_NAMES.users,
      },
      {
        type: EProposalType.changeTokenPrice,
        title: "Change token price",
        description: (
          <>
            <p>Adjust the sales price of your token.</p>
          </>
        ),
        iconName: ICON_NAMES.dollarOutline,
      },
    ],
    []
  )

  return (
    <>
      <Header>Create proposal</Header>
      <S.CreateProposalSelectTypePageHolder
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <S.CreateProposalSelectTypeContent>
          <TutorialCard
            text={"Shape your DAO with your best ideas."}
            linkText={"Read the tutorial"}
            imageSrc={tutorialImageSrc}
            href={"https://github.com/"}
          />
          <S.CreateProposalSelectTypeHeader>
            <S.CreateProposalSelectTypeTitle>
              Choose type of proposal
            </S.CreateProposalSelectTypeTitle>
            {/* TODO redirect to create custom proposal page */}
            <S.CreateProposalSelectTypeCreateNew to="/">
              + Create new
            </S.CreateProposalSelectTypeCreateNew>
          </S.CreateProposalSelectTypeHeader>
          {proposalTypes.map(
            ({ description, guide, iconName, title, type }) => {
              return (
                <SelectableCard
                  key={type}
                  value={selectedProposalType}
                  setValue={setSelectedProposalType}
                  valueToSet={type}
                  headNodeLeft={<Icon name={iconName} />}
                  title={title}
                  description={description}
                >
                  {guide && (
                    <Collapse isOpen={selectedProposalType === type}>
                      <S.ProposalTypeGuide>{guide}</S.ProposalTypeGuide>
                    </Collapse>
                  )}
                </SelectableCard>
              )
            }
          )}
          <S.CreateProposalSelectTypeSubmitButton
            type="button"
            size="large"
            onClick={proceedToNextStep}
            text={"Start creating proposal"}
          />
        </S.CreateProposalSelectTypeContent>
      </S.CreateProposalSelectTypePageHolder>
    </>
  )
}

export default CreateProposalSelectType
