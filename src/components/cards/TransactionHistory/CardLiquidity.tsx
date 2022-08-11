import { useMemo } from "react"
import { format } from "date-fns/esm"

import { Flex } from "theme"
import ExternalLink from "components/ExternalLink"
import TokenIcon from "components/TokenIcon"

import { expandTimestamp } from "utils"
import { usePoolContract } from "hooks/usePool"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"

import S from "./styled"

interface IVest {
  id: string
  pool: string
}

interface IProps {
  hash: string
  info: IVest
  chainId?: number
  timestamp?: number
}

const TransactionHistoryCardLiquidity: React.FC<IProps> = ({
  hash,
  info: { pool },
  chainId,
  timestamp,
}) => {
  const [, poolInfo] = usePoolContract(pool)

  const poolBaseToken = useMemo<string>(() => {
    if (!poolInfo) return ""
    return poolInfo.parameters.baseToken
  }, [poolInfo])

  const explorerUrl = useMemo<string>(() => {
    if (!chainId || !hash) return ""
    return getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)
  }, [chainId, hash])

  const datetime = useMemo<string>(() => {
    if (!timestamp) return ""
    return format(expandTimestamp(timestamp), "MMM dd, y, HH:mm")
  }, [timestamp])

  return (
    <S.Container>
      <Flex>
        <S.CardIcons relative={false}>
          <TokenIcon m="0" address={poolBaseToken} size={30} />
        </S.CardIcons>

        <ExternalLink fz="13px" fw="500" color="#2680EB" href={explorerUrl}>
          View on bscscan
        </ExternalLink>
      </Flex>
      <S.CardTime>{datetime}</S.CardTime>
    </S.Container>
  )
}

export default TransactionHistoryCardLiquidity
