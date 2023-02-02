import * as React from "react"
import { format } from "date-fns/esm"

import { DATE_FORMAT } from "consts"
import AmountRow from "components/Amount/Row"
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
    <>
      <AmountRow
        title={`${period} month Performance Fee`}
        value={`${normalizeBigNumber(percentage, 25, 0)}%`}
      />
      <AmountRow
        m="14px 0 0"
        title="Paid Performance Fee  "
        value={`$${formatBigNumber(amountUSD, 18, 2)}`}
      />
      <AmountRow
        full
        m="14px 0 0"
        title="Date of withdrawal"
        value={format(
          expandTimestamp(+unlockTimestamp.toString()),
          DATE_FORMAT
        )}
      />
      <AmountRow
        m="14px 0 0"
        title={`Investor funds locked (${formatBigNumber(
          fundsLockedInvestorPercentage,
          18,
          2
        )}%)`}
        value={`$${formatBigNumber(
          fundsLockedInvestorUSD,
          18,
          2
        )}/$${formatBigNumber(totalPoolInvestmentsUSD, 18, 2)}`}
      />
    </>
  )
}

export default InvestorPositionCommission
