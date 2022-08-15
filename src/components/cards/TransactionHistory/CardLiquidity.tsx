import { useMemo } from "react"
import { format } from "date-fns/esm"
import { BigNumber } from "@ethersproject/bignumber"

import { Flex } from "theme"
import TokenIcon from "components/TokenIcon"
import ExternalLink from "components/ExternalLink"

import { useERC20 } from "hooks/useContract"
import { usePoolContract } from "hooks/usePool"
import { expandTimestamp, formatBigNumber } from "utils"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"

import S from "./styled"

interface IVest {
  id: string
  pool: string
  baseAmount: BigNumber
}

interface IProps {
  hash: string
  info: IVest
  chainId?: number
  timestamp?: number
  isInvest: boolean
}

const TransactionHistoryCardLiquidity: React.FC<IProps> = ({
  hash,
  info: { pool, baseAmount },
  chainId,
  timestamp,
  isInvest,
}) => {
  const [, poolInfo] = usePoolContract(pool)
  const [, baseToken] = useERC20(poolInfo?.parameters.baseToken)

  const explorerUrl = useMemo<string>(() => {
    if (!chainId || !hash) return ""
    return getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)
  }, [chainId, hash])

  const amount = useMemo<string>(() => {
    if (!baseAmount) return ""
    return formatBigNumber(baseAmount)
  }, [baseAmount])

  const datetime = useMemo<string>(() => {
    if (!timestamp) return ""
    return format(expandTimestamp(timestamp), "MMM dd, y, HH:mm")
  }, [timestamp])

  return (
    <S.Container>
      <Flex>
        <S.CardIcons relative={false}>
          <TokenIcon m="0" size={30} address={baseToken?.address} />
        </S.CardIcons>

        <ExternalLink fz="13px" fw="500" color="#2680EB" href={explorerUrl}>
          {isInvest ? "Invest" : "Divest"} {amount} {baseToken?.symbol}{" "}
        </ExternalLink>
      </Flex>
      <S.CardTime>{datetime}</S.CardTime>
    </S.Container>
  )
}

export default TransactionHistoryCardLiquidity
