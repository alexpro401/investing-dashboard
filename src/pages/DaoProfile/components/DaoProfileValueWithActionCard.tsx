import * as React from "react"
import { isNil } from "lodash"

import { Card } from "common"
import { Flex, Text } from "theme"
import { AppLink, Counter } from "../styled"

import theme from "theme"

interface Props {
  value: React.ReactNode
  info: React.ReactNode
  to: string
  actionText: string
  count?: React.ReactNode
}

const DaoProfileValueWithActionCard: React.FC<Props> = ({
  value,
  info,
  to,
  actionText,
  count,
}) => {
  return (
    <Card>
      <Flex full ai="center" jc="space-between">
        <Flex ai="flex-start" dir="column" gap="4">
          {typeof value === "string" ? (
            <Text fz={16} lh="19px" fw={600} color={theme.textColors.primary}>
              {value}
            </Text>
          ) : (
            <div>{value}</div>
          )}
          {info}
        </Flex>
        <Flex ai="flex-center" jc="flex-end" gap="4">
          <AppLink to={to}>{actionText}</AppLink>
          {!isNil(count) && <Counter>{count}</Counter>}
        </Flex>
      </Flex>
    </Card>
  )
}

export default DaoProfileValueWithActionCard
