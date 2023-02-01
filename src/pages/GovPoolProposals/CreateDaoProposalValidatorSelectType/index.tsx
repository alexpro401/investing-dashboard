import React, { useCallback, useState, useMemo, useEffect } from "react"
import { useParams, useNavigate, generatePath } from "react-router-dom"
import { useDispatch } from "react-redux"

import Header from "components/Header/Layout"
import TutorialCard from "components/TutorialCard"
import WithUserIsDaoValidatorValidation from "components/WithUserIsDaoValidatorValidation"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import FormStepsLoaderWrapper from "common/FormSteps/FormStepsLoaderWrapper"
import { ICON_NAMES, ROUTE_PATHS } from "consts"
import { SelectableCard, Icon, Headline1, RegularText } from "common"
import Skeleton from "components/Skeleton"
import theme from "theme"
import { hideTapBar, showTabBar } from "state/application/actions"
import { useBreakpoints } from "hooks"

import tutorialImageSrc from "assets/others/create-fund-docs.png"
import * as S from "./styled"
import * as SForms from "common/FormSteps/styled"

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
  const dispatch = useDispatch()
  const { isMobile } = useBreakpoints()
  const [selectedValidatorProposalType, setSelectedValidatorProposalType] =
    useState<EValidatorProposalType>(EValidatorProposalType.validatorSettings)

  useEffect(() => {
    dispatch(hideTapBar())

    return () => {
      dispatch(showTabBar())
    }
  }, [dispatch])

  const handleNextStep = useCallback(() => {
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

  const handlePrevStep = useCallback(() => {
    navigate(`/dao/${daoAddress}`)
  }, [navigate, daoAddress])

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
          <FormStepsLoaderWrapper>
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
          </FormStepsLoaderWrapper>
        </S.PageContent>
      </S.PageHolder>
    ),
    [isMobile]
  )

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
        loader={loader}
      >
        <WithUserIsDaoValidatorValidation
          daoPoolAddress={daoAddress ?? ""}
          loader={loader}
        >
          <SForms.StepsWrapper>
            <SForms.StepsContainer>
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
                  {proposalTypes.map(
                    ({ description, iconName, title, type }) => {
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
                    title: "Validator proposal",
                  },
                ]}
                currentStep={1}
              />
            )}
          </SForms.StepsWrapper>
        </WithUserIsDaoValidatorValidation>
      </WithGovPoolAddressValidation>
    </SForms.StepsFormContainer>
  )
}

export default CreateDaoProposalValidatorSelectType
