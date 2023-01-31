import React from "react"
import { useParams } from "react-router-dom"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import Skeleton from "components/Skeleton"
import FormStepsLoaderWrapper from "common/FormSteps/FormStepsLoaderWrapper"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import TokenSaleCreatingContextProvider from "context/govPool/proposals/TokenSaleContext"
import CreateDaoProposalTokenSaleForm from "forms/CreateDaoProposalTokenSaleForm"
import { useBreakpoints } from "hooks"

import * as S from "../styled"

const CreateDaoProposalTokenSale: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()

  const { isMobile } = useBreakpoints()

  return (
    <>
      <Header>Token sale</Header>
      <WithGovPoolAddressValidation
        daoPoolAddress={daoAddress ?? ""}
        loader={
          <FormStepsLoaderWrapper>
            <S.SkeletonLoader>
              {!isMobile ? (
                <>
                  <Skeleton variant={"text"} w={"300px"} h={"40px"} />
                  <Skeleton variant={"text"} w={"400px"} h={"20px"} />
                </>
              ) : (
                <Skeleton variant={"rect"} w={"calc(100%)"} h={"160px"} />
              )}
              <Skeleton variant={"rect"} w={"calc(100%)"} h={"160px"} />
              <Skeleton variant={"rect"} w={"calc(100%)"} h={"160px"} />
            </S.SkeletonLoader>
          </FormStepsLoaderWrapper>
        }
      >
        <GovProposalCreatingContextProvider>
          <TokenSaleCreatingContextProvider>
            <S.PageHolder>
              <S.PageContent>
                <CreateDaoProposalTokenSaleForm />
              </S.PageContent>
            </S.PageHolder>
          </TokenSaleCreatingContextProvider>
        </GovProposalCreatingContextProvider>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default CreateDaoProposalTokenSale
