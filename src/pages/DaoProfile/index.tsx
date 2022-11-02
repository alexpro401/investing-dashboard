import React, { useCallback, useState } from "react"
import { useParams } from "react-router-dom"

import Header from "components/Header/Layout"
import Button from "components/Button"
import ChooseDaoProposalAsPerson from "modals/ChooseDaoProposalAsPerson"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"

import * as S from "./styled"

const DaoProfile: React.FC = () => {
  const { daoAddress } = useParams()

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
        <S.Container>
          <div style={{ backgroundColor: "cyan" }}>
            <Button onClick={handleOpenCreateProposalModal}>
              + Create Proposal
            </Button>
          </div>
          <div style={{ minHeight: 1050, backgroundColor: "red" }}></div>
        </S.Container>
      </WithGovPoolAddressValidation>
      <ChooseDaoProposalAsPerson
        isOpen={createProposalModalOpened}
        daoAddress={daoAddress ?? ""}
        toggle={handleCloseCreateProposalModal}
      />
    </>
  )
}

export default DaoProfile
