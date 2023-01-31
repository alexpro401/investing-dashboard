import React from "react"
import { useParams } from "react-router-dom"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import AdvancedABIContextProvider from "context/govPool/proposals/custom/AdvancedABIContext"
import CreateDaoProposalAbiForm from "forms/CreateDaoCustomProposalAbiForm"
import Skeleton from "components/Skeleton"
import FormStepsLoaderWrapper from "common/FormSteps/FormStepsLoaderWrapper"
import { useBreakpoints } from "hooks"

import * as S from "../styled"

const Abi: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()

  const { isMobile } = useBreakpoints()

  return (
    <>
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation
        daoPoolAddress={daoAddress ?? ""}
        loader={
          <FormStepsLoaderWrapper>
            <S.SkeletonLoader>
              {isMobile && (
                <Skeleton variant={"rect"} w={"calc(100%)"} h={"90px"} />
              )}
              {!isMobile && (
                <>
                  <Skeleton variant={"text"} w={"300px"} h={"40px"} />
                  <Skeleton variant={"text"} w={"400px"} h={"20px"} />
                </>
              )}
              <Skeleton variant={"rect"} w={"calc(100%)"} h={"90px"} />
            </S.SkeletonLoader>
          </FormStepsLoaderWrapper>
        }
      >
        <S.PageHolder>
          <GovProposalCreatingContextProvider>
            <AdvancedABIContextProvider>
              <CreateDaoProposalAbiForm />
            </AdvancedABIContextProvider>
          </GovProposalCreatingContextProvider>
        </S.PageHolder>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default Abi
