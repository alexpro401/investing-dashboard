import React, { useContext } from "react"

import TransactionSent from "modals/TransactionSent"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"

import * as S from "./styled"

const CreatingProposalSuccessModal: React.FC = () => {
  const { successModalState } = useContext(GovProposalCreatingContext)

  return (
    <TransactionSent
      isOpen={successModalState.opened}
      toggle={() => {
        successModalState.onClick()
      }}
      title={successModalState.title}
      description={successModalState.text}
    >
      <S.SuccessModalButton
        onClick={() => {
          successModalState.onClick()
        }}
        text={successModalState.buttonText}
        type="button"
        size="large"
      />
    </TransactionSent>
  )
}

export default CreatingProposalSuccessModal
