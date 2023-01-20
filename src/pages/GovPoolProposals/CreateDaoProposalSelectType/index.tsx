import React, { useCallback, useMemo, useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import { v4 as uuidv4 } from "uuid"
import { uniqBy } from "lodash"

import Header from "components/Header/Layout"
import TutorialCard from "components/TutorialCard"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import { ICON_NAMES } from "consts/icon-names"
import { SelectableCard, Icon, Collapse, Headline1, RegularText } from "common"
import { useBreakpoints } from "hooks"
import { useGovPoolCustomExecutors } from "hooks/dao"
import theme from "theme"
import { SkeletonGlobalLoader, SkeletonCustomProposals } from "./components"
import { hideTapBar, showTabBar } from "state/application/actions"

import tutorialImageSrc from "assets/others/create-fund-docs.png"
import * as S from "./styled"
import * as SForms from "common/FormSteps/styled"

enum EProposalType {
  daoProfileModification = "daoProfileModification",
  changingVotingSettings = "changingVotingSettings",
  tokenDistribution = "tokenDistribution",
  validatorSettings = "validatorSettings",
  changeTokenPrice = "changeTokenPrice",
  tokenSale = "tokenSale",
  createNew = "createNew",
}

interface IProposalType {
  type: EProposalType
  iconName: ICON_NAMES
  title: string
  description: JSX.Element
  guide?: JSX.Element
}

interface ISelectedCard {
  type: "default" | "custom"
  specification?: EProposalType
  executorAddress?: string
}

const CreateProposalSelectType: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { daoAddress } = useParams<"daoAddress">()
  const [selectedCard, setSelectedCard] = useState<ISelectedCard>({
    type: "default",
    specification: EProposalType.daoProfileModification,
  })
  const { isMobile } = useBreakpoints()
  const [customExecutors, customExecutorsLoading] =
    useGovPoolCustomExecutors(daoAddress)

  const customExecutorsFiltered = useMemo(() => {
    return uniqBy(customExecutors, "settings.settingsId")
  }, [customExecutors])

  useEffect(() => {
    dispatch(hideTapBar())

    return () => {
      dispatch(showTabBar())
    }
  }, [dispatch])

  const handleNextStep = useCallback(() => {
    if (selectedCard.type === "default" && selectedCard.specification) {
      const slug = `/dao/${daoAddress}/create-proposal`

      const nextProposalTypePath = {
        [EProposalType.daoProfileModification]: "/change-dao-settings",
        [EProposalType.changingVotingSettings]: "/change-voting-settings",
        [EProposalType.tokenDistribution]: "/token-distribution",
        [EProposalType.validatorSettings]: "/validator-settings",
        [EProposalType.changeTokenPrice]: "/",
        [EProposalType.tokenSale]: "/token-sale",
        [EProposalType.createNew]: "/custom",
      }[selectedCard.specification]

      if (nextProposalTypePath !== "/") {
        return navigate(slug + nextProposalTypePath)
      }

      return
    }

    if (selectedCard.type === "custom" && selectedCard.executorAddress) {
      navigate(
        `/dao/${daoAddress}/create-custom-proposal/${selectedCard.executorAddress}`
      )
    }
  }, [selectedCard, daoAddress, navigate])

  const defaultProposalTypes = useMemo<IProposalType[]>(() => {
    const defaultTypes = [
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
        type: EProposalType.changingVotingSettings,
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
      {
        type: EProposalType.tokenSale,
        title: "Token sale",
        description: (
          <>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
              odit commodi veritatis.
            </p>
          </>
        ),
        iconName: ICON_NAMES.dollarOutline,
      },
    ]

    if (!isMobile) {
      defaultTypes.push({
        type: EProposalType.createNew,
        title: "Create new",
        description: (
          <>
            <p>текст</p>
          </>
        ),
        iconName: ICON_NAMES.fileDock,
      })
    }

    return defaultTypes
  }, [isMobile])

  const handleSelectDefaultVotingType = useCallback(
    (specification: EProposalType): void => {
      setSelectedCard({ type: "default", specification })
    },
    []
  )

  const handleSelectCustomProposal = useCallback((executorAddress: string) => {
    setSelectedCard({ type: "custom", executorAddress })
  }, [])

  const renderDefaultProposals = useMemo(() => {
    return defaultProposalTypes.map(
      ({ description, guide, iconName, title, type }) => {
        return (
          <S.ProposalSelectableCard
            key={type}
            value={selectedCard?.specification as EProposalType}
            setValue={handleSelectDefaultVotingType}
            valueToSet={type}
            headNodeLeft={<Icon name={iconName} />}
            headNodeRight={
              guide && !isMobile ? (
                <S.ProposalTypeTooltipWrp>
                  <S.ProposalTypeTooltip id={uuidv4()}>
                    {guide}
                  </S.ProposalTypeTooltip>
                </S.ProposalTypeTooltipWrp>
              ) : undefined
            }
            title={title}
            description={description}
          >
            {guide && isMobile && (
              <Collapse isOpen={selectedCard?.specification === type}>
                <S.ProposalTypeGuide>{guide}</S.ProposalTypeGuide>
              </Collapse>
            )}
          </S.ProposalSelectableCard>
        )
      }
    )
  }, [
    defaultProposalTypes,
    handleSelectDefaultVotingType,
    selectedCard,
    isMobile,
  ])

  const renderCustomProposals = useMemo(() => {
    if (customExecutorsLoading) return <SkeletonCustomProposals />

    return customExecutorsFiltered.map(
      ({ id, proposalName, proposalDescription, executorAddress }) => {
        return (
          <SelectableCard
            key={id}
            headNodeLeft={<Icon name={ICON_NAMES.fileDock} />}
            value={selectedCard?.executorAddress as string}
            setValue={handleSelectCustomProposal}
            valueToSet={executorAddress}
            title={proposalName}
            description={proposalDescription}
          />
        )
      }
    )
  }, [
    customExecutorsLoading,
    customExecutorsFiltered,
    handleSelectCustomProposal,
    selectedCard,
  ])

  const handlePrevStep = useCallback(() => {
    navigate(`/dao/${daoAddress}`)
  }, [navigate, daoAddress])

  return (
    <SForms.StepsFormContainer
      totalStepsAmount={2}
      currentStepNumber={1}
      prevCb={handlePrevStep}
      nextCb={handleNextStep}
    >
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation
        daoPoolAddress={daoAddress ?? ""}
        loader={
          <S.PageHolder>
            <S.Content>
              <SkeletonGlobalLoader />
            </S.Content>
          </S.PageHolder>
        }
      >
        <SForms.StepsWrapper>
          <SForms.StepsContainer>
            <S.PageHolder>
              <S.Content>
                {isMobile && (
                  <>
                    <TutorialCard
                      text={"Shape your DAO with your best ideas."}
                      linkText={"Read the tutorial"}
                      imageSrc={tutorialImageSrc}
                      href={"https://github.com/"}
                    />
                    <S.HeaderWrp>
                      <S.CreateProposalSelectTypeTitle>
                        Choose type of proposal
                      </S.CreateProposalSelectTypeTitle>
                      <S.CreateProposalSelectTypeCreateNew
                        to={`/dao/${daoAddress}/create-proposal/custom`}
                      >
                        + Create new
                      </S.CreateProposalSelectTypeCreateNew>
                    </S.HeaderWrp>
                  </>
                )}
                {!isMobile && (
                  <S.DesktopHeaderWrp>
                    <Headline1
                      color={theme.statusColors.info}
                      desktopWeight={900}
                    >
                      Choose type of proposal
                    </Headline1>
                    <RegularText
                      color={theme.textColors.secondary}
                      desktopWeight={500}
                      desktopSize={"14px"}
                    >
                      тут знаходиться тестовий текст
                    </RegularText>
                  </S.DesktopHeaderWrp>
                )}
                {!isMobile && <S.BlockTitle>Шаблони пропоузалів</S.BlockTitle>}
                {isMobile && renderDefaultProposals}
                {!isMobile && (
                  <S.BlockGrid>{renderDefaultProposals}</S.BlockGrid>
                )}
                {!isMobile &&
                  (customExecutorsLoading ||
                    (!customExecutorsLoading &&
                      customExecutorsFiltered.length !== 0)) && (
                    <S.BlockTitle>Шаблони кастомних пропоузалів</S.BlockTitle>
                  )}
                {isMobile && renderCustomProposals}
                {!isMobile && (
                  <S.BlockGrid>{renderCustomProposals}</S.BlockGrid>
                )}
                <SForms.FormStepsNavigationWrp />
              </S.Content>
            </S.PageHolder>
          </SForms.StepsContainer>
          {!isMobile && (
            <SForms.SideStepsNavigationBarWrp
              title={"Create proposal"}
              steps={[
                {
                  number: 1,
                  title: "Title",
                },
                {
                  number: 2,
                  title: "Type of proposal",
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

export default CreateProposalSelectType
