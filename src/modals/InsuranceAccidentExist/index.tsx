import { FC } from "react"
import { useNavigate } from "react-router-dom"

import { Text } from "theme"
import * as S from "./styled"
import { AppButton } from "common"
import Confirm from "components/Confirm"
import confirmModalImage from "assets/images/confirm-modal.png"

interface Props {
  isOpen: boolean
  onClose: () => void
}

const InsuranceAccidentExist: FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate()

  const navigateToProposal = () => {
    onClose()
    navigate("/me/investor")
  }

  return (
    <Confirm title="Insurance Proposal" isOpen={isOpen} toggle={() => {}}>
      <S.Image src={confirmModalImage} alt="" />
      <Text fz={13} lh="150%" color="#E4F2FF" align="center">
        There is already an active insurance proposal for this fund. Review and
        vote for it.
      </Text>

      <AppButton
        text="Vote for the proposal"
        size="medium"
        color="primary"
        onClick={navigateToProposal}
        full
      />
    </Confirm>
  )
}

export default InsuranceAccidentExist
