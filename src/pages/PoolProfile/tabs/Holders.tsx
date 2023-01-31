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

  const {
    isTrader,
    creationDate,
    fundAddress,
    basicToken,
    fundTicker,
    fundName,
    fundType,
    fundImageUrl,
    minInvestAmount,
    emission,
    availableLPTokens,
    fundManagers,
    poolInvestors,
    whiteList,
    openPosition,
    isInvestorStricted,
    performanceFee,
    fundDescription,
    fundStrategy,
    trades,
    orderSize,
    dailyProfitPercent,
    timePositions,
    sortino,
    maxLoss,

    pnl,
    depositors,
    apy,
    tvl,
    priceLP,
    lockedFunds,
  } = useContext(PoolProfileContext)

  const traderPool = useTraderPoolContract(fundAddress)

  const investors = useMemo(() => {
    if (!poolInvestors) return []

    return poolInvestors.map((i) => [i.id])
  }, [poolInvestors])

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
            <S.TabCardValue>{basicToken?.symbol ?? ""}</S.TabCardValue>
          </Flex>
        </Flex>
      </S.Link>
    ),
    [basicToken, getInvestorExplorerLink, usersToBalancesMap]
  )

  return (
    <Card>
      {poolInvestors && (
        <Table
          data={poolInvestors}
          nodeHead={
            <Flex full ai="center" jc="space-between">
              <S.TabCardLabel>Holders: {poolInvestors?.length}</S.TabCardLabel>
              <S.TabCardLabel>Amount</S.TabCardLabel>
            </Flex>
          }
          row={getTableRow}
        />
      )}
    </Card>
  )
}

export default TabPoolHolders
