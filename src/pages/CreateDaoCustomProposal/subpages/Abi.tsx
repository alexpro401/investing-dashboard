import React from "react"
import { useParams } from "react-router-dom"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import AdvancedABIContextProvider from "context/govPool/proposals/custom/AdvancedABIContext"
import CreateDaoProposalAbiForm from "forms/CreateDaoCustomProposalAbiForm"
import Skeleton from "components/Skeleton"
import { Flex } from "theme"

import * as S from "../styled"

const Abi: React.FC = () => {
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
            <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"90px"} />
            <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"90px"} />
          </Flex>
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
