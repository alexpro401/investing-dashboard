import { AGREGATION_CODES } from "constants/history"
import { usePriceHistory } from "state/pools/hooks"
import { daysAgoTimestamp, expandTimestamp } from "utils"

import S, { Tip } from "./styled"

function getPassedDaysInTheYear() {
  const currentYear = new Date().getFullYear()

  const start = new Date(`${currentYear}-01-01`)
  const end = new Date()

  const diffInTime = end.getTime() - start.getTime()

  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneDay)

  return diffInDays
}

function prepareMonthlyHistory(payload) {
  if (!payload) return null

  const res = Array(12).fill(null)

  payload.forEach((h) => {
    const month = new Date(expandTimestamp(h.timestamp)).getMonth()
    res[month - 1] = h
  })

  return res
}

interface IProps {
  address: string | undefined
  withTip?: boolean
}

const BarChart: React.FC<IProps> = ({ address, withTip }) => {
  const history = usePriceHistory(
    address,
    [AGREGATION_CODES["1m"] - 1, AGREGATION_CODES["1m"]],
    12,
    daysAgoTimestamp(getPassedDaysInTheYear())
  )

  const data = prepareMonthlyHistory(history)

  if (data) {
    console.log("data", data)
  }

  if (!data) {
    const fallbackData = Array(12).fill(null)
    return (
      <S.Container>
        {fallbackData.map((v, i) => (
          <S.Bar key={i} perc={v} />
        ))}
      </S.Container>
    )
  }

  return (
    <S.Container>
      {data.map((v, i) => (
        <S.Bar
          active={withTip}
          key={i}
          perc={v && v.percPNL ? Number(v.percPNL) : null}
        >
          {v && v.percPNL && (
            <Tip
              id={i}
              timestamp={expandTimestamp(v.timestamp)}
              pnl={Number(v.percPNL)}
            />
          )}
        </S.Bar>
      ))}
    </S.Container>
  )
}

export default BarChart
