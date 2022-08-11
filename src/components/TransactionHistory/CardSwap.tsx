import { useMemo } from "react"
import { format } from "date-fns/esm"

import { Flex } from "theme"
import TokenIcon from "components/TokenIcon"
import ExternalLink from "components/ExternalLink"

import { expandTimestamp } from "utils"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"

import { CardContainer, CardIcons, CardTime } from "./styled"

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
}

const TransactionHistoryCardSwap: React.FC<IProps> = ({
  hash,
  info,
  chainId,
  timestamp,
}) => {
  const explorerUrl = useMemo<string>(() => {
    if (!chainId || !hash) return ""
    return getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)
  }, [chainId, hash])

  const datetime = useMemo<string>(() => {
    if (!timestamp) return ""
    return format(expandTimestamp(timestamp), "MMM dd, y, HH:mm")
  }, [timestamp])

  return (
    <CardContainer>
      <Flex>
        <CardIcons>
          <TokenIcon m="0" address={info?.toToken} size={20} />
          <TokenIcon m="0" address={info?.fromToken} size={20} />
        </CardIcons>

        <ExternalLink fz="13px" fw="500" color="#2680EB" href={explorerUrl}>
          View on bscscan
        </ExternalLink>
      </Flex>
      <CardTime>{datetime}</CardTime>
    </CardContainer>
  )
}

export default TransactionHistoryCardSwap
