import React from "react"
import { useParams } from "react-router-dom"
import { formatUnits } from "@ethersproject/units"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import WithUserIsDaoValidatorValidation from "components/WithUserIsDaoValidatorValidation"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import DaoValidatorProposalChangeVotingSettingsContextProvider from "context/govPool/proposals/validators/ChangeVotingSettingsContext"
import CreateGovProposalValidatorChangeVotingSettingsForm from "forms/CreateGovProposalValidatorChangeVotingSettingsForm"

import * as S from "./styled"
import { useGovValidatorsInternalSettings } from "hooks/dao"

const CreateDaoProposalValidatorChangeVotingSettings: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()
  const [proposalInternalSettings] = useGovValidatorsInternalSettings(
    daoAddress ?? ""
  )

  return (
    <>
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation daoPoolAddress={daoAddress ?? ""}>
        <WithUserIsDaoValidatorValidation daoPoolAddress={daoAddress ?? ""}>
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
        </WithUserIsDaoValidatorValidation>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default CreateDaoProposalValidatorChangeVotingSettings
