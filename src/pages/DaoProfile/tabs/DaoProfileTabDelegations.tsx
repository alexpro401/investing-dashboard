import * as React from "react"
import { v4 as uuidv4 } from "uuid"

import theme, { Flex, Text } from "theme"
import { Card, Icon } from "common"
import {
  AppLink,
  FlexLink,
  Image,
  Indents,
  TextLabel,
  TextValue,
} from "../styled"
import { DaoProfileValueWithActionCard } from "../components"

import Table from "components/Table"
import { AppButton } from "common"
import usersImageUrl from "assets/images/users.svg"

import { shortenAddress } from "utils"
import { ICON_NAMES } from "constants/icon-names"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { useNavigate } from "react-router-dom"

interface Props {
  data: any[]
  chainId?: number
  daoAddress?: string
}

const DaoProfileTabDelegations: React.FC<Props> = ({
  data,
  chainId,
  daoAddress,
}) => {
  const navigate = useNavigate()
  const total = data.length ?? 0

  const TableHead = React.useMemo(
    () => (
      <Flex full ai="center" jc="space-between">
        <TextValue fw={600} color={theme.statusColors.success}>
          TOP delegators
        </TextValue>
        <TextValue fw={600}>Total delegated: 1,000,234</TextValue>
      </Flex>
    ),
    [total]
  )

  const TableNoDataPlaceholder = React.useMemo(
    () => (
      <Flex full dir="column" ai="center" jc="center">
        <Image src={usersImageUrl} alt="No data" />
        <TextValue align="center" lh="19.5px" fw={500}>
          В этом ДАО нет делегаторов, но вы можете добавить их создав пропозал
          для делегаторов
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
          <TextValue color={theme.textColors.secondary} block fw={500}>
            <Flex ai="center" jc="flex-start" gap="4">
              {shortenAddress(id, 4)}
              <Icon name={ICON_NAMES.externalLink} />
            </Flex>
          </TextValue>
          <TextValue fw={500}>100,500</TextValue>
          <AppLink color="default" size="no-paddings" text="Delegate" />
        </Flex>
      </FlexLink>
    ),
    [chainId]
  )

  return (
    <>
      <DaoProfileValueWithActionCard
        value={
          <>
            <Text color={theme.textColors.primary} fz={16} fw={600}>
              1,000
            </Text>
            <Text color={theme.textColors.secondary} fz={16} fw={600}>
              {" "}
              Votes
            </Text>
          </>
        }
        info={<TextLabel>Delegated by me</TextLabel>}
        onClick={() => navigate(`/dao/${daoAddress ?? ""}/delegation/out`)}
        actionText="Manage"
      />
      <Indents top side={false}>
        <DaoProfileValueWithActionCard
          value={
            <>
              <Text color={theme.textColors.primary} fz={16} fw={600}>
                1,000,200
              </Text>
              <Text color={theme.textColors.secondary} fz={16} fw={600}>
                {" "}
                Votes
              </Text>
            </>
          }
          info={<TextLabel>Delegated to me</TextLabel>}
          onClick={() => navigate(`/dao/${daoAddress ?? ""}/delegation/in`)}
          actionText="Details"
        />
      </Indents>
      <Indents top side={false}>
        <Card>
          <Table
            data={data}
            row={getTableRow}
            nodeHead={TableHead}
            placeholder={TableNoDataPlaceholder}
          />
        </Card>
      </Indents>
      <Indents top side={false}>
        <AppButton
          full
          size="medium"
          color="primary"
          onClick={() => alert("Redirect to delegating terminal")}
          text="Delegate to address"
        />
      </Indents>
    </>
  )
}

export default DaoProfileTabDelegations
