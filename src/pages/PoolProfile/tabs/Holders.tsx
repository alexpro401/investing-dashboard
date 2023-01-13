import { FC, HTMLAttributes, useCallback, useContext, useMemo } from "react"
import { isNil } from "lodash"
import { v4 as uuidv4 } from "uuid"

import { Value, Link } from "./styled"
import { Card, Icon } from "common"
import { Flex } from "theme"
import { normalizeBigNumber, shortenAddress } from "utils"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { ICON_NAMES } from "consts/icon-names"
import Table from "components/Table"
import { useSingleContractMultipleData } from "state/multicall/hooks"
import { useTraderPoolContract } from "contracts"
import { PoolProfileContext } from "pages/PoolProfile/context"
import { useWeb3React } from "@web3-react/core"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const TabPoolHolders: FC<Props> = ({ ...rest }) => {
  const { chainId } = useWeb3React()

  const { poolData, baseToken, poolInfo } = useContext(PoolProfileContext)

  const total = Number(poolData?.investorsCount) || 0

  const traderPool = useTraderPoolContract(poolData.id)

  const investors = useMemo(() => {
    if (!poolData || !poolData.investors) return []

    return poolData.investors.map((i) => [i.id])
  }, [poolData])

  const balances = useSingleContractMultipleData(
    traderPool,
    "balanceOf",
    investors
  )

  const usersToBalancesMap = useMemo(() => {
    if (!balances || balances.some((b) => b.loading)) {
      return {}
    }

    return investors.reduce(
      (acc, investor, index) => ({
        ...acc,
        [investor[0]]: balances[index].result?.[0],
      }),
      {}
    )
  }, [balances, investors])

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
            <Value.Medium color="#E4F2FF">
              {normalizeBigNumber(usersToBalancesMap[id], 18, 6)}
            </Value.Medium>
            <Value.Medium color="#B1C7FC">
              {baseToken?.symbol ?? ""}
            </Value.Medium>
          </Flex>
        </Flex>
      </Link>
    ),
    [usersToBalancesMap]
  )

  return (
    <Card>
      <Table data={poolData.investors} nodeHead={TableHead} row={getTableRow} />
    </Card>
  )
}

export default TabPoolHolders
