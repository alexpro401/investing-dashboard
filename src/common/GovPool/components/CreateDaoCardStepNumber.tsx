import { FC } from "react"
import * as S from "./styled"

interface Props {
  number: number
}

const CreateDaoCardStepNumber: FC<Props> = ({ number, ...rest }) => {
  return (
    <S.CreateDaoCardNumberIcon {...rest}>
      <S.CreateDaoCardNumberIconText>{number}</S.CreateDaoCardNumberIconText>
    </S.CreateDaoCardNumberIcon>
  )
}

export default CreateDaoCardStepNumber
