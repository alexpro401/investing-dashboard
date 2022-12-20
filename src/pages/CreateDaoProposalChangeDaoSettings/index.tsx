import React, { useMemo, useEffect } from "react"
import { useParams, useLocation } from "react-router-dom"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import CreateProposalChangeDAOSettingsForm from "forms/CreateProposalChangeDAOSettingsForm"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import GovPoolFormContextProvider from "context/govPool/GovPoolFormContext"
import { useGovPoolDescription } from "hooks/dao"
import Skeleton from "components/Skeleton"
import { Flex } from "theme"
import { GovPoolFormOptions } from "types"
import { INITIAL_DAO_PROPOSAL } from "constants/dao"

import * as S from "./styled"

const CreateDaoProposalChangeDaoSettings: React.FC = () => {
  const location = useLocation()
  const { daoAddress } = useParams<"daoAddress">()

  const { descriptionObject, loading } = useGovPoolDescription(daoAddress ?? "")

  const loader = useMemo(
    () => (
      <Flex
        gap={"24"}
        full
        m="16px 0 0 0"
        dir="column"
        ai={"center"}
        jc={"flex-start"}
      >
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

  useEffect(() => {
    localStorage.removeItem("proposal-change-dao-settings")

    return () => {
      localStorage.removeItem("proposal-change-dao-settings")
    }
  }, [location])

  const govPoolFormOptions = {
    ...INITIAL_DAO_PROPOSAL,
    _avatarUrl: descriptionObject?.avatarUrl ?? "",
    _daoName: descriptionObject?.daoName ?? "",
    _description: descriptionObject?.description ?? "",
    _documents: descriptionObject?.documents ?? [],
    _socialLinks: descriptionObject?.socialLinks ?? [],
    _websiteUrl: descriptionObject?.websiteUrl ?? "",
  } as GovPoolFormOptions

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
            <GovPoolFormContextProvider
              customLSKey={"proposal-change-dao-settings"}
              govPoolFormOptions={govPoolFormOptions}
            >
              <GovProposalCreatingContextProvider>
                <CreateProposalChangeDAOSettingsForm />
              </GovProposalCreatingContextProvider>
            </GovPoolFormContextProvider>
          </S.PageHolder>
        )}
      </WithGovPoolAddressValidation>
    </>
  )
}

export default CreateDaoProposalChangeDaoSettings
