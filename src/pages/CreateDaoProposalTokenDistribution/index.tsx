import React from "react"
import { useParams } from "react-router-dom"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import TokenDistributionCreatingContextProvider from "context/govPool/proposals/TokenDistributionContext"
import CreateDaoProposalTokenDistributionForm from "forms/CreateDaoProposalTokenDistributionForm"

import * as S from "./styled"

const CreateDaoProposalTokenDistribution: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()

  return (
    <>
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation daoPoolAddress={daoAddress ?? ""}>
        <GovProposalCreatingContextProvider>
          <TokenDistributionCreatingContextProvider>
            <S.PageHolder>
              <S.PageContent>
                <CreateDaoProposalTokenDistributionForm />
              </S.PageContent>
            </S.PageHolder>
          </TokenDistributionCreatingContextProvider>
        </GovProposalCreatingContextProvider>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default CreateDaoProposalTokenDistribution
