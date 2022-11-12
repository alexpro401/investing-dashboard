import React from "react"
import { useParams } from "react-router-dom"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"

import * as S from "../styled"

const TokenDistribution: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()

  return (
    <>
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation daoPoolAddress={daoAddress ?? ""}>
        <S.PageHolder>
          <GovProposalCreatingContextProvider>
            <p style={{ color: "white" }}>token distribution</p>
          </GovProposalCreatingContextProvider>
        </S.PageHolder>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default TokenDistribution
