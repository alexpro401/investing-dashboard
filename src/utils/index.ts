import { getAddress } from "@ethersproject/address"
import { getTime, setHours, setMinutes } from "date-fns"
import { TransactionReceipt } from "@ethersproject/providers"
import { formatUnits, parseUnits, parseEther } from "@ethersproject/units"
import { BigNumber, BigNumberish, FixedNumber } from "@ethersproject/bignumber"

import { ERC20 } from "abi"
import { poolTypes, ZERO } from "constants/index"
import { ExchangeType } from "interfaces/exchange"
import { PoolType, TokenTuple } from "constants/types"
import { getBalanceOf, getContract } from "./getContract"
import { ITopMembersFilters, OwnedPools, Token } from "interfaces"
import { IRiskyPositionCard } from "interfaces/thegraphs/basic-pools"
import {
  PoolsQuery,
  PoolsQueryByType,
  PoolsQueryByTypeWithSort,
  PoolsQueryWithSort,
} from "queries/all-pools"

export const delay = (ms: number): Promise<void> => {
  return new Promise((res) => setTimeout(res, ms))
}

export function isAddress(value: any): boolean {
  if (!value || value.length !== 42 || value === "" || value === "0x") {
    return false
  }

  try {
    const address = getAddress(value).toLowerCase()
    return address.length === 42
  } catch (error) {
    console.log(error)
    return false
  }
}

export function isValidUrl(value: string): boolean {
  try {
    return Boolean(new URL(value))
  } catch (error) {
    return false
  }
}

