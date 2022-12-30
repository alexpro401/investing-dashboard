import { getDaysInMonth, sub } from "date-fns"
import { expandTimestamp, shortTimestamp } from "utils"
import { usePriceHistory } from "state/pools/hooks"
import { AGGREGATION_CODE } from "consts/chart"
import { useAPI } from "api"
import * as React from "react"
import { ITokenHistoricalPrices } from "api/token/types"
import { IPriceHistory } from "interfaces/thegraphs/all-pools"

function getSortinoPeriod() {
  const currentDate = new Date()
  let endYear = currentDate.getFullYear()
  let endMonth = currentDate.getMonth()

  if (endMonth - 1 <= 0) {
    --endYear
    endMonth = 12
  }

  const _end = new Date(`${endYear}-${endMonth}-01 00:01`)
  const start = sub(_end, { months: 11 })

  // Fix end date
  const daysInEndMonth = getDaysInMonth(_end)
  const end = new Date(`${endYear}-${endMonth}-${daysInEndMonth} 23:59`)

  return {
    start: shortTimestamp(start.getTime()),
    end: shortTimestamp(end.getTime()),
  }
}

function getActualPortfolioReturnPeriod(periods) {
  const first = new Date(expandTimestamp(periods[0].timestamp))
  const last = new Date(expandTimestamp(periods[periods.length - 1].timestamp))
  const daysInLastMonth = getDaysInMonth(last)

  const start = new Date(`${first.getFullYear()}-${first.getMonth()}-01 00:01`)
  const end = new Date(
    `${last.getFullYear()}-${last.getMonth()}-${daysInLastMonth} 23:59`
  )

  return {
    start: shortTimestamp(start.getTime()),
    end: shortTimestamp(end.getTime()),
  }
}

interface Response {
  data?: IPriceHistory[]
  actualPeriod?: {
    start: number
    end: number
  }
  tokensPrices?: ITokenHistoricalPrices
}

const usePoolSortinoData = (
  poolAddress: string,
  tokens: string[]
): Response => {
  const { TokenAPI } = useAPI()
  // _P (Period)
  const sortinoPeriod = React.useMemo(() => getSortinoPeriod(), [])

  const [history] = usePriceHistory(
    poolAddress,
    [AGGREGATION_CODE.m1 - 1, AGGREGATION_CODE.m1],
    12,
    sortinoPeriod.start
  )

  // _RP (Real period)
  const actualPortfolioReturnPeriod = React.useMemo(() => {
    if (!history || history.length === 0) {
      return undefined
    }

    return getActualPortfolioReturnPeriod(history)
  }, [history])

  const [tokensHistoricalPrices, setTokensHistoricalPrices] =
    React.useState<ITokenHistoricalPrices>()

  React.useEffect(() => {
    if (
      !TokenAPI ||
      !tokens ||
      tokens.length === 0 ||
      !actualPortfolioReturnPeriod
    ) {
      return
    }
    ;(async () => {
      const _tokensHistoricalPrices = {} as ITokenHistoricalPrices
      for (const token of tokens) {
        const tokenPrices = await TokenAPI.getHistoricalPrices(token, [
          actualPortfolioReturnPeriod.start,
          actualPortfolioReturnPeriod.end,
        ])

        if (tokenPrices) {
          _tokensHistoricalPrices[token] = tokenPrices[token]
        }
      }
      setTokensHistoricalPrices(_tokensHistoricalPrices)
    })()
  }, [TokenAPI, tokens, actualPortfolioReturnPeriod])

  return {
    data: history,
    actualPeriod: actualPortfolioReturnPeriod,
    tokensPrices: tokensHistoricalPrices,
  }
}

export default usePoolSortinoData
