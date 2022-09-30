import React, { ReactNode, useMemo } from "react"
import { BigNumber } from "@ethersproject/bignumber"

import { useERC20Data } from "state/erc20/hooks"
import { formatNumber, normalizeBigNumber } from "utils"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { IPoolQuery } from "interfaces/thegraphs/all-pools"
import { getLastInArray, getPNL, getPriceLP, getUSDPrice } from "utils/formulas"

import Icon from "components/Icon"
import TokenIcon from "components/TokenIcon"

import S, { Statistic } from "./styled"

// @param data - pool data
// @param index - indicating index in all list of pools
const MemberMobile: React.FC<{
  data: IPoolQuery
  index?: number
  children?: ReactNode
}> = ({ data, index = 0, children }) => {
  const [baseData] = useERC20Data(data.baseToken)
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

  const percPNL = useMemo(() => {
    if (
      !lastHistoryPoint ||
      !lastHistoryPoint.percPNL ||
      BigNumber.from(lastHistoryPoint.percPNL).isZero()
    ) {
      return "0"
    }

    return normalizeBigNumber(lastHistoryPoint.percPNL, 4, 2)
  }, [lastHistoryPoint])

  return (
    <S.Card
      initial={!index ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{
        duration: 0.2,
        delay: index / ((20 * index) ^ 2),
        ease: [0.29, 0.98, 0.29, 1],
      }}
    >
      <S.PoolInfoContainer>
        <S.PoolInfo>
          <Icon
            size={38}
            m="0 8px 0 0"
            source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
            address={data.id}
          />
          <div>
            <S.Title>{data.ticker}</S.Title>
            <S.Description>{data.name}</S.Description>
          </div>
        </S.PoolInfo>
        <S.BaseInfo>
          <TokenIcon address={data.baseToken} size={38} />
          <div>
            <S.Title>
              {formatNumber(priceLP, 2)}
              <S.PNL value={pnl}>{pnl}%</S.PNL>
            </S.Title>
            <S.Description>{baseData?.symbol}</S.Description>
          </div>
        </S.BaseInfo>
      </S.PoolInfoContainer>
      <S.Divider />
      <S.PoolStatisticContainer>
        <Statistic
          label="TVL"
          value={`$${getUSDPrice(
            lastHistoryPoint ? lastHistoryPoint.usdTVL : 0
          )}`}
        />
        <Statistic label="APY" value={`${APY}%`} />
        <Statistic label="P&L" value={`${percPNL}%`} />
        <Statistic label="Depositors" value={<>{data.investorsCount}</>} />
      </S.PoolStatisticContainer>
      {children}
    </S.Card>
  )
}

export default MemberMobile
