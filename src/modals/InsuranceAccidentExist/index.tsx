import { FC } from "react"
import { useNavigate } from "react-router-dom"

import * as S from "./styled"
import Confirm from "components/Confirm"
import confirmModalImage from "assets/images/confirm-modal.png"
import { BigNumberish } from "@ethersproject/bignumber"

interface Props {
  isOpen: boolean
  onClose: () => void
  daoPool: string
  proposalId: BigNumberish
}

const InsuranceAccidentExist: FC<Props> = ({
  isOpen,
  onClose,
  daoPool,
  proposalId,
}) => {
  const navigate = useNavigate()

  const navigateToProposal = () => {
    onClose()
    navigate(`/dao/${daoPool}/vote/${proposalId as string}`)
  }

  return (
    <Confirm title="Insurance Proposal" isOpen={isOpen} toggle={onClose}>
      <S.Image src={confirmModalImage} alt="" />
      <S.Description>
        There is already an active insurance proposal for this fund. Review and
        vote for it.
      </S.Description>

      <S.VoteButton
        text="Vote for the proposal"
        size="medium"
        scheme="filled"
        color={"tertiary"}
        onClick={navigateToProposal}
        full
      />
    </Confirm>
  )
}

export default InsuranceAccidentExist
