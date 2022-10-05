import { daysAgoTimestamp } from "utils"

/**
 * Codes of aggregationType in poolHistory
 */
export const AGREGATION_CODES = {
  ["5min"]: 0,
  ["15min"]: 1,
  ["30min"]: 2,
  ["1h"]: 4,
  ["2h"]: 8,
  ["4h"]: 16,
  ["6h"]: 32,
  ["12h"]: 64,
  ["24h"]: 128,
  ["1m"]: 256,
}

/**
 * History timeframes
 * D - 1 Day
 * W - 1 Week
 * M - 1 Month
 * 3M - 3 Month
 * 6M - 6 Month
 * 1Y - 1 Year
 * ALL - All time
 */
export const TIMEFRAMES = {
  ["D"]: "D",
  ["W"]: "W",
  ["M"]: "M",
  ["3M"]: "3M",
  ["6M"]: "6M",
  ["1Y"]: "1Y",
  ["ALL"]: "ALL",
}

interface IAggregationCodes {
  [x: string]: [number, number]
}

/**
 * Mapping timeframes to agregation codes
 * @key - timeframe
 * @value - [min aggregation code, max aggregation code]
 */
export const TIMEFRAME_AGREGATION_CODES: IAggregationCodes = {
  [TIMEFRAMES["D"]]: [AGREGATION_CODES["5min"], AGREGATION_CODES["1h"]],
  [TIMEFRAMES["W"]]: [AGREGATION_CODES["15min"], AGREGATION_CODES["24h"]],
  [TIMEFRAMES["M"]]: [AGREGATION_CODES["1h"], AGREGATION_CODES["24h"]],
  [TIMEFRAMES["3M"]]: [AGREGATION_CODES["4h"], AGREGATION_CODES["24h"]],
  [TIMEFRAMES["6M"]]: [
    AGREGATION_CODES["6h"] - AGREGATION_CODES["1h"],
    AGREGATION_CODES["12h"] + AGREGATION_CODES["24h"],
  ],
  [TIMEFRAMES["1Y"]]: [
    AGREGATION_CODES["12h"] - (AGREGATION_CODES["2h"] + AGREGATION_CODES["1h"]),
    AGREGATION_CODES["24h"] * 2,
  ],
  [TIMEFRAMES["ALL"]]: [AGREGATION_CODES["24h"] * 7, AGREGATION_CODES["1m"]],
}

/**
 * Mapping timeframes to collection length limits
 * @key - timeframe
 * @value - fetch limit
 */
export const TIMEFRAME_LIMIT_CODE = {
  [TIMEFRAMES["D"]]: 96, // 24h * (1h / TIMEFRAME_MIN_CODE["D"])
  [TIMEFRAMES["W"]]: 168, // (24h * 7d) / TIMEFRAME_MIN_CODE["W"]
  [TIMEFRAMES["M"]]: 744, // (24h * 31d)
  [TIMEFRAMES["3M"]]: 558,
  [TIMEFRAMES["6M"]]: 893,
  [TIMEFRAMES["1Y"]]: 974,
  [TIMEFRAMES["ALL"]]: 1000,
}

/**
 * Mapping timeframes to fromDate value
 * @key - timeframe
 * @value - fetch start day
 */
export const TIMEFRAME_FROM_DATE = {
  [TIMEFRAMES["D"]]: daysAgoTimestamp(1),
  [TIMEFRAMES["W"]]: daysAgoTimestamp(7),
  [TIMEFRAMES["M"]]: daysAgoTimestamp(31),
  [TIMEFRAMES["3M"]]: daysAgoTimestamp(93),
  [TIMEFRAMES["6M"]]: daysAgoTimestamp(186),
  [TIMEFRAMES["1Y"]]: daysAgoTimestamp(365),
  [TIMEFRAMES["ALL"]]: 0,
}
