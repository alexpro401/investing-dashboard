import { FC, useCallback, useMemo } from "react"
import { isNil } from "lodash"
import { v4 as uuidv4 } from "uuid"

import { IPoolQuery } from "interfaces/thegraphs/all-pools"
import { Indents, Value, Link } from "../styled"
import { Card, Icon } from "common"
import { Flex } from "theme"
import { shortenAddress } from "utils"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { Token } from "interfaces"
import { ICON_NAMES } from "consts/icon-names"
import Table from "components/Table"

interface Props {
  poolData: IPoolQuery
  baseToken: Token | null
  chainId?: number
}

const TabPoolHolders: FC<Props> = ({ poolData, baseToken, chainId }) => {
  const total = Number(poolData?.investorsCount) || 0

  const getInvestorExplorerLink = useCallback(
    (id) => {
      if (isNil(chainId)) return ""
      return getExplorerLink(chainId, id, ExplorerDataType.ADDRESS)
    },
    [chainId]
  )

  const TableHead = useMemo(
    () => (
      <Flex full ai="center" jc="space-between">
        <Value.Medium color="#E4F2FF">Addresses: {total}</Value.Medium>
        <Value.Medium color="#E4F2FF">Amount</Value.Medium>
      </Flex>
    ),
    [total]
  )

  const getTableRow = useCallback(
    ({ id }) => (
      <Link
        key={uuidv4()}
        href={getInvestorExplorerLink(id)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Flex full ai="center" jc="space-between" p={"16px 0"}>
          <Value.MediumThin color="#E4F2FF" block>
            <Flex ai="center" jc="flex-start" gap="4">
              {shortenAddress(id, 4)}
              <Icon name={ICON_NAMES.externalLink} />
            </Flex>
          </Value.MediumThin>

          <Flex ai="center" jc="flex-end" gap="4">
            <Value.Medium color="#E4F2FF">100,500</Value.Medium>
            <Value.Medium color="#B1C7FC">
              {baseToken?.symbol ?? ""}
            </Value.Medium>
          </Flex>
        </Flex>
      </Link>
    ),
    []
  )

  return (
    <>
      <Indents side={false}>
        <Card>
          <Table
            data={poolData.investors}
            nodeHead={TableHead}
            row={getTableRow}
          />
        </Card>
      </Indents>
    </>
  )
}

export default TabPoolHolders
