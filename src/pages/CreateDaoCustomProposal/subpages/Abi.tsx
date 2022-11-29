import React from "react"
import { useParams } from "react-router-dom"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import CreateDaoProposalAbiForm from "forms/CreateDaoCustomProposalAbiForm"

import * as S from "../styled"

const Abi: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()

  return (
    <>
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation daoPoolAddress={daoAddress ?? ""}>
        <S.PageHolder>
          <GovProposalCreatingContextProvider>
            <CreateDaoProposalAbiForm />
          </GovProposalCreatingContextProvider>
        </S.PageHolder>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default Abi
