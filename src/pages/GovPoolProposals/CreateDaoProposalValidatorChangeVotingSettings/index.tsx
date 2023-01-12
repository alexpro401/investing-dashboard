import React, { useMemo } from "react"
import { useParams } from "react-router-dom"
import { formatUnits } from "@ethersproject/units"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import WithUserIsDaoValidatorValidation from "components/WithUserIsDaoValidatorValidation"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import DaoValidatorProposalChangeVotingSettingsContextProvider from "context/govPool/proposals/validators/ChangeVotingSettingsContext"
import CreateGovProposalValidatorChangeVotingSettingsForm from "forms/CreateGovProposalValidatorChangeVotingSettingsForm"
import { useBreakpoints } from "hooks"
import { useGovValidatorsInternalSettings } from "hooks/dao"
import Skeleton from "components/Skeleton"
import FormStepsLoaderWrapper from "common/FormSteps/FormStepsLoaderWrapper"

import * as S from "../styled"

const CreateDaoProposalValidatorChangeVotingSettings: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()
  const [proposalInternalSettings, proposalInternalSettingsLoading] =
    useGovValidatorsInternalSettings(daoAddress ?? "")

  const { isMobile } = useBreakpoints()

  const loader = useMemo(
    () => (
      <FormStepsLoaderWrapper>
        <S.SkeletonLoader>
          {isMobile && (
            <Skeleton variant={"rect"} w={"calc(100%)"} h={"80px"} />
          )}
          {!isMobile && (
            <>
              <Skeleton variant={"rect"} w={"300px"} h={"40px"} />
              <Skeleton variant={"rect"} w={"400px"} h={"20px"} />
            </>
          )}
          <Skeleton variant={"rect"} w={"calc(100%)"} h={"160px"} />
        </S.SkeletonLoader>
      </FormStepsLoaderWrapper>
    ),
    [isMobile]
  )

  return (
    <>
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation
        daoPoolAddress={daoAddress ?? ""}
        loader={loader}
      >
        <WithUserIsDaoValidatorValidation
          daoPoolAddress={daoAddress ?? ""}
          loader={loader}
        >
          {proposalInternalSettingsLoading && loader}
          {!proposalInternalSettingsLoading && (
            <S.PageHolder>
              <S.PageContent>
                <GovProposalCreatingContextProvider>
                  {proposalInternalSettings && (
                    <DaoValidatorProposalChangeVotingSettingsContextProvider
                      initialForm={{
                        duration: proposalInternalSettings.duration.toNumber(),
                        quorum: Number(
                          formatUnits(proposalInternalSettings.quorum, 25)
                        ),
                      }}
                    >
                      <CreateGovProposalValidatorChangeVotingSettingsForm />
                    </DaoValidatorProposalChangeVotingSettingsContextProvider>
                  )}
                </GovProposalCreatingContextProvider>
              </S.PageContent>
            </S.PageHolder>
          )}
        </WithUserIsDaoValidatorValidation>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default CreateDaoProposalValidatorChangeVotingSettings
