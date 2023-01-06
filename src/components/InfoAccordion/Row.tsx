import { PNLIndicator } from "common"
import Tooltip from "components/Tooltip"
import { FC } from "react"
import { Info } from "."
import * as S from "./styled"

interface Props {
  data: Info
  children?: React.ReactNode | null
}

const Row: FC<Props> = ({ data, children }) => {
  const { title, tooltip, value, pnl } = data

  return (
    <S.Row>
      <S.Content>
        <S.Left>
          <Tooltip id={title}>{tooltip}</Tooltip>
          <S.Title>{title}</S.Title>
        </S.Left>
        <S.Right>
          <S.Value>{value}</S.Value>
          <PNLIndicator type="brackets" pnl={pnl} fontSize={13} />
        </S.Right>
      </S.Content>
      <S.Body>{children}</S.Body>
    </S.Row>
  )
}

export default Row
