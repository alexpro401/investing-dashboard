import React, { ReactNode, useMemo } from "react"

import { useERC20 } from "hooks/useContract"
import { IPoolQuery } from "interfaces/thegraphs/all-pools"
import { formatNumber, normalizeBigNumber } from "utils"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { getLastInArray, getPNL, getPriceLP, getUSDPrice } from "utils/formulas"

import Icon from "components/Icon"
import TokenIcon from "components/TokenIcon"

import {
  Card,
  PoolInfoContainer,
  PoolInfo,
  Title,
  Description,
  BaseInfo,
  Divider,
  PoolStatisticContainer,
  Statistic,
  PNL,
} from "./styled"

// @param data - pool data
// @param index - indicating index in all list of pools
const MemberMobile: React.FC<{
  data: IPoolQuery
  index?: number
  children?: ReactNode
}> = ({ data, index = 0, children }) => {
  const [, baseData] = useERC20(data.baseToken)
  const priceLP = getPriceLP(data.priceHistory)
  const pnl = getPNL(priceLP)
  const lastHistoryPoint = getLastInArray(data.priceHistory)

  const [{ poolMetadata }] = usePoolMetadata(data.id, data.descriptionURL)

  const APY = useMemo(() => {
    if (!lastHistoryPoint || !lastHistoryPoint.APY) {
      return "0"
    }
    return normalizeBigNumber(lastHistoryPoint.APY, 4, 2)
  }, [lastHistoryPoint])

  return (
    <Card
      initial={!index ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{
        duration: 0.2,
        delay: index / ((20 * index) ^ 2),
        ease: [0.29, 0.98, 0.29, 1],
      }}
    >
      <PoolInfoContainer>
        <PoolInfo>
          <Icon
            size={38}
            m="0 8px 0 0"
            source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
            address={data.id}
          />
          <div>
            <Title>{data.ticker}</Title>
            <Description>{data.name}</Description>
          </div>
        </PoolInfo>
        <BaseInfo>
          <TokenIcon address={data.baseToken} size={38} />
          <div>
            <Title>
              {formatNumber(priceLP, 2)}
              <PNL>{pnl}%</PNL>
            </Title>
            <Description>{baseData?.symbol}</Description>
          </div>
        </BaseInfo>
      </PoolInfoContainer>
      <Divider />
      <PoolStatisticContainer>
        <Statistic
          label="TVL"
          value={`$${getUSDPrice(
            lastHistoryPoint ? lastHistoryPoint.usdTVL : 0
          )}`}
        />
        <Statistic label="APY" value={`${APY}%`} />
        <Statistic label="P&L" value={`0%`} />
        <Statistic label="Depositors" value={<>{data.investorsCount}</>} />
      </PoolStatisticContainer>
      {children}
    </Card>
  )
}

export default MemberMobile
