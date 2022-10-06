import { FC } from "react"
import { useNavigate } from "react-router-dom"

import { Text } from "theme"
import * as S from "./styled"
import Button from "components/Button"
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

      <Button
        m="16px 0 0"
        size="big"
        theme="primary"
        onClick={navigateToProposal}
        full
      >
        Vote for the proposal
      </Button>
    </Confirm>
  )
}

export default InsuranceAccidentExist
