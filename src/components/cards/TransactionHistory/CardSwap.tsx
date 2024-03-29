import { useMemo } from "react"
import { format } from "date-fns/esm"

import { Flex } from "theme"
import TokenIcon from "components/TokenIcon"
import ExternalLink from "components/ExternalLink"

import { expandTimestamp } from "utils"
import { useERC20Data } from "state/erc20/hooks"
import { DATE_TIME_FORMAT } from "consts/time"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"

import S from "./styled"
import { Exchange } from "interfaces/thegraphs/interactions"

interface IProps {
  hash: string
  info: Exchange
  chainId?: number
  timestamp?: string
}

const TransactionHistoryCardSwap: React.FC<IProps> = ({
  hash,
  info,
  chainId,
  timestamp,
}) => {
  const [toToken] = useERC20Data(info?.toToken)
  const [fromToken] = useERC20Data(info?.fromToken)

  const explorerUrl = useMemo<string>(() => {
    if (!chainId || !hash) return ""
    return getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)
  }, [chainId, hash])

  const datetime = useMemo<string>(() => {
    if (!timestamp) return ""
    return format(expandTimestamp(Number(timestamp)), DATE_TIME_FORMAT)
  }, [timestamp])

  return (
    <S.Container>
      <Flex>
        <S.CardIcons>
          <TokenIcon m="0" address={fromToken?.address} size={20} />
          <TokenIcon m="0" address={toToken?.address} size={20} />
        </S.CardIcons>

        <ExternalLink fz="13px" fw="500" color="#2680EB" href={explorerUrl}>
          Swap {fromToken?.symbol} for {toToken?.symbol}
        </ExternalLink>
      </Flex>
      <S.CardTime>{datetime}</S.CardTime>
    </S.Container>
  )
}

export default TransactionHistoryCardSwap
