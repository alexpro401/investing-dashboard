import { FC, ReactNode, HTMLAttributes } from "react"
import { v4 as uuidv4 } from "uuid"
import { isNil } from "lodash"

import * as S from "./styled"
import { Flex } from "theme"
import Tooltip from "components/Tooltip"
import { useBreakpoints } from "../../hooks"

interface Statistic {
  label: ReactNode
  info?: ReactNode
  value: ReactNode
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  nodeHeadLeft?: ReactNode
  nodeHeadRight?: ReactNode
  children?: ReactNode
  statistic: Statistic[]
}

const CardInfo: FC<Props> = (props) => {
  const { nodeHeadLeft, nodeHeadRight, statistic, children, ...rest } = props

  const { isMobile } = useBreakpoints()

  return (
    <S.Container {...rest}>
      <S.Header>
        {nodeHeadLeft ? (
          <S.HeaderNodeLeft>{nodeHeadLeft}</S.HeaderNodeLeft>
        ) : null}
        {nodeHeadRight ? (
          <S.HeaderNodeRight>{nodeHeadRight}</S.HeaderNodeRight>
        ) : null}
      </S.Header>
      {isMobile && <S.Divider />}
      <Flex
        full
        ai={"center"}
        jc={"space-between"}
        gap={isMobile ? "12" : "32"}
      >
        {statistic.map((item, i) => (
          <Flex
            full
            gap={isMobile ? "4" : "0"}
            dir={"column"}
            key={uuidv4()}
            ai={statistic.length === i + 1 ? "flex-end" : "flex-start"}
          >
            <Flex
              full
              ai={"center"}
              jc={statistic.length === i + 1 ? "flex-end" : "flex-start"}
              gap={"4"}
            >
              <S.CardInfoLabel>{item.label}</S.CardInfoLabel>
              {!isNil(item.info) && (
                <Tooltip id={uuidv4()}>{item.info}</Tooltip>
              )}
            </Flex>

            <S.CardInfoValue>{item.value}</S.CardInfoValue>
          </Flex>
        ))}
      </Flex>
      {children}
    </S.Container>
  )
}

export default CardInfo
