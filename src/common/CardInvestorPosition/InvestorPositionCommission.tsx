import * as React from "react"
import * as S from "./styled"
import { format } from "date-fns/esm"

import { DATE_FORMAT } from "consts"
import { expandTimestamp, formatBigNumber, normalizeBigNumber } from "utils"
import { InvestorPositionInPoolContext } from "context/investor/positions/InvestorPositionInPoolContext"

const InvestorPositionCommission: React.FC = () => {
  const {
    commission: { period, percentage, amountUSD, unlockTimestamp },
    fundsLockedInvestorPercentage,
    fundsLockedInvestorUSD,
    totalPoolInvestmentsUSD,
  } = React.useContext(InvestorPositionInPoolContext)

  return (
    <S.CardInvestorPositionCommissionContentWrp>
      <S.CardInvestorPositionCommissionRow>
        <S.CardInvestorPositionCommissionLabel>
          {period} month Performance Fee
        </S.CardInvestorPositionCommissionLabel>
        <S.CardInvestorPositionCommissionValue>
          {normalizeBigNumber(percentage, 25, 0)}%
        </S.CardInvestorPositionCommissionValue>
      </S.CardInvestorPositionCommissionRow>

      <S.CardInvestorPositionCommissionRow>
        <S.CardInvestorPositionCommissionLabel>
          Paid Performance Fee
        </S.CardInvestorPositionCommissionLabel>
        <S.CardInvestorPositionCommissionValue
          value={formatBigNumber(amountUSD, 18, 2)}
        >
          {amountUSD.isNegative() && "-"}$
          {formatBigNumber(amountUSD.abs(), 18, 2)}
        </S.CardInvestorPositionCommissionValue>
      </S.CardInvestorPositionCommissionRow>

      <S.CardInvestorPositionCommissionRow>
        <S.CardInvestorPositionCommissionLabel>
          Date of withdrawal
        </S.CardInvestorPositionCommissionLabel>
        <S.CardInvestorPositionCommissionValue>
          {format(expandTimestamp(+unlockTimestamp.toString()), DATE_FORMAT)}
        </S.CardInvestorPositionCommissionValue>
      </S.CardInvestorPositionCommissionRow>

      <S.CardInvestorPositionCommissionRow>
        <S.CardInvestorPositionCommissionLabel>
          Investor funds locked (
          {formatBigNumber(fundsLockedInvestorPercentage, 18, 2)}%)
        </S.CardInvestorPositionCommissionLabel>
        <S.CardInvestorPositionCommissionValue>
          ${formatBigNumber(fundsLockedInvestorUSD, 18, 2)}/$
          {formatBigNumber(totalPoolInvestmentsUSD, 18, 2)}
        </S.CardInvestorPositionCommissionValue>
      </S.CardInvestorPositionCommissionRow>
    </S.CardInvestorPositionCommissionContentWrp>
  )
}

export default InvestorPositionCommission
