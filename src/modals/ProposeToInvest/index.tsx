import { FC, useCallback } from "react"
import { useNavigate } from "react-router-dom"

import Modal from "components/Modal"
import { AppButton } from "common"
import S from "./styled"

interface IProps {
  positionCount: number
  poolAddress?: string
  ticker?: string
}

const ProposeToInvest: FC<IProps> = ({
  positionCount = 0,
  poolAddress,
  ticker,
}) => {
  const navigate = useNavigate()

  const onToggle = () => {
    navigate(-1)
  }

  const onInvest = useCallback(() => {
    if (!poolAddress) return
    navigate(`/pool/invest/${poolAddress}`)
  }, [navigate, poolAddress])

  return (
    <>
      <Modal title="Become investor" isOpen onClose={onToggle}>
        <S.ModalText>
          The trader has {positionCount} open positions, but you need to be a
          fund investor to see them
        </S.ModalText>
        <S.ButtonContainer>
          <AppButton size="medium" color="primary" full onClick={onInvest}>
            Buy {ticker}
          </AppButton>
        </S.ButtonContainer>
      </Modal>
    </>
  )
}

export default ProposeToInvest
