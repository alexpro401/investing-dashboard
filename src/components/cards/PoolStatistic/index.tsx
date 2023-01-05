import { FC, ReactNode, useMemo } from "react"
import { BigNumber } from "@ethersproject/bignumber"
import { isNil } from "lodash"

import { Flex } from "theme"
import { CardInfo, PNLIndicator } from "common"
import Icon from "components/Icon"
import Skeleton from "components/Skeleton"
import TokenIcon from "components/TokenIcon"

import * as S from "./styled"

import { useERC20Data } from "state/erc20/hooks"
import { formatNumber, normalizeBigNumber } from "utils"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { IPoolQuery } from "interfaces/thegraphs/all-pools"
import { getLastInArray, getPNL, getPriceLP } from "utils/formulas"

const HeadNodesSkeleton: FC = () => (
  <Flex ai="center" jc="flex-start">
    <Skeleton variant="circle" w="38px" h="38px" />
    <Flex dir="column" ai="flex-start" jc="space-between" m="0 0 0 10px">
      <Skeleton variant="text" h="21px" w="121px" />
      <Skeleton variant="text" h="17px" w="50px" m="4px 0 0" />
    </Flex>
  </Flex>
)

interface Props {
  data: IPoolQuery
  index?: number
  children?: ReactNode
}
const PoolStatisticCard: FC<Props> = ({ data, index = 0, children }) => {
  const [{ poolMetadata: metadata }] = usePoolMetadata(
    data.id,
    data?.descriptionURL
  )
  const lastHistoryPoint = getLastInArray(data?.priceHistory)
  const [baseToken] = useERC20Data(data?.baseToken)

  const priceLP = getPriceLP(data?.priceHistory)
  const pnl = getPNL(priceLP)

  const TVL = useMemo(() => {
    if (isNil(lastHistoryPoint)) {
      return <Skeleton w="25px" h="16px" />
    }

    return (
      <S.StatisticValue>
        ${normalizeBigNumber(lastHistoryPoint.usdTVL, 18, 2)}
      </S.StatisticValue>
    )
  }, [lastHistoryPoint])

  const APY = useMemo(() => {
    if (isNil(lastHistoryPoint)) {
      return <Skeleton w="25px" h="16px" />
    }

    return (
      <S.StatisticValue>
        {normalizeBigNumber(lastHistoryPoint.APY, 4, 2)}%
      </S.StatisticValue>
    )
  }, [lastHistoryPoint])

  const PNL = useMemo(() => {
    if (isNil(lastHistoryPoint)) {
      return <Skeleton w="25px" h="16px" />
    }
    if (
      !lastHistoryPoint ||
      BigNumber.from(lastHistoryPoint.percPNLBase).isZero()
    ) {
      return <S.StatisticValue>0.0%</S.StatisticValue>
    }

    return (
      <S.StatisticValue>
        {normalizeBigNumber(lastHistoryPoint.percPNLBase, 4, 2)}%
      </S.StatisticValue>
    )
  }, [lastHistoryPoint])

  const depositors = useMemo(() => {
    if (isNil(data)) return <Skeleton w="25px" h="16px" />

    return <S.StatisticValue>{data.investorsCount}</S.StatisticValue>
  }, [data])

  const userStatistic = useMemo(
    () => [
      {
        label: "TVL",
        value: TVL,
      },
      {
        label: "APY",
        value: APY,
      },
      {
        label: "P&L",
        value: PNL,
      },
      {
        label: "Depositors",
        value: depositors,
      },
    ],
    [TVL, APY, PNL, depositors]
  )

  const leftNode = useMemo(() => {
    if (isNil(data) || isNil(metadata)) {
      return <HeadNodesSkeleton />
    }

    return (
      <Flex ai="center" jc="flex-start">
        <Icon
          size={38}
          m="0 8px 0 0"
          source={metadata?.assets[metadata?.assets.length - 1]}
          address={data.id}
        />
        <div>
          <S.Title>{data.ticker}</S.Title>
          <S.Description align="left">{data.name}</S.Description>
        </div>
      </Flex>
    )
  }, [data, metadata])

  const rightNode = useMemo(() => {
    if (isNil(data) || isNil(baseToken) || isNil(pnl) || isNil(priceLP)) {
      return <HeadNodesSkeleton />
    }

    return (
      <Flex ai="center" jc="flex-end">
        <div>
          <Flex ai="center" jc="flex-end" gap="4">
            <PNLIndicator pnl={pnl} />
            <S.Title>{formatNumber(priceLP, 2)}</S.Title>
          </Flex>
          <S.Description>{baseToken.symbol}</S.Description>
        </div>
        <TokenIcon address={data.baseToken} size={38} m="0 0 0 8px" />
      </Flex>
    )
  }, [data, baseToken, priceLP, pnl])

  return (
    <S.Animation index={index}>
      <CardInfo
        nodeHeadLeft={leftNode}
        nodeHeadRight={rightNode}
        statistic={userStatistic}
      >
        {children}
      </CardInfo>
    </S.Animation>
  )
}

export default PoolStatisticCard
