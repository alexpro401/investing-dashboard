import React from "react"
import { useParams } from "react-router-dom"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import AdvancedManualContextProvider from "context/govPool/proposals/custom/AdvancedManualContext"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import CreateDaoCustomProposalManualForm from "forms/CreateDaoCustomProposalManualForm"
import Skeleton from "components/Skeleton"
import { Flex } from "theme"

import * as S from "../styled"

const Manual: React.FC = () => {
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
            <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
            <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
            <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
          </Flex>
        }
      >
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
