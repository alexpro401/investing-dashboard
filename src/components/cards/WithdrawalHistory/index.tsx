import { FC, useMemo } from "react"
import { format } from "date-fns"
import { BigNumber } from "@ethersproject/bignumber"

import { useActiveWeb3React } from "hooks"
import { expandTimestamp, normalizeBigNumber } from "utils"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"

import Amount from "components/Amount"
import S from "./styled"

interface IWithdrawal {
  id: string
  PNL: BigNumber
  day: BigNumber
  fundProfit: BigNumber
  perfomanceFee: BigNumber
}

interface IProps {
  payload: IWithdrawal
  m?: string
}

function getPnlSymbol(amount: number): string {
  if (amount > 0) {
    return "+"
  }
  return ""
}

const WithdrawalHistory: FC<IProps> = ({ payload, ...rest }) => {
  const { chainId } = useActiveWeb3React()

  // URL to page with transaction details on explorer
  const url = useMemo<string>(() => {
    if (!payload || !chainId) return ""

    return getExplorerLink(chainId, payload.id, ExplorerDataType.TRANSACTION)
  }, [chainId, payload])

  // Withdrawal date
  const creationDate = useMemo<string>(() => {
    if (!payload) return "⌚️"

    return format(
      expandTimestamp(Number(normalizeBigNumber(payload.day, 18, 0)) * 86400),
      "MMM dd, y"
    )
  }, [payload])

  // P&L
  const pnl = useMemo<string>(() => {
    if (!payload) return "0.00"
    return normalizeBigNumber(payload.PNL, 4, 2)
  }, [payload])

  // Fund profit
  const profitUSD = useMemo<string>(() => {
    if (!payload) return "0.00"
    return normalizeBigNumber(payload.fundProfit, 18, 2)
  }, [payload])

  // Performance fee
  const fee = useMemo<string>(() => {
    if (!payload) return "0.00"
    return normalizeBigNumber(payload.perfomanceFee, 4, 2)
  }, [payload])

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
