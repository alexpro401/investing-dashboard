import { useState } from "react"
import { AGGREGATION_CODE } from "consts/chart"
import { opacityVariants } from "motion/variants"
import { usePriceHistory } from "state/pools/hooks"
import { Flex } from "theme"
import { daysAgoTimestamp, expandTimestamp, normalizeBigNumber } from "utils"

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
    res[month] = h
  })

  return res
}

interface IProps {
  address: string | undefined
  withTip?: boolean
  m?: string
}

const BarChart: React.FC<IProps> = ({ address, withTip, m }) => {
  const [history] = usePriceHistory(
    address,
    [AGGREGATION_CODE.m1 - 1, AGGREGATION_CODE.m1],
    12,
    daysAgoTimestamp(getPassedDaysInTheYear())
  )

  const data = prepareMonthlyHistory(history)

  const [showTooltip, setShowTooltip] = useState(false)
  const [activeItem, setActiveItem] = useState<number | null>(null)

  const activateTooltip = (i) => {
    setShowTooltip(true)
    setActiveItem(i)
  }

  const deactivateTooltip = () => {
    setShowTooltip(false)
    setActiveItem(null)
  }

  if (!data) {
    const fallbackData = Array(12).fill(null)
    return (
      <S.Container m={m}>
        {fallbackData.map((v, i) => (
          <S.Bar key={i} perc={v} />
        ))}
      </S.Container>
    )
  }

  return (
    <S.Container m={m}>
      {data.map((v, i) => (
        <S.Bar
          active={withTip}
          key={i}
          perc={
            v && v.percPNLBase
              ? Number(normalizeBigNumber(v.percPNLBase, 4, 6))
              : null
          }
          onMouseEnter={() => activateTooltip(i)}
          onMouseLeave={() => deactivateTooltip()}
        >
          <Flex
            initial={
              showTooltip && i === activeItem && v && v.percPNLBase
                ? "visible"
                : "hidden"
            }
            variants={opacityVariants}
            transition={{ duration: 0.2 }}
            animate={
              showTooltip && i === activeItem && v && v.percPNLBase
                ? "visible"
                : "hidden"
            }
          >
            {v && (
              <Tip
                id={i}
                timestamp={expandTimestamp(Number(v.timestamp))}
                pnl={Number(normalizeBigNumber(v.percPNLBase, 4, 6))}
              />
            )}
          </Flex>
        </S.Bar>
      ))}
    </S.Container>
  )
}

export default BarChart
