import { useMemo } from "react"
import { format } from "date-fns"

import { DATE_FORMAT } from "constants/time"
import { expandTimestamp } from "utils"

import { Flex } from "theme"
import { TooltipStyled as TS } from "./styled"

const PNLTooltip = (props) => {
  const { active, payload } = props
  const data = (payload && payload[0]?.payload) ?? null

  const date = useMemo<string>(() => {
    if (!data) return ""
    return format(expandTimestamp(data.timestamp), DATE_FORMAT)
  }, [data])

  if (active && payload && payload.length) {
    return (
      <TS.Container>
        <TS.Content>
          <TS.Date>{date}</TS.Date>
          <Flex full m="4px 0 0" jc="space-between">
            <TS.Label>Trader</TS.Label>
            <TS.Value type="trader">${data.traderUSDValue}</TS.Value>
          </Flex>
          <Flex full m="4px 0 0" jc="space-between">
            <TS.Label>Investors</TS.Label>
            <TS.Value type="investors">${data.investorsUSD}</TS.Value>
          </Flex>
        </TS.Content>
      </TS.Container>
    )
  }

  return null
}

export default PNLTooltip
