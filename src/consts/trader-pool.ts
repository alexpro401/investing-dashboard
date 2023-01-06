import { ISortItem } from "interfaces"

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

export type ICommissionPeriodType = "1 month" | "3 month" | "12 month"

export const mapCommissionPeriodToNumber: Record<
  ICommissionPeriodType,
  number
> = {
  "1 month": 0,
  "3 month": 1,
  "12 month": 2,
}

export const poolTypes = {
  all: "ALL_POOL",
  basic: "BASIC_POOL",
  invest: "INVEST_POOL",
} as const

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

export type IPoolCreateType =
  | "CREATE"
  | "IPFS"
  | "MANAGERS"
  | "INVESTORS"
  | "SUCCESS"

export interface IStep {
  title: string
  description: string
  buttonText: string
}

export const mapPoolCreateSteps: Record<IPoolCreateType, IStep> = {
  CREATE: {
    title: "Create",
    description:
      "Create your fund by signing a transaction in your wallet. This will create ERC20 compatible token.",
    buttonText: "Create fund",
  },
  IPFS: {
    title: "IPFS",
    description:
      "Upload your fund's information to IPFS. This will be used to display fund's information on the website.",
    buttonText: "Upload to IPFS",
  },
  MANAGERS: {
    title: "Managers",
    description: "Add managers to your fund.",
    buttonText: "Add managers",
  },
  INVESTORS: {
    title: "Investors",
    description: "Add investors to your fund.",
    buttonText: "Add investors",
  },
  SUCCESS: {
    title: "Success",
    description: "Your fund has been created successfully.",
    buttonText: "Go to fund",
  },
}
