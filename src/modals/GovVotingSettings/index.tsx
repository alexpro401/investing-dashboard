import React from "react"

import { GovPoolSettings } from "types"
import Modal from "components/Modal"

import * as S from "./styled"

interface IGovVotingSettings
  extends Partial<Omit<GovPoolSettings, "executorDescription" | "quorum">> {
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
    <Modal isOpen={isOpen} title="Current voting settings" onClose={toggle}>
      <S.VotingSettings {...rest} />
    </Modal>
  )
}

export default GovVotingSettings
