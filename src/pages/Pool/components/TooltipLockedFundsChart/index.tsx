import { useMemo } from "react"
import { format } from "date-fns"

import { DATE_FORMAT } from "constants/time"
import { expandTimestamp } from "utils"

import { Flex } from "theme"
import { Styled as S } from "./styled"

const TooltipLockedFundsChart = (props) => {
  const { active, payload } = props
  const data = (payload && payload[0]?.payload) ?? null

  const date = useMemo<string>(() => {
    if (!data) return ""
    return format(expandTimestamp(data.timestamp), DATE_FORMAT)
  }, [data])

  if (active && payload && payload.length) {
    return (
      <S.Container>
        <S.Content>
          <S.Date>{date}</S.Date>
          <Flex full m="4px 0 0" jc="space-between">
            <S.Label>Trader</S.Label>
            <S.Value type="trader">${data.traderUSDValue}</S.Value>
          </Flex>
          <Flex full m="4px 0 0" jc="space-between">
            <S.Label>Investors</S.Label>
            <S.Value type="investors">${data.investorsUSD}</S.Value>
          </Flex>
        </S.Content>
      </S.Container>
    )
  }

  return null
}

export default TooltipLockedFundsChart
