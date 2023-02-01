import React, { useMemo, useState, useCallback, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { uniqBy } from "lodash"

import {
  Card,
  CardHead,
  CardDescription,
  SelectableCard,
  CreateDaoCardStepNumber,
  Headline1,
  RegularText,
} from "common"
import FormStepsLoaderWrapper from "common/FormSteps/FormStepsLoaderWrapper"
import RadioButton from "components/RadioButton"
import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import { useGovPoolCustomExecutors } from "hooks/dao"
import { useBreakpoints } from "hooks"
import Skeleton from "components/Skeleton"
import theme, { Flex } from "theme"
import { hideTapBar, showTabBar } from "state/application/actions"

import * as S from "./styled"
import * as SForms from "common/FormSteps/styled"

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

  const { isMobile } = useBreakpoints()

  useEffect(() => {
    dispatch(hideTapBar())

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
    <SForms.StepsFormContainer
      totalStepsAmount={3}
      currentStepNumber={1}
      prevCb={handlePrevStep}
      nextCb={handleNextStep}
    >
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation
        daoPoolAddress={daoAddress ?? ""}
        loader={
          <FormStepsLoaderWrapper>
            <S.SkeletonLoader>
              {!isMobile && (
                <>
                  <Skeleton variant={"text"} w={"300px"} h={"40px"} />
                  <Skeleton variant={"text"} w={"400px"} h={"20px"} />
                </>
              )}
              {isMobile && (
                <Skeleton variant={"rect"} w={"calc(100%)"} h={"80px"} />
              )}
              <Skeleton variant={"rect"} w={"calc(100%)"} h={"80px"} />
              <Skeleton variant={"rect"} w={"calc(100%)"} h={"80px"} />
              <Skeleton variant={"rect"} w={"calc(100%)"} h={"80px"} />
            </S.SkeletonLoader>
          </FormStepsLoaderWrapper>
        }
      >
        <SForms.StepsWrapper>
          <SForms.StepsContainer>
            <S.PageHolder>
              <S.PageContent>
                {isMobile ? (
                  <Card>
                    <CardHead
                      nodeLeft={<CreateDaoCardStepNumber number={1} />}
                      title="What do you want to change? "
                    />
                    <CardDescription>
                      <p>Choose the setting you want to change.</p>
                    </CardDescription>
                  </Card>
                ) : (
                  <S.DesktopHeaderWrp>
                    <Headline1
                      color={theme.statusColors.info}
                      desktopWeight={900}
                    >
                      What do you want to change?
                    </Headline1>
                    <RegularText
                      color={theme.textColors.secondary}
                      desktopWeight={500}
                      desktopSize={"14px"}
                    >
                      Choose the settings you want to change
                    </RegularText>
                  </S.DesktopHeaderWrp>
                )}
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
                    <S.SkeletonCard variant={"rect"} w={"100%"} h={"80px"} />
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
                <SForms.FormStepsNavigationWrp />
              </S.PageContent>
            </S.PageHolder>
          </SForms.StepsContainer>
          {!isMobile && (
            <SForms.SideStepsNavigationBarWrp
              title={"Create proposal"}
              steps={[
                {
                  number: 1,
                  title: "Select proposal type",
                },
                {
                  number: 2,
                  title: "Change voting settings",
                },
                {
                  number: 3,
                  title: "Basic info",
                },
              ]}
              currentStep={1}
            />
          )}
        </SForms.StepsWrapper>
      </WithGovPoolAddressValidation>
    </SForms.StepsFormContainer>
  )
}

export default CreateDaoProposalChangeVotingSettings
