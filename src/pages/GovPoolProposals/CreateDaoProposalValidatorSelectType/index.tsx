import React, { useCallback, useState, useMemo } from "react"
import { useParams, useNavigate, generatePath } from "react-router-dom"

import Header from "components/Header/Layout"
import TutorialCard from "components/TutorialCard"
import WithUserIsDaoValidatorValidation from "components/WithUserIsDaoValidatorValidation"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import { ICON_NAMES, ROUTE_PATHS } from "consts"
import { SelectableCard, Icon, Headline1, RegularText } from "common"
import Skeleton from "components/Skeleton"
import theme, { Flex } from "theme"
import { useBreakpoints } from "hooks"

import tutorialImageSrc from "assets/others/create-fund-docs.png"
import * as S from "./styled"

enum EValidatorProposalType {
  validatorSettings = "validatorSettings",
  votingSettings = "votingSettings",
}

interface IProposalType {
  type: EValidatorProposalType
  iconName: ICON_NAMES
  title: string
  description: React.ReactNode
}

const CreateDaoProposalValidatorSelectType: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()
  const navigate = useNavigate()
  const { isMobile } = useBreakpoints()
  const [selectedValidatorProposalType, setSelectedValidatorProposalType] =
    useState<EValidatorProposalType>(EValidatorProposalType.validatorSettings)

  const proceedToNextStep = useCallback(() => {
    const nextProposalTypePath = {
      [EValidatorProposalType.validatorSettings]: generatePath(
        ROUTE_PATHS.daoProposalCreateInternalValidatorsSettings,
        { daoAddress: daoAddress! }
      ),
      [EValidatorProposalType.votingSettings]: generatePath(
        ROUTE_PATHS.daoProposalCreateInternalValidatorsVotingSettings,
        { daoAddress: daoAddress! }
      ),
    }[selectedValidatorProposalType]

    navigate(nextProposalTypePath)
  }, [navigate, selectedValidatorProposalType, daoAddress])

  const proposalTypes = useMemo<IProposalType[]>(
    () => [
      {
        type: EValidatorProposalType.validatorSettings,
        title: "Validator settings",
        description: (
          <>
            <p>Configure validators and validator voting.</p>
            <p>
              Add/remove validators, adjust voting power, and change quorum and
              voting length parameters.
            </p>
          </>
        ),
        iconName: ICON_NAMES.users,
      },
      {
        type: EValidatorProposalType.votingSettings,
        title: "Voting settings",
        description: (
          <>
            <p>
              Change the quorum and voting length settings for validator voting.
            </p>
          </>
        ),
        iconName: ICON_NAMES.cog,
      },
    ],
    []
  )

  const loader = useMemo(
    () => (
      <S.PageHolder>
        <S.PageContent>
          <S.SkeletonLoader>
            {!isMobile && (
              <>
                <Skeleton variant={"rect"} w={"300px"} h={"40px"} />
                <Skeleton variant={"rect"} w={"400px"} h={"20px"} />
              </>
            )}
            {isMobile && (
              <Skeleton variant={"rect"} w={"calc(100%)"} h={"80px"} />
            )}
            <Skeleton variant={"rect"} w={"calc(100%)"} h={"80px"} />
            <Skeleton variant={"rect"} w={"calc(100%)"} h={"80px"} />
          </S.SkeletonLoader>
        </S.PageContent>
      </S.PageHolder>
    ),
    [isMobile]
  )

  return (
    <>
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation
        daoPoolAddress={daoAddress ?? ""}
        loader={loader}
      >
        <WithUserIsDaoValidatorValidation
          daoPoolAddress={daoAddress ?? ""}
          loader={loader}
        >
          <S.PageHolder>
            <S.PageContent>
              {isMobile && (
                <TutorialCard
                  text={"Shape your DAO with your best ideas."}
                  linkText={"Read the tutorial"}
                  imageSrc={tutorialImageSrc}
                  href={"https://github.com/"}
                />
              )}
              {!isMobile && (
                <S.HeaderWrp>
                  <Headline1
                    color={theme.statusColors.info}
                    desktopWeight={900}
                  >
                    Choose type of proposal for validators
                  </Headline1>
                  <RegularText
                    color={theme.textColors.secondary}
                    desktopWeight={500}
                    desktopSize={"14px"}
                  >
                    тут знаходиться тестовий текст
                  </RegularText>
                </S.HeaderWrp>
              )}
              {proposalTypes.map(({ description, iconName, title, type }) => {
                return (
                  <SelectableCard
                    key={type}
                    value={selectedValidatorProposalType}
                    setValue={setSelectedValidatorProposalType}
                    valueToSet={type}
                    headNodeLeft={<Icon name={iconName} />}
                    title={title}
                    description={description}
                  />
                )
              })}
              <S.SubmitButton
                type="button"
                size="large"
                onClick={proceedToNextStep}
                text={"Start creating proposal"}
              />
            </S.PageContent>
          </S.PageHolder>
        </WithUserIsDaoValidatorValidation>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default CreateDaoProposalValidatorSelectType
