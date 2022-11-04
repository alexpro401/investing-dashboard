import * as React from "react"

import { FlexLink, Image, TextValue } from "../styled"

import theme, { Flex } from "theme"
import { Card, Icon } from "common"
import Table from "components/Table"
import { v4 as uuidv4 } from "uuid"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { shortenAddress } from "utils"
import { ICON_NAMES } from "constants/icon-names"
import usersImageUrl from "assets/images/users.svg"

interface Props {
  data: any[]
  chainId?: number
}

const DaoProfileTabValidators: React.FC<Props> = ({ data, chainId }) => {
  const total = data.length ?? 0

  const TableHead = React.useMemo(
    () => (
      <Flex full ai="center" jc="space-between">
        <TextValue fw={600}>Validators: {total}</TextValue>
        <TextValue fw={600}>Total votes: 11,110</TextValue>
      </Flex>
    ),
    [total]
  )

  const TableNoDataPlaceholder = React.useMemo(
    () => (
      <Flex full dir="column" ai="center" jc="center">
        <Image src={usersImageUrl} alt="No data" />
        <TextValue align="center" lh="19.5px" fw={500}>
          В этом ДАО нет валидаторов, но вы можете добавить их создав пропозал
          для валидаторов
        </TextValue>
      </Flex>
    ),
    [total]
  )

  const getTableRow = React.useCallback(
    ({ id }) => (
      <FlexLink
        full
        as={"a"}
        key={uuidv4()}
        href={getExplorerLink(chainId ?? 0, id, ExplorerDataType.ADDRESS)}
      >
        <Flex full ai="center" jc="space-between">
          <TextValue color={theme.textColors.secondary} block>
            <Flex ai="center" jc="flex-start" gap="4">
              {shortenAddress(id, 4)}
              <Icon name={ICON_NAMES.externalLink} />
            </Flex>
          </TextValue>

          <Flex ai="center" jc="flex-end" gap="4">
            <TextValue>100,500</TextValue>
            <TextValue color={theme.textColors.secondary}>111PG</TextValue>
          </Flex>
        </Flex>
      </FlexLink>
    ),
    [chainId]
  )

  return (
    <>
      <Card>
        <Table
          data={data}
          row={getTableRow}
          nodeHead={TableHead}
          placeholder={TableNoDataPlaceholder}
        />
      </Card>
    </>
  )
}

export default DaoProfileTabValidators
