import React, { useCallback, useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"

import Header from "components/Header/Layout"
import TutorialCard from "components/TutorialCard"
import WithUserIsDaoValidatorValidation from "components/WithUserIsDaoValidatorValidation"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import { SelectableCard, Icon } from "common"
import { ICON_NAMES } from "constants/icon-names"

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
  const [selectedValidatorProposalType, setSelectedValidatorProposalType] =
    useState<EValidatorProposalType>(EValidatorProposalType.validatorSettings)

  const proceedToNextStep = useCallback(() => {
    //TODO NAVIGATE to path related to selected validator proposal type
    const nextProposalTypePath = {
      [EValidatorProposalType.validatorSettings]: "/",
      [EValidatorProposalType.votingSettings]: "/",
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

  return (
    <>
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation daoPoolAddress={daoAddress ?? ""}>
        <WithUserIsDaoValidatorValidation daoPoolAddress={daoAddress ?? ""}>
          <S.PageHolder>
            <S.PageContext>
              <TutorialCard
                text={"Shape your DAO with your best ideas."}
                linkText={"Read the tutorial"}
                imageSrc={tutorialImageSrc}
                href={"https://github.com/"}
              />
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
            </S.PageContext>
          </S.PageHolder>
        </WithUserIsDaoValidatorValidation>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default CreateDaoProposalValidatorSelectType
