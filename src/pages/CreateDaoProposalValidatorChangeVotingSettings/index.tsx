import React, { useMemo } from "react"
import { useParams } from "react-router-dom"
import { formatUnits } from "@ethersproject/units"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import WithUserIsDaoValidatorValidation from "components/WithUserIsDaoValidatorValidation"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import DaoValidatorProposalChangeVotingSettingsContextProvider from "context/govPool/proposals/validators/ChangeVotingSettingsContext"
import CreateGovProposalValidatorChangeVotingSettingsForm from "forms/CreateGovProposalValidatorChangeVotingSettingsForm"
import { useGovValidatorsInternalSettings } from "hooks/dao"
import Skeleton from "components/Skeleton"
import { Flex } from "theme"

import * as S from "./styled"

const CreateDaoProposalValidatorChangeVotingSettings: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()
  const [proposalInternalSettings, proposalInternalSettingsLoading] =
    useGovValidatorsInternalSettings(daoAddress ?? "")

  const loader = useMemo(
    () => (
      <Flex
        gap={"24"}
        full
        m="16px 0 0 0"
        dir="column"
        ai={"center"}
        jc={"flex-start"}
      >
        <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
        <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"160px"} />
      </Flex>
    ),
    []
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
          {proposalInternalSettingsLoading && loader}
          {!proposalInternalSettingsLoading && (
            <S.PageHolder>
              <S.PageContent>
                <GovProposalCreatingContextProvider>
                  {proposalInternalSettings && (
                    <DaoValidatorProposalChangeVotingSettingsContextProvider
                      initialForm={{
                        duration: proposalInternalSettings.duration.toNumber(),
                        quorum: Number(
                          formatUnits(proposalInternalSettings.quorum, 25)
                        ),
                      }}
                    >
                      <CreateGovProposalValidatorChangeVotingSettingsForm />
                    </DaoValidatorProposalChangeVotingSettingsContextProvider>
                  )}
                </GovProposalCreatingContextProvider>
              </S.PageContent>
            </S.PageHolder>
          )}
        </WithUserIsDaoValidatorValidation>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default CreateDaoProposalValidatorChangeVotingSettings
