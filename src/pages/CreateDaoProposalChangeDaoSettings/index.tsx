import React, { useMemo } from "react"
import { useParams } from "react-router-dom"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import CreateProposalChangeDAOSettingsForm from "forms/CreateProposalChangeDAOSettingsForm"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import ChangeGovSettingsContextProvider from "context/govPool/proposals/regular/ChangeGovSettingsContext"
import { useGovPoolDescription } from "hooks/dao"
import Skeleton from "components/Skeleton"
import { Flex } from "theme"

import * as S from "./styled"

const CreateDaoProposalChangeDaoSettings: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()

  const { descriptionObject, loading } = useGovPoolDescription(daoAddress ?? "")

  const loader = useMemo(
    () => (
      <Flex gap={"24"} full m="16px 0 0 0" dir="column" ai={"center"}>
        <Skeleton variant={"text"} w={"calc(100% - 32px)"} h={"20px"} />
        <Skeleton variant={"circle"} radius={"50%"} w={"100px"} h={"100px"} />
        <Skeleton variant={"text"} w={"calc(100% - 32px)"} h={"20px"} />
        <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
        <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
        <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
      </Flex>
    ),
    []
  )

  return (
    <>
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation
        daoPoolAddress={daoAddress ?? ""}
        loader={loader}
      >
        {loading && loader}
        {!loading && (
          <S.PageHolder>
            <ChangeGovSettingsContextProvider
              initialForm={{
                avatarUrl: descriptionObject?.avatarUrl ?? "",
                daoName: descriptionObject?.daoName ?? "",
                description: descriptionObject?.description ?? "",
                documents: descriptionObject?.documents ?? [],
                socialLinks: descriptionObject?.socialLinks ?? [],
                websiteUrl: descriptionObject?.websiteUrl ?? "",
              }}
            >
              <GovProposalCreatingContextProvider>
                <CreateProposalChangeDAOSettingsForm />
              </GovProposalCreatingContextProvider>
            </ChangeGovSettingsContextProvider>
          </S.PageHolder>
        )}
      </WithGovPoolAddressValidation>
    </>
  )
}

export default CreateDaoProposalChangeDaoSettings
