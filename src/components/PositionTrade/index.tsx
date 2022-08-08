import { useMemo } from "react"
import { format } from "date-fns"
import { parseEther } from "@ethersproject/units"
import { BigNumber, FixedNumber } from "@ethersproject/bignumber"

import { useActiveWeb3React } from "hooks"
import { SupportedChainId } from "constants/chains"
import { expandTimestamp, normalizeBigNumber } from "utils"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"

import S from "./styled"

import externalLinkIcon from "assets/icons/external-link.svg"

interface Props {
  data: any
  baseTokenSymbol?: string
  timestamp?: string
  isBuy?: boolean
  amount?: BigNumber
  priceBase?: BigNumber
  priceUsd?: BigNumber
}

const PositionTrade: React.FC<Props> = ({
  data,
  baseTokenSymbol,
  timestamp,
  isBuy,
  amount,
  priceBase,
  priceUsd,
  ...rest
}) => {
  const { chainId } = useActiveWeb3React()

  const href = useMemo(() => {
    if (data && chainId) {
      const hash = data.hash ?? data.id
      return getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)
    }

    return getExplorerLink(chainId ?? SupportedChainId.BINANCE_SMART_CHAIN)
  }, [chainId, data])

  const date = useMemo(() => {
    if (!timestamp) return "0"
    return format(expandTimestamp(Number(timestamp)), "MMM dd, y HH:mm")
  }, [timestamp])

  const volume = useMemo(() => {
    if (!amount) return "0"
    return normalizeBigNumber(amount, 18, 5)
  }, [amount])

  const priceBaseToken = useMemo(() => {
    if (priceBase) {
      return normalizeBigNumber(priceBase, 18, 5)
    }
    if (!data.toVolume || !data.fromVolume) return "0"

    const toFixed = FixedNumber.fromValue(data.toVolume, 18)
    const fromFixed = FixedNumber.fromValue(data.fromVolume, 18)

    if (isBuy) {
      return normalizeBigNumber(
        parseEther(fromFixed.divUnsafe(toFixed)._value),
        18,
        5
      )
    }
    return normalizeBigNumber(
      parseEther(toFixed.divUnsafe(fromFixed)._value),
      18,
      5
    )
  }, [data.fromVolume, data.toVolume, isBuy, priceBase])

  const _priceUsd = useMemo(() => {
    if (priceUsd) return normalizeBigNumber(priceUsd, 18, 2)
    if (!data || !data.usdVolume) return "0"

    const usdVolumeFixed = FixedNumber.fromValue(data.usdVolume, 18)

    let res

    if (isBuy) {
      res = parseEther(
        usdVolumeFixed.divUnsafe(FixedNumber.fromValue(data.toVolume, 18))
          ._value
      )
    } else {
      res = parseEther(
        usdVolumeFixed.divUnsafe(FixedNumber.fromValue(data.fromVolume, 18))
          ._value
      )
    }

    return normalizeBigNumber(res, 18, 2)
  }, [data, isBuy, priceUsd])

  const PositionDirection = (
    <S.Direction isBuy={isBuy}>{isBuy ? "Buy" : "Sell"}</S.Direction>
  )

  return (
    <S.Container
      {...rest}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <S.Content>
        <S.Item>
          <S.Label>
            {date}
            <S.ExternalLinkIcon src={externalLinkIcon} />
          </S.Label>
          <S.Value>
            {PositionDirection} {volume}
          </S.Value>
        </S.Item>
        <S.Item>
          <S.Label>Price ({baseTokenSymbol ?? ""})</S.Label>
          <S.Value>{priceBaseToken}</S.Value>
        </S.Item>
        <S.Item>
          <S.Label>Price USD</S.Label>
          <S.Value>${_priceUsd}</S.Value>
        </S.Item>
      </S.Content>
    </S.Container>
  )
}

export default PositionTrade
