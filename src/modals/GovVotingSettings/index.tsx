import React from "react"

import { DaoVotingSettings } from "types"
import Modal from "components/Modal"
import { VotingSettings } from "common"

// import * as S from "./styled"

interface IGovVotingSettings
  extends Partial<Omit<DaoVotingSettings, "executorDescription">> {
  isOpen: boolean
  toggle: () => void
}

const GovVotingSettings: React.FC<IGovVotingSettings> = ({
  isOpen,
  toggle,
  ...rest
}) => {
  return (
    <Modal isOpen={isOpen} title="Current voting settings" toggle={toggle}>
      <VotingSettings {...rest} />
    </Modal>
  )
}

export default GovVotingSettings
