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

const NoEnoughInsurance: FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate()

  const navigateToStake = () => {
    onClose()
    navigate("/insurance")
  }

  return (
    <Confirm title="No enough insurance" isOpen={isOpen} toggle={() => {}}>
      <S.Image src={confirmModalImage} alt="" />
      <Text fz={13} lh="150%" color="#E4F2FF" align="center">
        <p>Чтобы оформить страховой пропоузел вам необходимо:</p>
        <br />
        <ul>
          <li>иметь действующую страховку минимум на 100 DEXE</li>
          <li>
            иметь страховку на момент страхового случая минимум на 100 DEXE
          </li>
        </ul>
      </Text>

      <Button
        m="16px 0 0"
        size="big"
        theme="primary"
        onClick={navigateToStake}
        full
      >
        Stake 100 DEXE
      </Button>
    </Confirm>
  )
}

export default NoEnoughInsurance
