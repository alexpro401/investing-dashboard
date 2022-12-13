import { useMemo } from "react"
import { format } from "date-fns"
import { parseEther } from "@ethersproject/units"

import { DATE_FORMAT } from "constants/time"
import { expandTimestamp, normalizeBigNumber } from "utils"

import { Flex } from "theme"
import { Styled as S } from "./styled"
import { isNil } from "lodash"

function getAmountSymbol(amount: number, withMinus = false): string {
  if (amount > 0) return "+"
  else if (withMinus && amount < 0) return "-"
  return ""
}

const ChartTooltipPnl = (props) => {
  const { active, payload, baseToken } = props
  const history = useMemo(() => {
    if (
      isNil(payload) ||
      isNil(payload[0]?.payload) ||
      (!isNil(payload[0]?.payload?.isFallback) &&
        payload[0]?.payload?.isFallback)
    ) {
      return null
    }

    return payload[0]?.payload
  }, [payload])

  const date = useMemo<string>(() => {
    if (!history) return ""

    return format(expandTimestamp(history.timestamp), DATE_FORMAT)
  }, [history])

  const pnlBase = useMemo<{ format: string; number: number }>(() => {
    if (!history || parseEther(history.percPNL).isZero()) {
      return { format: "0.00", number: 0 }
    }

    const res = normalizeBigNumber(history.percPNL, 4, 2)
    return { format: res, number: Number(res) }
  }, [history])

  const absPnlUsd = useMemo<{ format: string; number: number }>(() => {
    if (!history) return { format: "0.00", number: 0 }

    const res = normalizeBigNumber(history.absPNL, 18, 2)
    return { format: String(Math.abs(Number(res))), number: Number(res) }
  }, [history])

  if (
    active &&
    payload &&
    payload.length &&
    baseToken &&
    !history?.isFallback
  ) {
    return (
      <S.Container>
        <S.Content>
          <S.Date>{date}</S.Date>
          <Flex full m="4px 0 0" jc="space-between">
            <S.Label>{baseToken.symbol ?? ""}</S.Label>
            <S.Value amount={pnlBase.number}>
              {getAmountSymbol(pnlBase.number)}
              {pnlBase.format}%
            </S.Value>
          </Flex>
          <Flex full m="4px 0 0" jc="space-between">
            <S.Label>USD</S.Label>
            <S.Value amount={absPnlUsd.number}>
              {getAmountSymbol(absPnlUsd.number, true)}${absPnlUsd.format}
            </S.Value>
          </Flex>
        </S.Content>
      </S.Container>
    )
  }

  return null
}

export default ChartTooltipPnl
