import { useMemo } from "react"
import { format } from "date-fns/esm"

import { Flex } from "theme"
import TokenIcon from "components/TokenIcon"
import ExternalLink from "components/ExternalLink"

import { expandTimestamp } from "utils"
import { useERC20 } from "hooks/useContract"
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
}

const TransactionHistoryCardSwap: React.FC<IProps> = ({
  hash,
  info,
  chainId,
  timestamp,
}) => {
  const [, fromToken] = useERC20(info?.fromToken)
  const [, toToken] = useERC20(info?.toToken)

  const explorerUrl = useMemo<string>(() => {
    if (!chainId || !hash) return ""
    return getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)
  }, [chainId, hash])

  const datetime = useMemo<string>(() => {
    if (!timestamp) return ""
    return format(expandTimestamp(timestamp), "MMM dd, y, HH:mm")
  }, [timestamp])

  const fromTokenSymbol = useMemo<string>(() => {
    if (!fromToken) return ""
    return fromToken.symbol
  }, [fromToken])

  const toTokenSymbol = useMemo<string>(() => {
    if (!toToken) return ""
    return toToken.symbol
  }, [toToken])

  return (
    <S.Container>
      <Flex>
        <S.CardIcons>
          <TokenIcon m="0" address={info?.fromToken} size={20} />
          <TokenIcon m="0" address={info?.toToken} size={20} />
        </S.CardIcons>

        <ExternalLink fz="13px" fw="500" color="#2680EB" href={explorerUrl}>
          Swap {fromTokenSymbol} for {toTokenSymbol}
        </ExternalLink>
      </Flex>
      <S.CardTime>{datetime}</S.CardTime>
    </S.Container>
  )
}

export default TransactionHistoryCardSwap
