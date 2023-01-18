import { FC, HTMLAttributes, useCallback, useContext, useMemo } from "react"
import { isNil } from "lodash"
import { v4 as uuidv4 } from "uuid"

import * as S from "./styled"
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

  const { poolData, baseToken } = useContext(PoolProfileContext)

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

  const getTableRow = useCallback(
    ({ id }) => (
      <S.Link
        key={uuidv4()}
        href={getInvestorExplorerLink(id)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Flex full ai="center" jc="space-between" p={"16px 0"}>
          <S.TabCardValue>
            <Flex ai="center" jc="flex-start" gap="4">
              {shortenAddress(id, 4)}
              <Icon name={ICON_NAMES.externalLink} />
            </Flex>
          </S.TabCardValue>

          <Flex ai="center" jc="flex-end" gap="4">
            <S.TabCardValue>
              {normalizeBigNumber(usersToBalancesMap[id], 18, 6)}
            </S.TabCardValue>
            <S.TabCardValue>{baseToken?.symbol ?? ""}</S.TabCardValue>
          </Flex>
        </Flex>
      </S.Link>
    ),
    [baseToken.symbol, getInvestorExplorerLink, usersToBalancesMap]
  )

  return (
    <Card>
      <Table
        data={poolData.investors}
        nodeHead={
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Holders: {poolData?.investorsCount}</S.TabCardLabel>
            <S.TabCardLabel>Amount</S.TabCardLabel>
          </Flex>
        }
        row={getTableRow}
      />
    </Card>
  )
}

export default TabPoolHolders
