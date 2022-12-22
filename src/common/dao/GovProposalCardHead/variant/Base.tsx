import * as React from "react"
import * as S from "../styled"
import { ICON_NAMES } from "constants/icon-names"
import { Icon } from "common"
import { Flex } from "theme"

interface Props {
  name: string
  pool?: string
  completed?: boolean
}

const GovProposalCardHeadBase: React.FC<Props> = ({
  name,
  completed = false,
}) => {
  return (
    <S.Content>
      <Flex ai={"center"} jc={"flex-start"} gap={"8"} full>
        {completed && <Icon name={ICON_NAMES.successCircle} />}
        <S.TitleWrapper>
          <S.Title>
            {name && name.length > 0
              ? name
              : "DAO proposal name fallback fallback"}
          </S.Title>
        </S.TitleWrapper>
      </Flex>
      <S.HeadIcon name={ICON_NAMES.angleRight} />
    </S.Content>
  )
}

export default GovProposalCardHeadBase
