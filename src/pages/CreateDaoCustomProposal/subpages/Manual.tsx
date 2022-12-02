import React from "react"
import { useParams } from "react-router-dom"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import AdvancedManualContextProvider from "context/govPool/proposals/custom/AdvancedManualContext"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import CreateDaoCustomProposalManualForm from "forms/CreateDaoCustomProposalManualForm"

import * as S from "../styled"

const Manual: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()

  return (
    <>
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation daoPoolAddress={daoAddress ?? ""}>
        <S.PageHolder>
          <GovProposalCreatingContextProvider>
            <AdvancedManualContextProvider>
              <CreateDaoCustomProposalManualForm />
            </AdvancedManualContextProvider>
          </GovProposalCreatingContextProvider>
        </S.PageHolder>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default Manual
