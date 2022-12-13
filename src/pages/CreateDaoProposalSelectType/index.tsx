import React, { useCallback, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { uniqBy } from "lodash"

import Header from "components/Header/Layout"
import TutorialCard from "components/TutorialCard"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import { SelectableCard, Icon, Collapse } from "common"
import { ICON_NAMES } from "constants/icon-names"
import { useGovPoolCustomExecutors } from "hooks/dao"
import Skeleton from "components/Skeleton"
import { Flex } from "theme"

import tutorialImageSrc from "assets/others/create-fund-docs.png"
import * as S from "./styled"

enum EProposalType {
  daoProfileModification = "daoProfileModification",
  changingVotingSettings = "changingVotingSettings",
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

interface ISelectedCard {
  type: "default" | "custom"
  specification?: EProposalType
  executorAddress?: string
}

const CreateProposalSelectType: React.FC = () => {
  const navigate = useNavigate()
  const { daoAddress } = useParams<"daoAddress">()
  const [selectedCard, setSelectedCard] = useState<ISelectedCard>({
    type: "default",
    specification: EProposalType.daoProfileModification,
  })
  const [customExecutors, customExecutorsLoading] =
    useGovPoolCustomExecutors(daoAddress)

  const customExecutorsFiltered = useMemo(() => {
    return uniqBy(customExecutors, "settings.settingsId")
  }, [customExecutors])

  const proceedToNextStep = useCallback(async () => {
    //TODO NAVIGATE to path related to selected proposal type
    if (selectedCard.type === "default" && selectedCard.specification) {
      const slug = `/dao/${daoAddress}/create-proposal`

      const nextProposalTypePath = {
        [EProposalType.daoProfileModification]: "/change-dao-settings",
        [EProposalType.changingVotingSettings]: "/change-voting-settings",
        [EProposalType.tokenDistribution]: "/token-distribution",
        [EProposalType.validatorSettings]: "/validator-settings",
        [EProposalType.changeTokenPrice]: "/",
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

  const defaultProposalTypes = useMemo<IProposalType[]>(
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
    ],
    []
  )

  const handleSelectDefaultVotingType = useCallback(
    (specification: EProposalType): void => {
      setSelectedCard({ type: "default", specification })
    },
    []
  )

  const handleSelectCustomProposal = useCallback((executorAddress: string) => {
    setSelectedCard({ type: "custom", executorAddress })
  }, [])

  return (
    <>
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
              <S.CreateProposalSelectTypeCreateNew
                to={`/dao/${daoAddress}/create-proposal/custom`}
              >
                + Create new
              </S.CreateProposalSelectTypeCreateNew>
            </S.CreateProposalSelectTypeHeader>
            {defaultProposalTypes.map(
              ({ description, guide, iconName, title, type }) => {
                return (
                  <SelectableCard
                    key={type}
                    value={selectedCard?.specification as EProposalType}
                    setValue={handleSelectDefaultVotingType}
                    valueToSet={type}
                    headNodeLeft={<Icon name={iconName} />}
                    title={title}
                    description={description}
                  >
                    {guide && (
                      <Collapse isOpen={selectedCard?.specification === type}>
                        <S.ProposalTypeGuide>{guide}</S.ProposalTypeGuide>
                      </Collapse>
                    )}
                  </SelectableCard>
                )
              }
            )}
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
                      title={proposalName}
                      description={proposalDescription}
                    />
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
      </WithGovPoolAddressValidation>
    </>
  )
}

export default CreateProposalSelectType
