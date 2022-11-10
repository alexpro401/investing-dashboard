import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import Header from "components/Header/Layout"
import TutorialCard from "components/TutorialCard"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import { SelectableCard, Icon, Collapse } from "common"
import { ICON_NAMES } from "constants/icon-names"

import tutorialImageSrc from "assets/others/create-fund-docs.png"
import * as S from "./styled"

import { useGovPoolCreateProposal, useGovPoolDeposit } from "hooks/dao"
import { parseEther } from "@ethersproject/units"

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

const CreateProposalSelectType: React.FC = () => {
  const navigate = useNavigate()
  const { daoAddress } = useParams<"daoAddress">()
  const [selectedProposalType, setSelectedProposalType] = useState(
    EProposalType.daoProfileModification
  )

  const {
    createNewDaoProposalType,
    createInternalValidatorProposal,
    createInsuranceProposal,
    createInternalProposal,
    createDistributionProposal,
    createValidatorProposal,
    createCustomProposal,
  } = useGovPoolCreateProposal(daoAddress)

  const daoDeposit = useGovPoolDeposit(daoAddress ?? "")

  useEffect(() => {
    if (!daoDeposit) return
    ;async () => {
      daoDeposit(
        "0x8eFf9Efd56581bb5B8Ac5F5220faB9A7349160e3",
        parseEther("1"),
        []
      )
    }
  }, [daoDeposit])

  const proceedToNextStep = useCallback(async () => {
    // TEMP: create hardcoded proposals
    switch (selectedProposalType) {
      case EProposalType.daoProfileModification: {
        await createInternalProposal()
        return
      }
      case EProposalType.changingVotingSettings: {
        // internal
        await createInternalProposal()
        return
      }
      case EProposalType.tokenDistribution: {
        // token distribution
        await createDistributionProposal()
        return
      }
      case EProposalType.validatorSettings: {
        // validators
        await createValidatorProposal()
        return
      }
      case EProposalType.changeTokenPrice: {
        // not exist yet
        await createInternalProposal()
        return
      }
    }

    //TODO NAVIGATE to path related to selected proposal type
    const nextProposalTypePath = {
      [EProposalType.daoProfileModification]: `/dao/${daoAddress}/create-proposal-change-dao-settings`,
      [EProposalType.changingVotingSettings]: "/",
      [EProposalType.tokenDistribution]: "/",
      [EProposalType.validatorSettings]: `/dao/${daoAddress}/create-proposal-validator-settings`,
      [EProposalType.changeTokenPrice]: "/",
    }[selectedProposalType]

    navigate(nextProposalTypePath)
  }, [
    selectedProposalType,
    daoAddress,
    navigate,
    createDistributionProposal,
    createValidatorProposal,
  ])

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

  return (
    <>
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation daoPoolAddress={daoAddress ?? ""}>
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
                to={`/dao/${daoAddress}/create-new-proposal-type`}
              >
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
      </WithGovPoolAddressValidation>
    </>
  )
}

export default CreateProposalSelectType
