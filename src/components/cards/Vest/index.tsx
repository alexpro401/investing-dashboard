import { FC, useMemo } from "react"
import { format } from "date-fns"
import { BigNumber } from "@ethersproject/bignumber"

import { useActiveWeb3React, useBreakpoints } from "hooks"
import { SupportedChainId } from "consts/chains"
import { expandTimestamp, formatBigNumber, normalizeBigNumber } from "utils"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { DATE_TIME_FORMAT } from "consts/time"
import { InvestorRiskyVest } from "interfaces/thegraphs/investors"
import { divideBignumbers } from "utils/formulas"

import * as S from "./styled"

import externalLinkIcon from "assets/icons/external-link.svg"
import { Flex } from "theme"
import { ICON_NAMES } from "consts"

interface Props {
  data: InvestorRiskyVest
  baseTokenSymbol: string
}

const VestCard: FC<Props> = ({ data, baseTokenSymbol, ...rest }) => {
  const { chainId } = useActiveWeb3React()
  const { isDesktop } = useBreakpoints()

  const href = useMemo(() => {
    if (data && chainId) {
      const { hash } = data

      return getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)
    }

    return getExplorerLink(chainId ?? SupportedChainId.BINANCE_SMART_CHAIN)
  }, [chainId, data])

  const date = useMemo(() => {
    if (!data) return "0"
    const { timestamp } = data
    return format(expandTimestamp(Number(timestamp)), DATE_TIME_FORMAT)
  }, [data])

  const volumeLP2 = useMemo(() => {
    if (!data) return "0"
    const { lp2Volume } = data
    return normalizeBigNumber(BigNumber.from(lp2Volume), 18, 4)
  }, [data])

  const LP2PriceBase = useMemo(() => {
    if (!data) return "0"
    const { lp2Volume, baseVolume } = data

    const result = divideBignumbers(
      [BigNumber.from(lp2Volume), 18],
      [BigNumber.from(baseVolume), 18]
    )
    return formatBigNumber(result, 18, 4)
  }, [data])

  const LP2PriceUSD = useMemo(() => {
    if (!data) return "0"
    const { lp2Volume, usdVolume } = data

    const result = divideBignumbers(
      [BigNumber.from(lp2Volume), 18],
      [BigNumber.from(usdVolume), 18]
    )
    return formatBigNumber(result, 18, 2)
  }, [data])

  const PositionDirection = (
    <S.Direction isBuy={data.isInvest}>
      {data.isInvest ? "Buy" : "Sell"}
    </S.Direction>
  )

  return (
    <S.Container
      {...rest}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <S.Content>
        {isDesktop ? (
          <S.Item>
            <Flex full jc={"flex-start"} gap={"8"}>
              <S.DirectionIconWrp>
                <S.DirectionIcon
                  name={ICON_NAMES.arrow}
                  dir={data.isInvest ? "bottom-left" : "top-right"}
                />
              </S.DirectionIconWrp>
              {PositionDirection}
            </Flex>
          </S.Item>
        ) : (
          <S.Item>
            <S.Label>
              {date}
              <S.ExternalLinkIcon src={externalLinkIcon} />
            </S.Label>
            <S.Value>
              {PositionDirection} {volumeLP2} LP2
            </S.Value>
          </S.Item>
        )}
        <S.Item>
          <S.Label>Price ({baseTokenSymbol ?? ""})</S.Label>
          <S.Value>{LP2PriceBase}</S.Value>
        </S.Item>
        <S.Item>
          <S.Label>Price USD</S.Label>
          <S.Value>${LP2PriceUSD}</S.Value>
        </S.Item>
        {isDesktop && (
          <S.Item>
            <S.Value>
              {date}
              <S.ExternalLinkIcon src={externalLinkIcon} />
            </S.Value>
          </S.Item>
        )}
      </S.Content>
    </S.Container>
  )
}

export default VestCard
