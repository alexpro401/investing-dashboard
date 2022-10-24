import React from "react"
import { useParams } from "react-router-dom"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import CreateProposalChangeDAOSettingsForm from "forms/CreateProposalChangeDAOSettingsForm"
import DaoProposalCreatingContextProvider from "context/DaoProposalCreatingContext"
import DaoProposalChangeDaoSettingsCreatingContextProvider from "context/DaoProposalChangeDaoSettingsCreatingContext"

import * as S from "./styled"

const CreateDaoProposalChangeDaoSettings: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()

  return (
    <>
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation daoPoolAddress={daoAddress ?? ""}>
        <S.PageHolder>
          <DaoProposalChangeDaoSettingsCreatingContextProvider>
            <DaoProposalCreatingContextProvider>
              <CreateProposalChangeDAOSettingsForm />
            </DaoProposalCreatingContextProvider>
          </DaoProposalChangeDaoSettingsCreatingContextProvider>
        </S.PageHolder>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default CreateDaoProposalChangeDaoSettings
