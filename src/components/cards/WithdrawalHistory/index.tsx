import { FC, useEffect, useMemo, useState } from "react"
import { format } from "date-fns"
import { BigNumber } from "@ethersproject/bignumber"

import { useActiveWeb3React } from "hooks"
import { expandTimestamp, formatBigNumber } from "utils"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"

import Amount from "components/Amount"
import S from "./styled"

interface IWithdrawal {
  id: string
  lpAmount: BigNumber
  baseAmount: BigNumber
}

interface IProps {
  payload: IWithdrawal
  timestamp: string
  getBaseInUSD: any
  m?: string
}

function getPnlSymbol(amount: number): string {
  if (amount > 0) {
    return "+"
  }
  return ""
}

const WithdrawalHistory: FC<IProps> = ({
  payload,
  timestamp,
  getBaseInUSD,
  ...rest
}) => {
  const { chainId } = useActiveWeb3React()

  const [profitUSD, setProfitUSD] = useState<string>("0")

  /**
   * URL to page with transaction details on explorer
   */
  const url = useMemo<string>(() => {
    if (!payload || !payload.id || !chainId) return ""

    return getExplorerLink(chainId, payload.id, ExplorerDataType.TRANSACTION)
  }, [chainId, payload])

  /**
   * Withdrawal date
   */
  const creationDate = useMemo<string>(() => {
    if (!timestamp) return "⌚️"

    return format(expandTimestamp(Number(timestamp)), "MMM dd, y")
  }, [timestamp])

  const pnl = useMemo<string>(() => "0", [])
  const fee = useMemo<string>(() => "-", [])

  // Calculate withdrawal amount in USD
  useEffect(() => {
    if (!payload || !payload.baseAmount) return
    ;(async () => {
      try {
        const amount = await getBaseInUSD(payload.baseAmount)
        if (amount) {
          setProfitUSD(formatBigNumber(amount, 18, 2))
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [getBaseInUSD, payload])

  return (
    <>
      <S.Link href={url} target="_blank" rel="noopener noreferrer">
        <S.Container {...rest}>
          <div>
            <S.Date>{creationDate}</S.Date>
            <S.PNL amount={Number(pnl)}>
              {getPnlSymbol(Number(pnl))}
              {pnl} %
            </S.PNL>
          </div>
          <Amount value={profitUSD} symbol="USD" full />
          <Amount value={fee} symbol="USD" jc="flex-end" full />
        </S.Container>
      </S.Link>
    </>
  )
}

export default WithdrawalHistory
