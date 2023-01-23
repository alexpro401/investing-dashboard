import React, { useMemo, useEffect } from "react"
import { useParams, useLocation } from "react-router-dom"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import CreateProposalChangeDAOSettingsForm from "forms/CreateProposalChangeDAOSettingsForm"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import GovPoolFormContextProvider from "context/govPool/GovPoolFormContext"
import FormStepsLoaderWrapper from "common/FormSteps/FormStepsLoaderWrapper"
import { useGovPoolDescription } from "hooks/dao"
import { useBreakpoints } from "hooks"
import Skeleton from "components/Skeleton"
import { GovPoolFormOptions } from "types"
import { INITIAL_DAO_PROPOSAL } from "consts/dao"
import { Flex } from "theme"

import * as S from "../styled"

const CreateDaoProposalChangeDaoSettings: React.FC = () => {
  const location = useLocation()
  const { daoAddress } = useParams<"daoAddress">()
  const { isMobile } = useBreakpoints()

  const { descriptionObject, loading } = useGovPoolDescription(daoAddress ?? "")

  const loader = useMemo(
    () => (
      <FormStepsLoaderWrapper>
        <S.SkeletonLoader alignItems={"center"}>
          {!isMobile && (
            <Flex full dir="column" ai="flex-start" jc="flex-start" gap="12">
              <Skeleton variant={"text"} w={"300px"} h={"24px"} />
              <Skeleton variant={"text"} w={"500px"} h={"16px"} />
            </Flex>
          )}
          {isMobile && (
            <Skeleton variant={"rect"} w={"calc(100%)"} h={"80px"} />
          )}
          <Skeleton variant={"circle"} radius={"50%"} w={"100px"} h={"100px"} />
          <Skeleton variant={"text"} w={"calc(100%)"} h={"20px"} />
          <Skeleton variant={"rect"} w={"calc(100%)"} h={"500px"} />
          <Skeleton variant={"rect"} w={"calc(100%)"} h={"200px"} />
        </S.SkeletonLoader>
      </FormStepsLoaderWrapper>
    ),
    [isMobile]
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
