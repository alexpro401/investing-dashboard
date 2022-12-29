import { v4 as uuidv4 } from "uuid"
import { daysAgoTimestamp } from "utils"
import theme from "theme"

export enum CHART_TYPE {
  area = "ChartArea",
  line = "ChartLine",
  straightAnglePie = "ChartStraightAnglePie",
}

/**
 * Codes of aggregationType
 */
export enum AGGREGATION_CODE {
  min5 = 0,
  min15 = 1,
  min30 = 2,
  h1 = 4,
  h2 = 8,
  h4 = 16,
  h6 = 32,
  h12 = 64,
  d1 = 128,
  m1 = 256,
}

/**
 * TIMEFRAME
 * d - 1 Day
 * w - 1 Week
 * m - 1 Month
 * m3 - 3 Month
 * m6 - 6 Month
 * y1 - 1 Year
 * all - All time
 */
export enum TIMEFRAME {
  d = "D",
  w = "W",
  m = "M",
  m3 = "3M",
  m6 = "6M",
  y1 = "1Y",
  all = "ALL",
}

/**
 * Mapping timeframe to aggregation code
 * @key - timeframe
 * @value - [min aggregation code, max aggregation code]
 */
export const TIMEFRAME_AGGREGATION_CODE: Record<string, [number, number]> = {
  [TIMEFRAME.d]: [AGGREGATION_CODE.min5, AGGREGATION_CODE.h1],
  [TIMEFRAME.w]: [AGGREGATION_CODE.min15, AGGREGATION_CODE.d1],
  [TIMEFRAME.m]: [AGGREGATION_CODE.h1, AGGREGATION_CODE.d1],
  [TIMEFRAME.m3]: [
    AGGREGATION_CODE.h2 - AGGREGATION_CODE.min15,
    AGGREGATION_CODE.d1,
  ],
  [TIMEFRAME.m6]: [
    AGGREGATION_CODE.h6 - AGGREGATION_CODE.h1,
    AGGREGATION_CODE.h12 + AGGREGATION_CODE.d1,
  ],
  [TIMEFRAME.y1]: [
    AGGREGATION_CODE.h12 - (AGGREGATION_CODE.h2 + AGGREGATION_CODE.h1),
    AGGREGATION_CODE.d1 * 2,
  ],
  [TIMEFRAME.all]: [AGGREGATION_CODE.d1 * 7, AGGREGATION_CODE.m1],
}

/**
 * Mapping timeframe to limits of collection length
 * @key - timeframe
 * @value - fetch limit
 */
export const TIMEFRAME_LIMIT_CODE = {
  [TIMEFRAME.d]: 288, // count of TIMEFRAME_AGGREGATION_CODE[TIMEFRAME.d][0] interval in 1 day
  [TIMEFRAME.w]: 672,
  [TIMEFRAME.m]: 744,
  [TIMEFRAME.m3]: 1000,
  [TIMEFRAME.m6]: 893,
  [TIMEFRAME.y1]: 974,
  [TIMEFRAME.all]: 1000,
}

/**
 * Mapping timeframe to fromDate value
 * @key - timeframe
 * @value - fetch start day
 */
export const TIMEFRAME_FROM_DATE = {
  [TIMEFRAME.d]: daysAgoTimestamp(1),
  [TIMEFRAME.w]: daysAgoTimestamp(7),
  [TIMEFRAME.m]: daysAgoTimestamp(31),
  [TIMEFRAME.m3]: daysAgoTimestamp(93),
  [TIMEFRAME.m6]: daysAgoTimestamp(186),
  [TIMEFRAME.y1]: daysAgoTimestamp(365),
  [TIMEFRAME.all]: 0,
}

export const AREA_GRADIENT_STOPS = [
  {
    o: 65,
    s: 0.3,
  },
  {
    o: 70,
    s: 0.25,
  },
  {
    o: 80,
    s: 0.2,
  },
  {
    o: 85,
    s: 0.15,
  },
  {
    o: 90,
    s: 0.1,
  },
  {
    o: 95,
    s: 0.04,
  },
  {
    o: 100,
    s: 0,
  },
]

export const CHART_FALLBACK_DATA = Array(25).fill({
  id: uuidv4(),
  value: 0,
  isFallback: true,
})

export const CHART_ITEM_THEME = {
  default: {
    isAnimationActive: false,
    baseLine: 2,
    type: "monotone",
    strokeWidth: 2,
    fillOpacity: 1,
  },
}

export const CHART_FALLBACK_ITEM = {
  ...CHART_ITEM_THEME.default,
  legendType: "triangle",
  dataKey: "value",
  stroke: theme.statusColors.success,
}
