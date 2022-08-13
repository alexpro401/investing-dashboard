import { FC, useMemo } from "react"
import { format } from "date-fns"
import { BigNumber } from "@ethersproject/bignumber"

import { expandTimestamp, formatBigNumber } from "utils"

import Amount from "components/Amount"
import S from "./styled"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { useActiveWeb3React } from "hooks"

interface IWithdrawal {
  id: string
  pnl: BigNumber
  profit: BigNumber
  fee: BigNumber
}

interface IProps {
  payload: IWithdrawal
  timestamp: string
  m?: string
}

const WithdrawalHistory: FC<IProps> = ({ payload, timestamp, ...rest }) => {
  const { chainId } = useActiveWeb3React()

  const url = useMemo<string>(() => {
    if (!payload || !payload.id || !chainId) return ""

    return getExplorerLink(chainId, payload.id, ExplorerDataType.TRANSACTION)
  }, [chainId, payload])

  const creationTime = useMemo<string>(() => {
    if (!timestamp) return ""

    return format(expandTimestamp(Number(timestamp)), "MMM dd, y")
  }, [timestamp])

  const pnl = useMemo(() => {
    if (!payload || !payload.pnl) return null

    return formatBigNumber(payload.pnl, 18, 2)
  }, [payload])

  const profit = useMemo(() => {
    if (!payload || !payload.profit) return null

    return formatBigNumber(payload.profit, 18, 2)
  }, [payload])

  const fee = useMemo(() => {
    if (!payload || !payload.fee) return null

    return formatBigNumber(payload.fee, 18, 2)
  }, [payload])

  return (
    <>
      <S.Link href={url} target="_blank" rel="noopener noreferrer">
        <S.Container {...rest}>
          <div>
            <S.Time>{creationTime}</S.Time>
            <S.Percentage>{pnl} %</S.Percentage>
          </div>
          <Amount value={profit} symbol="USD" full />
          <Amount value={fee} symbol="USD" jc="flex-end" full />
        </S.Container>
      </S.Link>
    </>
  )
}

export default WithdrawalHistory
