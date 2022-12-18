import { FC, useMemo } from "react"
import { BigNumber } from "@ethersproject/bignumber"

import * as S from "./styled"
import { Flex, getAmountColor, Text } from "theme"
import Icon from "components/Icon"
import Skeleton from "components/Skeleton"
import TokenIcon from "components/TokenIcon"

import { normalizeBigNumber } from "utils"
import { getLastInArray } from "utils/formulas"
import useInvestorTV from "hooks/useInvestorTV"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { IPoolQuery } from "interfaces/thegraphs/all-pools"

interface Props {
  data: IPoolQuery
  account: string
}

function getPnlSymbol(pnl) {
  if (pnl.gt(0)) return "+"
  return null
}

const InvestedFund: FC<Props> = ({ data, account }) => {
  const [{ poolMetadata }] = usePoolMetadata(data.id, data.descriptionURL)
  const lastHistoryPoint = getLastInArray(data.priceHistory)

  const _account = useMemo(() => account, [account])
  const _pools = useMemo(() => [{ id: data.id }], [data])
  const [{ usd: tvUSD }, { loading: tvLoading }] = useInvestorTV(
    _account,
    _pools
  )

  const TvUsd = useMemo(() => {
    if (tvLoading) {
      return <Skeleton w="50px" h="17px" />
    }

    return (
      <Text block color="#E4F2FF" fz={16} fw={600}>
        <>$ {normalizeBigNumber(tvUSD, 18, 2)}</>
      </Text>
    )
  }, [tvLoading, tvUSD])

  const PnlPercentage = useMemo(() => {
    if (!lastHistoryPoint || !lastHistoryPoint.percPNLBase) {
      return <Skeleton w="50px" h="17px" />
    }

    const pnlBN = BigNumber.from(lastHistoryPoint.percPNLBase)
    const pnl = normalizeBigNumber(pnlBN, 4, 2)

    return (
      <Text block color={getAmountColor(pnl, "#E4F2FF")} fz={16} fw={600}>
        {getPnlSymbol(pnlBN)} {pnl}%
      </Text>
    )
  }, [lastHistoryPoint])

  return (
    <S.Container>
      <S.Content>
        <Flex full ai="center" jc="flex-start">
          <S.Icons>
            <Icon
              size={40}
              m="0"
              source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
              address={data.id}
            />
            <TokenIcon address={data.baseToken} size={20} m="0" />
          </S.Icons>
          <div>
            <Text block color="#E4F2FF" fz={16} fw={600} p="0 0 4px">
              {data.ticker}
            </Text>
            <Text block color="#788AB4" fz={13}>
              {data.name}
            </Text>
          </div>
        </Flex>
        <div>
          <Text block color="#788AB4" fz={13} p="0 0 4px">
            TV
          </Text>
          {TvUsd}
        </div>
        <div>
          <Text block color="#788AB4" fz={13} p="0 0 4px">
            P&L
          </Text>
          {PnlPercentage}
        </div>
      </S.Content>
    </S.Container>
  )
}

export default InvestedFund
