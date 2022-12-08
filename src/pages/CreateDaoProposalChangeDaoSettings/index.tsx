import React from "react"
import { useParams } from "react-router-dom"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import CreateProposalChangeDAOSettingsForm from "forms/CreateProposalChangeDAOSettingsForm"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import ChangeGovSettingsContextProvider from "context/govPool/proposals/regular/ChangeGovSettingsContext"
import { useGovPoolDescription } from "hooks/dao"

import * as S from "./styled"

const CreateDaoProposalChangeDaoSettings: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()

  const { descriptionObject } = useGovPoolDescription(daoAddress ?? "")

  return (
    <>
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation daoPoolAddress={daoAddress ?? ""}>
        <S.PageHolder>
          <ChangeGovSettingsContextProvider
            initialForm={{
              avatarUrl: descriptionObject?.avatarUrl ?? "",
              daoName: descriptionObject?.daoName ?? "",
              description: descriptionObject?.description ?? "",
              documents: descriptionObject?.documents ?? [],
              socialLinks: descriptionObject?.socialLinks ?? [],
              websiteUrl: descriptionObject?.websiteUrl ?? "",
            }}
          >
            <GovProposalCreatingContextProvider>
              <CreateProposalChangeDAOSettingsForm />
            </GovProposalCreatingContextProvider>
          </ChangeGovSettingsContextProvider>
        </S.PageHolder>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default CreateDaoProposalChangeDaoSettings
