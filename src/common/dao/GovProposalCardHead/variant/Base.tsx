import * as React from "react"
import * as S from "../styled"
import { ICON_NAMES } from "constants/icon-names"

interface Props {
  name: string
  pool?: string
}

const GovProposalCardHeadBase: React.FC<Props> = ({ name }) => {
  return (
    <S.Content>
      <S.TitleWrapper>
        <S.Title>
          {name.length > 0 ? name : "DAO proposal name fallback"}
        </S.Title>
      </S.TitleWrapper>
      <S.HeadIcon name={ICON_NAMES.arrowDownFilled} />
    </S.Content>
  )
}

export default GovProposalCardHeadBase
