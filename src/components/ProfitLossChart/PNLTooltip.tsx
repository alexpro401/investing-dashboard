import { useMemo } from "react"
import { format } from "date-fns"
import { parseEther, parseUnits } from "@ethersproject/units"

import { DATE_FORMAT } from "constants/time"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { expandTimestamp, normalizeBigNumber } from "utils"

import { Flex } from "theme"
import { TooltipStyled as TS } from "./styled"

function getAmountSymbol(amount: number): string {
  if (amount > 0) return "+"
  return ""
}

const PNLTooltip = (props) => {
  const { active, payload, baseToken } = props
  const history = payload[0]?.payload ?? null

  const usd = useTokenPriceOutUSD({
    tokenAddress: baseToken?.address,
    amount: parseUnits(history?.absPNL ?? "1", 25),
  })

  const date = useMemo<string>(() => {
    if (!history) return "0"

    return format(expandTimestamp(history.timestamp), DATE_FORMAT)
  }, [history])

  const pnlBase = useMemo<{ format: string; number: number }>(() => {
    if (!history || parseEther(history.percPNL).isZero()) {
      return { format: "0.00", number: 0 }
    }

    const res = normalizeBigNumber(history.percPNL, 18, 2)
    return { format: res, number: Number(res) }
  }, [history])

  const absPnlUsd = useMemo<{ format: string; number: number }>(() => {
    if (!history || !usd) {
      return { format: "0.00", number: 0 }
    }

    const res = normalizeBigNumber(usd, 25, 6)
    return { format: res, number: Number(res) }
  }, [history, usd])

  if (active && payload && payload.length && baseToken) {
    return (
      <TS.Container>
        <TS.Content>
          <TS.Date>{date}</TS.Date>
          <Flex full m="4px 0 0" jc="space-between">
            <TS.Label>{baseToken.symbol ?? ""}</TS.Label>
            <TS.Value amount={pnlBase.number}>
              {getAmountSymbol(pnlBase.number)}
              {pnlBase.format}%
            </TS.Value>
          </Flex>
          <Flex full m="4px 0 0" jc="space-between">
            <TS.Label>USD</TS.Label>
            <TS.Value amount={absPnlUsd.number}>
              {getAmountSymbol(absPnlUsd.number)}${absPnlUsd.format}
            </TS.Value>
          </Flex>
        </TS.Content>
      </TS.Container>
    )
  }

  return null
}

export default PNLTooltip
