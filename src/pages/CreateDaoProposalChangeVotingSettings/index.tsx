import React, { useMemo, useState, useCallback, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { createPortal } from "react-dom"
import { useDispatch } from "react-redux"
import { uniqBy } from "lodash"

import {
  Card,
  CardHead,
  CardDescription,
  SelectableCard,
  StepsNavigation,
  CreateDaoCardStepNumber,
} from "common"
import RadioButton from "components/RadioButton"
import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import StepsControllerContext from "context/StepsControllerContext"
import { useGovPoolCustomExecutors } from "hooks/dao"
import Skeleton from "components/Skeleton"
import { Flex } from "theme"
import { hideTapBar, showTabBar } from "state/application/actions"

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
  executorAddress?: string
}

const CreateDaoProposalChangeVotingSettings: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { daoAddress } = useParams<"daoAddress">()
  const [selectedCard, setSelectedCard] = useState<ISelectedCard>({
    type: "default",
    specification: EDefaultVotingSettingsType.changeVotingSettings,
  })
  const [appNavigationEl, setAppNavigationEl] = useState<Element | null>(null)

  useEffect(() => {
    dispatch(hideTapBar())
    setTimeout(() => {
      setAppNavigationEl(document.querySelector("#app-navigation"))
    }, 100)

    return () => {
      dispatch(showTabBar())
    }
  }, [dispatch])

  const [customExecutors, customExecutorsLoading] =
    useGovPoolCustomExecutors(daoAddress)

  const customExecutorsFiltered = useMemo(() => {
    return uniqBy(customExecutors, "settings.settingsId")
  }, [customExecutors])

  const handleSelectDefaultVotingType = useCallback(
    (specification: EDefaultVotingSettingsType): void => {
      setSelectedCard({ type: "default", specification })
    },
    []
  )

  const handleSelectCustomProposal = useCallback((executorAddress: string) => {
    setSelectedCard({ type: "custom", executorAddress })
  }, [])

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

    const slug = `/dao/${daoAddress}/create-proposal/change-voting-settings`

    if (selectedCard.type === "default" && selectedCard.specification) {
      if (
        selectedCard.specification ===
        EDefaultVotingSettingsType.changeVotingSettings
      ) {
        return navigate(slug + "/global-voting")
      }

      if (
        selectedCard.specification ===
        EDefaultVotingSettingsType.tokenDistribution
      ) {
        return navigate(slug + "/token-distribution")
      }
    }

    if (selectedCard.type === "custom" && selectedCard.executorAddress) {
      navigate(slug + `/custom/${selectedCard.executorAddress}`)
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
      <WithGovPoolAddressValidation
        daoPoolAddress={daoAddress ?? ""}
        loader={
          <Flex gap={"24"} full m="16px 0 0 0" dir="column" ai={"center"}>
            <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
            <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
            <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
            <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
          </Flex>
        }
      >
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
            {customExecutorsLoading && (
              <Flex gap={"24"} full dir="column" ai={"center"}>
                <Skeleton variant={"rect"} w={"100%"} h={"60px"} />
              </Flex>
            )}
            {!customExecutorsLoading &&
              customExecutorsFiltered.map(
                ({
                  id,
                  proposalName,
                  proposalDescription,
                  executorAddress,
                }) => {
                  return (
                    <SelectableCard
                      key={id}
                      value={selectedCard?.executorAddress as string}
                      setValue={handleSelectCustomProposal}
                      valueToSet={executorAddress}
                      nodeLeft={
                        <RadioButton
                          selected={selectedCard?.executorAddress ?? ""}
                          value={executorAddress}
                          onChange={() => {}}
                        />
                      }
                      title={proposalName}
                      description={proposalDescription}
                    />
                  )
                }
              )}
          </S.PageContent>
        </S.PageHolder>
        {appNavigationEl ? (
          createPortal(<StepsNavigation />, appNavigationEl)
        ) : (
          <></>
        )}
      </WithGovPoolAddressValidation>
    </StepsControllerContext>
  )
}

export default CreateDaoProposalChangeVotingSettings
