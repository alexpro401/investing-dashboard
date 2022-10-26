import React, { useCallback, useState } from "react"
import { useParams } from "react-router-dom"

import Header from "components/Header/Layout"
import Button from "components/Button"
import ChooseDaoProposalAsPerson from "modals/ChooseDaoProposalAsPerson"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"

import * as S from "./styled"

const DaoProfile: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()

  const [createProposalModalOpened, setCreateProposalModalOpened] =
    useState<boolean>(false)

  const handleOpenCreateProposalModal = useCallback(() => {
    setCreateProposalModalOpened(true)
  }, [])

  const handleCloseCreateProposalModal = useCallback(() => {
    setCreateProposalModalOpened(false)
  }, [])

  return (
    <>
      <Header>Dao Profile</Header>
      <WithGovPoolAddressValidation daoPoolAddress={daoAddress ?? ""}>
        <Button onClick={handleOpenCreateProposalModal}>
          + Create Proposal
        </Button>
        <ChooseDaoProposalAsPerson
          isOpen={createProposalModalOpened}
          daoAddress={daoAddress ?? ""}
          toggle={handleCloseCreateProposalModal}
        />
      </WithGovPoolAddressValidation>
    </>
  )
}

export default DaoProfile
