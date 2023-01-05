import React from "react"
import { useParams } from "react-router-dom"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import TokenDistributionCreatingContextProvider from "context/govPool/proposals/TokenDistributionContext"
import CreateDaoProposalTokenDistributionForm from "forms/CreateDaoProposalTokenDistributionForm"
import Skeleton from "components/Skeleton"
import FormStepsLoaderWrapper from "common/FormSteps/FormStepsLoaderWrapper"
import { Flex } from "theme"
import { useBreakpoints } from "hooks"

import * as S from "./styled"

const CreateDaoProposalTokenDistribution: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()

  const { isMobile } = useBreakpoints()

  return (
    <>
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation
        daoPoolAddress={daoAddress ?? ""}
        loader={
          <FormStepsLoaderWrapper>
            <Flex
              gap={"24"}
              full
              m="16px 0 0 0"
              dir="column"
              ai={"flex-start"}
              jc={"flex-start"}
            >
              {!isMobile && (
                <>
                  <Skeleton variant={"text"} w={"300px"} h={"40px"} />
                  <Skeleton variant={"text"} w={"400px"} h={"20px"} />
                </>
              )}
              <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"160px"} />
            </Flex>
          </FormStepsLoaderWrapper>
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
