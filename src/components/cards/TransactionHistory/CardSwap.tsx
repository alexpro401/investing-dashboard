import { useMemo } from "react"
import { format } from "date-fns/esm"

import { Flex } from "theme"
import TokenIcon from "components/TokenIcon"
import ExternalLink from "components/ExternalLink"

import { expandTimestamp } from "utils"
import { ITokenBase } from "constants/interfaces"
import { DATE_TIME_FORMAT } from "constants/time"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"

import S from "./styled"

interface ITransactionSwap {
  id: string
  fromToken: string
  toToken: string
}

interface IProps {
  hash: string
  info: ITransactionSwap
  chainId?: number
  timestamp?: number
  toToken?: ITokenBase
  fromToken?: ITokenBase
}

const TransactionHistoryCardSwap: React.FC<IProps> = ({
  hash,
  chainId,
  timestamp,
  toToken,
  fromToken,
}) => {
  const explorerUrl = useMemo<string>(() => {
    if (!chainId || !hash) return ""
    return getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)
  }, [chainId, hash])

  const datetime = useMemo<string>(() => {
    if (!timestamp) return ""
    return format(expandTimestamp(timestamp), DATE_TIME_FORMAT)
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
