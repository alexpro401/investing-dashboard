import React from "react"
import { useParams } from "react-router-dom"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import CreateProposalChangeDAOSettingsForm from "forms/CreateProposalChangeDAOSettingsForm"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import ChangeGovSettingsContextProvider from "context/govPool/proposals/regular/ChangeGovSettingsContext"

import * as S from "./styled"

const CreateDaoProposalChangeDaoSettings: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()

  return (
    <>
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation daoPoolAddress={daoAddress ?? ""}>
        <S.PageHolder>
          <ChangeGovSettingsContextProvider>
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
