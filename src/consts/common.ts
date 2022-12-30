import { addDays, addMonths, addYears } from "date-fns"
import { parseEther } from "@ethersproject/units"
import { createStaticRanges } from "react-date-range"
import { ISortItem } from "interfaces"
import { BigNumber } from "@ethersproject/bignumber"

export const ZERO = BigNumber.from("0")

export const ZERO_ADDR = "0x0000000000000000000000000000000000000000"

export const poolTypes: {
  all: "ALL_POOL"
  basic: "BASIC_POOL"
  invest: "INVEST_POOL"
} = {
  all: "ALL_POOL",
  basic: "BASIC_POOL",
  invest: "INVEST_POOL",
}

export const sortItemsList: ISortItem[] = [
  {
    label: "Max Loss",
    key: "maxLoss",
    direction: "",
  },
  {
    label: "Investors amount",
    key: "investorsCount",
    direction: "",
  },
  {
    label: "Date of creation",
    key: "creationTime",
    direction: "",
  },
  {
    label: "Total trades",
    key: "totalTrades",
    direction: "",
  },
  {
    label: "Max. total closed positions",
    key: "totalClosedPositions",
    direction: "",
  },
  {
    label: "Max. average trades ",
    key: "averageTrades",
    direction: "",
  },
  {
    label: "Average position time ",
    key: "averagePositionTime",
    direction: "",
  },
]

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

export const performanceFees = [
  {
    id: 0,
    title: "1 Month Fee withdrawal",
    description: "Performance Fee limits of 20% to 30%",
    monthes: 1,
  },
  {
    id: 1,
    title: "3 Months Fee withdrawal",
    description: "Performance Fee limits of 20% to 50%",
    monthes: 3,
  },
  {
    id: 2,
    title: "12 Months Fee withdrawal",
    description: "Performance Fee limits of 20% to 70%",
    monthes: 12,
  },
]

export const sliderPropsByPeriodType = {
  "0": {
    min: 20,
    max: 30,
  },
  "1": {
    min: 20,
    max: 50,
  },
  "2": {
    min: 20,
    max: 70,
  },
}
