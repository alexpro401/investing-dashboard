import { useMemo } from "react"
import { useSelector } from "react-redux"
import { BigNumber } from "@ethersproject/bignumber"

import { formatBigNumber } from "utils"
import { selectWhitelistItem } from "state/pricefeed/selectors"

const FormattedCurrencyAmount: React.FC<{
  rawAmount: string
  rawCurrencySymbol?: string
  rawCurrencyId?: string
  decimals?: number
  sigFigs?: number
}> = ({
  rawAmount,
  rawCurrencyId,
  rawCurrencySymbol,
  decimals = 18,
  sigFigs = 6,
}) => {
  const amount = formatBigNumber(BigNumber.from(rawAmount), decimals, sigFigs)
  const currency = useSelector(selectWhitelistItem(rawCurrencyId ?? ""))

  const symbol = useMemo(() => {
    if (!currency || !currency.symbol) {
      return rawCurrencySymbol ?? ""
    }

    return currency.symbol
  }, [currency, rawCurrencySymbol])

  return (
    <>
      {amount} {symbol}
    </>
  )
}

export default FormattedCurrencyAmount
