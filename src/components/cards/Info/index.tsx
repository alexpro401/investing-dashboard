import { FC, ReactNode } from "react"
import { v4 as uuidv4 } from "uuid"
import { isNil } from "lodash"

import * as S from "./styled"
import { Flex, Text } from "theme"
import Tooltip from "components/Tooltip"

interface Statistic {
  label: ReactNode
  info?: ReactNode
  value: ReactNode
}

interface Props {
  nodeHeadLeft?: ReactNode
  nodeHeadRight?: ReactNode
  children?: ReactNode
  statistic: Statistic[]
}

const InfoCard: FC<Props> = (props) => {
  const { nodeHeadLeft, nodeHeadRight, statistic, children } = props

  return (
    <S.Container>
      <S.Header>
        {nodeHeadLeft ? (
          <S.HeaderNodeLeft>{nodeHeadLeft}</S.HeaderNodeLeft>
        ) : null}
        {nodeHeadRight ? (
          <S.HeaderNodeRight>{nodeHeadRight}</S.HeaderNodeRight>
        ) : null}
      </S.Header>
      <S.Divider />
      <S.Content>
        {statistic.map((item) => (
          <S.Item key={uuidv4()}>
            <Flex ai="center" jc="flex-start" m="0 0 4px 0">
              <Text color="#B1C7FC" fz={11} lh="20px" p="0 3px 0 0">
                {item.label}
              </Text>
              {!isNil(item.info) ? (
                <Tooltip id={uuidv4()}>{item.info}</Tooltip>
              ) : null}
            </Flex>

            <div>{item.value}</div>
          </S.Item>
        ))}
      </S.Content>
      {children}
    </S.Container>
  )
}

export default InfoCard
