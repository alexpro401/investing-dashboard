import React from "react"

import { DaoVotingSettings } from "types"
import Modal from "components/Modal"

import * as S from "./styled"

interface IGovVotingSettings
  extends Partial<Omit<DaoVotingSettings, "executorDescription" | "quorum">> {
  isOpen: boolean
  toggle: () => void
  quorum: string
}

const GovVotingSettings: React.FC<IGovVotingSettings> = ({
  isOpen,
  toggle,
  ...rest
}) => {
  return (
    <Modal isOpen={isOpen} title="Current voting settings" toggle={toggle}>
      <S.VotingSettings {...rest} />
    </Modal>
  )
}

export default GovVotingSettings
