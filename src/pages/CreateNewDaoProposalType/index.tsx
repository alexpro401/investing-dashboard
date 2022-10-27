import React, { useEffect } from "react"
import { useParams, useLocation } from "react-router-dom"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import DaoProposalCreatingContextProvider from "context/DaoProposalCreatingContext"
import FundDaoCreatingContextProvider from "context/FundDaoCreatingContext"
import CreateNewProposalTypeForm from "forms/CreateNewProposalTypeForm"
import useDaoPoolSetting from "hooks/useDaoPoolSetting"
import { EExecutor } from "interfaces/contracts/IGovPoolSettings"
import { INITIAL_DAO_PROPOSAL } from "constants/dao"

import * as S from "./styled"

const CreateNewProposalType: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()
  const [daoSettings, loading] = useDaoPoolSetting({
    daoAddress: daoAddress ?? "",
    settingsId: EExecutor.DEFAULT,
  })
  const location = useLocation()

  useEffect(() => {
    return () => {
      localStorage.removeItem("creating-new-dao-proposal-type")
    }
  }, [location])

  if (loading) return null

  return (
    <>
      <Header>Create Proposal</Header>
      <WithGovPoolAddressValidation daoPoolAddress={daoAddress ?? ""}>
        <S.CreateNewDaoProposalTypePageHolder
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <p style={{ color: "white" }}>{JSON.stringify(daoSettings)}</p>
          <FundDaoCreatingContextProvider
            customLSKey={"creating-new-dao-proposal-type"}
            daoProposal={{
              ...INITIAL_DAO_PROPOSAL,
              _defaultProposalSettingForm: {
                ...INITIAL_DAO_PROPOSAL._defaultProposalSettingForm,
                duration: 1000,
                quorum: 63,
              },
            }}
          >
            <DaoProposalCreatingContextProvider>
              <CreateNewProposalTypeForm />
            </DaoProposalCreatingContextProvider>
          </FundDaoCreatingContextProvider>
        </S.CreateNewDaoProposalTypePageHolder>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default CreateNewProposalType
