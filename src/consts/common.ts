import { addDays, addMonths, addYears } from "date-fns"
import { parseEther } from "@ethersproject/units"
import { createStaticRanges } from "react-date-range"
import { BigNumber } from "@ethersproject/bignumber"

export const ZERO = BigNumber.from("0")

export const ZERO_ADDR = "0x0000000000000000000000000000000000000000"
export const ZERO_ADDR_SHORT = "0x00000000"

export const currencies = [
  "BTC",
  "ETH",
  "USD",
  "AUD",
  "CHF",
  "EUR",
  "GBP",
  "JPY",
]

export const defaultStaticRanges = [
  {
    label: "1 day",
    range: () => ({
      startDate: new Date(),
      endDate: addDays(new Date(), -1),
    }),
  },
  {
    label: "1 week",
    range: () => ({
      startDate: new Date(),
      endDate: addDays(new Date(), -7),
    }),
  },
  {
    label: "1 month",
    range: () => ({
      startDate: new Date(),
      endDate: addMonths(new Date(), -1),
    }),
  },
  {
    label: "3 months",
    range: () => ({
      startDate: new Date(),
      endDate: addMonths(new Date(), -3),
    }),
  },
  {
    label: "6 months",
    range: () => ({
      startDate: new Date(),
      endDate: addMonths(new Date(), -6),
    }),
  },
  {
    label: "1 year",
    range: () => ({
      startDate: new Date(),
      endDate: addYears(new Date(), -1),
    }),
  },
  {
    label: "2 years",
    range: () => ({
      startDate: new Date(),
      endDate: addYears(new Date(), -2),
    }),
  },
  {
    label: "All period",
    range: () => ({
      startDate: new Date(),
      endDate: addYears(new Date(), -5),
    }),
  },
]

export const calendarStaticRanges = createStaticRanges(
  defaultStaticRanges.reverse()
)

export const EXCHANGE_DEFAULT_PERCENTS = [
  {
    id: "010",
    label: "10%",
    percent: parseEther("0.1"),
  },
  {
    id: "025",
    label: "25%",
    percent: parseEther("0.25"),
  },
  {
    id: "050",
    label: "50%",
    percent: parseEther("0.5"),
  },
  {
    id: "075",
    label: "75%",
    percent: parseEther("0.75"),
  },
]
