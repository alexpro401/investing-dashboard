import React from "react"
import { useParams } from "react-router-dom"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import DaoProposalCreatingContextProvider from "context/DaoProposalCreatingContext"
import FundDaoCreatingContextProvider from "context/FundDaoCreatingContext"
import CreateNewProposalTypeForm from "forms/CreateNewProposalTypeForm"

import * as S from "./styled"

const CreateNewProposalType: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()

  return (
    <>
      <Header>Create Proposal</Header>
      <WithGovPoolAddressValidation daoPoolAddress={daoAddress ?? ""}>
        <S.CreateNewDaoProposalTypePageHolder
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <FundDaoCreatingContextProvider>
            <DaoProposalCreatingContextProvider>
              <CreateNewProposalTypeForm />
            </DaoProposalCreatingContextProvider>
          </FundDaoCreatingContextProvider>
        </S.CreateNewDaoProposalTypePageHolder>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default CreateNewProposalType
