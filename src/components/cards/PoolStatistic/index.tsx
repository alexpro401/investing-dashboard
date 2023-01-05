import { FC, HTMLAttributes, ReactNode, useMemo } from "react"
import { BigNumber } from "@ethersproject/bignumber"
import { isNil } from "lodash"
import { MotionProps } from "framer-motion"

import { Flex, getAmountColor, Text } from "theme"
import { CardInfo } from "common"
import Icon from "components/Icon"
import Skeleton from "components/Skeleton"
import TokenIcon from "components/TokenIcon"

import * as S from "./styled"

import { useERC20Data } from "state/erc20/hooks"
import { DateUtil, formatNumber, normalizeBigNumber } from "utils"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { IPoolQuery } from "interfaces/thegraphs/all-pools"
import { getLastInArray, getPNL, getPriceLP } from "utils/formulas"
import { format } from "date-fns"
import { DATE_FORMAT } from "consts/time"
import { CHART_TYPE, TIMEFRAME, TIMEFRAME_FROM_DATE } from "consts/chart"
import theme from "theme"
import { usePoolPriceHistory } from "hooks/usePool"
import Chart from "components/Chart"
import { parseDuration, parseSeconds } from "utils/time"
import { useBreakpoints } from "hooks"

const HeadNodesSkeleton: FC = () => (
  <Flex ai="center" jc="flex-start">
    <Skeleton variant="circle" w="38px" h="38px" />
    <Flex dir="column" ai="flex-start" jc="space-between" m="0 0 0 10px">
      <Skeleton variant="text" h="21px" w="121px" />
      <Skeleton variant="text" h="17px" w="50px" m="4px 0 0" />
    </Flex>
  </Flex>
)

type Props = {
  data: IPoolQuery
  index?: number
  children?: ReactNode
  isMobile?: boolean
  hideChart?: boolean
  stroke?: string
} & HTMLAttributes<HTMLDivElement> &
  MotionProps

const PoolStatisticCard: FC<Props> = ({
  data,
  index = 0,
  children,
  hideChart = false,
  stroke = theme.statusColors.success,
  ...rest
}) => {
  const { isMobile, isTablet, isDesktop } = useBreakpoints()
  const [{ poolMetadata: metadata }] = usePoolMetadata(
    data.id,
    data?.descriptionURL
  )
  const lastHistoryPoint = getLastInArray(data?.priceHistory)
  const [baseToken] = useERC20Data(data?.baseToken)

  const startDate = useMemo(() => {
    const durationFromNow = parseDuration(
      parseSeconds(DateUtil.timeFromNow(data.creationTime))
    )

    if (durationFromNow.years === 0) {
      return Number(data.creationTime)
    } else {
      return TIMEFRAME_FROM_DATE[TIMEFRAME.all]
    }
  }, [data.creationTime])

  const [history, fetchingHistory] = usePoolPriceHistory(
    data.id,
    TIMEFRAME.all,
    startDate
  )
  const priceLP = getPriceLP(data?.priceHistory)
  const pnl = getPNL(priceLP)

  const TVL = useMemo(() => {
    if (isNil(lastHistoryPoint)) {
      return <Skeleton w="25px" h="16px" />
    }

    return `$${normalizeBigNumber(lastHistoryPoint.usdTVL, 18, 2)}`
  }, [lastHistoryPoint])

  const APY = useMemo(() => {
    if (isNil(lastHistoryPoint)) {
      return <Skeleton w="25px" h="16px" />
    }

    return `${normalizeBigNumber(lastHistoryPoint.APY, 4, 2)}%`
  }, [lastHistoryPoint])

  const PNL = useMemo(() => {
    if (isNil(lastHistoryPoint)) {
      return <Skeleton w="25px" h="16px" />
    }
    if (
      !lastHistoryPoint ||
      BigNumber.from(lastHistoryPoint.percPNLBase).isZero()
    ) {
      return "0.0%"
    }

    return `${normalizeBigNumber(lastHistoryPoint.percPNLBase, 4, 2)}%`
  }, [lastHistoryPoint])

  const depositors = useMemo(() => {
    if (isNil(data)) return <Skeleton w="25px" h="16px" />

    return data.investorsCount
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

  const _Chart = useMemo(
    () =>
      hideChart ? null : (
        <div
          style={{
            height: isTablet ? "39px" : "35px",
            width: isTablet ? "180px" : "118px",
            margin: "auto",
            flex: "1 0 118px",
          }}
        >
          <Chart
            type={CHART_TYPE.area}
            data={history}
            height={isTablet ? "39px" : "35px"}
            chart={{
              stackOffset: "silhouette",
            }}
            chartItems={[
              {
                type: "linear",
                dataKey: "price",
                legendType: "triangle",
                isAnimationActive: true,
                stroke,
              },
            ]}
            loading={fetchingHistory}
          />
        </div>
      ),
    [history, fetchingHistory, stroke, hideChart, isTablet]
  )

  const leftNode = useMemo(() => {
    if (isNil(data) || isNil(metadata)) {
      return <HeadNodesSkeleton />
    }

    return (
      <Flex ai="center" jc="flex-start">
        <Icon
          size={!isDesktop ? 38 : 100}
          m="0 8px 0 0"
          source={metadata?.assets[metadata?.assets.length - 1]}
          address={data.id}
        />
        <div>
          {isDesktop && (
            <S.Description align="left">
              {format(new Date(data.creationTime * 1000), DATE_FORMAT)}
            </S.Description>
          )}
          <S.Title>{data.ticker}</S.Title>
          {!isDesktop && (
            <S.Description align="left">{data.name}</S.Description>
          )}
        </div>
      </Flex>
    )
  }, [data, metadata, isDesktop])

  const rightNode = useMemo(() => {
    if (isNil(data) || isNil(baseToken) || isNil(pnl) || isNil(priceLP)) {
      return <HeadNodesSkeleton />
    }

    return (
      <Flex ai={"center"} jc={"space-between"} gap={"88"}>
        {!isMobile && isTablet && _Chart}
        <Flex ai="center" jc="flex-end">
          {!isDesktop && (
            <div>
              <Flex ai="center" jc="flex-end" gap="4">
                <Text fz={10} lh="12px" color={getAmountColor(pnl)}>
                  {Number(pnl) > 0 ? "+" : null}
                  {pnl}%
                </Text>
                <S.Title>{formatNumber(priceLP, 2)}</S.Title>
              </Flex>
              <S.Description>{baseToken.symbol}</S.Description>
            </div>
          )}
          <TokenIcon address={data.baseToken} size={38} m="0 0 0 8px" />
        </Flex>
      </Flex>
    )
  }, [data, baseToken, priceLP, pnl, isDesktop, isTablet, isMobile, _Chart])

  const _children = useMemo(() => {
    if (isDesktop && !isNil(data)) {
      return (
        <>
          {_Chart}
          {children}
        </>
      )
    }

    return children
  }, [children, isDesktop, _Chart])

  return (
    <S.Animation
      initial={!index ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{
        duration: 0.2,
        delay: index / ((20 * index) ^ 2),
        ease: [0.29, 0.98, 0.29, 1],
      }}
      {...rest}
    >
      <CardInfo
        nodeHeadLeft={leftNode}
        nodeHeadRight={rightNode}
        statistic={userStatistic}
        isMobile={isMobile}
      >
        {_children}
      </CardInfo>
    </S.Animation>
  )
}

export default PoolStatisticCard