export function shortenAddress(
  address: string | null | undefined,
  chars = 4
): string {
  if (!address || !address.length) {
    return ""
  }

  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`
}

// create dummy data 90% positive number 10% negative
export const getRandomPnl = () => {
  const r1 = Math.random()
  const r2 = Math.random()
  const negative = r2 > 0.9 ? -1 : 1

  return r1 * 100 * negative
}

const parseDecimals = (float: string, decimals) => {
  return !!float ? `${float}`.substring(0, decimals + 1) : ".00"
}

const humanizeBigNumber = (amount: string | number, limit = 6): string => {
  const numArr = `${amount}`.split(".")

  // no decimal places
  if (!numArr[1]) {
    return numArr[0]
  }

  // passes without formatting
  if (numArr[1].length < limit) {
    return `${numArr[0]}.${numArr[1]}`
  }

  const firstMatch = numArr[1].match("[1-9]")

  if (
    !!firstMatch &&
    !!firstMatch.length &&
    !!firstMatch.index &&
    firstMatch.index > limit
  ) {
    return Number(amount).toFixed(firstMatch.index + 2)
  }

  return Number(amount).toFixed(limit)
}

export const formatNumber = (amount: string, decimals = 2) => {
  if (!amount) return "0.00"

  const numArr = amount.split(".")

  const floatPart = numArr[1] && numArr[1] !== "0" ? `.${numArr[1]}` : ""

  if (Number(numArr[0]) > 1000) {
    return `${(Number(numArr[0]) / 1000).toFixed(2).split(".00")[0]}k`
  }

  if (decimals === 0) {
    return numArr[0].split(/(?=(?:\d{3})+(?!\d))/).join(",")
  }

  return (
    numArr[0].split(/(?=(?:\d{3})+(?!\d))/).join(",") +
    parseDecimals(floatPart, decimals)
  )
}

export const formatBigNumber = (value?: BigNumber, decimals = 18, fix = 6) => {
  if (!value) return formatNumber("0", fix)

  const amount = formatUnits(value, decimals).toString()

  return formatNumber(amount, fix)
}

export const normalizeBigNumber = (
  value?: BigNumberish,
  decimals = 18,
  fix?: number
) => {
  const amount = formatUnits(value || ZERO, decimals).toString()

  return humanizeBigNumber(amount, fix)
}

export function getTypedSignature(address, lib, nonce) {
  const signer = lib.getSigner(address)

  const { domain, types, message } = nonce
  return signer._signTypedData(domain, types, message)
}

export function getERC20Contract(address, lib, account) {
  return getContract(address, ERC20, lib, account)
}

export function getAllowance(
  account,
  tokenAddress,
  contractAddress,
  lib
): Promise<BigNumber> {
  try {
    const erc20Contract = getERC20Contract(tokenAddress, lib, account)

    return erc20Contract.allowance(account, contractAddress)
  } catch (e) {
    console.log(e)
    return new Promise((resolve) => resolve(ZERO))
  }
}

export function getTokenBalance(
  account,
  tokenAddress,
  library
): Promise<BigNumber> {
  try {
    const contract = getERC20Contract(tokenAddress, library, account)

    return getBalanceOf({
      account,
      contract,
      tokenAddress,
      library,
    })
  } catch (e) {
    console.log(e)
    return new Promise((resolve) => resolve(ZERO))
  }
}

export function getTokenData(account, address, library): Promise<Token> {
  const contract = getERC20Contract(address, library, account)

  return new Promise((resolve, reject) => {
    Promise.all([contract.name(), contract.symbol(), contract.decimals()])
      .then(([name, symbol, decimals]) => {
        resolve({
          address,
          name,
          symbol,
          decimals,
        })
      })
      .catch((e) => {
        console.log(e)
        reject(e)
      })
  })
}

export const focusText = (event) => event.target.select()

export const getRedirectedPoolAddress = (pools: OwnedPools) => {
  if (!!pools && pools.basic.length) {
    return [poolTypes.basic, pools.basic[0]]
  }

  if (!!pools && pools.invest.length) {
    return [poolTypes.invest, pools.invest[0]]
  }

  return null
}

export const calcSlippage = (
  token: TokenTuple,
  slippage: string,
  swapDirection: ExchangeType
) => {
  const sl =
    swapDirection === ExchangeType.FROM_EXACT
      ? 1 - parseFloat(slippage) / 100
      : 1 + parseFloat(slippage) / 100

  const a = FixedNumber.fromValue(token[0], token[1])
  const multiplier = FixedNumber.fromValue(parseEther(sl.toString()), 18)

  return BigNumber.from(a.mulUnsafe(multiplier)._hex)
}

export const parseTransactionError = (str: any) => {
  const DEFAULT_TRANSACTION_ERROR = "Unpredictable transaction error"

  try {
    if (str.code === 4001) {
      return
    }

    // parse string error reason
    if (typeof str === "string") {
      const position = str.search(`reason=`)

      const cutString = str.substring(position + 7)

      const matches = cutString.match(/"(.*?)"/)
      return matches ? matches[1] : DEFAULT_TRANSACTION_ERROR
    }

    // parse string error message
    if (typeof str === "string") {
      const position = str.search(`"message":`)

      const cutString = str.substring(position + 10)

      const matches = cutString.match(/"(.*?)"/)
      return matches ? matches[1] : DEFAULT_TRANSACTION_ERROR
    }

    if (typeof str !== "object") {
      return DEFAULT_TRANSACTION_ERROR
    }

    if (
      Object.keys(str).includes("error") &&
      Object.keys(str.error).includes("message")
    ) {
      return str.error.message
    }
    if (
      Object.keys(str).includes("data") &&
      Object.keys(str.data).includes("message")
    ) {
      return str.data.message
    }
  } catch (e) {
    return DEFAULT_TRANSACTION_ERROR
  }
}

export const shortTimestamp = (timestamp: number): number => {
  return Number((timestamp / 1000).toFixed(0))
}

export const expandTimestamp = (timestamp: number): number => {
  return Number(`${timestamp}000`)
}

export const keepHoursAndMinutes = (timestamp: Date | number, h, m): number => {
  const hours = setHours(timestamp, h)
  const minutes = setMinutes(hours, m)

  return shortTimestamp(getTime(minutes))
}

export function daysAgoTimestamp(days: number): number {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return shortTimestamp(d.getTime())
}

/**
 * Check that transaction is mined by the given receipt
 * @param tx transaction receipt
 * @returns true if transaction is mined otherwise false
 */
export const isTxMined = (tx: TransactionReceipt | undefined): boolean => {
  return !!tx && tx.status === 1
}

export const cutDecimalPlaces = (
  value: BigNumberish,
  decimals = 18,
  roundUp = true,
  fix = 6
) => {
  const number = formatUnits(value, decimals)

  const pow = Math.pow(10, fix)

  const parsed =
    Math[roundUp ? "round" : "floor"](parseFloat(number) * pow) / pow

  return parseUnits(parsed.toString(), decimals)
}

export const getMaxLPInvestAmount = (
  supply: BigNumber,
  emission: BigNumber
) => {
  const supplyFixed = FixedNumber.fromValue(supply, 18)
  const emissionFixed = FixedNumber.fromValue(emission, 18)

  const result = emissionFixed.subUnsafe(supplyFixed)

  return BigNumber.from(result._hex)
}

export function fromBig(value: BigNumber | undefined, decimals = 18) {
  if (!value) {
    return "0"
  }

  const formatedNumber = formatUnits(value, decimals)
  if (formatedNumber.split(".")[1] === "0") return formatedNumber.split(".")[0]
  return formatedNumber
}

export function bigify(value: string, decimals: number) {
  if (!value) {
    return parseUnits("0", decimals)
  }

  return parseUnits(value, decimals)
}

/**
 * Transform BigNumber to FixedNumber (usually for calculations)
 * @param recepient - converted number
 * @param decimals - number of decimals for recepient (18 by default)
 * @returns  recepient formating to FixedNumber
 */
export const convertBigToFixed = (
  recepient: BigNumber,
  decimals?: number
): FixedNumber => FixedNumber.fromValue(recepient, decimals ?? 18)

export const getProposalId = (id?: string) => {
  const proposalId = Number(id?.substring(42, 43))
  return isNaN(proposalId) ? -1 : proposalId
}

export const getPoolsQueryVariables = (
  filters: ITopMembersFilters,
  poolType: PoolType
) => {
  const isAllPools = poolType === "ALL_POOL"
  const isSorting = filters.sort.direction !== ""

  if (!isAllPools && !isSorting) {
    return {
      query: PoolsQueryByType,
      variables: { q: filters.query, type: poolType },
    }
  }

  if (isAllPools && isSorting) {
    return {
      query: PoolsQueryWithSort,
      variables: {
        q: filters.query,
        orderBy: filters.sort.key,
        orderDirection: filters.sort.direction,
      },
    }
  }

  if (!isAllPools && isSorting) {
    return {
      query: PoolsQueryByTypeWithSort,
      variables: {
        q: filters.query,
        type: poolType,
        orderBy: filters.sort.key,
        orderDirection: filters.sort.direction,
      },
    }
  }

  return {
    query: PoolsQuery,
    variables: { q: filters.query },
  }
}

// prepare risky positions data
export const prepareRiskyPositions = (data): IRiskyPositionCard[] => {
  return data.proposalPositions.map((p) => {
    const position = {
      ...p,
      token: p.proposal.token,
      pool: p.proposal.basicPool,
      exchanges: p.proposal.exchanges.reduce((acc, e) => {
        if (e.exchanges && e.exchanges.length > 0) {
          return [...acc, ...e.exchanges]
        }
        return acc
      }, []),
    }
    delete position.proposal

    return position
  })
}
