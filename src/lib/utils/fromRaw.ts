import JSBI from "jsbi"
import _Decimal from "decimal.js-light"
import toFormat from "toformat"
import invariant from "tiny-invariant"
import { BigintIsh, Rounding } from "lib/constants"

const Decimal = toFormat(_Decimal)

const toSignificantRounding = {
  [Rounding.ROUND_DOWN]: Decimal.ROUND_DOWN,
  [Rounding.ROUND_HALF_UP]: Decimal.ROUND_HALF_UP,
  [Rounding.ROUND_UP]: Decimal.ROUND_UP,
}

const toSignificant = (
  rawAmount: BigintIsh,
  significantDigits: number,
  // eslint-disable-next-line @typescript-eslint/ban-types
  format: object = { groupSeparator: "" },
  rounding: Rounding = Rounding.ROUND_HALF_UP
): string => {
  invariant(
    Number.isInteger(significantDigits),
    `${significantDigits} is not an integer.`
  )
  invariant(significantDigits > 0, `${significantDigits} is not positive.`)

  Decimal.set({
    precision: significantDigits + 1,
    rounding: toSignificantRounding[rounding],
  })
  const numerator = JSBI.BigInt(rawAmount)
  const denominator = JSBI.BigInt(1)
  const quotient = new Decimal(numerator.toString())
    .div(denominator.toString())
    .toSignificantDigits(significantDigits)
  return quotient.toFormat(quotient.decimalPlaces(), format)
}

const fromRawAmount = (
  rawAmount: BigintIsh,
  significantDigits = 6,
  // eslint-disable-next-line @typescript-eslint/ban-types
  format?: object,
  rounding: Rounding = Rounding.ROUND_DOWN
) => {
  return toSignificant(rawAmount, significantDigits, format, rounding)
}

export default fromRawAmount
