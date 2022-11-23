import React, { useMemo, useState, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"

import {
  Card,
  CardHead,
  CardDescription,
  SelectableCard,
  StepsNavigation,
} from "common"
import { CreateDaoCardStepNumber } from "common"
import RadioButton from "components/RadioButton"
import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import StepsControllerContext from "context/StepsControllerContext"

import * as S from "./styled"

enum EDefaultVotingSettingsType {
  changeVotingSettings = "changeVotingSettings",
  tokenDistribution = "tokenDistribution",
}

interface IDefaultVotingSettingsType {
  type: EDefaultVotingSettingsType
  title: string
  description: React.ReactNode
}

interface ISelectedCard {
  type: "default" | "custom"
  specification?: EDefaultVotingSettingsType
}

const CreateDaoProposalChangeVotingSettings: React.FC = () => {
  const navigate = useNavigate()
  const { daoAddress } = useParams<"daoAddress">()
  const [selectedCard, setSelectedCard] = useState<ISelectedCard>({
    type: "default",
    specification: EDefaultVotingSettingsType.changeVotingSettings,
  })

  const handleSelectDefaultVotingType = useCallback(
    (specification: EDefaultVotingSettingsType): void => {
      setSelectedCard({ type: "default", specification })
    },
    []
  )

  const defaultVotingSettingsTypes = useMemo<IDefaultVotingSettingsType[]>(
    () => [
      {
        type: EDefaultVotingSettingsType.changeVotingSettings,
        title: "Global voting options",
        description: (
          <>
            <p>
              Changes to making proposals, voting, vote delegation, and rewards
            </p>
          </>
        ),
      },
      {
        type: EDefaultVotingSettingsType.tokenDistribution,
        title: "Token distribution",
        description: (
          <>
            <p>Change the settings for DAO treasury token distribution.</p>
          </>
        ),
      },
    ],
    []
  )

  const handlePrevStep = useCallback(() => {
    navigate(`/dao/${daoAddress}`)
  }, [navigate, daoAddress])

  const handleNextStep = useCallback(() => {
    if (!selectedCard) return

    if (
      selectedCard &&
      selectedCard.type === "default" &&
      selectedCard.specification
    ) {
      if (
        selectedCard.specification ===
        EDefaultVotingSettingsType.changeVotingSettings
      ) {
        return navigate(
          `/dao/${daoAddress}/create-proposal-global-voting-options`
        )
      }

      if (
        selectedCard.specification ===
        EDefaultVotingSettingsType.tokenDistribution
      ) {
        return navigate(
          `/dao/${daoAddress}/create-proposal-change-token-distribution`
        )
      }
    }

    if (selectedCard && selectedCard.type === "custom") {
      // TODO handle custom proposals
      return
    }
  }, [navigate, daoAddress, selectedCard])

  return (
    <StepsControllerContext
      totalStepsAmount={3}
      currentStepNumber={1}
      prevCb={handlePrevStep}
      nextCb={handleNextStep}
    >
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation daoPoolAddress={daoAddress ?? ""}>
        <S.PageHolder>
          <S.PageContent>
            <Card>
              <CardHead
                nodeLeft={<CreateDaoCardStepNumber number={1} />}
                title="What do you want to change? "
              />
              <CardDescription>
                <p>Choose the setting you want to change.</p>
              </CardDescription>
            </Card>
            {defaultVotingSettingsTypes.map((el) => {
              return (
                <SelectableCard
                  key={el.type}
                  value={
                    selectedCard?.specification as EDefaultVotingSettingsType
                  }
                  setValue={handleSelectDefaultVotingType}
                  valueToSet={el.type}
                  nodeLeft={
                    <RadioButton
                      selected={selectedCard?.specification ?? ""}
                      value={el.type}
                      onChange={() => {}}
                    />
                  }
                  title={el.title}
                  description={el.description}
                />
              )
            })}
            <StepsNavigation />
          </S.PageContent>
        </S.PageHolder>
      </WithGovPoolAddressValidation>
    </StepsControllerContext>
  )
}

export default CreateDaoProposalChangeVotingSettings
