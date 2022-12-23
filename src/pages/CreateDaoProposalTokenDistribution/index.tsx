import React from "react"
import { useParams } from "react-router-dom"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import TokenDistributionCreatingContextProvider from "context/govPool/proposals/TokenDistributionContext"
import CreateDaoProposalTokenDistributionForm from "forms/CreateDaoProposalTokenDistributionForm"
import Skeleton from "components/Skeleton"
import { Flex } from "theme"

import * as S from "./styled"

const CreateDaoProposalTokenDistribution: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()

  return (
    <>
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation
        daoPoolAddress={daoAddress ?? ""}
        loader={
          <Flex
            gap={"24"}
            full
            m="16px 0 0 0"
            dir="column"
            ai={"center"}
            jc={"flex-start"}
          >
            <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"160px"} />
            <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"160px"} />
          </Flex>
        }
      >
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
